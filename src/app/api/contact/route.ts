import { NextResponse } from 'next/server';

import { emailConfig, sendEmail } from '@/lib/email';
import { confirmationEmail, notificationEmail, type ContactSubmission } from '@/lib/email-templates';

import { passesRecaptcha, validateContact } from '@/lib/contact-validation';

// All side effects are behind POST validation; no public email self-test endpoint.
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const allowedOrigins = ['https://itzdigital.co', 'https://www.itzdigital.co'];
  if (process.env.NODE_ENV !== 'production') allowedOrigins.push(new URL(request.url).origin);
  if (!origin || !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Please submit the form from our website.' }, { status: 403 });
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return NextResponse.json({ error: 'Invalid request format.' }, { status: 415 });
  }

  let body: Record<string, unknown>;
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: 'Missing request body.' }, { status: 400 });
  try {
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 20_000) {
        await reader.cancel();
        return NextResponse.json({ error: 'The submission is too large.' }, { status: 413 });
      }
      chunks.push(value);
    }
    const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid body');
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  if (body.companyWebsite) {
    // A honeypot hit must not trigger browser-side CallRail capture either.
    return NextResponse.json({ ok: true, accepted: false });
  }
  const error = validateContact(body);
  if (error) return NextResponse.json({ error }, { status: 422 });

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (secret || siteKey || process.env.VERCEL_ENV === 'production') {
    if (!secret || !siteKey) {
      console.error('[contact] reCAPTCHA configuration incomplete');
      return NextResponse.json({ error: 'Verification is temporarily unavailable. Please call us.' }, { status: 503 });
    }
    if (typeof body.recaptchaToken !== 'string' || !body.recaptchaToken || body.recaptchaToken.length > 4096) {
      return NextResponse.json({ error: 'Please complete verification and try again.' }, { status: 403 });
    }
    try {
      const verification = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: new URLSearchParams({ secret, response: body.recaptchaToken }),
        signal: AbortSignal.timeout(8000),
        cache: 'no-store',
      });
      if (!verification.ok) throw new Error('Verification unavailable');
      if (!passesRecaptcha(await verification.json())) {
        return NextResponse.json({ error: 'We could not verify this submission. Please try again or call us.' }, { status: 403 });
      }
    } catch {
      return NextResponse.json({ error: 'Verification is temporarily unavailable. Please try again.' }, { status: 503 });
    }
  }

  const name = str(body.name);
  const business = str(body.business);
  const email = str(body.email);

  const submission: ContactSubmission = {
    name,
    business,
    email,
    phone: str(body.phone),
    industry: str(body.industry),
    service: str(body.service),
    message: str(body.message),
    pagePath: str(body.pagePath) || pathFromReferer(request.headers.get('referer')),
    receivedAt: new Date().toISOString(),
  };

  console.info('[contact] verified submission received');

  const notify = notificationEmail(submission);
  const confirm = confirmationEmail(submission);

  const [notifyResult, confirmResult] = await Promise.allSettled([
    sendEmail({
      to: emailConfig.notifyTo,
      subject: notify.subject,
      html: notify.html,
      text: notify.text,
      replyTo: submission.email,
    }),
    sendEmail({
      to: submission.email,
      subject: confirm.subject,
      html: confirm.html,
      text: confirm.text,
    }),
  ]);

  logDelivery('notification', notifyResult);
  logDelivery('confirmation', confirmResult);

  // Coarse status in the response — visible in the browser Network tab for
  // debugging, no secrets. The form UI ignores everything except `ok`.
  return NextResponse.json({
    ok: true,
    accepted: true,
    delivery: {
      notification: settledStatus(notifyResult),
      confirmation: settledStatus(confirmResult),
    },
  });
}

function settledStatus(
  result: PromiseSettledResult<Awaited<ReturnType<typeof sendEmail>>>,
): 'sent' | 'skipped' | 'failed' {
  if (result.status === 'rejected') return 'failed';
  const r = result.value;
  if (r.ok) return 'sent';
  if ('skipped' in r && r.skipped) return 'skipped';
  return 'failed';
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

function pathFromReferer(referer: string | null): string {
  if (!referer) return '/contact';
  try {
    return new URL(referer).pathname || '/contact';
  } catch {
    return '/contact';
  }
}

function logDelivery(kind: string, result: PromiseSettledResult<Awaited<ReturnType<typeof sendEmail>>>) {
  if (result.status === 'rejected') {
    console.error(`[contact] ${kind} email rejected:`, result.reason);
    return;
  }
  const r = result.value;
  if (r.ok) {
    console.info(`[contact] ${kind} email sent (${r.id})`);
  } else if ('skipped' in r && r.skipped) {
    console.warn(`[contact] ${kind} email skipped — RESEND_API_KEY not configured`);
  } else {
    console.error(`[contact] ${kind} email failed:`, 'error' in r ? r.error : 'unknown');
  }
}

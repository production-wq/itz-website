import 'server-only';

/**
 * Transactional email transport.
 *
 * Uses Resend's REST API directly (no SDK dependency) so the provider is a
 * ~15-line swap if the business moves to SendGrid / Postmark / SES. The route
 * handler never throws on a delivery failure — it logs and carries on so a
 * submission is never lost because the mail provider had a bad minute.
 *
 * Required env:
 *   RESEND_API_KEY        — https://resend.com/api-keys
 * Optional env (defaults shown):
 *   EMAIL_FROM            — "ITZ Digital <info@itzdigital.co>"
 *   EMAIL_REPLY_TO        — "info@itzdigital.co"
 *   CONTACT_NOTIFY_TO     — "info@itzontarget.com"
 *
 * The `from` domain (itzdigital.co) must be verified in Resend before anything
 * sends — until it is, requests 403 and this module logs the failure.
 */

const RESEND_ENDPOINT = 'https://api.resend.com/emails';

export const emailConfig = {
  from: process.env.EMAIL_FROM || 'ITZ Digital <info@itzdigital.co>',
  replyTo: process.env.EMAIL_REPLY_TO || 'info@itzdigital.co',
  notifyTo: process.env.CONTACT_NOTIFY_TO || 'info@itzontarget.com',
};

export type SendResult =
  | { ok: true; id: string }
  | { ok: false; skipped: true }
  | { ok: false; skipped?: false; error: string; detail?: string };

/** True when a RESEND_API_KEY is present on this deployment. */
export const isEmailConfigured = () => Boolean(process.env.RESEND_API_KEY);

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  /** Overrides the default reply-to for this message. */
  replyTo?: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping "${opts.subject}" to ${String(opts.to)}`,
    );
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailConfig.from,
        to: Array.isArray(opts.to) ? opts.to : [opts.to],
        reply_to: opts.replyTo || emailConfig.replyTo,
        subject: opts.subject,
        html: opts.html,
        text: opts.text,
      }),
      // Don't let a slow provider hang the request handler.
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.error(`[email] send failed (${res.status}) for "${opts.subject}": ${detail}`);
      return { ok: false, error: `provider responded ${res.status}`, detail: detail.slice(0, 500) };
    }

    const data = (await res.json()) as { id?: string };
    return { ok: true, id: data.id ?? 'unknown' };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    console.error(`[email] send threw for "${opts.subject}": ${message}`);
    return { ok: false, error: message };
  }
}

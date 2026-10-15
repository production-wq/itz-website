'use client';

import { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { industries } from '@/lib/industries';
import { services } from '@/lib/services';

type Status = 'idle' | 'submitting' | 'sent' | 'error';

const field =
  'w-full min-h-tap rounded-2xl border-2 border-navy-100 bg-white px-4 py-3 text-ink-900 ' +
  'placeholder:text-ink-400 transition-colors ' +
  'hover:border-navy-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20';

const label = 'mb-2 block text-sm font-bold text-navy-700';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus('submitting');
    setError(null);

    try {
      const payload = Object.fromEntries(new FormData(form));
      payload.pagePath = window.location.pathname;

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Request failed with ${response.status}`);

      form.reset();
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  }

  if (status === 'sent') {
    return (
      <div
        role="status"
        className="flex flex-col items-center rounded-3xl border border-navy-100 bg-white p-10 text-center shadow-card lg:p-14"
      >
        <CheckCircle2 className="h-14 w-14 text-blue-600" aria-hidden="true" />
        <h2 className="mt-6 text-display-sm text-navy-700">Thanks — we&rsquo;ve got it</h2>
        <p className="mt-4 max-w-md text-ink-600">
          We read every enquiry and reply within one business day, usually sooner. If it&rsquo;s
          urgent, call us and you&rsquo;ll get a person.
        </p>
        <Button onClick={() => setStatus('idle')} variant="ghost" className="mt-8">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      id="itz-contact-form"
      onSubmit={onSubmit}
      noValidate={false}
      className="relative overflow-hidden rounded-3xl border border-navy-100 bg-white p-7 shadow-card lg:p-10"
    >
      {/* CallRail includes this marker in its Zoho note for the ITZ business-unit rule. */}
      <input type="hidden" name="itz_lead_origin" value="ITZ_DIGITAL_WEBSITE_CALLRAIL" />
      <h2 className="text-display-sm text-navy-700">Request a free audit</h2>
      <p className="mt-3 text-ink-600">
        No obligation, and you keep the findings either way.
      </p>

      {/* Honeypot — bots fill this, humans never see it. */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="company-website">Leave this field empty</label>
        <input id="company-website" name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" data-cr-no-capture />
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={label}>
            Your name <span className="text-blue-600">*</span>
          </label>
          <input id="name" name="name" type="text" required autoComplete="name" className={field} />
        </div>

        <div>
          <label htmlFor="business" className={label}>
            Business name <span className="text-blue-600">*</span>
          </label>
          <input
            id="business"
            name="business"
            type="text"
            required
            autoComplete="organization"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="email" className={label}>
            Email <span className="text-blue-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="phone" className={label}>
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="industry" className={label}>
            Industry
          </label>
          <select id="industry" name="industry" className={field} defaultValue="">
            <option value="">Select one…</option>
            {industries.map((i) => (
              <option key={i.slug} value={i.name}>
                {i.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="service" className={label}>
            What are you after?
          </label>
          <select id="service" name="service" className={field} defaultValue="">
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={label}>
            Tell us about your market and goals
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className={`${field} resize-y`}
            placeholder="Which city or metro do you serve, and what type of work do you want more of?"
          />
        </div>
      </div>

      {status === 'error' ? (
        <p role="alert" className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          We couldn&rsquo;t send that ({error}). Please try again, or call us on the number to the
          left.
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          'Get My Free Quote'
        )}
      </Button>

      <p className="mt-4 text-xs leading-relaxed text-ink-500">
        We use your details to respond to this enquiry only. No lists, no resale.
      </p>
    </form>
  );
}

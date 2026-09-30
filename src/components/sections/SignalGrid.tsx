import { Activity } from 'lucide-react';
import type { ReactNode } from 'react';

import { Section, SectionHeading } from '@/components/ui/Section';

export type Signal = { label: string; body: string };

/**
 * "How we know it's working" — a grid of leading-indicator cards. Deliberately
 * qualitative: the house rule is no invented percentages or dollar figures, so
 * each card names a signal and explains what it tells you, not a number.
 */
export function SignalGrid({
  eyebrow = 'Leading indicators',
  title,
  intro,
  signals,
  tone = 'white',
  id,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  signals: Signal[];
  tone?: 'white' | 'muted';
  id?: string;
  children?: ReactNode;
}) {
  if (signals.length === 0) return null;

  return (
    <Section tone={tone} id={id}>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {signals.map((signal, i) => (
          <li key={signal.label} data-reveal data-reveal-delay={i}>
            <article className="flex h-full flex-col rounded-[1.75rem] border border-navy-100 bg-white p-7 shadow-card">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <Activity className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold leading-snug text-navy-700">{signal.label}</h3>
              <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
                {signal.body}
              </p>
            </article>
          </li>
        ))}
      </ul>

      {children ? <div className="mt-12">{children}</div> : null}
    </Section>
  );
}

'use client';

import { useId, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

import { cn } from '@/lib/cn';
import type { Faq } from '@/lib/geo/types';

/**
 * Accessible FAQ accordion.
 *
 * Implements the WAI-ARIA disclosure pattern: each header is a <button> with
 * aria-expanded + aria-controls, and each panel is a region labelled by its
 * button.
 *
 * Answers stay in the DOM when collapsed (hidden, not unmounted) so the
 * FAQPage structured data on this page always has visible on-page equivalents
 * — Google requires the answer text to be present in the rendered HTML.
 */
export function FaqAccordion({
  faqs,
  allowMultiple = true,
  defaultOpen = 'first',
  className,
}: {
  faqs: Faq[];
  /** false = classic single-open accordion. */
  allowMultiple?: boolean;
  /**
   * Which items start expanded. 'all' keeps every answer visible on load, so a
   * short list never reads as unanswered questions to people or crawlers that
   * don't click.
   */
  defaultOpen?: 'first' | 'all';
  className?: string;
}) {
  const baseId = useId();
  // Never start all-collapsed: that reads as an empty section.
  const [open, setOpen] = useState<Set<number>>(
    () => new Set(defaultOpen === 'all' ? faqs.map((_, i) => i) : [0]),
  );

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set<number>();
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div className={cn('divide-y divide-navy-100 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card', className)}>
      {faqs.map((faq, i) => {
        const isOpen = open.has(i);
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;

        return (
          <div key={faq.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className={cn(
                  'flex min-h-[4rem] w-full items-center justify-between gap-4 px-6 py-5 text-left',
                  'text-base font-bold text-navy-700 transition-colors sm:text-lg',
                  'hover:bg-surface-muted focus-visible:relative focus-visible:z-10',
                  isOpen && 'bg-surface-muted/60',
                )}
              >
                <span>{faq.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
                    isOpen ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600',
                  )}
                >
                  {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="px-6 pb-6 pt-0"
            >
              <p className="max-w-prose leading-relaxed text-ink-600">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

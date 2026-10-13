import Link from 'next/link';
import { ArrowRight, Car, GraduationCap, Handshake, Home, Scale, Stethoscope, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Section, SectionHeading } from '@/components/ui/Section';
import { industries, type Industry } from '@/lib/industries';

const icons: Record<Industry['icon'], LucideIcon> = {
  Scale,
  Stethoscope,
  Home,
  GraduationCap,
  Car,
  Wrench,
  Handshake,
};

export function IndustriesGrid({ tone = 'muted' }: { tone?: 'white' | 'muted' }) {
  return (
    <Section tone={tone} id="who-we-serve">
      <SectionHeading
        eyebrow="Who we serve"
        title="Seven industries, one clear strategy each"
        size="lg"
        intro="Legal, medical, real estate, education, automotive, home services businesses and marketing agencies all compete for visibility differently — different keywords, different compliance rules, different buyer urgency. We build a distinct strategy for each rather than one generic template."
      />

      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry, i) => {
          const Icon = icons[industry.icon];

          return (
            <li key={industry.slug} data-reveal data-reveal-delay={i}>
              <article className="group relative flex h-full flex-col rounded-[1.75rem] border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-card-lg focus-within:-translate-y-1.5 focus-within:shadow-card-lg">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-lg font-bold text-navy-700">
                  <Link href={`/${industry.slug}`} className="after:absolute after:inset-0 after:content-['']">
                    {industry.name}
                  </Link>
                </h3>

                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
                  {industry.children
                    .slice(0, 3)
                    .map((c) => c.name)
                    .join(', ')}
                  {industry.children.length > 3
                    ? ` and ${industry.children.length - 3} more`
                    : ''}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                  View
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { PageHero } from '@/components/ui/PageHero';
import { Section, SectionHeading } from '@/components/ui/Section';
import { allLocations, hasActivePages, hubCopy, servicesForCity } from '@/lib/locations';
import type { Faq } from '@/lib/geo/types';

export const metadata: Metadata = {
  title: 'Locations',
  description:
    'Local search results differ block by block, not just city by city. The metro markets where ITZ Digital runs active SEO and paid ad programs.',
  alternates: { canonical: '/locations' },
};

const locationFaqs: Faq[] = [
  {
    question: 'Do you only work with businesses in these markets?',
    answer:
      'No — these are our current active metros. We take on clients nationwide; reach out and we’ll confirm coverage for your area. The market-tuned approach applies wherever your business is.',
  },
  {
    question: 'Why does the strategy change by market?',
    answer:
      'Local search results are, by definition, local — competitive density, search volume and even the words people use shift from city to city, and often from suburb to suburb inside one metro.',
  },
  {
    question: 'When will more market pages go live?',
    answer:
      'We publish detailed “<service> in <city>” pages only when we have genuine local results and market data to put on them — a handful of strong pages beats hundreds of templated ones. Dallas and Tampa have market pages now; the deeper service pages follow as the work does.',
  },
];

export default function LocationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Locations"
        title="Local marketing, in your market"
        intro="Local search results differ block by block, not just city by city. These are the metro markets where we currently run active SEO and paid ad programs."
        crumbs={[{ label: 'Locations' }]}
        image="/images/headers/locations.webp"
        imageAlt="A US map with pins marking the metro markets ITZ Digital serves"
        imagePriority
      />

      <Section>
        <SectionHeading
          eyebrow="Active markets"
          title="Where we're running campaigns now"
          intro="Each market page covers how search competition works there, which services we run, and the industries we're active in."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allLocations.map((city, i) => {
            const services = servicesForCity(city.slug);
            return (
              <li key={city.slug} data-reveal data-reveal-delay={i}>
                <article className="group relative flex h-full flex-col rounded-[1.75rem] border border-navy-100 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-card-lg focus-within:-translate-y-1.5 focus-within:shadow-card-lg">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                    <MapPin className="h-6 w-6" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 text-lg font-bold text-navy-700">
                    <Link
                      href={`/locations/${city.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {city.name}, {city.stateCode}
                    </Link>
                  </h3>

                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
                    {hubCopy[city.slug]?.hubIntro ?? city.marketNote}
                  </p>

                  {hasActivePages(city.slug) && services.length > 0 ? (
                    <p className="mt-4 text-xs font-semibold text-ink-500">
                      {services.map((s) => s.navLabel ?? s.name).join(' · ')} pages live
                    </p>
                  ) : (
                    <p className="mt-4 text-xs font-semibold text-ink-500">Market page</p>
                  )}

                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                    View market
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

      <FaqSection
        faqs={locationFaqs}
        path="/locations"
        title="Common questions about our locations"
        tone="muted"
      />

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Not sure if we cover your area?"
          highlight="your area"
          body="Tell us where you're based and what you do. We'll confirm coverage and outline an approach for your market."
        />
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import Image from 'next/image';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { ProcessSection } from '@/components/sections/ProcessTimeline';
import { LinkCard } from '@/components/ui/Card';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { services } from '@/lib/services';

const sequence = [
  {
    phase: 'Start here',
    title: 'SEO and the Google Business Profile',
    body: 'The foundation for almost every local business. It compounds, it lowers cost per lead over time, and it keeps producing between ad flights. Slower to show results, so it goes in first.',
  },
  {
    phase: 'Layer in',
    title: 'Paid search — Google Ads or PPC management',
    body: 'Covers the gap while SEO builds. Calls within weeks, budget you can turn up or down, and the search-term data feeds the organic work. The obvious second move for most accounts.',
  },
  {
    phase: 'When it fits',
    title: 'Paid social, programmatic and a rebuilt site',
    body: 'Meta and other social ads for demand you build rather than demand that exists; programmatic for reach; a website rebuild when the current site is capping everything above it. Added once the audit shows the specific gap.',
  },
  {
    phase: 'Always on',
    title: 'Lead generation as the system around all of it',
    body: 'Tracking, routing and follow-up tying the channels together. The biggest leaks are usually here — a slow callback, a form in an unwatched inbox — not in the ad spend.',
  },
];

export const metadata: Metadata = {
  title: 'Digital Marketing Services',
  description:
    'SEO, Google and Meta Ads, programmatic, website design and lead generation for small businesses. Every channel that puts you in front of local searches.',
  alternates: { canonical: '/services' },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="What we do"
        title="Every channel that puts you in front of local searches"
        intro="Most clients don't need all of it at once. SEO is usually the foundation, with paid ads and a rebuilt site layered in once an audit shows where the gaps actually are."
        crumbs={[{ label: 'Services' }]}
        image="/images/headers/services.webp"
        imageAlt="The marketing channels ITZ Digital runs, shown as connected dashboards"
        imagePriority
      >
        <Button href="/contact" variant="onDark" size="lg">
          Get a Free Audit
        </Button>
      </PageHero>

      <Section>
        <SectionHeading
          eyebrow="The full stack"
          title="Nine services, priced and measured separately"
          intro="You should be able to see what each channel costs and what it returns. Every engagement reports on booked jobs, not impressions."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <li key={service.slug} data-reveal data-reveal-delay={i}>
              <LinkCard
                href={`/services/${service.slug}`}
                title={service.name}
                body={service.tagline}
                icon={
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
                    <Image src={service.icon} alt="" width={32} height={32} className="h-8 w-8" aria-hidden="true" />
                  </span>
                }
                className="h-full"
              />
            </li>
          ))}
        </ul>
      </Section>

      <ProcessSection
        eyebrow="How to sequence it"
        title="Most clients do not need all of it at once"
        intro="There is a usual order, and it is not an accident. Foundation first, fast lane second, everything else when the audit says so."
        steps={sequence}
        tone="muted"
      />

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Not sure which channel to start with?"
          highlight="which channel"
          body="A free audit tells you where the demand is in your market and which channel captures it cheapest. No obligation to buy anything afterwards."
        />
      </div>
    </>
  );
}

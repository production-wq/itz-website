import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, MapPin } from 'lucide-react';

import { ContextBlock } from '@/components/sections/ContextBlock';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { Button } from '@/components/ui/Button';
import { LinkCard } from '@/components/ui/Card';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SplitHero } from '@/components/ui/SplitHero';
import { cities, cityBySlug } from '@/lib/geo';
import { hubCopy, servicesForCity } from '@/lib/locations';
import { homepageServices } from '@/lib/services';
import { industries } from '@/lib/industries';
import { site } from '@/lib/site';
import type { Faq } from '@/lib/geo/types';

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const city = cityBySlug.get(slug);
  if (!city) return {};

  const copy = hubCopy[slug];
  return {
    title: `${city.name}, ${city.stateCode} Marketing`,
    description: copy?.hubIntro ?? city.marketNote,
    alternates: { canonical: `/locations/${slug}` },
    openGraph: {
      title: `Local Marketing for ${city.name} Businesses | ${site.name}`,
      description: copy?.hubIntro ?? city.marketNote,
      url: `/locations/${slug}`,
    },
  };
}

export default async function LocationHubPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: slug } = await params;
  const city = cityBySlug.get(slug);
  if (!city) notFound();

  const copy = hubCopy[slug];
  const localServices = servicesForCity(slug);
  const otherCities = cities.filter((c) => c.slug !== slug);
  const cityState = `${city.name}, ${city.stateCode}`;

  const faqs: Faq[] = [
    {
      question: `How competitive is local search in ${city.name}?`,
      answer: copy?.whyDifferent ?? city.marketNote,
    },
    {
      question: `Do you cover the areas around ${city.name}?`,
      answer: `Yes — we cover the wider metro, including ${city.nearbyCities
        .map((n) => n.name)
        .slice(0, 4)
        .join(', ')} and the surrounding suburbs, within roughly a ${city.serviceRadiusMiles}-mile radius.`,
    },
    {
      question: `Which industries do you work with in ${city.name}?`,
      answer:
        'All six of our core industries — legal, medical, real estate, education, automotive and home services — with a distinct strategy for each in this market.',
    },
  ];

  return (
    <>
      <SplitHero
        eyebrow={`${cityState} marketing`}
        title={`Local search marketing for ${city.name} businesses`}
        intro={copy?.hubIntro ?? city.marketNote}
        image="/images/who-we-serve/hero.webp"
        imageAlt={`Marketing for ${city.name} businesses`}
        fit="contain"
        crumbs={[{ label: 'Locations', href: '/locations' }, { label: cityState }]}
        stat={{ value: `${city.serviceRadiusMiles} mi`, label: `Service radius across the ${city.name} metro` }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            Get Your Free Audit
          </Button>
          <Button href="/case-studies" variant="ghost" size="lg">
            See Case Studies
          </Button>
        </div>
      </SplitHero>

      <ContextBlock
        eyebrow="Why this market is different"
        title={`How search competition works in ${city.name}`}
        paragraphs={[
          copy?.whyDifferent ?? city.marketNote,
          `We tune Google Business Profile categories, service-area targeting and content for how ${city.name} residents actually search — across neighbourhoods like ${city.neighborhoods
            .slice(0, 4)
            .join(', ')}.`,
        ]}
        tone="muted"
      />

      {/* ── What we run here ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeading
          eyebrow={`What we run in ${city.name}`}
          title="The same services, tuned for this market"
          action={
            <Button href="/services" variant="secondary">
              All services
            </Button>
          }
        />

        {localServices.length > 0 ? (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {localServices.map((service, i) => (
              <li key={service.slug} data-reveal data-reveal-delay={i}>
                <LinkCard
                  href={`/services/${service.slug}/${slug}`}
                  title={`${service.navLabel ?? service.name} in ${cityState}`}
                  body={service.tagline}
                  className="h-full"
                  icon={
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                      <MapPin className="h-6 w-6" aria-hidden="true" />
                    </span>
                  }
                />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="mt-6 max-w-prose text-body-lg text-ink-600">
              We run SEO, Google &amp; Meta Ads, programmatic, website design, review management
              and creative across the {city.name} metro. Market-specific pages for each are on the
              way — in the meantime, here is how each service works.
            </p>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {homepageServices.slice(0, 3).map((service, i) => (
                <li key={service.slug} data-reveal data-reveal-delay={i}>
                  <LinkCard
                    href={`/services/${service.slug}`}
                    title={service.name}
                    body={service.tagline}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {/* ── Industries active here ──────────────────────────────────────── */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Who we serve here"
          title={`Seven industries, active in ${city.name}`}
          intro={`${city.name} clients span all six of our core industries — each with its own keyword strategy and compliance considerations for this market.`}
        />
        <ul className="mt-10 flex flex-wrap gap-3" data-reveal>
          {industries.map((industry) => (
            <li key={industry.slug}>
              <Button href={`/${industry.slug}`} variant="ghost">
                {industry.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      </Section>

      <FaqSection faqs={faqs} path={`/locations/${slug}`} title={`Common questions from ${city.name} businesses`} tone="white" />

      <div className="py-section lg:py-section-lg" data-reveal="scale">
        <CtaBanner
          title={`Ready to rank in ${city.name}?`}
          highlight={city.name}
          body="Free audit of your current visibility, your competitors and the gap between them."
        />
      </div>

      {/* ── Other locations ─────────────────────────────────────────────── */}
      <Section>
        <SectionHeading eyebrow="Other locations" title="We work beyond this metro too" />
        <ul className="mt-10 flex flex-wrap gap-3" data-reveal>
          {otherCities.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/locations/${c.slug}`}
                className="inline-flex min-h-tap items-center rounded-pill bg-white px-4 text-sm font-semibold text-navy-700 shadow-ring transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                {c.name}, {c.stateCode}
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

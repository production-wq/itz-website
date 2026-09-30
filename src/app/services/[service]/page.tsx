import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AlertTriangle, Check, MapPin } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { PerksBand } from '@/components/sections/PerksBand';
import { ProcessSection } from '@/components/sections/ProcessTimeline';
import { SignalGrid } from '@/components/sections/SignalGrid';
import { LinkCard } from '@/components/ui/Card';
import { SplitHero } from '@/components/ui/SplitHero';
import { Button } from '@/components/ui/Button';
import { Section, SectionHeading } from '@/components/ui/Section';
import { citiesForService } from '@/lib/geo';
import { serviceBySlug, services } from '@/lib/services';
import { serviceExtras } from '@/lib/service-content';
import { site } from '@/lib/site';

export const dynamicParams = false;

/** Services with a bespoke process illustration in public/images/services. */
const PROCESS_IMAGE = new Set([
  'seo',
  'google-ads',
  'meta-ads',
  'website-design',
  'lead-generation',
  'review-management',
  'creative',
]);

/** Per-service override for the "How we measure it" intro; others use the shared default. */
const MEASURE_INTRO: Record<string, ReactNode> = {
  'cold-outreach': (
    <>
      Ten replies can mean ten different things. An out-of-office message, an unsubscribe request and a
      request for pricing should not count as equivalent results. Outreach Engine&rsquo;s{' '}
      <a
        href="https://www.outreachengine.co/blog/cold-email-metrics-that-matter"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
      >
        guide to cold email metrics
      </a>{' '}
      distinguishes total replies from positive replies&mdash;a useful starting point for understanding
      campaign quality. For your business, the next step is connecting that interest to qualified
      meetings, sales opportunities and won work. These are the earlier signals we review to see where
      targeting, messaging or follow-up needs attention.
    </>
  ),
};

export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) return {};

  return {
    title: `${service.name} for Small Business`,
    description: `${service.tagline}. ${service.summary.slice(0, 120)}…`,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | ${site.name}`,
      description: service.tagline,
      url: `/services/${service.slug}`,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const { service: slug } = await params;
  const service = serviceBySlug.get(slug);
  if (!service) notFound();

  const children = (service.children ?? []).map((s) => serviceBySlug.get(s)!).filter(Boolean);
  const related = services.filter((s) => s.slug !== service.slug && !service.children?.includes(s.slug)).slice(0, 3);
  const cities = citiesForService(slug);
  const extra = serviceExtras[service.slug];
  const hasProcessImage = PROCESS_IMAGE.has(service.slug);
  const label = service.navLabel ?? service.name;

  return (
    <>
      <SplitHero
        eyebrow={service.name}
        title={service.tagline}
        intro={service.summary}
        image={`/images/services/${service.slug}.webp`}
        imageAlt={`${service.name} dashboard`}
        fit="contain"
        tone="dark"
        crumbs={[{ label: 'Services', href: '/services' }, { label: service.name }]}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" variant="onDark" size="lg">
            Get a Free {label} Audit
          </Button>
          <Button href="#included" variant="outlineOnDark" size="lg">
            What&rsquo;s included
          </Button>
        </div>
      </SplitHero>

      {/* ── Expanded intro ──────────────────────────────────────────────── */}
      {extra ? (
        <Section>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className={hasProcessImage ? 'min-w-0 lg:col-span-7' : 'min-w-0 lg:col-span-9'}>
              <p className="eyebrow-script mb-3">In plain terms</p>
              <div className="space-y-5 text-body-lg text-ink-600">
                {extra.expandedSummary.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>
            </div>
            {hasProcessImage ? (
              <div className="min-w-0 lg:col-span-5" data-reveal="right">
                <div className="relative aspect-[4/3] overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-navy-100">
                  <Image
                    src={`/images/services/${service.slug}-process.webp`}
                    alt={`How ${label} works`}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-contain"
                  />
                </div>
              </div>
            ) : null}
          </div>
        </Section>
      ) : null}

      <Section id="included" tone={extra ? 'muted' : 'white'}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-5" data-reveal="left">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 ring-1 ring-amber-100">
              <Image src={service.icon} alt="" width={36} height={36} className="h-9 w-9" aria-hidden="true" />
            </span>

            <h2 className="mt-6 text-display-sm text-navy-700">What&rsquo;s included</h2>

            <ul className="mt-7 space-y-4">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" strokeWidth={3} />
                  </span>
                  <span className="text-[0.9375rem] leading-relaxed text-ink-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0 lg:col-span-7" data-reveal="right">
            <h2 className="text-display-sm text-navy-700">What you get</h2>

            <ol className="mt-8 space-y-6">
              {service.deliverables.map((item, i) => (
                <li
                  key={item.title}
                  className="relative rounded-[1.75rem] border border-navy-100 bg-white p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover"
                  data-reveal
                  data-reveal-delay={i}
                >
                  <span className="absolute -top-3 left-7 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-gradient-cta px-2.5 text-xs font-bold text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 text-lg font-bold text-navy-700">{item.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{item.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ── The engagement, step by step ────────────────────────────────── */}
      {extra ? (
        <ProcessSection
          eyebrow="The engagement"
          title={`How the ${label} engagement runs`}
          intro="The sequence rarely changes, even though every account does. Fix the foundation, launch what is fast, then compound."
          steps={extra.process.map((s) => ({ phase: s.phase, title: '', body: s.body }))}
          tone="white"
        />
      ) : null}

      {/* ── Who it suits, and honestly who it doesn't ────────────────────── */}
      {service.whoItsFor ? (
        <PerksBand
          eyebrow="Fit"
          title={`Who ${label} is for`}
          perks={service.whoItsFor}
          tone="muted"
        >
          {service.notFor ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
              <p className="text-eyebrow uppercase text-amber-700">And who it isn&rsquo;t</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-700">{service.notFor}</p>
            </div>
          ) : null}
        </PerksBand>
      ) : null}

      {/* ── Common mistakes ─────────────────────────────────────────────── */}
      {extra ? (
        <Section>
          <SectionHeading
            eyebrow="What goes wrong"
            title={`Where ${label} usually gets wasted`}
            intro="The failure modes we see most often when this channel is run without discipline — worth checking your current setup against."
          />
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {extra.commonMistakes.map((m, i) => (
              <li key={m.title} data-reveal data-reveal-delay={i}>
                <article className="h-full rounded-[1.75rem] border border-amber-100 bg-amber-50/50 p-7">
                  <AlertTriangle className="h-6 w-6 text-amber-600" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-bold leading-snug text-navy-700">{m.title}</h3>
                  <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-600">{m.body}</p>
                </article>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* ── Leading indicators ──────────────────────────────────────────── */}
      {extra ? (
        <SignalGrid
          eyebrow="How we measure it"
          title={`What a working ${label} account looks like`}
          intro={
            MEASURE_INTRO[service.slug] ??
            'Booked jobs are the goal. These are the earlier reads that tell us the channel is on track to get there.'
          }
          signals={extra.outcomes}
          tone="muted"
        />
      ) : null}

      {children.length > 0 ? (
        <Section tone={extra ? 'white' : 'muted'}>
          <SectionHeading eyebrow="Go deeper" title={`Specialist ${service.name.toLowerCase()} services`} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {children.map((child) => (
              <li key={child.slug} data-reveal>
                <LinkCard
                  href={`/services/${child.slug}`}
                  title={child.name}
                  body={child.tagline}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {service.faqs ? (
        <FaqSection
          faqs={service.faqs}
          path={`/services/${service.slug}`}
          title={`${label}: common questions`}
          tone={children.length > 0 ? 'muted' : 'white'}
        />
      ) : null}

      <div className="py-section lg:py-section-lg" data-reveal="scale">
        <CtaBanner
          title={`Want to know what ${service.name.toLowerCase()} would cost you?`}
          highlight="would cost"
          body="Tell us your market and target job type. We come back with the demand, the competition and a number."
        />
      </div>

      {cities.length > 0 ? (
        <Section>
          <SectionHeading
            eyebrow="Where we run it"
            title={`${service.name} by city`}
            intro="Local search results differ block by block. These pages cover the market specifics, competitors and pricing for each metro we actively run campaigns in."
          />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <li key={city.slug} data-reveal>
                <LinkCard
                  href={`/services/${service.slug}/${city.slug}`}
                  title={`${service.name} in ${city.name}, ${city.stateCode}`}
                  body={city.marketNote}
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
        </Section>
      ) : null}

      <Section tone={cities.length > 0 || children.length > 0 ? 'muted' : 'white'}>
        <SectionHeading eyebrow="Also worth a look" title="Services that pair well with this" />
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <li key={r.slug} data-reveal>
              <LinkCard href={`/services/${r.slug}`} title={r.name} body={r.tagline} className="h-full" />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

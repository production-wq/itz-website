import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, Car, GraduationCap, Handshake, Home, Scale, Stethoscope, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { ContextBlock } from '@/components/sections/ContextBlock';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { FeatureRows } from '@/components/sections/FeatureRows';
import { PerksBand } from '@/components/sections/PerksBand';
import { SignalGrid } from '@/components/sections/SignalGrid';
import { Button } from '@/components/ui/Button';
import { LinkCard } from '@/components/ui/Card';
import { Section, SectionHeading } from '@/components/ui/Section';
import { SplitHero } from '@/components/ui/SplitHero';
import { industries, industryBySlug, type Industry } from '@/lib/industries';
import { industryExtras } from '@/lib/industry-content';
import { citiesForService } from '@/lib/geo';
import { homepageServices } from '@/lib/services';
import { site } from '@/lib/site';

/*
 * Top-level industry pages keep their original WordPress paths — /lawyers,
 * /medical, /real-estate, /education, /automotive. They share the root
 * dynamic segment with blog posts; `[slug]/page.tsx` decides which renders.
 */

const icons: Record<Industry['icon'], LucideIcon> = { Scale, Stethoscope, Home, GraduationCap, Car, Wrench, Handshake };

/** Composites are transparent and need `contain`; photographs get `cover`. */
const HERO_FIT: Record<string, 'contain' | 'cover'> = {
  lawyers: 'contain',
  medical: 'contain',
  'real-estate': 'contain',
  automotive: 'contain',
  'home-services': 'contain',
  'marketing-agencies': 'contain',
  education: 'cover',
};

/** "Lawyers" → "Lawyers Marketing", but "Marketing Agencies" stays as-is rather than doubling up. */
const pageTitle = (name: string) => (/marketing/i.test(name) ? name : `${name} Marketing`);
/** Same guard, lowercase — for the eyebrow label and image alt text ("lawyers marketing" vs "Marketing Agencies"). */
const eyebrowText = (name: string) => (/marketing/i.test(name) ? name : `${name} marketing`);

export function industryMetadata(slug: string): Metadata {
  const industry = industryBySlug.get(slug);
  if (!industry) return {};

  return {
    title: pageTitle(industry.name),
    description: industry.summary,
    alternates: { canonical: `/${industry.slug}` },
    openGraph: {
      title: `${pageTitle(industry.name)} | ${site.name}`,
      description: industry.summary,
      url: `/${industry.slug}`,
      images: [{ url: `/images/industries/${industry.slug}.webp` }],
    },
  };
}

export function IndustryPage({ slug }: { slug: string }) {
  const industry = industryBySlug.get(slug);
  if (!industry) notFound();

  const Icon = icons[industry.icon];
  const others = industries.filter((i) => i.slug !== industry.slug);
  const extra = industryExtras[industry.slug];
  const lower = industry.name.toLowerCase();

  const approachImages = [
    `/images/industries/${industry.slug}-strategy.webp`,
    `/images/industries/${industry.slug}-approach.webp`,
    `/images/industries/${industry.slug}-market.webp`,
  ];

  const contextParagraphs = [
    ...(industry.context ?? []),
    ...(extra?.expandedContext ?? []),
  ];

  const channelNotes = extra
    ? [extra.channelNotes.seo, extra.channelNotes.paid, extra.channelNotes.website]
    : [];

  return (
    <>
      <SplitHero
        eyebrow={eyebrowText(industry.name)}
        title={industry.headline}
        intro={industry.summary}
        image={`/images/industries/${industry.slug}.webp`}
        imageAlt={eyebrowText(industry.name)}
        fit={HERO_FIT[industry.slug] ?? 'cover'}
        crumbs={[{ label: 'Who We Serve', href: '/who-we-serve' }, { label: industry.name }]}
        stat={industry.stat}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/contact" size="lg">
            Get a Free Quote
          </Button>
          <Button href="#specialisations" variant="ghost" size="lg">
            See what we cover
          </Button>
        </div>
      </SplitHero>

      {/* ── Specialisations: photo cards, one per sub-industry ──────────── */}
      <Section id="specialisations">
        <SectionHeading
          eyebrow="Specialisations"
          title={`Where ${lower} campaigns actually differ`}
          intro="Each of these has its own search behaviour, its own compliance constraints and its own definition of a good lead. We run them as separate strategies."
        />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industry.children.map((child, i) => (
            <li key={child.slug} data-reveal data-reveal-delay={i}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-card-lg focus-within:-translate-y-1.5 focus-within:shadow-card-lg">
                <div className="media-zoom relative aspect-[4/3] overflow-hidden bg-navy-50">
                  <Image
                    src={`/images/industries/${industry.slug}-${child.slug}.webp`}
                    alt={child.name}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-navy-950/5 to-transparent"
                  />
                  <span className="absolute bottom-4 left-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-blue-600 shadow-card">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold text-navy-700">
                    <Link
                      href={`/${industry.slug}/${child.slug}`}
                      className="after:absolute after:inset-0 after:content-['']"
                    >
                      {child.name}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-600">
                    {child.headline}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                    View
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── How we run campaigns for this vertical ──────────────────────── */}
      {extra ? (
        <FeatureRows
          eyebrow="Our approach"
          title={`How we run ${lower} campaigns`}
          intro={`The playbook that consistently works in ${lower} — and the parts most generalist agencies skip.`}
          rows={extra.approach.map((a, i) => ({
            title: a.title,
            body: [a.body],
            image: approachImages[i] ?? approachImages[0],
            imageAlt: `${eyebrowText(industry.name)} — ${a.title}`,
          }))}
          mesh
        />
      ) : null}

      {/* ── Deeper context prose ─────────────────────────────────────────── */}
      {contextParagraphs.length > 0 ? (
        <ContextBlock
          eyebrow="The market"
          title={`How ${lower} buyers actually decide`}
          paragraphs={contextParagraphs}
          tone="muted"
        />
      ) : null}

      {/* ── Why us, vertical-specific ────────────────────────────────────── */}
      {industry.perks ? (
        <PerksBand
          eyebrow="Why us"
          title={`What you get from an agency that knows ${lower}`}
          perks={industry.perks}
          cta={{ label: 'Get a Free Quote', href: '/contact' }}
        >
          <p>{industry.stat.label} — that is the number this work has to move.</p>
        </PerksBand>
      ) : null}

      {/* ── Leading indicators ──────────────────────────────────────────── */}
      {extra ? (
        <SignalGrid
          eyebrow="How we know it's working"
          title="What we watch, month to month"
          intro={`Booked work is the goal, but it lags. These are the earlier signals that tell us a ${lower} campaign is on track.`}
          signals={extra.signals}
          tone={industry.perks ? 'muted' : 'white'}
        />
      ) : null}

      {/* ── Channels ────────────────────────────────────────────────────── */}
      <Section tone={extra ? 'white' : industry.perks ? 'muted' : 'white'}>
        <SectionHeading
          eyebrow="What we run"
          title={`Channels that work for ${lower} businesses`}
          action={
            <Button href="/services" variant="secondary">
              All services
            </Button>
          }
        />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homepageServices.slice(0, 3).map((service, i) => (
            <li key={service.slug} data-reveal data-reveal-delay={i}>
              <LinkCard
                href={`/services/${service.slug}`}
                title={service.name}
                body={channelNotes[i] ?? service.tagline}
                className="h-full"
                icon={
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-ring ring-1 ring-amber-100">
                    <Image src={service.icon} alt="" width={30} height={30} className="h-[1.875rem] w-[1.875rem]" aria-hidden="true" />
                  </span>
                }
              />
            </li>
          ))}
        </ul>

        {citiesForService('seo').length > 0 ? (
          <div className="mt-12 flex flex-wrap items-center gap-3" data-reveal>
            <span className="text-sm font-semibold text-ink-500">Active markets:</span>
            {citiesForService('seo').map((c) => (
              <Link
                key={c.slug}
                href={`/services/seo/${c.slug}`}
                className="inline-flex min-h-tap items-center rounded-pill bg-white px-4 text-sm font-semibold text-navy-700 shadow-ring transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                {c.name}, {c.stateCode}
              </Link>
            ))}
          </div>
        ) : null}
      </Section>

      {industry.faqs ? (
        <FaqSection
          faqs={industry.faqs}
          path={`/${industry.slug}`}
          title={`${eyebrowText(industry.name)}: common questions`}
          intro={`What ${lower} owners ask us most often before starting.`}
          tone="muted"
        />
      ) : null}

      <div className="py-section lg:py-section-lg" data-reveal="scale">
        <CtaBanner
          title={`Ready to grow your ${lower} business?`}
          highlight="grow"
          body="Free audit of your current visibility, your competitors and the gap between them."
        />
      </div>

      <Section>
        <SectionHeading eyebrow="Other industries" title="We also work with" />
        <ul className="mt-10 flex flex-wrap gap-3" data-reveal>
          {others.map((other) => (
            <li key={other.slug}>
              <Button href={`/${other.slug}`} variant="ghost">
                {other.name}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

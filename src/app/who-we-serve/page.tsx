import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Car, GraduationCap, Home, Scale, Stethoscope, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { industries, type Industry } from '@/lib/industries';
import { about } from '@/lib/about-content';

export const metadata: Metadata = {
  title: 'Who We Serve',
  description:
    'Marketing built separately for legal, medical, real estate, education and automotive businesses — because each competes for local search in a different way.',
  alternates: { canonical: '/who-we-serve' },
};

const icons: Record<Industry['icon'], LucideIcon> = { Scale, Stethoscope, Home, GraduationCap, Car, Wrench };

export default function WhoWeServePage() {
  return (
    <>
      <PageHero
        eyebrow="Who we serve"
        title="Five industries, five distinct strategies"
        intro="A personal injury firm and a med spa both want more local calls, but almost nothing about how they get them is the same. These are the verticals we know well enough to be useful in."
        crumbs={[{ label: 'Who We Serve' }]}
        image="/images/headers/who-we-serve.webp"
        imageAlt="Distinct marketing strategies for each industry we serve"
        imagePriority
      />

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="min-w-0 lg:col-span-7">
            <p className="eyebrow-script mb-3">Why we specialise</p>
            <h2 className="text-display-sm text-navy-700">
              Depth in a few industries beats breadth across many
            </h2>
            <div className="mt-5 space-y-4 text-body-lg text-ink-600">
              <p>{about.industriesIntro}</p>
              <p>
                A generalist agency learns your rules, your buying cycle and your definition of a
                good lead on your budget, in the first few months of the engagement. We have already
                run enough campaigns in each of these five fields to skip that — which is most of
                why the work moves faster and wastes less.
              </p>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-5" data-reveal="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-4xl bg-white shadow-card ring-1 ring-navy-100">
              <Image
                src="/images/who-we-serve/hero.webp"
                alt="Five industry emblems converging into one growth strategy"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </Section>

      {industries.map((industry, index) => {
        const Icon = icons[industry.icon];

        return (
          <Section key={industry.slug} tone={index % 2 === 0 ? 'muted' : 'white'}>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-8 xl:gap-16">
              <div className="min-w-0 lg:col-span-5" data-reveal="left">
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </span>

                <h2 className="mt-6 text-display-sm">
                  <Link
                    href={`/${industry.slug}`}
                    className="tap-target inline-block text-navy-700 hover:text-blue-600"
                  >
                    {industry.name}
                  </Link>
                </h2>

                <p className="mt-4 max-w-prose text-ink-600">{industry.summary}</p>

                <p className="mt-6 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold tracking-tight text-blue-600">
                    {industry.stat.value}
                  </span>
                  <span className="text-sm text-ink-500">{industry.stat.label}</span>
                </p>
              </div>

              <div className="min-w-0 lg:col-span-7" data-reveal="right">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {industry.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={`/${industry.slug}/${child.slug}`}
                        className="flex min-h-tap items-center rounded-2xl border border-navy-100 bg-white px-5 py-4 font-semibold text-navy-700 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-600 hover:shadow-card-hover"
                      >
                        {child.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        );
      })}

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Don't see your industry listed?"
          highlight="your industry"
          body="We work well beyond these five. If your business depends on local search, the playbook usually transfers — tell us what you do and we'll tell you honestly whether we can help."
        />
      </div>
    </>
  );
}

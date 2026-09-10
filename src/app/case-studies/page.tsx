import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { Stats } from '@/components/sections/Stats';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { caseStudies, caseStudyFaqs } from '@/lib/case-studies';


export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    'Real campaigns for schools, law firms, publishers, theatres and attractions — what we were asked to do and which channels did the work.',
  alternates: { canonical: '/case-studies' },
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title="What the work actually produced"
        intro="A cross-section of the campaigns we have run — different industries, different budgets, different definitions of a good outcome."
        crumbs={[{ label: 'Case Studies' }]}
        image="/images/headers/case-studies.webp"
        imageAlt="Campaign performance climbing from a slow start to compounding growth"
        imagePriority
      />

      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((study, i) => (
            <li key={study.slug} data-reveal data-reveal-delay={i}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-card-hover">
                <div className="media-zoom relative aspect-[16/9] overflow-hidden bg-navy-50">
                  <Image
                    src={`/images/industries/${study.image}.webp`}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover"
                    aria-hidden="true"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-navy-950/45 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-8 lg:p-10">
                <p className="text-eyebrow uppercase text-blue-600">{study.industry}</p>

                <h2 className="mt-3 text-xl font-bold leading-snug text-navy-700 lg:text-2xl">
                  <Link
                    href={`/case-studies/${study.slug}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {study.title}
                  </Link>
                </h2>

                <p className="mt-4 flex-1 leading-relaxed text-ink-600">{study.summary}</p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                  Read the case study
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                </span>

                <ul className="mt-6 flex flex-wrap gap-2 border-t border-navy-100 pt-6">
                  {study.channels.map((channel) => (
                    <li
                      key={channel}
                      className="rounded-pill bg-surface-muted px-3 py-1.5 text-xs font-semibold text-ink-600"
                    >
                      {channel}
                    </li>
                  ))}
                </ul>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Stats />

      <FaqSection
        faqs={caseStudyFaqs}
        path="/case-studies"
        title="Common questions about these case studies"
        tone="white"
      />

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Want results like these in your market?"
          highlight="your market"
          body="Start with a free audit. You'll get the findings whether or not you decide to work with us."
        />
      </div>
    </>
  );
}

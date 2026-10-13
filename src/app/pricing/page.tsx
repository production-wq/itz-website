import type { Metadata } from 'next';
import { Check } from 'lucide-react';

import { BlogTeaser } from '@/components/sections/BlogTeaser';
import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqSection } from '@/components/sections/FaqSection';
import { PricingTiers } from '@/components/sections/PricingTiers';
import { PageHero } from '@/components/ui/PageHero';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { maintenanceFeatures, pricingFaqs, pricingGroups } from '@/lib/pricing-content';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Straightforward pricing by service and program — SEO, Google & Meta Ads, programmatic, website design, web maintenance, review management and creative. Typical ranges, scoped to your market.',
  alternates: { canonical: '/pricing' },
};

/** The Web Maintenance group gets the feature grid appended after its tiers. */
const MAINTENANCE_SLUG = 'web-maintenance';

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Straightforward pricing, by service and program"
        intro="Every program is scoped to your market and competition, so these are typical ranges, not exact quotes. Reach out for a number specific to your business — the audit is free."
        crumbs={[{ label: 'Pricing' }]}
        image="/images/headers/pricing.webp"
        imageAlt="Service pricing shown as clean, labelled program cards"
        imagePriority
      >
        <Button href="/contact" variant="onDark" size="lg">
          Get a Free Quote
        </Button>
      </PageHero>

      {pricingGroups.map((group, i) => (
        <div key={group.slug}>
          <PricingTiers group={group} tone={i % 2 === 0 ? 'white' : 'muted'} />

          {group.slug === MAINTENANCE_SLUG ? (
            <Section tone={i % 2 === 0 ? 'white' : 'muted'} className="pt-0">
              <p className="eyebrow-caps">Every tier includes</p>
              <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                {maintenanceFeatures.flat().map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[0.9375rem] text-ink-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" strokeWidth={3} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Section>
          ) : null}
        </div>
      ))}

      <FaqSection
        faqs={pricingFaqs}
        path="/pricing"
        title="Common questions about pricing"
        intro="How the ranges work, what's included, and what isn't."
        tone={pricingGroups.length % 2 === 0 ? 'white' : 'muted'}
      />

      <BlogTeaser
        eyebrow="From the blog"
        title="More on how pricing works"
        intro="Per-lead costs by practice area, what drives an SEO retainer up or down, and how to budget a paid campaign."
        tone={pricingGroups.length % 2 === 0 ? 'muted' : 'white'}
      />

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Get a number specific to your business"
          highlight="specific to your"
          body={`Free audit, no obligation. Or call ${site.phone} and we'll scope it on the phone.`}
        />
      </div>
    </>
  );
}

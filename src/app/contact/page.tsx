import type { Metadata } from 'next';
import Image from 'next/image';
import { Clock, Mail, MapPin, Phone, Star } from 'lucide-react';

import { ContactForm } from '@/components/sections/ContactForm';
import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { addressLine, site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get a free marketing audit. Call ${site.phone} or send us your market and target job type and we'll come back with where the demand is.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Let's talk"
        title="Get a free quote"
        intro="Tell us your market and the type of work you want more of. We'll come back with where the demand actually is, what your competitors are doing, and what it costs to win."
        crumbs={[{ label: 'Contact' }]}
        image="/images/headers/contact.webp"
        imageAlt="A message, a phone and a map pin — starting a conversation with ITZ Digital"
        imagePriority
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-5" data-reveal="left">
            <h2 className="text-display-sm text-navy-700">Reach us directly</h2>
            <p className="mt-4 text-ink-600">
              Prefer to skip the form? Call and you&rsquo;ll get a person, not a queue.
            </p>

            <ul className="mt-8 space-y-2">
              <li>
                <a
                  href={site.phoneHref}
                  className="group flex min-h-tap items-center gap-4 rounded-2xl px-3 py-3 -mx-3 transition-colors hover:bg-surface-muted"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Phone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-ink-500">
                      Phone
                    </span>
                    <span className="block text-lg font-bold text-navy-700">{site.phone}</span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="group flex min-h-tap items-center gap-4 rounded-2xl px-3 py-3 -mx-3 transition-colors hover:bg-surface-muted"
                >
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-wider text-ink-500">
                      Email
                    </span>
                    <span className="block text-lg font-bold text-navy-700">{site.email}</span>
                  </span>
                </a>
              </li>

              <li className="flex items-start gap-4 px-3 py-3 -mx-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink-500">
                    Office
                  </span>
                  <address className="mt-0.5 not-italic leading-relaxed text-ink-700">
                    {addressLine}
                  </address>
                </span>
              </li>

              <li className="flex items-start gap-4 px-3 py-3 -mx-3">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-xs font-bold uppercase tracking-wider text-ink-500">
                    Hours
                  </span>
                  <span className="mt-0.5 block leading-relaxed text-ink-700">
                    Monday&ndash;Friday, 8am&ndash;6pm MT
                  </span>
                </span>
              </li>
            </ul>

            {/* Proof panel — gives the left column visual weight against the
                form, and reassures before someone commits to filling it in. */}
            <div className="mt-10 overflow-hidden rounded-3xl border border-navy-100 bg-white shadow-card">
              <div className="relative aspect-[16/10] bg-navy-50">
                <Image
                  src="/images/services/lead-generation.webp"
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  className="object-contain p-4"
                  aria-hidden="true"
                />
              </div>
              <div className="border-t border-navy-100 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex gap-0.5" aria-hidden="true">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <p className="text-sm font-semibold text-navy-700">
                    {site.rating.value} average &middot; {site.rating.count}+ served
                  </p>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Every audit includes your current visibility, your three closest
                  competitors, and the gap between them. You keep the findings either way.
                </p>
              </div>
            </div>
          </div>

          <div className="min-w-0 lg:col-span-7" data-reveal="right">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}

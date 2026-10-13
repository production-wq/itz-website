import Link from 'next/link';
import { ChevronRight, Facebook, Instagram, Linkedin, MapPin, Phone, Star } from 'lucide-react';

import { Logo } from './Logo';
import { Button } from '@/components/ui/Button';
import { footerNav } from '@/lib/nav';
import { addressLine, site } from '@/lib/site';

export function Footer() {
  const socials = [
    { href: site.social.facebook, label: 'Facebook', Icon: Facebook },
    { href: site.social.linkedin, label: 'LinkedIn', Icon: Linkedin },
    { href: site.social.instagram, label: 'Instagram', Icon: Instagram },
  ];

  return (
    <footer className="on-dark mesh mesh-dark relative bg-gradient-navy text-navy-100">
      <div className="container relative py-section lg:py-section-lg">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand + CTA */}
          <div className="min-w-0 lg:col-span-5 lg:pr-10">
            <Logo variant="white" />

            <p className="mt-6 max-w-sm text-2xl font-bold leading-snug text-white sm:text-3xl">
              Let&rsquo;s revolutionize your ad strategy.
            </p>

            <Button href="/contact" variant="onDark" size="lg" className="mt-7">
              Get a Free Quote Today
            </Button>

            <div className="mt-8 flex items-center gap-3">
              <span className="flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </span>
              <p className="text-sm text-navy-200">
                {site.rating.value} average rating &middot; {site.rating.count}+ clients served
              </p>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3 min-w-0 lg:col-span-5">
            {footerNav.map((col) => (
              <nav key={col.label} aria-label={col.label}>
                <h2 className="text-eyebrow uppercase text-navy-300">{col.label}</h2>
                <ul className="mt-4 -ml-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex min-h-tap items-center gap-1.5 rounded-lg px-2 text-[0.9375rem] text-navy-100 transition-colors hover:text-white"
                      >
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 text-amber-400 transition-transform duration-200 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          {/* Contact */}
          <div className="min-w-0 lg:col-span-2">
            <h2 className="text-eyebrow uppercase text-navy-300">Contact Us</h2>

            <ul className="mt-4 space-y-1 -ml-2">
              <li>
                <a
                  href={site.phoneHref}
                  className="inline-flex min-h-tap items-center gap-3 rounded-lg px-2 font-semibold text-white transition-colors hover:text-amber-300"
                >
                  <Phone className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li className="flex items-start gap-3 px-2 py-3 text-[0.9375rem] leading-relaxed text-navy-100">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                <address className="not-italic">{addressLine}</address>
              </li>
            </ul>

            <ul className="mt-4 flex gap-1 -ml-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${site.name} on ${label}`}
                    className="inline-flex h-tap w-tap items-center justify-center rounded-xl text-navy-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-sm text-navy-200 sm:flex-row">
          <p>
            &copy; {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <Link
              href="/sitemap"
              className="inline-flex min-h-tap items-center rounded-lg px-2 transition-colors hover:text-white"
            >
              Sitemap
            </Link>
            <Link
              href="/terms-conditions"
              className="inline-flex min-h-tap items-center rounded-lg px-2 transition-colors hover:text-white"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

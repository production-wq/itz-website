import type { Metadata, Viewport } from 'next';
import { Caveat, Figtree } from 'next/font/google';

import './globals.css';
import { CallRailTracking } from '@/components/CallRailTracking';
import { Footer } from '@/components/layout/Footer';
import { ScrollFx } from '@/components/motion/ScrollFx';
import { Header } from '@/components/layout/Header';
import { site } from '@/lib/site';

/*
 * Type stack
 * ---------------------------------------------------------------------------
 * The live site licenses Greycliff CF (headings + body) and Verveine (the
 * handwritten eyebrows). Neither is on Google Fonts, so:
 *
 *   Greycliff CF → Figtree   geometric humanist, double-storey `a`, tall
 *                            x-height, rounded terminals. Variable 300–900,
 *                            so one file covers Light → Heavy.
 *   Verveine     → Caveat    casual marker pen with the same irregular
 *                            baseline as the "Let's revolutionize…" flourishes.
 *
 * Both are self-hosted by next/font at build time — no render-blocking request
 * to fonts.googleapis.com, and no layout shift.
 */
const figtree = Figtree({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-figtree',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  weight: ['500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Premium Small Business Marketing Agency`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: site.name,
    url: site.url,
    title: `${site.name} — Premium Small Business Marketing Agency`,
    description: site.description,
    images: [{ url: '/images/og-default.jpg', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Premium Small Business Marketing Agency`,
    description: site.description,
    images: ['/images/og-default.jpg'],
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#00386C',
  width: 'device-width',
  initialScale: 1,
  // Never block pinch-zoom.
  maximumScale: 5,
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#organization`,
  name: site.name,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  logo: `${site.url}/logo/itz-digital.svg`,
  image: `${site.url}/images/og-default.jpg`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.country,
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: site.rating.value,
    reviewCount: site.rating.count,
  },
  sameAs: Object.values(site.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${caveat.variable}`}
      /* The inline script below adds `js` to <html> before hydration — an
         intentional mismatch React 19 would otherwise warn about. */
      suppressHydrationWarning
    >
      <head>
        {/* Marks JS as available before first paint, so the pre-reveal hidden
            state only ever applies when something can un-hide it. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <ScrollFx />
        <CallRailTracking />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  );
}

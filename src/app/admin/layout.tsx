import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, LayoutDashboard, PlusCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: { default: 'Content Studio', template: '%s — Content Studio' },
  robots: { index: false, follow: false },
};

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/new', label: 'New batch', icon: PlusCircle },
  { href: '/admin/review', label: 'Review queue', icon: FileText },
];

/**
 * Deliberately its own visual world inside the public site's Header/Footer
 * (this app has one root layout — see src/app/layout.tsx — so that chrome
 * still wraps this route). Gated by src/proxy.ts (HTTP Basic Auth), so it
 * does not need to look or read like a marketing page.
 *
 * Note: unlike a typical section layout, this one does NOT wrap `children`
 * in `.container` — the draft-post preview route renders the site's own
 * full-bleed components (PageHero etc.) and needs the full viewport width to
 * look like the real page. Every other /admin page applies its own
 * `.container` internally instead.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100dvh-var(--header-height))] bg-ink-950 text-white">
      <div className="border-b border-white/10 bg-ink-900">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300">
              ITZ Digital
            </p>
            <h1 className="text-xl font-bold text-white">Content Studio</h1>
          </div>
          <nav aria-label="Content Studio" className="flex flex-wrap gap-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy-100 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {children}
    </div>
  );
}

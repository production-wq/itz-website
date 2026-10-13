import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/ui/PageHero';
import { Section } from '@/components/ui/Section';
import { caseStudies } from '@/lib/case-studies';
import { cities } from '@/lib/geo';
import { industries } from '@/lib/industries';
import { allPosts, categories } from '@/lib/posts';
import { services } from '@/lib/services';

export const metadata: Metadata = {
  title: 'Sitemap',
  description: 'Every page on the ITZ Digital site, in one place — industries, services, locations, case studies and every article on the blog.',
  alternates: { canonical: '/sitemap' },
};

/**
 * A human-readable index of the whole site — every page reachable in one
 * click from the footer (present on every page), so nothing here is more
 * than two clicks from anywhere. Exists specifically because most of the
 * 600+ blog posts had no path in besides /blog's pagination, which put many
 * of them 40+ clicks deep and gave them zero incoming internal links. This
 * page is linked from the footer's bottom bar (see Footer.tsx) and gives
 * every post at least one direct, permanent internal link.
 */
export default function HtmlSitemapPage() {
  const postsByCategory = categories.map((cat) => ({
    category: cat,
    posts: allPosts.filter((p) => p.categories.includes(cat)),
  }));

  return (
    <>
      <PageHero
        eyebrow="Sitemap"
        title="Every page on the site"
        intro="Industries, services, locations, case studies, and every article on the blog — organized in one place."
        crumbs={[{ label: 'Sitemap' }]}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <h2 className="text-eyebrow uppercase text-blue-600">Company</h2>
            <ul className="mt-4 space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/about-us', label: 'About Us' },
                { href: '/who-we-serve', label: 'Who We Serve' },
                { href: '/services', label: 'What We Do' },
                { href: '/pricing', label: 'Pricing' },
                { href: '/locations', label: 'Locations' },
                { href: '/case-studies', label: 'Case Studies' },
                { href: '/blog', label: 'Blog' },
                { href: '/contact', label: 'Contact' },
                { href: '/terms-conditions', label: 'Terms & Conditions' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[0.9375rem] text-ink-600 hover:text-blue-600 hover:underline">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-eyebrow uppercase text-blue-600">Industries</h2>
            <ul className="mt-4 space-y-2">
              {industries.map((industry) => (
                <li key={industry.slug}>
                  <Link href={`/${industry.slug}`} className="text-[0.9375rem] font-semibold text-navy-700 hover:text-blue-600 hover:underline">
                    {industry.name}
                  </Link>
                  <ul className="mt-1.5 space-y-1 border-l border-navy-100 pl-3">
                    {industry.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={`/${industry.slug}/${child.slug}`}
                          className="text-sm text-ink-600 hover:text-blue-600 hover:underline"
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-eyebrow uppercase text-blue-600">Services</h2>
            <ul className="mt-4 space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-[0.9375rem] text-ink-600 hover:text-blue-600 hover:underline">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-eyebrow uppercase text-blue-600">Locations</h2>
            <ul className="mt-4 space-y-2">
              {cities.map((c) => (
                <li key={c.slug}>
                  <Link href={`/locations/${c.slug}`} className="text-[0.9375rem] text-ink-600 hover:text-blue-600 hover:underline">
                    {c.name}, {c.stateCode}
                  </Link>
                </li>
              ))}
            </ul>

            <h2 className="mt-10 text-eyebrow uppercase text-blue-600">Case Studies</h2>
            <ul className="mt-4 space-y-2">
              {caseStudies.map((c) => (
                <li key={c.slug}>
                  <Link href={`/case-studies/${c.slug}`} className="text-[0.9375rem] text-ink-600 hover:text-blue-600 hover:underline">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="text-display-sm text-navy-700">Blog — {allPosts.length} articles</h2>
        <p className="mt-2 max-w-prose text-ink-600">Grouped by category. Every article on the site is linked below.</p>

        <div className="mt-10 space-y-12">
          {postsByCategory.map(({ category, posts }) => (
            <div key={category}>
              <h3 className="text-display-sm text-navy-700">{category}</h3>
              <p className="mt-1 text-sm text-ink-500">{posts.length} articles</p>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <li key={post.slug} className="min-w-0">
                    <Link
                      href={`/${post.slug}`}
                      className="block truncate text-sm text-ink-600 hover:text-blue-600 hover:underline"
                      title={post.title}
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

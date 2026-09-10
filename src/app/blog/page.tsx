import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { PageHero } from '@/components/ui/PageHero';
import { PostCard } from '@/components/ui/PostCard';
import { Section } from '@/components/ui/Section';
import { allPosts, categories, paginate } from '@/lib/posts';
import { cn } from '@/lib/cn';

const PER_PAGE = 12;

export const metadata: Metadata = {
  title: 'Blog & Resources',
  description:
    'Practical guides on local SEO, paid ad setup, pricing breakdowns and industry benchmarks for small business marketing.',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageParam, category } = await searchParams;

  const filtered = category ? allPosts.filter((p) => p.categories.includes(category)) : allPosts;
  const { items, page, totalPages, total } = paginate(filtered, Number(pageParam) || 1, PER_PAGE);

  // Only promote a hero post on the unfiltered first page — on page 3 of a
  // category filter a "Latest" banner would be misleading.
  const featured = page === 1 && !category ? items[0] : null;
  const rest = featured ? items.slice(1) : items;

  const hrefFor = (opts: { page?: number; category?: string | null }) => {
    const params = new URLSearchParams();
    const nextCategory = opts.category === undefined ? category : opts.category;
    if (nextCategory) params.set('category', nextCategory);
    if (opts.page && opts.page > 1) params.set('page', String(opts.page));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : '/blog';
  };

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Industry insights and how-to guides"
        intro="Practical guides on the tactics we run every day — SEO fundamentals, paid ad setup, and honest pricing breakdowns for every service we offer."
        crumbs={[{ label: 'Blog' }]}
        image="/images/headers/resources.webp"
        imageAlt="Guides and how-to resources on local marketing"
        imagePriority
      />

      <Section>
        <nav aria-label="Filter by category" className="mb-12">
          <ul className="flex flex-wrap gap-2">
            <li>
              <Link
                href={hrefFor({ category: null, page: 1 })}
                aria-current={!category ? 'true' : undefined}
                className={chip(!category)}
              >
                All ({allPosts.length})
              </Link>
            </li>
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={hrefFor({ category: c, page: 1 })}
                  aria-current={category === c ? 'true' : undefined}
                  className={chip(category === c)}
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="mb-8 text-sm text-ink-500">
          {total} article{total === 1 ? '' : 's'}
          {category ? ` in ${category}` : ''} &middot; page {page} of {totalPages}
        </p>

        {featured ? (
          <article
            className="group relative mb-12 grid gap-0 overflow-hidden rounded-4xl border border-navy-100 bg-white shadow-card transition-all duration-300 hover:border-blue-200 hover:shadow-card-hover lg:grid-cols-12"
            data-reveal="scale"
          >
            {featured.heroImage ? (
              <div className="media-zoom relative aspect-[16/9] overflow-hidden bg-navy-50 min-w-0 lg:col-span-6 lg:aspect-auto">
                <Image
                  src={featured.heroImage}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  aria-hidden="true"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-tr from-navy-950/40 to-transparent" />
              </div>
            ) : null}

            <div
              className={cn(
                'flex flex-col justify-center p-8 min-w-0 lg:p-12',
                featured.heroImage ? 'lg:col-span-6' : 'lg:col-span-12',
              )}
            >
              <p className="eyebrow-script text-blue-600">Latest</p>
              <h2 className="mt-2 text-display-sm text-navy-700">
                <Link href={`/${featured.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-4 max-w-prose leading-relaxed text-ink-600">{featured.excerpt}</p>
              <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-500">
                {featured.categories[0] ? (
                  <span className="rounded-pill bg-surface-muted px-3 py-1 font-semibold text-blue-600">
                    {featured.categories[0]}
                  </span>
                ) : null}
                <span>{featured.readingTime} min read</span>
              </p>
            </div>
          </article>
        ) : null}

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <li key={post.slug} data-reveal data-reveal-delay={i}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>

        {totalPages > 1 ? (
          <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-3">
            <Link
              href={hrefFor({ page: page - 1 })}
              aria-disabled={page === 1}
              tabIndex={page === 1 ? -1 : undefined}
              className={cn(
                'inline-flex min-h-tap items-center rounded-pill border-2 border-navy-200 px-6 font-semibold text-navy-700 transition-colors hover:border-navy-700 hover:bg-navy-50',
                page === 1 && 'pointer-events-none opacity-40',
              )}
            >
              Previous
            </Link>

            <span className="px-2 text-sm font-medium text-ink-500">
              {page} / {totalPages}
            </span>

            <Link
              href={hrefFor({ page: page + 1 })}
              aria-disabled={page === totalPages}
              tabIndex={page === totalPages ? -1 : undefined}
              className={cn(
                'inline-flex min-h-tap items-center rounded-pill border-2 border-navy-200 px-6 font-semibold text-navy-700 transition-colors hover:border-navy-700 hover:bg-navy-50',
                page === totalPages && 'pointer-events-none opacity-40',
              )}
            >
              Next
            </Link>
          </nav>
        ) : null}
      </Section>

      <div className="pb-section lg:pb-section-lg">
        <CtaBanner
          title="Rather have someone just run it for you?"
          highlight="run it for you"
          body="Everything in these guides, executed by a team that has done it 500 times."
        />
      </div>
    </>
  );
}

const chip = (active: boolean) =>
  cn(
    'inline-flex min-h-tap items-center rounded-pill px-5 text-sm font-semibold transition-colors',
    active
      ? 'bg-gradient-cta text-white shadow-cta'
      : 'bg-surface-muted text-ink-600 hover:bg-navy-100 hover:text-navy-700',
  );

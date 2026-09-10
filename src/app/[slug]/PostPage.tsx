import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock } from 'lucide-react';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { PostCard } from '@/components/ui/PostCard';
import { Section, SectionHeading } from '@/components/ui/Section';
import { allPosts, formatDate, getPost, relatedPosts } from '@/lib/posts';
import { buildArticleGraph } from '@/lib/schema';

/*
 * Blog posts live at the site root (/post-slug), matching the original
 * WordPress URLs. They share the root dynamic segment with the industry
 * pages; `[slug]/page.tsx` decides which renders.
 */
export function postMetadata(slug: string): Metadata {
  const post = allPosts.find((p) => p.slug === slug);
  if (!post) return {};

  const description = post.seoDescription ?? post.excerpt;

  return {
    title: post.seoTitle ?? post.title,
    description,
    alternates: { canonical: `/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `/${post.slug}`,
      publishedTime: post.date ?? undefined,
      images: post.heroImage ? [{ url: post.heroImage }] : undefined,
    },
  };
}

export function PostPage({ slug }: { slug: string }) {
  const post = getPost(slug);
  if (!post) notFound();

  const related = relatedPosts(post);

  const graph = buildArticleGraph(post);

  return (
    <>
      <PageHero
        eyebrow={post.categories[0]}
        title={post.title}
        crumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
        image={post.heroImage}
        imageAlt={post.heroImageAlt ?? ''}
        imagePriority
      >
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-200">
          {post.date ? <time dateTime={post.date}>{formatDate(post.date)}</time> : null}
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-4 w-4" aria-hidden="true" />
            {post.readingTime} min read
          </span>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8 xl:gap-16">
          <div className="min-w-0 lg:col-span-8">
            <div
              className="prose prose-brand prose-headings:font-display prose-headings:font-bold prose-a:font-medium prose-a:underline-offset-2 prose-img:rounded-2xl max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.faqs && post.faqs.length > 0 ? (
              <section aria-labelledby="post-faq" className="mt-14 border-t border-navy-100 pt-10">
                <h2 id="post-faq" className="text-display-sm text-navy-700">
                  Frequently asked questions
                </h2>
                <FaqAccordion faqs={post.faqs} className="mt-8" />
              </section>
            ) : null}

            {post.tags.length > 0 ? (
              <div className="mt-14 border-t border-navy-100 pt-8">
                <h2 className="text-eyebrow uppercase text-ink-500">Topics</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-pill bg-surface-muted px-3 py-1.5 text-xs font-medium text-ink-600"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="min-w-0 lg:col-span-4">
            <div className="sticky top-[calc(var(--header-height)+1.5rem)] space-y-6">
              <div className="on-dark rounded-3xl bg-gradient-navy p-8">
                <p className="eyebrow-script text-amber-400">Free audit</p>
                <p className="mt-2 text-xl font-bold leading-snug text-white">
                  Want this done for you instead?
                </p>
                <p className="mt-3 text-sm leading-relaxed text-navy-100">
                  We&rsquo;ll audit your current visibility and show you where the gap is. No
                  obligation.
                </p>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex min-h-tap items-center rounded-pill bg-amber-400 px-6 font-bold text-navy-800 transition-colors hover:bg-amber-300"
                >
                  Get a Free Quote
                </Link>
              </div>

              {post.categories.length > 0 ? (
                <div className="rounded-3xl border border-navy-100 bg-white p-8 shadow-card">
                  <h2 className="text-eyebrow uppercase text-ink-500">Filed under</h2>
                  <ul className="mt-4 space-y-1">
                    {post.categories.map((c) => (
                      <li key={c}>
                        <Link
                          href={`/blog?category=${encodeURIComponent(c)}`}
                          className="flex min-h-tap items-center font-semibold text-blue-600 hover:text-blue-700"
                        >
                          {c}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="muted">
          <SectionHeading eyebrow="Keep reading" title="Related guides" />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <PostCard post={r} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Ready to put this into practice?"
          highlight="into practice"
          body="Free audit of your market, your competitors and the gap between them."
        />
      </div>

      <JsonLd data={graph} />
    </>
  );
}

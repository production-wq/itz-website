import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { CtaBanner } from '@/components/sections/CtaBanner';
import { JsonLd } from '@/components/ui/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { PostCard } from '@/components/ui/PostCard';
import { Section, SectionHeading } from '@/components/ui/Section';
import { authorBySlug, authorForPost, authors } from '@/lib/authors';
import { allPosts } from '@/lib/posts';
import { buildBreadcrumbNode, type JsonLdGraph } from '@/lib/schema';
import { site } from '@/lib/site';

export const dynamicParams = false;

const LATEST_COUNT = 12;

export function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = authorBySlug.get(slug);
  if (!author) return {};

  const description = author.shortBio;

  return {
    title: `${author.name}, ${author.role}`,
    description,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      type: 'profile',
      title: `${author.name} | ${site.name}`,
      description,
      url: `/authors/${author.slug}`,
      images: [{ url: author.image }],
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = authorBySlug.get(slug);
  if (!author) notFound();

  const posts = allPosts
    .filter((p) => authorForPost(p).slug === author.slug)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const path = `/authors/${author.slug}`;
  const graph: JsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${site.url}${path}#webpage`,
        url: `${site.url}${path}`,
        name: `${author.name}, ${author.role}`,
        mainEntity: { '@id': `${site.url}${path}#person` },
        breadcrumb: { '@id': `${site.url}${path}#breadcrumb` },
      },
      buildBreadcrumbNode([{ name: author.name, path }], path),
      {
        '@type': 'Person',
        '@id': `${site.url}${path}#person`,
        name: author.name,
        jobTitle: author.role,
        description: author.shortBio,
        url: `${site.url}${path}`,
        image: `${site.url}${author.image}`,
        worksFor: { '@id': `${site.url}/#organization` },
      },
    ],
  };

  return (
    <>
      <PageHero
        eyebrow={`${author.role}, ${site.name}`}
        title={author.name}
        crumbs={[{ label: author.name }]}
      />

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Image
            src={author.image}
            alt={author.name}
            width={320}
            height={320}
            priority
            className="h-56 w-56 rounded-full object-cover shadow-card-hover lg:col-span-4 lg:h-72 lg:w-72"
          />
          <div className="max-w-3xl space-y-5 text-body-lg text-ink-600 lg:col-span-8">
            <h2 className="text-display-md text-navy-700">About {author.firstName}</h2>
            {author.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </Section>

      {posts.length > 0 ? (
        <Section tone="muted">
          <SectionHeading eyebrow="Latest articles" title={`Recent writing from ${author.firstName}`} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, LATEST_COUNT).map((p) => (
              <li key={p.slug}>
                <PostCard post={p} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <div className="py-section lg:py-section-lg">
        <CtaBanner
          title="Ready to talk about your growth?"
          highlight="your growth"
          body="Free audit of your market, your competitors and the gap between them."
        />
      </div>

      <JsonLd data={graph} />
    </>
  );
}

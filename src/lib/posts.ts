import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import index from '@/content/posts-index.json';
import postImages from '@/content/post-images.json';
import type { Faq } from './geo/types';
import { industryOf } from './post-industry';

/**
 * slug → featured image. Kept out of the post JSON and the generated index so a
 * re-import can't clobber it — see `scripts/derive-post-images.mjs`.
 */
const heroImages = postImages as Record<string, { image: string; alt: string }>;

export type PostSummary = {
  slug: string;
  title: string;
  date: string | null;
  excerpt: string;
  categories: string[];
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  readingTime: number;
  /** Present on generated posts; the WordPress-imported posts omit it. */
  faqs?: Faq[];
  /** Featured image, merged in from `post-images.json`. */
  heroImage?: string;
  heroImageAlt?: string;
};

function withHeroImage<T extends { slug: string }>(post: T): T & {
  heroImage?: string;
  heroImageAlt?: string;
} {
  const hero = heroImages[post.slug];
  return hero ? { ...post, heroImage: hero.image, heroImageAlt: hero.alt } : post;
}

export type Post = PostSummary & {
  content: string;
  /**
   * On-page H1 when it should differ from `title` (which stays the card/list
   * headline). Used to keep the H1 identical to the `<title>` tag.
   */
  h1?: string;
};

/** Where post images are served from. Set to a CDN or the legacy WP host. */
const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE ?? 'https://itzdigital.co/wp-content/uploads';

const POSTS_DIR = join(process.cwd(), 'src/content/posts');

export const allPosts = (index as PostSummary[]).map(withHeroImage);

export const categories = [...new Set(allPosts.flatMap((p) => p.categories))].sort();

export function getPost(slug: string): Post | null {
  try {
    const raw = readFileSync(join(POSTS_DIR, `${slug}.json`), 'utf8');
    const post = JSON.parse(raw) as Post;
    // The importer leaves a `${MEDIA_BASE}` token so the host is a deploy-time
    // decision rather than something baked into 595 files.
    return withHeroImage({
      ...post,
      content: post.content.replaceAll('${MEDIA_BASE}', MEDIA_BASE),
    });
  } catch {
    return null;
  }
}

export function postsByCategory(category: string) {
  return allPosts.filter((p) => p.categories.includes(category));
}

/**
 * "Keep reading" picks. Posts about the same industry come first — the same
 * sub-industry (e.g. physical therapy) ahead of the wider one (medical) — and
 * within a tier the ones covering the same service category win, then the newest.
 * A post whose industry can't be inferred falls back to category matching alone.
 */
export function relatedPosts(post: PostSummary, limit = 3) {
  const here = industryOf(post);

  return allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const there = industryOf(p);
      const sameIndustry = !!here && !!there && here.industry === there.industry;
      const sameSub = sameIndustry && !!here.sub && here.sub === there!.sub;
      const sameCategory = p.categories.some((c) => post.categories.includes(c));
      return { p, rank: (sameSub ? 4 : 0) + (sameIndustry ? 2 : 0) + (sameCategory ? 1 : 0), sameIndustry };
    })
    // With a known industry, never pad with other industries' posts.
    .filter(({ rank, sameIndustry }) => (here ? sameIndustry : rank > 0))
    .sort((a, b) => b.rank - a.rank || (b.p.date ?? '').localeCompare(a.p.date ?? ''))
    .slice(0, limit)
    .map(({ p }) => p);
}

export function paginate<T>(list: T[], page: number, perPage: number) {
  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const current = Math.min(Math.max(1, page), totalPages);
  return {
    items: list.slice((current - 1) * perPage, current * perPage),
    page: current,
    totalPages,
    total: list.length,
  };
}

export const formatDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

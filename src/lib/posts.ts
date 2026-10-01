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
 * Related posts, ranked by how close they are to `post`:
 *
 *   1. same industry niche (physical therapy → physical therapy)
 *   2. same parent vertical (physical therapy → dentists, med spas, ...)
 *   3. same service category (the old behaviour) — only to fill remaining slots
 *
 * Within a tier, posts sharing a service category with `post` come first, then
 * the newest. Category alone is a poor signal: "Website Services" spans every
 * industry we serve, so a clinic post would otherwise recommend a roofer's.
 */
export function relatedPosts(post: PostSummary, limit = 3) {
  const own = industryOf(post.slug);

  const tier = (p: PostSummary) => {
    const theirs = industryOf(p.slug);
    if (own && theirs?.niche === own.niche) return 0;
    if (own && theirs?.vertical === own.vertical) return 1;
    return 2;
  };
  const sharedCategories = (p: PostSummary) =>
    p.categories.filter((c) => post.categories.includes(c)).length;
  const time = (p: PostSummary) => (p.date ? Date.parse(p.date) : 0);

  return allPosts
    .filter((p) => p.slug !== post.slug && (tier(p) < 2 || sharedCategories(p) > 0))
    .sort(
      (a, b) =>
        tier(a) - tier(b) || sharedCategories(b) - sharedCategories(a) || time(b) - time(a),
    )
    .slice(0, limit);
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

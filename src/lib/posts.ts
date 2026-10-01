import 'server-only';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import index from '@/content/posts-index.json';
import postImages from '@/content/post-images.json';
import { postIndustry } from './post-industries';
import type { Faq } from './geo/types';

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

export type Post = PostSummary & { content: string };

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
 * Posts worth reading next. Categories are content types, not industries, so
 * matching on them alone surfaces e.g. a plumbing post next to Physical Therapy
 * "Website Services" guides. When the post's industry is known, candidates are
 * limited to that industry — the same trade first, then others in its group —
 * and a short list beats padding it with off-topic reads. Posts with no
 * detectable industry fall back to category overlap.
 */
export function relatedPosts(post: PostSummary, limit = 3) {
  const industry = postIndustry(post);
  const sharedCategories = (p: PostSummary) =>
    p.categories.filter((c) => post.categories.includes(c)).length;

  const candidates = allPosts.filter((p) => {
    if (p.slug === post.slug) return false;
    if (!industry) return sharedCategories(p) > 0;
    return postIndustry(p)?.group === industry.group;
  });

  const sameTopic = (p: PostSummary) =>
    industry?.topic != null && postIndustry(p)?.topic === industry.topic ? 1 : 0;

  return candidates
    .sort(
      (a, b) =>
        sameTopic(b) - sameTopic(a) ||
        sharedCategories(b) - sharedCategories(a) ||
        (b.date ?? '').localeCompare(a.date ?? '') ||
        a.slug.localeCompare(b.slug),
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

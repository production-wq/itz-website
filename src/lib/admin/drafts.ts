import 'server-only';

import type { Post } from '@/lib/posts';
import { readFileAtRef } from './github';

const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE ?? 'https://itzdigital.co/wp-content/uploads';

/**
 * Loads one post exactly as it will render, straight off a pull request's
 * branch — before it is merged, before this deployment has ever seen the
 * file. Mirrors the read + merge that src/lib/posts.ts#getPost does against
 * the local filesystem, but against a git ref via the GitHub API instead.
 */
export async function loadDraftPost(slug: string, ref: string): Promise<Post> {
  const raw = await readFileAtRef(`src/content/posts/${slug}.json`, ref);
  const post = JSON.parse(raw) as Post;

  let heroImage: string | undefined;
  let heroImageAlt: string | undefined;
  try {
    const imagesRaw = await readFileAtRef('src/content/post-images.json', ref);
    const images = JSON.parse(imagesRaw) as Record<string, { image: string; alt: string }>;
    const hero = images[slug];
    if (hero) {
      heroImage = hero.image;
      heroImageAlt = hero.alt;
    }
  } catch {
    // post-images.json didn't change in this PR (or the image step hasn't
    // run yet) — preview without a hero image rather than fail the page.
  }

  return {
    ...post,
    content: post.content.replaceAll('${MEDIA_BASE}', MEDIA_BASE),
    ...(heroImage ? { heroImage, heroImageAlt } : {}),
  };
}

export type DraftGeoRecord = {
  serviceSlug: string;
  citySlug: string;
  headline: string;
  intro: string;
  stats: { value: string; label: string }[];
  localFactors: string[];
  faqs: { question: string; answer: string }[];
};

/** Every geo record present at `ref` that differs from what's at `baseRef` — new or edited only. */
export async function loadChangedGeoRecords(
  ref: string,
  baseRef: string,
): Promise<DraftGeoRecord[]> {
  const afterRaw = await readFileAtRef('src/lib/geo/service-locations.json', ref);
  const after = JSON.parse(afterRaw) as { serviceLocations: DraftGeoRecord[] };

  let before: { serviceLocations: DraftGeoRecord[] } = { serviceLocations: [] };
  try {
    const beforeRaw = await readFileAtRef('src/lib/geo/service-locations.json', baseRef);
    before = JSON.parse(beforeRaw);
  } catch {
    // no file at the base ref — every record in `after` counts as new
  }

  const key = (r: DraftGeoRecord) => `${r.serviceSlug}::${r.citySlug}`;
  const beforeByKey = new Map(before.serviceLocations.map((r) => [key(r), JSON.stringify(r)]));

  return after.serviceLocations.filter((r) => beforeByKey.get(key(r)) !== JSON.stringify(r));
}

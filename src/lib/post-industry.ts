/**
 * Which industry a blog post is about.
 *
 * Posts carry a `categories` array, but those are service categories ("SEO",
 * "Web Design"), not industries. The industry only exists in the slug, where
 * every post names who it is for (`...-physical-therapy-website-services-...`).
 * So it is derived from the slug, at module load, with no per-post data to
 * keep in sync — a freshly generated post is classified the moment it lands.
 *
 * Two levels: a niche (`physical-therapy`) and its parent vertical (`medical`,
 * the same slugs used by `industries.ts` for the top-level industry pages).
 * Related posts prefer the niche and fall back to the vertical.
 */

export type PostIndustry = { niche: string; vertical: string };

/**
 * First match wins, so narrow niches sit above the broad ones that would also
 * match (`bankruptcy-law` before `lawyers`, `real-estate-agent` before
 * `real-estate`). Patterns run against `-${slug}-`, so `tire` cannot match
 * inside `entire`.
 */
const NICHES: [niche: string, vertical: string, pattern: RegExp][] = [
  ['personal-injury', 'lawyers', /-personal-injury-/],
  ['family-law', 'lawyers', /-(divorce|family-law)-/],
  ['criminal-defense', 'lawyers', /-(criminal|dui)-/],
  ['immigration-law', 'lawyers', /-immigration-/],
  ['estate-planning', 'lawyers', /-estate-planning-/],
  ['bankruptcy-law', 'lawyers', /-bankruptcy-/],
  ['lawyers', 'lawyers', /-(lawyers?|attorneys?|law-firms?|legal|law)-/],

  ['dentists', 'medical', /-(dentists?|dental)-/],
  ['chiropractors', 'medical', /-chiropractors?-/],
  ['med-spa', 'medical', /-med-spa-/],
  ['estheticians', 'medical', /-estheticians?-/],
  ['physical-therapy', 'medical', /-(physical-therap(y|ists?)|pt-clinics?)-/],
  ['urgent-care', 'medical', /-urgent-care-/],
  ['massage-therapy', 'medical', /-massage-/],
  ['medical', 'medical', /-(medical|healthcare)-/],

  ['realtor', 'real-estate', /-(real-estate-agents?|realtors?)-/],
  ['investors', 'real-estate', /-investors?-/],
  ['property-management', 'real-estate', /-property-management-/],
  ['real-estate', 'real-estate', /-real-estate-/],

  ['education', 'education', /-(education|schools?|universit(y|ies)|enrollment)-/],

  ['auto-detailing', 'automotive', /-(detailing|car-wash)-/],
  ['collision-repair', 'automotive', /-collision-/],
  ['auto-repair', 'automotive', /-(auto-repair|auto-glass|mechanics?|tire|windshields?|dealers?|dealerships?)-/],
  ['automotive', 'automotive', /-automotive-/],

  ['hvac', 'home-services', /-hvac-/],
  ['plumbing', 'home-services', /-(plumbers?|plumbing)-/],
  ['roofing', 'home-services', /-roofing-/],
  ['electrician', 'home-services', /-electricians?-/],
  ['locksmith', 'home-services', /-locksmiths?-/],
  ['remodeling', 'home-services', /-(remodel(er|ers|ing)?|bathroom|kitchen|flooring)-/],
  ['restoration', 'home-services', /-restoration-/],
  // The long tail of trades (landscaping, solar, pest control, ...) is listed
  // as its own niche so those posts relate to each other, not to nothing.
  [
    'other-home-services',
    'home-services',
    /-(landscaping|general-contractors|contractors?|drywall|solar|pest-control|pool|appliances|cleanup|outdoor-construction|siding|painters?|window-door|home-builders)-/,
  ],
];

export function industryOf(slug: string): PostIndustry | null {
  const haystack = `-${slug}-`;
  for (const [niche, vertical, pattern] of NICHES) {
    if (pattern.test(haystack)) return { niche, vertical };
  }
  return null;
}

/**
 * Which industry a blog post is about, inferred from its title and slug.
 *
 * Posts carry service categories ("SEO", "Website Services"…) but no industry
 * field, so "more from the same industry" has to be derived. Rules run in order
 * and the first match wins, so specific verticals sit above the generic
 * catch-alls for their parent industry. `industry` is a top-level slug from
 * `industries.ts`; `sub` is the matching sub-industry, or null when the post is
 * only identifiable at the top level.
 */

export type PostIndustry = { industry: string; sub: string | null };

const RULES: [industry: string, sub: string | null, pattern: RegExp][] = [
  ['medical', 'chiropractors', /chiropract/],
  ['medical', 'dentists', /dentist|dental|orthodont/],
  ['medical', 'med-spa', /med ?spa|medical spa|aesthetic/],
  ['medical', 'estheticians', /esthetician|facial|skincare/],
  ['medical', 'physical-therapy', /physical therap|physiotherap|\bpt\b/],
  ['medical', 'urgent-care', /urgent care/],
  ['medical', 'massage-therapy', /massage/],
  ['medical', null, /healthcare|medical|clinic|doctor|physician|patient|dermatolog|veterinar|optometr|therapist/],
  ['lawyers', 'personal-injury', /personal injury/],
  ['lawyers', 'family-law', /family law|divorce/],
  ['lawyers', 'criminal-defense', /criminal/],
  ['lawyers', 'immigration-law', /immigration/],
  ['lawyers', 'estate-planning', /estate planning/],
  ['lawyers', null, /\blaw\b|lawyer|attorney|legal|bankruptcy/],
  ['real-estate', 'property-management', /property management/],
  ['real-estate', 'realtor', /realtor|real estate agent/],
  ['real-estate', null, /real estate|broker|home buyer|mortgage/],
  ['education', 'private-schools', /private school/],
  ['education', 'universities', /universit|college/],
  ['education', 'trade-schools', /trade school|vocational/],
  ['education', null, /school|education|enrol/],
  ['automotive', 'auto-detailing', /detailing|car wash/],
  ['automotive', 'collision-repair', /collision|body shop/],
  ['automotive', 'auto-repair', /auto repair|mechanic|repair shop|auto center|tire|windshield|auto glass|oil change/],
  ['automotive', null, /automotive|dealership|dealer|car |auto /],
  ['home-services', 'hvac', /hvac|heating|air conditioning/],
  ['home-services', 'plumbing', /plumb/],
  ['home-services', 'roofing', /roof/],
  [
    'home-services',
    null,
    /electrician|electrical|painter|painting|locksmith|restoration|removal|cleanup|appliance|pool|spa builder|landscap|lawn|concrete|flooring|siding|remodel|contractor|construction|builder|home service|pest|cleaning|garage|fence|handyman|window|solar/,
  ],
  ['marketing-agencies', null, /white label|agency partner|reseller/],
];

export function industryOf(post: { title: string; slug: string }): PostIndustry | null {
  const text = `${post.title} ${post.slug.replaceAll('-', ' ')}`.toLowerCase();
  for (const [industry, sub, pattern] of RULES) {
    if (pattern.test(text)) return { industry, sub };
  }
  return null;
}

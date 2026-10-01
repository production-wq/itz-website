/**
 * Which industry a blog post is about.
 *
 * Post categories describe the *kind* of content (Website Services, SEO, Meta
 * Ads…), not the trade it's written for, so they can't answer "is this a
 * plumbing post?". The trade is only recoverable from the slug and tags, which
 * the content generators build from the same industry name — so this reads
 * those.
 *
 * `group` is the top-level industry page (`/home-services`, `/medical`…) and
 * `topic` the specific trade inside it, where the post names one. Posts written
 * for a whole industry ("medical SEO") have a group and no topic.
 */

export type PostIndustry = {
  /** Top-level industry slug, matching `industries.ts`. */
  group: string;
  /** Specific trade within the group, or null for industry-wide posts. */
  topic: string | null;
};

type Rule = { group: string; topic: string | null; match: RegExp };

// Order matters: specific trades first, then the industry-wide catch-alls.
const RULES: Rule[] = [
  { group: 'home-services', topic: 'plumbing', match: /\bplumb/ },
  { group: 'home-services', topic: 'hvac', match: /\bhvac\b/ },
  { group: 'home-services', topic: 'roofing', match: /\broof/ },
  { group: 'home-services', topic: 'electrician', match: /\belectrician/ },
  { group: 'home-services', topic: 'locksmith', match: /\blocksmith/ },
  { group: 'home-services', topic: 'bathroom-remodeler', match: /\bbathroom remodel/ },
  { group: 'home-services', topic: 'kitchen-remodeler', match: /\bkitchen remodel/ },

  { group: 'medical', topic: 'physical-therapy', match: /\bphysical therap|\bpt clinic\b/ },
  { group: 'medical', topic: 'med-spa', match: /\bmed spas?\b/ },
  { group: 'medical', topic: 'massage-therapy', match: /\bmassage/ },
  { group: 'medical', topic: 'chiropractor', match: /\bchiropract/ },
  { group: 'medical', topic: 'dentists', match: /\bdentist|\bdental\b/ },
  { group: 'medical', topic: 'urgent-care', match: /\burgent care\b/ },

  { group: 'lawyers', topic: 'personal-injury', match: /\bpersonal injury\b/ },
  { group: 'lawyers', topic: 'divorce-lawyer', match: /\bdivorce\b/ },
  { group: 'lawyers', topic: 'bankruptcy-lawyer', match: /\bbankruptcy\b/ },
  { group: 'lawyers', topic: 'immigration-law', match: /\bimmigration\b/ },
  { group: 'lawyers', topic: 'estate-planning', match: /\bestate planning\b/ },

  { group: 'automotive', topic: 'auto-repair', match: /\bmechanic|\bauto repair\b/ },
  { group: 'automotive', topic: 'tire-repair', match: /\btire repair\b/ },
  { group: 'automotive', topic: 'car-wash', match: /\bcar wash/ },
  { group: 'automotive', topic: 'auto-detailing', match: /\bdetailing\b/ },
  { group: 'automotive', topic: 'auto-windshields', match: /\bwindshield|\bauto glass\b/ },

  { group: 'real-estate', topic: 'real-estate', match: /\breal estate\b|\brealtor|\bproperty manage/ },

  { group: 'lawyers', topic: null, match: /\blaw\b|\blegal\b|\battorney|\blaw firms?\b/ },
  { group: 'medical', topic: null, match: /\bmedical\b|\bhealthcare\b/ },
  { group: 'education', topic: null, match: /\beducat|\bschools?\b|\bstudents?\b|\benrollment\b/ },
  { group: 'automotive', topic: null, match: /\bautomotive\b|\bdealer|\bauto\b/ },
  {
    group: 'home-services',
    topic: null,
    match:
      /\brestoration|\blandscap|\bgeneral contractors?\b|\bpest control\b|\bpool\b|\bsolar\b|\bflooring\b|\bsiding\b|\bpainter|\bconcrete\b|\bwindow door\b|\bdrywall\b|\bhome builders?\b|\bcleanup\b|\bappliances?\b|\bcontractors?\b|\bconstruction\b/,
  },
];

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ');

function classify(text: string): PostIndustry | null {
  const t = normalize(text);
  const rule = RULES.find((r) => r.match.test(t));
  return rule ? { group: rule.group, topic: rule.topic } : null;
}

/** Slug first — it's the most reliable signal — then tags for the stragglers. */
export function postIndustry(post: { slug: string; tags: string[] }): PostIndustry | null {
  return classify(post.slug) ?? classify(post.tags.join(' '));
}

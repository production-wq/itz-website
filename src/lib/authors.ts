/**
 * Blog authors. Every post is bylined to one of these three people.
 *
 * Assignment is deterministic (see `authorForPost`): by service category first,
 * then a stable hash of the slug, so a post never changes author between builds
 * and newly generated posts are covered without any per-post data.
 */

export type Author = {
  slug: string;
  name: string;
  /** Name as used in running copy ("Christopher"). */
  firstName: string;
  role: string;
  /** One or two sentences for the byline card under each post. */
  shortBio: string;
  /** Full bio, one paragraph per entry, for the author page. */
  bio: string[];
  /** Served from /public. */
  image: string;
  /** Post categories this author is the default for. */
  categories: string[];
};

export const authors: Author[] = [
  {
    slug: 'chris-lee',
    name: 'Chris Lee',
    firstName: 'Chris',
    role: 'Business Development Manager',
    shortBio:
      'Christopher Lee is the Business Development Manager at ITZ Digital. He works with service businesses to find where their online visibility and lead flow can improve.',
    bio: [
      'Christopher Lee is the Business Development Manager at ITZ Digital, a digital marketing agency that helps businesses grow through SEO, paid advertising, website optimization and lead generation. He focuses on building client partnerships, understanding the growth challenges each business faces, and matching them with digital marketing solutions designed to improve online visibility and customer acquisition.',
      'Working with service businesses, Christopher helps owners identify opportunities to strengthen their digital presence, attract qualified leads and build marketing strategies that line up with their growth goals. His work centers on connecting marketing performance to measurable business outcomes, so owners can make informed decisions about where their digital investment goes.',
    ],
    image: '/images/people/chris-lee.webp',
    categories: ['SEO', 'Digital Marketing', 'Social Media Ads', 'Meta Ads', 'Real Estate Agent'],
  },
  {
    slug: 'kayce-marty',
    name: 'Kayce Marty',
    firstName: 'Kayce',
    role: 'President',
    shortBio:
      'Kayce Marty is the President of ITZ Digital. She oversees operations, client relationships and strategic marketing initiatives.',
    bio: [
      'Kayce Marty is the President of ITZ Digital. She oversees operations, client relationships and strategic marketing initiatives, making sure the agency delivers high-quality digital marketing solutions that drive measurable business growth.',
    ],
    image: '/images/people/kayce-marty.webp',
    categories: ['Websites', 'Website Services', 'Web Design'],
  },
  {
    slug: 'raheim-binnie',
    name: 'Raheim Binnie',
    firstName: 'Raheim',
    role: 'CEO',
    shortBio:
      'Raheim Binnie is the CEO of ITZ Digital. He leads the agency’s strategic vision, growth initiatives and client success programs.',
    bio: [
      'Raheim Binnie is the CEO of ITZ Digital, leading the agency’s strategic vision, growth initiatives and client success programs. With extensive experience in digital marketing and business leadership, he helps businesses scale through data-driven strategies and high-performing teams.',
    ],
    image: '/images/people/raheim-binnie.webp',
    categories: ['Google ads', 'PPC Management', 'Programmatic Ads'],
  },
];

export const authorBySlug = new Map(authors.map((a) => [a.slug, a]));

const byCategory = new Map(authors.flatMap((a) => a.categories.map((c) => [c, a] as const)));

/** Stable, well-spread hash so uncategorised posts split evenly across authors. */
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0;
  return h;
}

export function authorForPost(post: { slug: string; categories: string[] }): Author {
  for (const c of post.categories) {
    const match = byCategory.get(c);
    if (match) return match;
  }
  return authors[hash(post.slug) % authors.length];
}

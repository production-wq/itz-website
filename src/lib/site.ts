export const site = {
  name: 'ITZ Digital',
  legalName: 'ITZ Digital',
  tagline: 'Get more customers without breaking the bank.',
  description:
    'Small business marketing agency running SEO, Google & Meta Ads, and website design for law firms, medical practices, real estate teams, schools, auto shops and home-services companies.',
  url: 'https://itzdigital.co',
  phone: '800.647.6917',
  phoneHref: 'tel:+18006476917',
  email: 'hello@itzdigital.co',
  address: {
    street: '5830 E 2nd St, Suite 8',
    city: 'Casper',
    region: 'WY',
    postalCode: '82609',
    country: 'US',
  },
  rating: { value: 4.9, count: 500 },
  yearsInBusiness: 20,
  social: {
    facebook: 'https://www.facebook.com/itzdigital',
    linkedin: 'https://www.linkedin.com/company/itzdigital',
    instagram: 'https://www.instagram.com/itzdigital',
  },
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

/**
 * The named person credited on blog posts. Left unset, posts are credited to
 * the organisation only. Setting it adds a visible byline and a Person author
 * in each post's structured data — fill it in with a real, verifiable author.
 */
export type BlogAuthor = {
  name: string;
  jobTitle: string;
  /** Author bio or LinkedIn page; strengthens the Person entity. */
  url?: string;
};

export const blogAuthor = null as BlogAuthor | null;

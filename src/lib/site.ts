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
  /** Default byline for blog posts (shown on the page, in meta tags and in Article JSON-LD). */
  author: { name: 'Saikat Chowdhury' },
  social: {
    facebook: 'https://www.facebook.com/itzdigital',
    linkedin: 'https://www.linkedin.com/company/itzdigital',
    instagram: 'https://www.instagram.com/itzdigital',
  },
} as const;

export const addressLine = `${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.postalCode}`;

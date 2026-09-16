import { industries } from './industries';
import { serviceBySlug } from './services';

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavColumn = {
  label: string;
  href: string;
  links: NavLink[];
};

export type NavItem = {
  label: string;
  href: string;
  /** Present = renders as a dropdown. Absent = plain link. */
  columns?: NavColumn[];
  /** Short blurb shown in the footer strip of the desktop mega menu. */
  blurb?: string;
  /** Label for the mega-menu footer link, e.g. "See all industries". */
  seeAllLabel?: string;
};

const serviceLink = (slug: string): NavLink => {
  const s = serviceBySlug.get(slug)!;
  return { label: s.name, href: `/services/${slug}`, description: s.tagline };
};

export const mainNav: NavItem[] = [
  {
    label: 'Who We Serve',
    href: '/who-we-serve',
    blurb: 'Seven industries, seven distinct strategies — not one template with the noun swapped out.',
    seeAllLabel: 'See all industries',
    columns: industries.map((industry) => ({
      label: industry.name,
      href: `/${industry.slug}`,
      links: industry.children.map((child) => ({
        label: child.name,
        href: `/${industry.slug}/${child.slug}`,
      })),
    })),
  },
  {
    label: 'What We Do',
    href: '/services',
    blurb: 'SEO is usually the foundation. Paid and a rebuilt site get layered in once you know where the gaps are.',
    seeAllLabel: 'See all services',
    columns: [
      {
        label: 'Search',
        href: '/services/seo',
        links: [serviceLink('seo'), serviceLink('ai-seo-company')],
      },
      {
        label: 'Paid Ads',
        href: '/services/ppc-management',
        links: [
          serviceLink('ppc-management'),
          serviceLink('google-ads'),
          serviceLink('meta-ads'),
          serviceLink('programmatic-ads'),
          serviceLink('social-media-ads'),
        ],
      },
      {
        label: 'Website',
        href: '/services/website-services',
        links: [serviceLink('website-design'), serviceLink('website-services')],
      },
      {
        label: 'Growth',
        href: '/services/lead-generation',
        links: [serviceLink('lead-generation'), serviceLink('review-management'), serviceLink('social-media-management')],
      },
      {
        label: 'Outbound',
        href: '/services/cold-outreach',
        links: [serviceLink('cold-outreach'), serviceLink('cold-calling'), serviceLink('cold-email')],
      },
      {
        label: 'Creative',
        href: '/services/creative',
        links: [serviceLink('creative')],
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Locations', href: '/locations' },
  { label: 'Resources', href: '/blog' },
  {
    label: 'Company',
    href: '/about-us',
    columns: [
      {
        label: 'Company',
        href: '/about-us',
        links: [
          { label: 'About Us', href: '/about-us', description: 'Two decades, 500+ local businesses' },
          { label: 'Case Studies', href: '/case-studies', description: 'What the work actually produced' },
          { label: 'Contact', href: '/contact', description: 'Get a free audit or quote' },
        ],
      },
    ],
  },
];

export const footerNav: NavColumn[] = [
  {
    label: 'Who We Serve',
    href: '/who-we-serve',
    links: industries.map((i) => ({ label: i.name, href: `/${i.slug}` })),
  },
  {
    label: 'What We Do',
    href: '/services',
    links: [
      { label: 'SEO', href: '/services/seo' },
      { label: 'Google Ads', href: '/services/google-ads' },
      { label: 'Meta Ads', href: '/services/meta-ads' },
      { label: 'Website Design', href: '/services/website-design' },
      { label: 'Review Management', href: '/services/review-management' },
      { label: 'Creative & Video', href: '/services/creative' },
      { label: 'Cold Outreach', href: '/services/cold-outreach' },
      { label: 'Social Media Management', href: '/services/social-media-management' },
    ],
  },
  {
    label: 'Company',
    href: '/about-us',
    links: [
      { label: 'Pricing', href: '/pricing' },
      { label: 'Locations', href: '/locations' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'About Us', href: '/about-us' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

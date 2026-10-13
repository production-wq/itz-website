/**
 * Pricing page content.
 *
 * Prices are the owner's own published ranges (from the pricing brief) — not
 * invented. Every program is scoped per market, so these are typical ranges,
 * not quotes; the page and the FAQ both say so.
 */
import type { Faq } from './geo/types';

export type PricingTier = {
  name: string;
  price: string;
  /** e.g. "/mo" — omitted for one-time and custom prices. */
  unit?: string;
  blurb: string;
  featured?: boolean;
};

export type PricingGroup = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  /** Extra caveat under the intro (e.g. "ad spend billed separately"). */
  note?: string;
  /** Link to the matching service page, when there is one. */
  serviceHref?: string;
  tiers: PricingTier[];
};

export const pricingGroups: PricingGroup[] = [
  {
    slug: 'seo',
    eyebrow: 'SEO programs',
    title: 'Monthly local SEO retainers',
    intro:
      'Scoped as a one-time audit or an ongoing monthly plan. Some clients start with a single audit to see where they stand, then move to a retainer once they know the priorities.',
    serviceHref: '/services/seo',
    tiers: [
      { name: 'One-time audit', price: 'Custom', blurb: 'A full technical and Google Business Profile audit with a prioritised action list — no ongoing commitment.' },
      { name: 'Starter', price: '$600–$1,000', unit: '/mo', blurb: 'Solo practices or newer businesses in a lower-competition market. Covers Google Business Profile optimisation and foundational on-page SEO.' },
      { name: 'Growth', price: '$3,000–$5,500', unit: '/mo', featured: true, blurb: 'Most mid-size businesses in competitive metros. Adds ongoing content, ethical link building, and multi-service or multi-practice-area targeting.' },
      { name: 'Aggressive', price: '$7,000–$12,000+', unit: '/mo', blurb: 'High-competition categories like personal injury law in a major market, or businesses with multiple locations to rank simultaneously.' },
    ],
  },
  {
    slug: 'google-ads',
    eyebrow: 'Google Ads',
    title: 'Monthly Google Ads management',
    intro:
      'We manage your Google Search and Local Service Ads campaigns end to end — keyword strategy, ad copy, bid management and monthly optimisation.',
    note: 'Ad spend is billed separately, direct to Google.',
    serviceHref: '/services/google-ads',
    tiers: [
      { name: 'One-time setup', price: '$500–$900', blurb: 'Account build, keyword research and first campaign launch — no ongoing management included.' },
      { name: 'Starter', price: '$450–$700', unit: '/mo', blurb: 'Single-campaign management for a solo practice or single-location business.' },
      { name: 'Growth', price: '$1,800–$3,200', unit: '/mo', featured: true, blurb: 'Multi-campaign management across Search and Local Service Ads, with monthly A/B testing.' },
      { name: 'Multi-location', price: '$4,000+', unit: '/mo', blurb: 'Coordinated campaigns across multiple locations or practice areas under one account.' },
    ],
  },
  {
    slug: 'meta-ads',
    eyebrow: 'Meta Ads',
    title: 'Facebook & Instagram campaign management',
    intro: 'Creative, targeting and monthly optimisation for social campaigns.',
    note: 'Ad spend is billed separately, direct to Meta.',
    serviceHref: '/services/meta-ads',
    tiers: [
      { name: 'Monthly plan', price: '$1,500–$2,500', unit: '/mo', featured: true, blurb: 'Ongoing creative refresh and audience testing across Facebook and Instagram.' },
      { name: 'Multi-location', price: 'Custom', blurb: 'Coordinated social campaigns across multiple locations under one account.' },
    ],
  },
  {
    slug: 'programmatic-ads',
    eyebrow: 'Programmatic ads',
    title: 'Display and video, placed automatically',
    intro:
      'Automated display and video placement across the web and streaming apps, targeted to your service area.',
    note: 'Media spend is billed separately.',
    serviceHref: '/services/programmatic-ads',
    tiers: [
      { name: 'One-time campaign', price: '$1,000–$1,800', blurb: 'A single seasonal push, ideal for a launch or a limited-time promotion.' },
      { name: 'Monthly plan', price: '$700–$1,300', unit: '/mo', featured: true, blurb: 'Ongoing brand awareness alongside your search and social programs.' },
      { name: 'Multi-market', price: '$3,500+', unit: '/mo', blurb: 'Coordinated placement across several service areas or brand locations.' },
    ],
  },
  {
    slug: 'website-design',
    eyebrow: 'Website design & build',
    title: 'A site built to load fast and convert',
    intro:
      'Priced as a one-time build. Sign up for a monthly Web Maintenance plan below and we waive the design & build cost entirely.',
    serviceHref: '/services/website-design',
    tiers: [
      { name: 'Starter site', price: '$3,500–$6,000', blurb: 'A focused 5–8 page site — home, services, about, contact — for a single-location business.' },
      { name: 'Growth site', price: '$6,000–$12,000', featured: true, blurb: 'Multiple service and practice-area pages, blog, and custom design built for SEO from day one.' },
    ],
  },
  {
    slug: 'web-maintenance',
    eyebrow: 'Web maintenance',
    title: 'One monthly plan, every housekeeping task covered — and the build cost waived',
    intro:
      'Sign up for any Web Maintenance plan and we waive your Design & Build fee — you pay only the monthly rate. Every tier includes hosting, security monitoring, backups, uptime monitoring, plugin/CMS updates and routine edits.',
    serviceHref: '/services/website-services',
    tiers: [
      { name: 'Essential', price: '$99–$180', unit: '/mo', blurb: 'Hosting, uptime monitoring, security scanning, weekly backups and CMS/plugin updates. Up to 30 minutes of content edits per month.' },
      { name: 'Standard', price: '$350–$550', unit: '/mo', featured: true, blurb: 'Everything in Essential, plus malware monitoring and removal, daily backups, speed tuning and up to 3 hours of edits or design tweaks per month.' },
      { name: 'Premium', price: '$900–$1,500', unit: '/mo', blurb: 'Everything in Standard, plus a dedicated firewall and DDoS protection, staging-site testing for every change, priority same-day edits and unlimited content updates.' },
    ],
  },
  {
    slug: 'review-management',
    eyebrow: 'Reputation & reviews management',
    title: 'Build and protect your review rating',
    intro:
      'Review generation, monitoring and response across Google and your industry-specific platforms.',
    serviceHref: '/services/review-management',
    tiers: [
      { name: 'One-time cleanup', price: '$500–$900', blurb: 'An initial review audit and response pass to clear out stale, unanswered reviews.' },
      { name: 'Monthly plan', price: '$180–$350', unit: '/mo', featured: true, blurb: 'Ongoing review requests, monitoring and response within 48 hours across all platforms.' },
      { name: 'Multi-location', price: '$900+', unit: '/mo', blurb: 'Coordinated review management across multiple locations or profiles.' },
    ],
  },
  {
    slug: 'creative',
    eyebrow: 'Creative & video',
    title: 'Testimonial edits, social clips and ad creative',
    intro: 'Cut from your raw footage and ready to run across every channel above.',
    serviceHref: '/services/creative',
    tiers: [
      { name: 'One-time project', price: '$400–$900', blurb: 'A single testimonial edit or ad cut, delivered ready to run.' },
      { name: 'Monthly content plan', price: '$350–$650', unit: '/mo', featured: true, blurb: 'A steady stream of social clips and ad creative each month, cut from ongoing footage.' },
      { name: 'Campaign bundle', price: '$1,800+', blurb: 'A full set of edits — testimonial, social clips and ad creative — for a single campaign launch.' },
    ],
  },
];

/** Rendered as a four-column checked grid under the Web Maintenance tiers. */
export const maintenanceFeatures: string[][] = [
  ['Managed hosting & CDN', 'SSL certificate management', 'Uptime monitoring & alerts'],
  ['Cybersecurity monitoring', 'Malware scanning & removal', 'Automated backups'],
  ['CMS, plugin & theme updates', 'Broken link & 404 checks', 'Page speed optimisation'],
  ['Content edits & tweaks', 'Form & integration testing', 'Monthly health report'],
];

export const pricingFaqs: Faq[] = [
  {
    question: 'Why is there a range instead of a fixed price?',
    answer:
      "Cost depends on your market's competitiveness, your current site condition, and how many services or locations you need covered. We scope every quote after a free audit, so you see the plan and the price together.",
  },
  {
    question: 'Is there a contract or minimum term?',
    answer:
      'Most programs run month-to-month after an initial 90-day setup period, since SEO needs that runway to show measurable movement. You keep your accounts, analytics and creative either way.',
  },
  {
    question: 'Do you charge extra for website design?',
    answer:
      "Design & Build is quoted as a one-time project, scoped to your site's size and features. If you sign up for a Web Maintenance plan, that one-time cost is waived — you only pay the monthly rate.",
  },
  {
    question: 'Is ad spend included in the management fee?',
    answer:
      'No. Management fees cover our work — strategy, setup, optimisation and reporting. The media budget is billed separately, direct to Google or Meta, so you keep full visibility and control of it.',
  },
  {
    question: 'Can I combine services into one plan?',
    answer:
      'Yes, and most clients do — SEO plus paid search is the common starting pair. We scope the combined program after the audit and bill it as one monthly retainer, with the reporting rolled up so you see the whole picture.',
  },
];

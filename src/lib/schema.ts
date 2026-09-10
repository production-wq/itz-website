/**
 * JSON-LD builders for the geo-landing pages.
 *
 * Everything is emitted as a single `@graph` so the nodes can cross-reference
 * each other by `@id` instead of repeating the organisation and address on
 * every node. Google resolves `@id` references within a graph.
 *
 * Policy note on aggregateRating — see lib/geo/types.ts. A rating is emitted
 * ONLY when the city has verified, city-attributable review data. The
 * site-wide average is deliberately not used as a fallback: repeating one
 * rating across every generated city page is the pattern Google's structured
 * data policy calls out, and it risks a manual action across the whole site.
 */

import type { ResolvedServiceLocation } from './geo';
import type { Faq } from './geo/types';
import type { Post } from './posts';
import { site } from './site';

/** Loose JSON-LD node type — schema.org is too open to model precisely. */
export type JsonLdNode = Record<string, unknown>;

export interface JsonLdGraph {
  '@context': 'https://schema.org';
  '@graph': JsonLdNode[];
}

const ORG_ID = `${site.url}/#organization`;

const abs = (path: string) => `${site.url}${path}`;

const postalAddress = (): JsonLdNode => ({
  '@type': 'PostalAddress',
  streetAddress: site.address.street,
  addressLocality: site.address.city,
  addressRegion: site.address.region,
  postalCode: site.address.postalCode,
  addressCountry: site.address.country,
});

/**
 * LocalBusiness node for one city.
 *
 * Modelled as ProfessionalService (a LocalBusiness subtype) with `areaServed`
 * + `serviceArea` rather than a fake per-city `address`. Inventing a street
 * address in each city would be a fabricated location — the business operates
 * from Casper, WY and serves these metros.
 */
export function buildLocalBusinessNode(resolved: ResolvedServiceLocation): JsonLdNode {
  const { city, service, cityStateLong, path } = resolved;

  return {
    '@type': 'ProfessionalService',
    '@id': `${abs(path)}#localbusiness`,
    name: `${site.name} — ${service.name} in ${city.name}`,
    description: `${service.name} for small businesses in ${cityStateLong}.`,
    url: abs(path),
    telephone: site.phone,
    image: abs('/images/og-default.jpg'),
    logo: abs('/logo/itz-digital.svg'),
    priceRange: '$$',
    parentOrganization: { '@id': ORG_ID },

    // Real operating address, not a fabricated per-city one.
    address: postalAddress(),

    areaServed: [
      {
        '@type': 'City',
        name: city.name,
        containedInPlace: {
          '@type': 'State',
          name: city.state,
          alternateName: city.stateCode,
        },
      },
      ...city.nearbyCities.map((n) => ({ '@type': 'City', name: n.name })),
    ],

    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: city.geo.lat,
        longitude: city.geo.lng,
      },
      geoRadius: Math.round(city.serviceRadiusMiles * 1609.34), // schema.org wants metres
    },

    // Emitted only with verified, city-attributable review data.
    ...(city.reviews
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: city.reviews.ratingValue,
            reviewCount: city.reviews.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/** Service node, scoped to the city. */
export function buildServiceNode(resolved: ResolvedServiceLocation): JsonLdNode {
  const { city, service, cityStateLong, path } = resolved;

  return {
    '@type': 'Service',
    '@id': `${abs(path)}#service`,
    name: `${service.name} in ${city.name}, ${city.stateCode}`,
    description: `${service.tagline}. ${service.summary}`,
    serviceType: service.name,
    category: 'Digital Marketing',
    url: abs(path),
    provider: { '@id': `${abs(path)}#localbusiness` },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'State',
        name: city.state,
        alternateName: city.stateCode,
      },
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.name} deliverables in ${cityStateLong}`,
      itemListElement: service.deliverables.map((d, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: d.title,
          description: d.body,
        },
      })),
    },
  };
}

/**
 * FAQPage node.
 *
 * Google requires every answer here to also be visible on the page — the
 * accordion renders exactly this array, so the two cannot drift.
 */
export function buildFaqNode(faqs: Faq[], pagePath: string): JsonLdNode {
  return {
    '@type': 'FAQPage',
    '@id': `${abs(pagePath)}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function buildBreadcrumbNode(crumbs: Crumb[], pagePath: string): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(pagePath)}#breadcrumb`,
    itemListElement: [{ name: 'Home', path: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };
}

export function buildWebPageNode(
  resolved: ResolvedServiceLocation,
  title: string,
  description: string,
): JsonLdNode {
  return {
    '@type': 'WebPage',
    '@id': `${abs(resolved.path)}#webpage`,
    url: abs(resolved.path),
    name: title,
    description,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${abs(resolved.path)}#service` },
    breadcrumb: { '@id': `${abs(resolved.path)}#breadcrumb` },
    primaryImageOfPage: { '@id': `${abs(resolved.path)}#primaryimage` },
  };
}

/**
 * The full graph for one geo-landing page: WebPage + BreadcrumbList +
 * ProfessionalService + Service + FAQPage.
 */
export function buildGeoPageGraph(
  resolved: ResolvedServiceLocation,
  meta: { title: string; description: string },
): JsonLdGraph {
  const { service, city, content, path } = resolved;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildWebPageNode(resolved, meta.title, meta.description),
      buildBreadcrumbNode(
        [
          { name: 'Services', path: '/services' },
          { name: service.name, path: `/services/${service.slug}` },
          { name: city.name, path },
        ],
        path,
      ),
      buildLocalBusinessNode(resolved),
      buildServiceNode(resolved),
      buildFaqNode(content.faqs, path),
    ],
  };
}

/**
 * The full graph for one blog post: Article + BreadcrumbList, plus FAQPage when
 * the post carries FAQs (generated posts do; the 595 imported ones don't).
 *
 * Replaces the inline BlogPosting object the blog page used to build, so every
 * page on the site derives its structured data from `site.ts` through these
 * builders.
 */
export function buildArticleGraph(post: Post): JsonLdGraph {
  const path = `/${post.slug}`;
  const description = post.seoDescription ?? post.excerpt;

  const article: JsonLdNode = {
    '@type': 'Article',
    '@id': `${abs(path)}#article`,
    headline: post.title,
    description,
    url: abs(path),
    ...(post.heroImage ? { image: abs(post.heroImage) } : {}),
    ...(post.date ? { datePublished: post.date, dateModified: post.date } : {}),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${abs(path)}#webpage` },
    ...(post.categories.length > 0 ? { articleSection: post.categories } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {}),
    inLanguage: 'en-US',
  };

  const webPage: JsonLdNode = {
    '@type': 'WebPage',
    '@id': `${abs(path)}#webpage`,
    url: abs(path),
    name: post.seoTitle ?? post.title,
    description,
    isPartOf: { '@id': `${site.url}/#website` },
    breadcrumb: { '@id': `${abs(path)}#breadcrumb` },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      webPage,
      buildBreadcrumbNode([{ name: 'Blog', path: '/blog' }, { name: post.title, path }], path),
      article,
      ...(post.faqs && post.faqs.length > 0 ? [buildFaqNode(post.faqs, path)] : []),
    ],
  };
}

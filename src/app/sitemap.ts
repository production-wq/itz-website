import type { MetadataRoute } from 'next';

import { caseStudies } from '@/lib/case-studies';
import { cities, serviceLocationParams } from '@/lib/geo';
import { industries } from '@/lib/industries';
import { allPosts } from '@/lib/posts';
import { services } from '@/lib/services';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = (
    [
      { url: url('/'), changeFrequency: 'weekly', priority: 1 },
      { url: url('/services'), changeFrequency: 'monthly', priority: 0.9 },
      { url: url('/who-we-serve'), changeFrequency: 'monthly', priority: 0.9 },
      { url: url('/pricing'), changeFrequency: 'monthly', priority: 0.9 },
      { url: url('/locations'), changeFrequency: 'monthly', priority: 0.8 },
      { url: url('/about-us'), changeFrequency: 'monthly', priority: 0.7 },
      { url: url('/case-studies'), changeFrequency: 'monthly', priority: 0.7 },
      { url: url('/blog'), changeFrequency: 'daily', priority: 0.8 },
      { url: url('/contact'), changeFrequency: 'yearly', priority: 0.9 },
      { url: url('/sitemap'), changeFrequency: 'weekly', priority: 0.3 },
      { url: url('/terms-conditions'), changeFrequency: 'yearly', priority: 0.1 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({ ...entry, lastModified: now }));

  const servicePages: MetadataRoute.Sitemap = services.map((s) => ({
    url: url(`/services/${s.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const industryPages: MetadataRoute.Sitemap = industries.flatMap((industry) => [
    {
      url: url(`/${industry.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    ...industry.children.map((child) => ({
      url: url(`/${industry.slug}/${child.slug}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]);

  // Programmatic geo-landing pages. High priority: these target the
  // highest-intent "<service> in <city>" queries.
  const geoPages: MetadataRoute.Sitemap = serviceLocationParams.map(({ service, city }) => ({
    url: url(`/services/${service}/${city}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = caseStudies.map((study) => ({
    url: url(`/case-studies/${study.slug}`),
    lastModified: now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  const locationPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: url(`/locations/${city.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const postPages: MetadataRoute.Sitemap = allPosts.map((post) => ({
    url: url(`/${post.slug}`),
    lastModified: post.date ? new Date(post.date) : now,
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...geoPages,
    ...industryPages,
    ...locationPages,
    ...caseStudyPages,
    ...postPages,
  ];
}

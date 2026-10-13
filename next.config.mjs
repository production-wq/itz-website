import { readFileSync } from 'node:fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Original WordPress URLs that changed in the rebuild. Everything else keeps
  // its legacy path so existing rankings and backlinks survive the migration.
  async redirects() {
    // Blog posts live at the site root (/post-slug), matching the original
    // WordPress URLs. The site briefly launched with them under /blog, so send
    // that form back to the root. Built from the same index the routes read,
    // so the list can never drift from the slugs actually served. Evaluated
    // once at build time, not per request.
    const posts = JSON.parse(readFileSync('./src/content/posts-index.json', 'utf8'));
    const postRedirects = posts.map((post) => ({
      source: `/blog/${post.slug}`,
      destination: `/${post.slug}`,
      permanent: true,
    }));

    // Posts whose slug was renamed after publishing (src/content/posts has only
    // the new slug). Both the root and the short-lived /blog form go straight to
    // the new URL in one hop, so neither chains through a second redirect. An
    // explicit 301 rather than `permanent` (which Next sends as a 308).
    // The same table keeps scripts/import-roadmap-csv.mjs from re-queuing the
    // old slugs.
    const renamed = JSON.parse(readFileSync('./src/content/post-redirects.json', 'utf8'));
    const renamedPostRedirects = Object.entries(renamed).flatMap(([from, to]) => [
      { source: `/${from}`, destination: `/${to}`, statusCode: 301 },
      { source: `/blog/${from}`, destination: `/${to}`, statusCode: 301 },
    ]);

    // WordPress archive URLs with no equivalent page in the rebuild. Send them
    // to the blog index rather than letting them 404.
    const archiveRedirects = [
      { source: '/category/:path*', destination: '/blog', permanent: true },
      { source: '/tag/:path*', destination: '/blog', permanent: true },
      { source: '/author/:path*', destination: '/blog', permanent: true },
      { source: '/feed', destination: '/blog', permanent: true },
      { source: '/page/:n', destination: '/blog', permanent: true },
      // The `resource` post type and its taxonomy only ever held drafts.
      { source: '/resource', destination: '/blog', permanent: true },
      { source: '/resources/:path*', destination: '/blog', permanent: true },
      { source: '/wp-sitemap.xml', destination: '/sitemap.xml', permanent: true },
    ];

    // Pages that exist in the rebuild under a different path. Sourced from the
    // old database's permalink table and the Search Console index, 2026-09-03.
    const movedPages = [
      // The `case_study` post type lived at /case-study/<slug>; the rebuild
      // uses /case-studies/<slug> with the same six slugs. Its taxonomy terms
      // (/case-studies/banner-campaign etc.) have no equivalent page.
      { source: '/case-study', destination: '/case-studies', permanent: true },
      { source: '/case-study/:slug', destination: '/case-studies/:slug', permanent: true },
      { source: '/case-studies/banner-campaign', destination: '/case-studies', permanent: true },
      { source: '/case-studies/multi%e2%80%90channel-campaign', destination: '/case-studies', permanent: true },
      { source: '/case-studies/website-design', destination: '/case-studies', permanent: true },
      { source: '/ai-seo-company', destination: '/services/ai-seo-company', permanent: true },
      { source: '/lawyers/divorce-lawyer', destination: '/lawyers/family-law', permanent: true },
      { source: '/property-management', destination: '/real-estate/property-management', permanent: true },
      { source: '/faqs', destination: '/about-us', permanent: true },
    ];

    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/about', destination: '/about-us', permanent: true },
      { source: '/testimonials', destination: '/about-us', permanent: true },
      // Flat duplicates WordPress accumulated alongside the nested originals.
      { source: '/dentists', destination: '/medical/dentists', permanent: true },
      { source: '/chiropractor', destination: '/medical/chiropractors', permanent: true },
      { source: '/med-spa', destination: '/medical/med-spa', permanent: true },
      { source: '/urgent-care', destination: '/medical/urgent-care', permanent: true },
      { source: '/massage-therapy', destination: '/medical/massage-therapy', permanent: true },
      { source: '/personal-injury-law', destination: '/lawyers/personal-injury', permanent: true },
      { source: '/estate-planning', destination: '/lawyers/estate-planning', permanent: true },
      { source: '/real-estate-agent', destination: '/real-estate/realtor', permanent: true },
      { source: '/auto-repair', destination: '/automotive/auto-repair', permanent: true },
      { source: '/auto-detailing', destination: '/automotive/auto-detailing', permanent: true },
      ...movedPages,
      ...archiveRedirects,
      ...renamedPostRedirects,
      ...postRedirects,
    ];
  },
};

export default nextConfig;

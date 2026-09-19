/*
 * Internal-link manifest + resolution helpers, shared by the roadmap CSV
 * importer and every generation entry point (Vercel cron + manual batch).
 *
 * Reads .ts source as text (regex extraction), the same trick
 * content-gen.mjs's readServices() uses — these scripts run as plain `node
 * scripts/*.mjs` with no TypeScript loader, so a real `import` of a .ts file
 * only works from inside Next's own bundler (e.g. the cron route handler).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const STATIC_PAGES = {
  '/': 'Homepage',
  '/about-us': 'About Us',
  '/who-we-serve': 'Who We Serve',
  '/services': 'Our Services',
  '/pricing': 'Pricing',
  '/locations': 'Locations',
  '/case-studies': 'Case Studies',
  '/blog': 'the Blog',
  '/contact': 'Contact',
  '/terms-conditions': 'Terms & Conditions',
  '/sitemap': 'Sitemap',
};

// Legacy WordPress paths that 301 elsewhere (next.config.mjs `redirects()`) —
// link straight to the real destination instead of relying on the redirect.
const PATH_FIXUPS = {
  '/faqs': '/about-us',
};

function readCaseStudies(root) {
  const src = readFileSync(join(root, 'src/lib/case-studies.ts'), 'utf8');
  const items = [];
  for (const block of src.split(/\n {2}\{\n/).slice(1)) {
    const get = (key) => block.match(new RegExp(`^\\s{4}${key}: '((?:[^'\\\\]|\\\\.)*)'`, 'm'))?.[1];
    const slug = get('slug');
    if (slug) items.push({ slug, title: get('title') });
  }
  return items;
}

function readIndustries(root) {
  const src = readFileSync(join(root, 'src/lib/industries.ts'), 'utf8');
  const industries = [];
  for (const block of src.split(/\n {2}\{\n/).slice(1)) {
    const slug = block.match(/^\s{4}slug: '((?:[^'\\]|\\.)*)'/m)?.[1];
    const name = block.match(/^\s{4}name: '((?:[^'\\]|\\.)*)'/m)?.[1];
    if (!slug) continue;
    const childSlugs = [...block.matchAll(/^\s{8}slug: '((?:[^'\\]|\\.)*)'/gm)].map((m) => m[1]);
    const childNames = [...block.matchAll(/^\s{8}name: '((?:[^'\\]|\\.)*)'/gm)].map((m) => m[1]);
    const children = childSlugs.map((s, i) => ({ slug: s, name: childNames[i] }));
    industries.push({ slug, name, children });
  }
  return industries;
}

/**
 * Every internal path this build can actually serve, mapped to a short human
 * label — used both to validate the roadmap CSV's pre-planned "Internal
 * Links" and to describe them to the model. Deliberately omits the
 * service/city geo pages and /locations/<city>: the client's roadmap CSV
 * never references either (confirmed against all 212 rows), so leaving them
 * out keeps this regex-based reader simpler without dropping anything real.
 *
 * `services` is passed in (from content-gen.mjs's readServices(root)) rather
 * than re-read here, so the two lib modules don't have to import each other.
 */
export function buildLinkManifest(root, services) {
  const manifest = new Map(Object.entries(STATIC_PAGES));

  for (const s of services) manifest.set(`/services/${s.slug}`, s.name);

  for (const cs of readCaseStudies(root)) manifest.set(`/case-studies/${cs.slug}`, cs.title);

  for (const ind of readIndustries(root)) {
    manifest.set(`/${ind.slug}`, ind.name);
    for (const child of ind.children) manifest.set(`/${ind.slug}/${child.slug}`, child.name);
  }

  const posts = JSON.parse(readFileSync(join(root, 'src/content/posts-index.json'), 'utf8'));
  for (const p of posts) manifest.set(`/${p.slug}`, p.title);

  return manifest;
}

/** "https://itzdigital.co/blog/foo/, 'https://itzdigital.co/bar/" -> ["https://itzdigital.co/blog/foo/", "https://itzdigital.co/bar/"] */
export function parseInternalLinksCell(raw) {
  return (raw ?? '')
    .split(',')
    .map((s) => s.trim().replace(/^['"]+|['"]+$/g, '').trim())
    .filter(Boolean);
}

/** Absolute or root-relative URL -> canonical site-relative path, or null if unparseable. */
export function normalizeInternalLink(rawUrl) {
  let path;
  try {
    path = new URL(rawUrl, 'https://itzdigital.co').pathname;
  } catch {
    return null;
  }
  path = path.replace(/\/+$/, '');
  path = path === '' ? '/' : path.replace(/^\/blog(\/|$)/, '/') || '/';
  return PATH_FIXUPS[path] ?? path;
}

/**
 * Resolves a row's raw "Internal Links" URLs against the manifest, dropping
 * anything unresolvable (not-yet-published sibling post, typo'd slug, a
 * legacy path with no mapping), duplicates, and a link back to the page
 * itself. Caps at `limit` — the roadmap CSV plans 4-5 per row, matching the
 * client's own brief.
 */
export function resolveInternalLinks(rawLinks, manifest, { selfPath = '', limit = 5 } = {}) {
  const seen = new Set(selfPath ? [selfPath] : []);
  const resolved = [];
  for (const raw of rawLinks) {
    const path = normalizeInternalLink(raw);
    if (!path || seen.has(path) || !manifest.has(path)) continue;
    seen.add(path);
    resolved.push({ path, label: manifest.get(path) });
    if (resolved.length >= limit) break;
  }
  return resolved;
}

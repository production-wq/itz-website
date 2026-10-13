#!/usr/bin/env node
/*
 * Pulls published posts from the ITZ Digital Sanity Studio (a separate
 * repo/app — see ../studio-itz-digital, sibling to this one) and writes them
 * into this repo's normal content pipeline:
 *   src/content/posts/<slug>.json  +  an entry in posts-index.json
 * exactly like scripts/generate-daily-content.mjs does. A Sanity-authored
 * post is then indistinguishable from a keyword-generated one to the rest of
 * the site — same route, same sitemap entry, same /admin/review preview.
 *
 *   node scripts/sync-sanity-posts.mjs
 *   node scripts/sync-sanity-posts.mjs --force     # re-sync every post, ignore the state cache
 *
 * Review model: Sanity's own draft/publish distinction IS the review gate on
 * that side — this script only ever reads published documents (a "Publish"
 * click in the Studio, not "Save"). The site's own review gate still applies
 * on top: the daily-content-style workflow that runs this script opens a PR
 * rather than committing to the deploy branch directly, and a full
 * `npm run build` has to pass before that PR is offered for review.
 *
 * Idempotent: a post's local file is only rewritten if Sanity's `_updatedAt`
 * moved since the last successful sync (tracked in
 * scripts/.sanity-sync-state.json, itself committed so re-runs across CI
 * runs stay in sync).
 *
 * Needs:
 *   SANITY_PROJECT_ID   (or NEXT_PUBLIC_SANITY_PROJECT_ID)
 *   SANITY_DATASET      defaults to "production"
 *   SANITY_API_TOKEN    a Viewer token — only required if the dataset is
 *                        private; public datasets work without one
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { createClient } from '@sanity/client';

import { readingTime, slugify } from '../src/lib/content-schemas.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const POSTS_INDEX = join(ROOT, 'src/content/posts-index.json');
const IMAGES_DIR = join(ROOT, 'public/images/blog');
const IMAGES_MAP = join(ROOT, 'src/content/post-images.json');
const STATE_PATH = join(ROOT, 'scripts/.sanity-sync-state.json');

const FORCE = process.argv.includes('--force');

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';

if (!projectId) {
  console.error('SANITY_PROJECT_ID is not set — see README §13.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const readJson = (path, fallback) => (existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : fallback);

// ── Portable Text → the same constrained HTML subset content-schemas.mjs validates ──
// (h2/h3/p, ul/ol/li, strong, a — nothing else; matches the Studio's own
// schema restrictions in studio-itz-digital/schemaTypes/post.ts, so there is
// no formatting a writer can pick in Sanity that would produce anything else)

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

function renderSpan(span, markDefs) {
  let text = escapeHtml(span.text);
  for (const mark of span.marks ?? []) {
    if (mark === 'strong') {
      text = `<strong>${text}</strong>`;
      continue;
    }
    const def = markDefs?.find((d) => d._key === mark);
    if (def?._type === 'link' && def.href) {
      text = `<a href="${escapeHtml(def.href)}">${text}</a>`;
    }
  }
  return text;
}

const renderBlockText = (block) =>
  (block.children ?? []).filter((c) => c._type === 'span').map((s) => renderSpan(s, block.markDefs)).join('');

/** Portable Text blocks → HTML string. Skips any non-`block` entry (inline images, custom types) — the site's content model has none. */
function portableTextToHtml(blocks) {
  const out = [];
  let openList = null; // { tag: 'ul'|'ol', items: string[] }

  const flushList = () => {
    if (openList) out.push(`<${openList.tag}>${openList.items.join('')}</${openList.tag}>`);
    openList = null;
  };

  for (const block of blocks ?? []) {
    if (block._type !== 'block') continue;

    if (block.listItem) {
      const tag = block.listItem === 'number' ? 'ol' : 'ul';
      if (!openList || openList.tag !== tag) {
        flushList();
        openList = { tag, items: [] };
      }
      openList.items.push(`<li>${renderBlockText(block)}</li>`);
      continue;
    }

    flushList();
    const text = renderBlockText(block);
    if (!text.trim()) continue;
    if (block.style === 'h2') out.push(`<h2>${text}</h2>`);
    else if (block.style === 'h3') out.push(`<h3>${text}</h3>`);
    else out.push(`<p>${text}</p>`);
  }
  flushList();
  return out.join('');
}

// ── Featured image: download Sanity's asset into public/images/blog/ ──

async function saveHeroImage(image, slug) {
  const url = image?.asset?.url;
  if (!url) return null;

  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`  ! could not download hero image for ${slug} (${res.status})`);
    return null;
  }
  const ext = (new URL(url).pathname.match(/\.(\w+)$/)?.[1] || 'jpg').toLowerCase();
  const filename = `${slug}.${ext}`;

  mkdirSync(IMAGES_DIR, { recursive: true });
  writeFileSync(join(IMAGES_DIR, filename), Buffer.from(await res.arrayBuffer()));

  return { image: `/images/blog/${filename}`, alt: image.alt || '' };
}

// ── Light validation for human-authored content ──
// Deliberately NOT content-schemas.mjs's validatePost(): that one requires
// >=4 FAQs and >=1200 words, tuned for the AI-generation contract. A person
// writing directly in Sanity should not be held to an AI-batch word floor —
// the checks below just catch the "still a draft, don't ship it" cases.

function problemsWith(doc, html) {
  const problems = [];
  if (!doc.title?.trim()) problems.push('no title');
  if (!doc.excerpt?.trim()) problems.push('no excerpt');
  if (!doc.categories?.length) problems.push('no category selected');
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  if (words < 150) problems.push(`body is only ${words} words — looks unfinished`);
  if (!/<h2[\s>]/.test(html) && words > 0) problems.push('no <h2> heading — add at least one section');
  return problems;
}

async function main() {
  const docs = await client.fetch(`*[_type == "post" && defined(slug.current)]{
    _id, _updatedAt, title, "slug": slug.current, excerpt, categories, tags,
    seoTitle, seoDescription, publishedAt, faqs, body,
    heroImage{alt, asset->{url}}
  }`);

  const state = FORCE ? {} : readJson(STATE_PATH, {});
  const index = readJson(POSTS_INDEX, []);
  const images = readJson(IMAGES_MAP, {});

  let synced = 0;
  let skipped = 0;
  let unchanged = 0;

  for (const doc of docs) {
    const slug = doc.slug || slugify(doc.title ?? '');
    if (!slug) {
      console.warn(`  ✗ "${doc.title ?? doc._id}" — could not derive a usable slug`);
      skipped += 1;
      continue;
    }

    if (state[slug] === doc._updatedAt) {
      unchanged += 1;
      continue;
    }

    const html = portableTextToHtml(doc.body);
    const problems = problemsWith(doc, html);
    if (problems.length) {
      console.warn(`  ✗ "${doc.title}" (/${slug}) — ${problems.join('; ')}`);
      skipped += 1;
      continue;
    }

    const post = {
      slug,
      title: doc.title,
      date: doc.publishedAt || new Date().toISOString(),
      excerpt: doc.excerpt,
      categories: doc.categories,
      tags: doc.tags ?? [],
      seoTitle: doc.seoTitle || null,
      seoDescription: doc.seoDescription || null,
      readingTime: readingTime(html),
      ...(doc.faqs?.length ? { faqs: doc.faqs } : {}),
      content: html,
    };

    mkdirSync(POSTS_DIR, { recursive: true });
    writeFileSync(join(POSTS_DIR, `${slug}.json`), JSON.stringify(post));

    const nextIndex = index.filter((p) => p.slug !== slug);
    const { content: _omit, ...summary } = post;
    nextIndex.push(summary);
    nextIndex.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
    index.length = 0;
    index.push(...nextIndex);

    const hero = await saveHeroImage(doc.heroImage, slug);
    if (hero) images[slug] = hero; // no hero from Sanity → leave to derive-post-images.mjs / generate-blog-images.mjs

    state[slug] = doc._updatedAt;
    synced += 1;
    console.log(`  ✓ "${doc.title}" → /${slug}`);
  }

  if (synced > 0) {
    writeFileSync(POSTS_INDEX, `${JSON.stringify(index, null, 2)}\n`);
    writeFileSync(IMAGES_MAP, `${JSON.stringify(images, null, 2)}\n`);
  }
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);

  console.log(`\n${synced} synced, ${skipped} skipped, ${unchanged} unchanged.`);
  if (synced > 0) {
    console.log('Run `node scripts/derive-post-images.mjs && node scripts/generate-blog-images.mjs`');
    console.log('to fill in a featured image for anything synced without one, then `npm run build`.');
  }
}

main().catch((err) => {
  console.error(`\nFatal: ${err.message}`);
  process.exit(1);
});

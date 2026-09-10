#!/usr/bin/env node
/*
 * Generate a featured image for every blog post left un-matched by
 * scripts/derive-post-images.mjs (its queue: scripts/.post-images-generate.json).
 *
 *   node scripts/generate-blog-images.mjs --api-key <KEY>     # or GEMINI_API_KEY
 *   node scripts/generate-blog-images.mjs --only roofing      # slug substring
 *   node scripts/generate-blog-images.mjs --limit 10          # first N only
 *   node scripts/generate-blog-images.mjs --force             # re-make existing
 *
 * Each prompt is built from the post title + its primary category so the set
 * stays on-brand and on-topic. Writes public/images/blog/<slug>.webp and merges
 * the entry into src/content/post-images.json. Key is never written to disk.
 * Cost: ~1290 output tokens per image on gemini-2.5-flash-image.
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GoogleGenAI } from '@google/genai';

import { generateImage, resolveKey } from './lib/image-gen.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_OUT = resolve(ROOT, 'public/images/blog');
const MAP_PATH = resolve(ROOT, 'src/content/post-images.json');
const QUEUE_PATH = resolve(__dirname, '.post-images-generate.json');

// category (lower-cased) → the scene half of the prompt
const SCENES = {
  seo:
    'a search-results page with one listing climbing to the top spot, a magnifying glass, a ' +
    'small local map-pack of three results, an upward rank ladder',
  'google ads':
    'a search-results page with the top sponsored ad slot highlighted amber, a bid-strategy ' +
    'dial, a single click turning into a ringing phone',
  'ppc management':
    'a paid-search dashboard: the top ad slot highlighted amber, a bid dial, a negative-keyword ' +
    'filter, a conversion funnel ending in a phone call',
  'meta ads':
    'a phone showing one sponsored post in a social feed, concentric audience-targeting rings, ' +
    'two creative variants side by side, a small results chart',
  'social media ads':
    'a phone showing a social feed with one boosted post, engagement icons rising from it, ' +
    'audience-targeting rings, a compact performance chart',
  'programmatic ads':
    'a display-ad exchange: banner slots across several device screens linked by routing lines ' +
    'to a central audience graph and a bid meter',
  websites:
    'a rough wireframe on the left resolving into a polished fast website shown on a phone and ' +
    'a desktop on the right, a speed gauge, a call-to-action button highlighted amber',
  'web design':
    'a designer\'s canvas: a wireframe becoming a finished website on phone and desktop, colour ' +
    'and type swatches, a highlighted call-to-action button',
  'website services':
    'an ongoing-care view of a website: a dashboard with uptime and speed gauges, a small ' +
    'checklist of monthly fixes, a shield badge',
  'digital marketing':
    'a multi-channel funnel: search, social and email icons feeding into one dashboard with an ' +
    'upward revenue curve and a ringing phone at the end',
  'real estate agent':
    'a house with a sold sign and a map pin, a phone showing a stream of new buyer enquiries, ' +
    'an upward listings chart',
};
const DEFAULT_SCENE = SCENES['digital marketing'];

// title keyword → the subject half of the prompt. First match wins.
const SUBJECTS = [
  [/chiropract/i, 'a chiropractic clinic'],
  [/dentist|dental/i, 'a dental practice'],
  [/med spa|medspa|medical spa|esthetician/i, 'a med spa'],
  [/physical therapy|physiotherap/i, 'a physical-therapy clinic'],
  [/urgent care/i, 'an urgent-care clinic'],
  [/massage/i, 'a massage-therapy practice'],
  [/\b(law|legal|lawyer|attorney|counsel)\b|divorce|injury|bankruptcy|immigration|estate planning|criminal defense/i, 'a law firm'],
  [/roofing|roofer/i, 'a roofing company'],
  [/plumb/i, 'a plumbing company'],
  [/\bhvac\b|heating|air conditioning/i, 'an HVAC company'],
  [/electrician|electrical/i, 'an electrical contractor'],
  [/painter|painting/i, 'a painting company'],
  [/concrete|flooring|siding|remodel|contractor|construction|builder/i, 'a home-improvement contractor'],
  [/property management/i, 'a property-management company'],
  [/real estate|realtor|broker/i, 'a real-estate brokerage'],
  [/auto detailing|car wash/i, 'an auto-detailing and car-wash business'],
  [/auto repair|mechanic|auto center|repair shop/i, 'an auto-repair shop'],
  [/tire/i, 'a tire shop'],
  [/windshield|auto glass/i, 'an auto-glass shop'],
  [/locksmith/i, 'a locksmith business'],
  [/restoration|water damage|removal|cleanup/i, 'a restoration company'],
  [/\b(school|schools|education|university|universities|college|enrol)/i, 'a school or college'],
  [/automotive|dealership|dealer/i, 'an automotive dealership group'],
  [/pool|spa builder/i, 'a pool and spa builder'],
  [/hotel|hospitality|restaurant/i, 'a hospitality business'],
];

function promptFor({ title, category }) {
  const subjectMatch = SUBJECTS.find(([re]) => re.test(title));
  const subject = subjectMatch ? subjectMatch[1] : 'a local service business';
  const scene = SCENES[String(category || '').toLowerCase()] ?? DEFAULT_SCENE;
  return `Editorial illustration for a small-business marketing article about ${subject}. Scene: ${scene}. A single balanced composition, not a collage of separate panels.`;
}

function parseArgs(argv) {
  const args = { force: false, only: null, limit: Infinity, apiKey: null };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--force') args.force = true;
    else if (a === '--only') args.only = argv[(i += 1)];
    else if (a === '--limit') args.limit = Number(argv[(i += 1)]);
    else if (a === '--api-key') args.apiKey = argv[(i += 1)];
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);

  if (!existsSync(QUEUE_PATH)) {
    console.error(`No queue at ${QUEUE_PATH} — run scripts/derive-post-images.mjs first.`);
    process.exit(1);
  }
  let queue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  if (args.only) queue = queue.filter((q) => q.slug.includes(args.only));
  if (Number.isFinite(args.limit)) queue = queue.slice(0, args.limit);

  const map = existsSync(MAP_PATH) ? JSON.parse(readFileSync(MAP_PATH, 'utf8')) : {};
  mkdirSync(BLOG_OUT, { recursive: true });

  const ai = new GoogleGenAI({ apiKey: resolveKey(args.apiKey) });
  let made = 0;
  let skipped = 0;
  const failures = [];

  for (const post of queue) {
    const outPath = join(BLOG_OUT, `${post.slug}.webp`);
    if (!args.force && existsSync(outPath)) {
      skipped += 1;
      map[post.slug] ??= { image: `/images/blog/${post.slug}.webp`, alt: post.title };
      continue;
    }
    process.stdout.write(`gen   ${post.slug} … `);
    try {
      const webp = await generateImage(ai, { prompt: promptFor(post), aspect: '4:3' });
      writeFileSync(outPath, webp);
      map[post.slug] = { image: `/images/blog/${post.slug}.webp`, alt: post.title };
      made += 1;
      console.log(`${(webp.length / 1024).toFixed(0)} KB`);
    } catch (err) {
      failures.push(post.slug);
      console.log(`FAILED — ${err.message}`);
    }
  }

  // Persist the map (sorted) and shrink the queue to what is still missing.
  const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
  writeFileSync(MAP_PATH, JSON.stringify(sorted, null, 2) + '\n');

  const fullQueue = JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
  const remaining = fullQueue.filter((q) => !existsSync(join(BLOG_OUT, `${q.slug}.webp`)));
  writeFileSync(QUEUE_PATH, JSON.stringify(remaining, null, 2) + '\n');

  console.log(`\n${made} generated, ${skipped} already present, ${failures.length} failed`);
  console.log(`featured image map: ${Object.keys(sorted).length} entries`);
  console.log(`queue remaining:    ${remaining.length}`);
  if (failures.length) {
    console.log('failed:', failures.join(', '));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

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

import { generateImage, promptFor, resolveKey } from './lib/image-gen.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BLOG_OUT = resolve(ROOT, 'public/images/blog');
const MAP_PATH = resolve(ROOT, 'src/content/post-images.json');
const QUEUE_PATH = resolve(__dirname, '.post-images-generate.json');
// SCENES/SUBJECTS/promptFor moved to lib/image-gen.mjs — shared with the
// Studio "Generate with AI" button.

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

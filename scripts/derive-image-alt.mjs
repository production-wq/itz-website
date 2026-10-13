#!/usr/bin/env node
/*
 * Replace weak featured-image alt text in `src/content/post-images.json`.
 *
 *   node scripts/derive-image-alt.mjs [--dry-run]
 *
 * "Weak" means the alt is empty, is just the post title (which the page already
 * shows as the H1 right beside the image), or is a leaked image-generation
 * prompt. Alts that were written by hand are left alone, so the script is
 * idempotent and safe to re-run after new posts land.
 *
 *   alt === title        → describe the house-style illustration (altFor)
 *   alt is a prompt      → its first descriptive sentence (altFromPrompt)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { altFor, altFromPrompt, needsBetterAlt } from './lib/image-gen.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MAP_PATH = resolve(ROOT, 'src/content/post-images.json');
const DRY = process.argv.includes('--dry-run');

const index = JSON.parse(readFileSync(resolve(ROOT, 'src/content/posts-index.json'), 'utf8'));
const meta = new Map(index.map((p) => [p.slug, p]));
const map = JSON.parse(readFileSync(MAP_PATH, 'utf8'));

let fromTitle = 0;
let fromPrompt = 0;
for (const [slug, entry] of Object.entries(map)) {
  const post = meta.get(slug);
  if (!post || !needsBetterAlt(entry.alt, post.title)) continue;
  if (entry.alt === post.title || !entry.alt?.trim()) {
    entry.alt = altFor({ title: post.title, category: post.categories?.[0] });
    fromTitle += 1;
  } else {
    entry.alt = altFromPrompt(entry.alt);
    fromPrompt += 1;
  }
}

console.log(`alt rewritten from title: ${fromTitle}, from prompt: ${fromPrompt}`);
if (!DRY) writeFileSync(MAP_PATH, JSON.stringify(map, null, 2) + '\n');

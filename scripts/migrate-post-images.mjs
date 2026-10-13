#!/usr/bin/env node
/*
 * Vendor the imported blog posts' inline images into the repo.
 *
 *   node scripts/migrate-post-images.mjs /path/to/old-site/wp-content/uploads
 *
 * The WordPress importer left each post body with a single
 *   <img src="${MEDIA_BASE}/YYYY/MM/original-name.webp">
 * pointing at the old host. This script, given a local copy of that host's
 * `uploads` directory, copies each referenced file to
 *   public/images/blog/<post-slug>.webp
 * and rewrites the <img src> in src/content/posts/<post-slug>.json to the new
 * local path. One image per post, named by slug (guaranteed unique).
 *
 * Idempotent: posts already pointing at /images/blog/ are skipped, and a
 * re-run with the same uploads dir is a no-op.
 *
 * Any post whose source file is missing from the uploads dir is listed at the
 * end so a replacement can be generated (see scripts/generate-images.mjs).
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS_DIR = resolve(ROOT, 'src/content/posts');
const OUT_DIR = resolve(ROOT, 'public/images/blog');

const uploadsArg = process.argv[2];
if (!uploadsArg) {
  console.error('Usage: node scripts/migrate-post-images.mjs <wp-content/uploads dir>');
  process.exit(1);
}
const UPLOADS = resolve(process.cwd(), uploadsArg);
if (!existsSync(UPLOADS) || !statSync(UPLOADS).isDirectory()) {
  console.error(`Not a directory: ${UPLOADS}`);
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

// Matches the token the importer leaves, e.g.
//   ${MEDIA_BASE}/2026/08/some-image-inline-2.webp
const TOKEN = /\$\{MEDIA_BASE\}(\/\d{4}\/\d{2}\/[^"]+\.(?:webp|png|jpe?g|gif))/i;

const files = readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));

let copied = 0;
let rewritten = 0;
let skipped = 0;
const missing = [];

for (const file of files) {
  const slug = file.replace(/\.json$/, '');
  const path = join(POSTS_DIR, file);
  const raw = readFileSync(path, 'utf8');

  const match = raw.match(TOKEN);
  if (!match) {
    skipped += 1;
    continue;
  }

  const rel = match[1]; // /YYYY/MM/name.ext
  const ext = rel.slice(rel.lastIndexOf('.'));
  const source = join(UPLOADS, rel);
  const destName = `${slug}${ext}`;
  const dest = join(OUT_DIR, destName);

  if (!existsSync(source)) {
    missing.push({ slug, rel });
    continue;
  }

  // Skip the copy when an identical file is already in place (cheap re-runs).
  if (!existsSync(dest) || statSync(dest).size !== statSync(source).size) {
    copyFileSync(source, dest);
    copied += 1;
  }

  const next = raw.replace(TOKEN, `/images/blog/${destName}`);
  if (next !== raw) {
    writeFileSync(path, next);
    rewritten += 1;
  }
}

console.log(`posts scanned:   ${files.length}`);
console.log(`images copied:   ${copied}  ->  public/images/blog/`);
console.log(`posts rewritten: ${rewritten}`);
console.log(`posts skipped:   ${skipped}  (no external image token)`);

if (missing.length) {
  console.log(`\n${missing.length} referenced image(s) not found in ${UPLOADS}:`);
  for (const m of missing) console.log(`  ${m.slug}  <-  ${m.rel}`);
  process.exitCode = 2;
}

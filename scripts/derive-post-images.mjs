#!/usr/bin/env node
/*
 * Give every blog post a featured image (`src/content/post-images.json`).
 *
 *   node scripts/derive-post-images.mjs [/path/to/old-site/wp-content/uploads] [--no-fuzzy]
 *
 * Two groups of posts:
 *
 *  A. Posts whose body already carries an inline image at /images/blog/<slug>.webp
 *     (migrated by scripts/migrate-post-images.mjs). That image becomes the
 *     featured image and the now-redundant <figure> is stripped from the body so
 *     it is not shown twice on the page.
 *
 *  B. Posts with no image. If an uploads directory is given (and --no-fuzzy is
 *     not set), each title is fuzzy-matched against the original (non-resized)
 *     files in it; confident matches are resized to WebP and copied to
 *     public/images/blog/<slug>.webp. Everything still unmatched is written to
 *     scripts/.post-images-generate.json for scripts/generate-blog-images.mjs.
 *
 *     --no-fuzzy skips B's matching entirely and queues every imageless post for
 *     generation. Use it when the old featured images are inconsistent (photo
 *     renders, baked-in stats) — on-brand generated art is then more uniform.
 *
 * Idempotent. Re-run after a fresh WordPress import. Writes:
 *   src/content/post-images.json          slug -> { image, alt }
 *   scripts/.post-images-report.json       what matched, with scores
 *   scripts/.post-images-generate.json     the still-unmatched queue
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const POSTS_DIR = resolve(ROOT, 'src/content/posts');
const BLOG_OUT = resolve(ROOT, 'public/images/blog');
const MAP_PATH = resolve(ROOT, 'src/content/post-images.json');
const REPORT_PATH = resolve(__dirname, '.post-images-report.json');
const QUEUE_PATH = resolve(__dirname, '.post-images-generate.json');

const argv = process.argv.slice(2).filter((a) => a !== '--no-fuzzy');
const NO_FUZZY = process.argv.includes('--no-fuzzy');
const uploadsArg = argv[0];
const UPLOADS = uploadsArg ? resolve(process.cwd(), uploadsArg) : null;

mkdirSync(BLOG_OUT, { recursive: true });

// ── tokenisation ───────────────────────────────────────────────────────────
const STOP = new Set(
  ('the a an and or of for to in on with your you our we how why what which that this these those' +
    ' is are be as at by from into out up more most best top vetted elite premier leading proven' +
    ' ultimate complete essential key core guide guides tips tricks ways step steps 2023 2024 2025' +
    ' 2026 vs versus using use used need needs should must can will get getting growth grow scale' +
    ' scaling business businesses company companies agency agencies firm firms partner partners' +
    ' service services solution solutions platform platforms provider providers marketing digital')
    .split(/\s+/),
);

const tokens = (s) =>
  new Set(
    String(s)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length >= 3 && !STOP.has(t) && !/^\d+$/.test(t)),
  );

const jaccard = (a, b) => {
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = a.size + b.size - inter;
  return { inter, score: union === 0 ? 0 : inter / union };
};

// ── candidate image index (group B) ────────────────────────────────────────
function buildCandidateIndex() {
  if (NO_FUZZY || !UPLOADS || !existsSync(UPLOADS)) return [];
  const skip = /\/(smush|wp-defender|snapshot-backups|siteground-optimizer-assets|elementor)\//i;
  const resized = /-\d+x\d+\.(webp|png|jpe?g)$/i;
  const out = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!skip.test(full + '/')) walk(full);
        continue;
      }
      if (!/\.webp$/i.test(entry.name)) continue;
      if (resized.test(entry.name) || skip.test(full)) continue;
      const base = entry.name.replace(/\.(png|jpe?g)?\.webp$/i, '').replace(/\.webp$/i, '');
      if (base.length < 12) continue; // skip "1", "2-e177…" style noise
      out.push({ path: full, tok: tokens(base) });
    }
  };
  walk(UPLOADS);
  return out;
}

// ── main ───────────────────────────────────────────────────────────────────
const index = JSON.parse(readFileSync(resolve(ROOT, 'src/content/posts-index.json'), 'utf8'));
const prevMap = existsSync(MAP_PATH) ? JSON.parse(readFileSync(MAP_PATH, 'utf8')) : {};
const map = {};
const report = { promotedFromBody: [], fuzzyMatched: [], unmatched: [] };
const queue = [];
const proposals = [];

const FIGURE_RE = (slug) =>
  new RegExp(
    `<figure class="wp-block-image[^"]*"><img src="/images/blog/${slug.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    )}\\.webp"[^>]*></figure>\\r?\\n?`,
  );

const candidates = buildCandidateIndex();
if (UPLOADS) console.log(`candidate images indexed: ${candidates.length}`);

const pending = [];

for (const meta of index) {
  const slug = meta.slug;
  const file = join(POSTS_DIR, `${slug}.json`);
  if (!existsSync(file)) continue;
  const raw = readFileSync(file, 'utf8');
  const post = JSON.parse(raw);
  const category = meta.categories?.[0] ?? null;

  // ── A. already has an inline image ──────────────────────────────────────
  const inline = post.content.match(
    new RegExp(`<img src="/images/blog/${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.webp" alt="([^"]*)"`),
  );
  if (inline) {
    map[slug] = {
      image: `/images/blog/${slug}.webp`,
      alt: inline[1] || prevMap[slug]?.alt || meta.title,
    };
    const stripped = post.content.replace(FIGURE_RE(slug), '');
    if (stripped !== post.content) {
      post.content = stripped;
      writeFileSync(file, JSON.stringify(post));
      report.promotedFromBody.push(slug);
    }
    continue;
  }

  // Body figure already stripped on a previous run, or matched/generated
  // earlier — keep whatever we recorded, falling back to the title.
  if (existsSync(join(BLOG_OUT, `${slug}.webp`))) {
    map[slug] = {
      image: `/images/blog/${slug}.webp`,
      alt: prevMap[slug]?.alt || meta.title,
    };
    continue;
  }

  // ── B. fuzzy-match against uploads ─────────────────────────────────────
  const want = new Set([...tokens(meta.title), ...tokens(slug)]);
  let best = null;
  let second = 0;
  for (const cand of candidates) {
    const { inter, score } = jaccard(want, cand.tok);
    if (inter < 4) continue;
    if (!best || score > best.score) {
      second = best ? best.score : 0;
      best = { path: cand.path, score, inter };
    } else if (score > second) {
      second = score;
    }
  }

  if (best && best.score >= 0.42 && best.score - second >= 0.06) {
    proposals.push({ slug, title: meta.title, category, ...best });
  } else {
    report.unmatched.push({ slug, title: meta.title, category });
  }
}

// Resolve source-file collisions: a given uploads file can only be the featured
// image for one post — the highest-scoring claim wins, the rest fall through to
// generation.
proposals.sort((a, b) => b.score - a.score);
const claimed = new Set();
for (const p of proposals) {
  if (claimed.has(p.path)) {
    report.unmatched.push({ slug: p.slug, title: p.title, category: p.category });
    continue;
  }
  claimed.add(p.path);
  const dest = join(BLOG_OUT, `${p.slug}.webp`);
  pending.push(
    sharp(p.path)
      .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(dest),
  );
  map[p.slug] = { image: `/images/blog/${p.slug}.webp`, alt: p.title };
  report.fuzzyMatched.push({
    slug: p.slug,
    title: p.title,
    file: p.path.replace(UPLOADS, '…'),
    score: Number(p.score.toFixed(3)),
  });
}

for (const u of report.unmatched) queue.push({ slug: u.slug, title: u.title, category: u.category });

if (pending.length) {
  process.stdout.write(`encoding ${pending.length} matched images… `);
  await Promise.all(pending);
  console.log('done');
}

// sorted for a stable diff
const sortedMap = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
writeFileSync(MAP_PATH, JSON.stringify(sortedMap, null, 2) + '\n');
writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n');

console.log(`\nposts total:            ${index.length}`);
console.log(`featured image set:     ${Object.keys(sortedMap).length}`);
console.log(`  promoted from body:   ${report.promotedFromBody.length}`);
console.log(`  fuzzy-matched:        ${report.fuzzyMatched.length}`);
console.log(`still to generate:      ${queue.length}   -> scripts/.post-images-generate.json`);
console.log(`report:                 scripts/.post-images-report.json`);

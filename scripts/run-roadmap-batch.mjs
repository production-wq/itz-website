#!/usr/bin/env node
/**
 * Work through content-queue/roadmap/queue.json — the dated content calendar
 * imported by scripts/import-roadmap-csv.mjs — generating whichever posts are
 * due.
 *
 *   node scripts/run-roadmap-batch.mjs --limit 4
 *   node scripts/run-roadmap-batch.mjs --all-due          # catch-up run
 *   node scripts/run-roadmap-batch.mjs --limit 4 --dry-run
 *
 * "Due" means launchDate <= today and status is still "pending" — this
 * covers both backdated rows (immediate catch-up) and today's row, exactly
 * like the daily cron is meant to: each day's run only ever sees rows whose
 * date has arrived. Rows are processed oldest-date-first, capped at --limit
 * (default 4) unless --all-due is passed.
 *
 * Always uses the Gemini provider — this queue is explicitly a Gemini-only
 * pipeline (see the content-gen.mjs shared core for the Claude path, used by
 * the /admin studio instead). Unlike scripts/generate-daily-content.mjs, the
 * post's title/slug are NOT derived from the model's output — they're forced
 * to the queue row's own values, because other rows in the same roadmap
 * reference these exact planned URLs in their internal-linking plan.
 *
 * On success, each processed row is marked "published" in queue.json (so a
 * re-run never repeats it) and a run summary is written to
 * content-queue/roadmap/.last-run.json for scripts/send-roadmap-notification.mjs.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { POST_SCHEMA, readingTime, slugify, validatePost } from '../src/lib/content-schemas.mjs';
import {
  DEFAULT_MODEL,
  describeError,
  makeGeminiProvider,
  postPrompt,
  readServices,
  readSite,
  systemPrompt,
} from './lib/content-gen.mjs';
import { buildLinkManifest, resolveInternalLinks } from './lib/internal-links.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_PATH = resolve(ROOT, 'content-queue/roadmap/queue.json');
const SUMMARY_PATH = resolve(ROOT, 'content-queue/roadmap/.last-run.json');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const POSTS_INDEX = join(ROOT, 'src/content/posts-index.json');
const SITE_ORIGIN = 'https://itzdigital.co';

function parseArgs(argv) {
  const opts = { limit: 4, allDue: false, dryRun: false, model: null, concurrency: 2 };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[(i += 1)];
    switch (arg) {
      case '--limit': opts.limit = Number(next()); break;
      case '--all-due': opts.allDue = true; break;
      case '--dry-run': opts.dryRun = true; break;
      case '--model': opts.model = next(); break;
      case '--concurrency': opts.concurrency = Number(next()); break;
      default:
        console.error(`Unknown option: ${arg}`);
        process.exit(1);
    }
  }
  return opts;
}

/** Bounded-concurrency map; does not preserve order (progress is saved as each item lands). */
async function mapLimit(items, limit, fn) {
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor];
      cursor += 1;
      await fn(item);
    }
  });
  await Promise.all(workers);
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const todayStr = () => new Date().toISOString().slice(0, 10);

function writePost(post) {
  mkdirSync(POSTS_DIR, { recursive: true });
  writeFileSync(join(POSTS_DIR, `${post.slug}.json`), JSON.stringify(post));

  const { content: _omit, ...summary } = post;
  const index = readJson(POSTS_INDEX).filter((p) => p.slug !== post.slug);
  index.push(summary);
  index.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  writeFileSync(POSTS_INDEX, `${JSON.stringify(index, null, 2)}\n`);
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  // Was hardcoded to gemini-3.1-pro-preview here, independent of
  // content-gen.mjs's own DEFAULT_MODEL — the two silently drifted apart, so
  // this script kept using the expensive Pro model even after DEFAULT_MODEL
  // was moved to Flash. Deferring to DEFAULT_MODEL.gemini keeps both entry
  // points (this script and the cron route) on the same model by construction.
  opts.model ??= DEFAULT_MODEL.gemini;

  if (!existsSync(QUEUE_PATH)) {
    console.error(`No queue at ${QUEUE_PATH} — run scripts/import-roadmap-csv.mjs first.`);
    process.exit(1);
  }

  const queue = readJson(QUEUE_PATH);
  const today = todayStr();
  const due = queue
    .filter((r) => r.status === 'pending' && r.launchDate <= today)
    .sort((a, b) => a.launchDate.localeCompare(b.launchDate));

  const batch = opts.allDue ? due : due.slice(0, opts.limit);

  if (batch.length === 0) {
    console.log(`Nothing due today (${today}). ${due.length} row(s) match the date filter but were already selected, or none are due yet.`);
    writeFileSync(SUMMARY_PATH, `${JSON.stringify({ date: today, generated: [], failed: [] }, null, 2)}\n`);
    return;
  }

  console.log(`${due.length} row(s) due as of ${today}; processing ${batch.length}${opts.dryRun ? ' [DRY RUN]' : ''}.\n`);

  const site = readSite(ROOT);
  const system = systemPrompt(site);
  const existingSlugs = new Set(readJson(POSTS_INDEX).map((p) => p.slug));
  const provider = await makeGeminiProvider(opts);
  // Built once up front, like `system` above — a sibling row that finishes
  // earlier in this same batch won't be linkable until the next run, but
  // that only ever means fewer links, never a link to a page that isn't live.
  const linkManifest = buildLinkManifest(ROOT, readServices(ROOT));

  const generated = [];
  const failed = [];

  // Persisted after every row (not just at the end) so a rate-limit or crash
  // partway through an --all-due catch-up doesn't lose progress: queue.json
  // always reflects exactly what's actually on disk.
  const saveProgress = () => {
    if (!opts.dryRun) writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);
    writeFileSync(SUMMARY_PATH, `${JSON.stringify({ date: today, generated, failed }, null, 2)}\n`);
  };

  await mapLimit(batch, opts.concurrency, async (row) => {
    const label = `${row.launchDate} · ${row.slug}`;
    try {
      if (existingSlugs.has(row.slug)) {
        console.log(`  ○ ${label} — a post with this slug already exists, marking published`);
        row.status = 'published';
        row.publishedDate = today;
        row.publishedUrl = `${SITE_ORIGIN}/${row.slug}`;
        generated.push({ slug: row.slug, title: row.title, url: row.publishedUrl });
        saveProgress();
        return;
      }

      const internalLinks = resolveInternalLinks(row.internalLinks ?? [], linkManifest, {
        selfPath: `/${row.slug}`,
      });
      const { data } = await provider.generate({
        system,
        user: postPrompt({ keyword: row.keyword, category: row.category, angle: row.angle, internalLinks }),
        schema: POST_SCHEMA,
        schemaName: 'blog_post',
      });

      // Title/slug are forced to the roadmap's planned values (not the
      // model's own title) — see file header.
      data.title = row.title;
      const slug = slugify(row.title) ?? row.slug;

      const errors = validatePost(data);
      if (errors.length) throw new Error(`validation failed: ${errors.join('; ')}`);

      const linkedCount = internalLinks.filter((l) => data.content.includes(`href="${l.path}"`)).length;
      if (internalLinks.length > 0 && linkedCount < internalLinks.length) {
        console.warn(`  ⚠ ${label}: used ${linkedCount}/${internalLinks.length} requested internal links`);
      }

      const post = {
        slug,
        title: row.title,
        // The row's own planned launch date, not "now" — a catch-up run that
        // processes a week of backlog in one sitting would otherwise stamp
        // every post with today's date, clustering them instead of spreading
        // them across the days they were actually meant to publish.
        date: new Date(row.launchDate).toISOString(),
        excerpt: data.excerpt,
        categories: data.categories,
        tags: data.tags,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        readingTime: readingTime(data.content),
        faqs: data.faqs,
        content: data.content,
      };

      if (!opts.dryRun) {
        writePost(post);
        existingSlugs.add(slug);
        row.status = 'published';
        row.publishedDate = today;
        row.publishedUrl = `${SITE_ORIGIN}/${slug}`;
      }

      console.log(`  ✓ ${label} → /${slug}`);
      generated.push({ slug, title: row.title, url: `${SITE_ORIGIN}/${slug}` });
      saveProgress();
    } catch (err) {
      console.error(`  ✗ ${label} — ${describeError(err)}`);
      failed.push({ slug: row.slug, title: row.title, error: describeError(err) });
      saveProgress();
    }
  });

  console.log(`\n${generated.length} generated, ${failed.length} failed.`);
  if (failed.length > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(`\nFatal: ${describeError(err)}`);
  process.exit(1);
});

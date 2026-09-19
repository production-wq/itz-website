#!/usr/bin/env node
/**
 * Convert the ITZ SEO content-roadmap CSV (the "Blogs" export from the
 * SEO strategy spreadsheet) into content-queue/roadmap/queue.json — the
 * queue scripts/run-roadmap-batch.mjs works through, one dated batch a day.
 *
 *   node scripts/import-roadmap-csv.mjs content-queue/roadmap/blogs-source.csv
 *
 * Re-runnable: rows are keyed by slug (derived from the `Link` column), so
 * importing an updated export merges in new rows and leaves the status of
 * rows already in the queue (pending/published) untouched. The one exception
 * is `internalLinks`: a row that already exists but has none yet (queue rows
 * imported before this field existed) gets it backfilled from the CSV.
 *
 * Expected columns (matched by exact header name — this is a fixed export
 * format, not a loose user upload like the /admin queue):
 *   PAGE TITLE, Vertical, Services, Blog Topic, Launch Date, Link,
 *   Relevant Keywords, Description, Internal Links
 *
 * Launch Date is `DD-Mon-YYYY` (e.g. "01-Sep-2026"). Link is the full
 * intended URL (e.g. https://itzdigital.co/blog/<slug>) — the slug is taken
 * from its last path segment so every planned page keeps the exact URL the
 * roadmap already committed to (other rows' Internal Links reference these).
 * Internal Links is a comma-separated list of the full URLs the client's plan
 * wants this specific post to link to — generation resolves each against the
 * site's real routes and drops anything that isn't (a typo, a not-yet-
 * published sibling) rather than ever letting the model link to a dead page.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseInternalLinksCell } from './lib/internal-links.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const QUEUE_PATH = resolve(ROOT, 'content-queue/roadmap/queue.json');

// The blog's real category taxonomy (src/lib/content-gen.mjs BLOG_CATEGORIES)
// — the roadmap CSV's `Services` values need mapping onto these exact strings.
const SERVICE_TO_CATEGORY = {
  'SEO': 'SEO',
  'Google Ads': 'Google ads',
  'PPC Management': 'PPC Management',
  'Meta Ads': 'Meta Ads',
  'Social Media Ads': 'Social Media Ads',
  'Programmatic Ads': 'Programmatic Ads',
  'Web Design': 'Web Design',
  'Website Services': 'Website Services',
  'Digital Market Agency Core': 'Digital Marketing',
};

function parseCsvTable(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else { quoted = false; }
      } else field += ch;
      continue;
    }
    if (ch === '"') { quoted = true; continue; }
    if (ch === ',') { row.push(field); field = ''; continue; }
    if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(field);
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = []; field = '';
      continue;
    }
    field += ch;
  }
  row.push(field);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

const MONTHS = {
  jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
  jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
};

/** "01-Sep-2026" -> "2026-09-01" (sortable, matches post.date's format prefix). */
function parseLaunchDate(raw) {
  const m = String(raw ?? '').trim().match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
  if (!m) return null;
  const month = MONTHS[m[2].toLowerCase()];
  if (!month) return null;
  return `${m[3]}-${month}-${m[1].padStart(2, '0')}`;
}

function slugFromLink(link) {
  try {
    const path = new URL(link).pathname;
    return path.replace(/^\/(blog\/)?/, '').replace(/\/$/, '').trim();
  } catch {
    return null;
  }
}

function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node scripts/import-roadmap-csv.mjs <path-to-blogs-csv>');
    process.exit(1);
  }
  const inputPath = resolve(process.cwd(), input);
  if (!existsSync(inputPath)) {
    console.error(`Error: input file not found: ${inputPath}`);
    process.exit(1);
  }

  const table = parseCsvTable(readFileSync(inputPath, 'utf8'));
  const [header, ...body] = table;
  const col = (name) => {
    const i = header.indexOf(name);
    if (i === -1) throw new Error(`missing expected column "${name}"`);
    return i;
  };
  const idx = {
    title: col('PAGE TITLE'),
    vertical: col('Vertical'),
    services: col('Services'),
    topic: col('Blog Topic'),
    launchDate: col('Launch Date'),
    link: col('Link'),
    keywords: col('Relevant Keywords'),
    description: col('Description'),
    internalLinks: col('Internal Links'),
  };

  const existing = existsSync(QUEUE_PATH)
    ? new Map(JSON.parse(readFileSync(QUEUE_PATH, 'utf8')).map((r) => [r.slug, r]))
    : new Map();

  let added = 0;
  let backfilled = 0;
  let skippedBadDate = 0;
  let skippedNoSlug = 0;

  for (const row of body) {
    const title = row[idx.title]?.trim();
    const link = row[idx.link]?.trim();
    const launchDate = parseLaunchDate(row[idx.launchDate]);
    const slug = link ? slugFromLink(link) : null;
    const internalLinks = parseInternalLinksCell(row[idx.internalLinks]);

    if (!title || !slug) { skippedNoSlug += 1; continue; }
    if (!launchDate) { skippedBadDate += 1; continue; }
    if (existing.has(slug)) {
      // Already imported — leave status/dates alone, but an earlier import
      // (before this column was read) may have left internalLinks unset.
      const row2 = existing.get(slug);
      if (!row2.internalLinks && internalLinks.length > 0) {
        row2.internalLinks = internalLinks;
        backfilled += 1;
      }
      continue;
    }

    const service = row[idx.services]?.trim();
    const category = SERVICE_TO_CATEGORY[service] ?? 'Digital Marketing';
    const vertical = row[idx.vertical]?.trim();
    const topic = row[idx.topic]?.trim();
    const keywords = row[idx.keywords]?.trim();
    const description = row[idx.description]?.trim();

    const angleParts = [];
    if (description) angleParts.push(description);
    if (keywords) angleParts.push(`Target keywords to weave in naturally: ${keywords}.`);
    if (vertical) angleParts.push(`Audience/vertical: ${vertical}.`);
    if (topic && topic !== 'None') angleParts.push(`Content angle: ${topic}.`);

    existing.set(slug, {
      slug,
      title,
      category,
      keyword: title,
      angle: angleParts.join(' '),
      internalLinks,
      launchDate,
      status: 'pending',
      publishedDate: null,
      publishedUrl: null,
    });
    added += 1;
  }

  const queue = [...existing.values()].sort((a, b) => a.launchDate.localeCompare(b.launchDate));
  mkdirSync(dirname(QUEUE_PATH), { recursive: true });
  writeFileSync(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`);

  console.log(`Imported ${added} new row(s) into ${QUEUE_PATH}`);
  if (backfilled) console.log(`  backfilled internalLinks onto ${backfilled} existing row(s)`);
  if (skippedBadDate) console.log(`  skipped ${skippedBadDate} row(s) with an unparseable Launch Date`);
  if (skippedNoSlug) console.log(`  skipped ${skippedNoSlug} row(s) missing a title or Link`);
  console.log(`Queue now has ${queue.length} row(s) total ` +
    `(${queue.filter((r) => r.status === 'pending').length} pending, ` +
    `${queue.filter((r) => r.status === 'published').length} published).`);
}

main();

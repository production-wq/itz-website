#!/usr/bin/env node
/**
 * Generate SEO content with Claude and write it straight into the site's
 * content directories.
 *
 *   node scripts/generate-daily-content.mjs --input content-queue.xlsx --dry-run
 *   node scripts/generate-daily-content.mjs --input content-queue.xlsx --provider gemini
 *   node scripts/generate-daily-content.mjs --provider gemini --list-models
 *
 * Two output types:
 *   post  →  src/content/posts/<slug>.json   + an entry in posts-index.json
 *   geo   →  a record merged into src/lib/geo/service-locations.json
 *
 * Both destinations are dictated by how the site actually loads content:
 *   - src/lib/posts.ts reads `allPosts` from posts-index.json, and
 *     app/blog/[slug] has `dynamicParams = false`. A post file with no index
 *     entry gets NO route generated and 404s. The index write is not optional.
 *   - src/lib/geo/index.ts statically imports service-locations.json. There is
 *     no per-slug geo directory to write into, so records are merged.
 *
 * The generated geo records are validated again at build time by
 * assertServiceLocation() — a malformed record fails `next build` rather than
 * shipping.
 *
 * Input is .xlsx or .csv. Column headings are matched loosely — see
 * COLUMN_ALIASES below for what each field accepts.
 *
 * Two providers, chosen with --provider:
 *   claude (default)  needs ANTHROPIC_API_KEY  (console.anthropic.com/settings/keys)
 *   gemini            needs GEMINI_API_KEY     (aistudio.google.com/apikey)
 * Both are asked for schema-constrained JSON, so output is parseable either way.
 * Run --list-models to see what your key can reach.
 *
 * Scheduling is deliberately not built in — this is a one-shot batch. To run it
 * daily, drive it from cron or CI:
 *
 *   # crontab: 07:00 daily
 *   0 7 * * * cd /path/to/itz-new && /usr/bin/node scripts/generate-daily-content.mjs \
 *     --input content-queue.csv --limit 3 >> /var/log/itz-content.log 2>&1
 *
 *   # .github/workflows/daily-content.yml
 *   # on: { schedule: [{ cron: '0 7 * * *' }] }
 *   # jobs.generate.steps:
 *   #   - uses: actions/checkout@v4
 *   #   - uses: actions/setup-node@v4
 *   #     with: { node-version: 22 }
 *   #   - run: npm ci
 *   #   - run: node scripts/generate-daily-content.mjs --input content-queue.csv --limit 3
 *   #     env: { ANTHROPIC_API_KEY: '${{ secrets.ANTHROPIC_API_KEY }}' }
 *   #   - run: npm run build          # geo validation gate
 *   #   - uses: peter-evans/create-pull-request@v6   # review before publish
 */

// Provider SDKs are imported dynamically so a Gemini run never loads the
// Anthropic client (and vice versa) — see makeProvider below.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  GEO_SCHEMA,
  POST_SCHEMA,
  readingTime,
  slugify,
  validateGeo,
  validatePost,
} from '../src/lib/content-schemas.mjs';
import {
  DEFAULT_MODEL,
  describeError,
  makeProvider,
  postPrompt,
  readServices as readServicesFrom,
  readSite as readSiteFrom,
  systemPrompt,
} from './lib/content-gen.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const POSTS_DIR = join(ROOT, 'src/content/posts');
const POSTS_INDEX = join(ROOT, 'src/content/posts-index.json');
const GEO_CITIES = join(ROOT, 'src/lib/geo/cities.json');
const GEO_RECORDS = join(ROOT, 'src/lib/geo/service-locations.json');

const readServices = () => readServicesFrom(ROOT);
const readSite = () => readSiteFrom(ROOT);

// ── CLI ─────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const opts = {
    input: null,
    type: null,
    limit: 5,
    effort: 'medium',
    concurrency: 2,
    dryRun: false,
    force: false,
    provider: 'claude',
    model: null,
    listModels: false,
    sheet: null,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = () => argv[(i += 1)];
    switch (arg) {
      case '--input': opts.input = next(); break;
      case '--type': opts.type = next(); break;
      case '--limit': opts.limit = Number(next()); break;
      case '--effort': opts.effort = next(); break;
      case '--concurrency': opts.concurrency = Number(next()); break;
      case '--provider': opts.provider = next()?.toLowerCase(); break;
      case '--model': opts.model = next(); break;
      case '--sheet': opts.sheet = next(); break;
      case '--list-models': opts.listModels = true; break;
      case '--dry-run': opts.dryRun = true; break;
      case '--force': opts.force = true; break;
      case '--help': case '-h': usage(); process.exit(0); break;
      default:
        console.error(`Unknown option: ${arg}`);
        usage();
        process.exit(1);
    }
  }
  if (!['claude', 'gemini'].includes(opts.provider)) {
    console.error(`Unknown provider "${opts.provider}" (expected claude or gemini)`);
    process.exit(1);
  }
  opts.model ??= DEFAULT_MODEL[opts.provider];
  return opts;
}

function usage() {
  console.log(`
Usage: node scripts/generate-daily-content.mjs --input <file> [options]

INPUT  .xlsx or .csv. Column names are matched loosely — see the header block
       at the top of this file for accepted aliases.

  --input <file>      Required. Path to your spreadsheet or CSV.
  --sheet <name>      Worksheet name in an .xlsx (default: the first sheet)
  --type post|geo     Default type for rows that omit the column
  --limit N           Max rows to process this run (default 5)
  --concurrency N     Parallel generations (default 2)
  --dry-run           Generate and validate, print the JSON, write nothing
  --force             Overwrite an existing slug / service+city pair

MODEL

  --provider claude|gemini   Default claude
  --model <id>               Override the default for the provider
  --effort LEVEL             Claude only: low|medium|high|xhigh|max (default medium)
  --list-models              Print the models your API key can reach, then exit

API KEYS  (set one, matching your provider)

  Claude   ANTHROPIC_API_KEY   → https://console.anthropic.com/settings/keys
  Gemini   GEMINI_API_KEY      → https://aistudio.google.com/apikey

EXAMPLES

  npm run generate:content -- --input content-queue.xlsx --dry-run
  npm run generate:content -- --input content-queue.xlsx --provider gemini --limit 3
  npm run generate:content -- --provider gemini --list-models
`);
}

// ── Input: .xlsx or .csv ────────────────────────────────────────────────────

/*
 * Column names are matched loosely, so your spreadsheet does not have to use
 * our exact headings. Case, spaces, underscores and hyphens are all ignored.
 *
 *   type      | kind, contenttype                    post | geo
 *   keyword   | topic, topicname, title, targetkeyword   what the post is about
 *   city      | location, cityslug, market, metro        geo rows only
 *   service   |                                          geo rows: overrides keyword
 *   category  | cat, section
 *   angle     | notes, brief, instructions, comment      extra steer for the model
 *
 * Anything else in the sheet is ignored, so you can keep your own columns
 * (owner, status, due date) alongside these.
 */
const COLUMN_ALIASES = {
  type: ['type', 'kind', 'contenttype'],
  keyword: ['keyword', 'topic', 'topicname', 'title', 'targetkeyword', 'subject'],
  city: ['city', 'location', 'cityslug', 'market', 'metro', 'geo'],
  service: ['service', 'serviceslug'],
  category: ['category', 'cat', 'section'],
  angle: ['angle', 'notes', 'note', 'brief', 'instructions', 'comment', 'comments'],
};

const normalizeHeader = (h) => String(h ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');

/** Maps a raw header row to our canonical field names. */
function buildHeaderMap(rawHeaders) {
  const map = {};
  rawHeaders.forEach((raw, i) => {
    const key = normalizeHeader(raw);
    for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
      if (aliases.includes(key)) {
        map[field] ??= i;
        return;
      }
    }
  });
  return map;
}

function rowsFromTable(table, sourceLabel) {
  const nonEmpty = table.filter((r) => r.some((c) => String(c ?? '').trim() !== ''));
  if (nonEmpty.length < 2) {
    throw new Error(`${sourceLabel}: need a header row plus at least one data row`);
  }

  const [headerRow, ...bodyRows] = nonEmpty;
  const map = buildHeaderMap(headerRow);

  if (map.keyword === undefined) {
    throw new Error(
      `${sourceLabel}: could not find a topic column. ` +
        `Name one of: ${COLUMN_ALIASES.keyword.join(', ')}. ` +
        `Found: ${headerRow.map((h) => String(h ?? '').trim()).filter(Boolean).join(', ') || '(none)'}`,
    );
  }

  const cell = (row, field) =>
    map[field] === undefined ? '' : String(row[map[field]] ?? '').trim();

  return bodyRows.map((row) => ({
    type: cell(row, 'type'),
    // For geo rows the service can live in its own column or in the topic column.
    keyword: cell(row, 'service') || cell(row, 'keyword'),
    city: cell(row, 'city'),
    category: cell(row, 'category'),
    angle: cell(row, 'angle'),
  }));
}

/** Reads .xlsx (first sheet, or --sheet) or .csv, returning canonical rows. */
async function readInput(path, opts) {
  const ext = extname(path).toLowerCase();

  if (ext === '.xlsx' || ext === '.xlsm') {
    const { default: readXlsxFile } = await import('read-excel-file/node');
    const raw = await readXlsxFile(path);

    // read-excel-file returns either a flat table (single-sheet workbook) or
    // `[{sheet, data}]` (multi-sheet), and its `sheet` option does not reliably
    // filter, so normalise here instead of trusting either shape.
    const isWrapped = Array.isArray(raw) && raw.length > 0 && !Array.isArray(raw[0]);
    let table;
    let sheetName = '';

    if (!isWrapped) {
      table = raw;
    } else if (opts.sheet) {
      const match = raw.find((s) => s.sheet === opts.sheet);
      if (!match) {
        throw new Error(
          `${path}: no sheet named "${opts.sheet}". Available: ${raw.map((s) => s.sheet).join(', ')}`,
        );
      }
      table = match.data;
      sheetName = match.sheet;
    } else {
      // Default to the first sheet that actually looks like a content queue,
      // so a workbook with a leading README/instructions tab still works.
      const usable =
        raw.find((s) => buildHeaderMap((s.data?.[0] ?? []).map(String)).keyword !== undefined) ??
        raw[0];
      table = usable.data;
      sheetName = usable.sheet;
    }

    return rowsFromTable(table, `${path}${sheetName ? ` [${sheetName}]` : ''}`);
  }

  if (ext === '.xls') {
    throw new Error('Legacy .xls is not supported — re-save as .xlsx or export to .csv');
  }

  if (ext === '.csv' || ext === '.txt' || ext === '') {
    return rowsFromTable(parseCsvTable(readFileSync(path, 'utf8')), path);
  }

  throw new Error(`Unsupported input type "${ext}" — use .xlsx or .csv`);
}

// ── CSV ─────────────────────────────────────────────────────────────────────

/** Minimal RFC-4180 reader: quoted fields, escaped quotes, CRLF. Returns rows of cells. */
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

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

// ── Prompts ─────────────────────────────────────────────────────────────────
// systemPrompt / postPrompt moved to lib/content-gen.mjs, shared with the
// /admin "Generate with AI" Studio button — see that file's header comment.

function geoPrompt({ service, city, angle }) {
  return `Write the landing page content for "${service.name}" in ${city.name}, ${city.state}.${
    angle ? `\n\nEDITOR'S BRIEF (from the content queue — follow it):\n${angle}` : ''
  }

THE SERVICE
${service.name} — ${service.tagline}

THE MARKET
City: ${city.name}, ${city.state} (${city.stateCode}), ${city.county}
Service radius: ${city.serviceRadiusMiles} miles
Neighborhoods: ${city.neighborhoods.join(', ')}
Nearby: ${city.nearbyCities.map((n) => `${n.name} (${n.driveMinutes} min)`).join(', ')}
Known market context: ${city.marketNote}

Requirements:
- headline: an H1 for this page. Natural, not "Service in City" keyword stuffing.
- intro: 2-3 sentences naming real ${city.name} geography and referencing the market
  context above. This must read as though written by someone who knows the metro.
- stats: EXACTLY 3. Short factual descriptors of the engagement — radius, coverage,
  cadence, ownership. These render as a hero band. Do NOT invent performance
  metrics, percentages or results.
- localFactors: 3 specific reasons this market differs from a generic one. Ground
  them in the geography, seasonality or competitive density above — not in
  generic advice that would apply to any city.
- Exactly 4 FAQs. Each answer 40-80 words. Write what a ${city.name} business owner
  would actually ask before signing. At least two must be city-specific rather
  than generic service questions.

Do not output review counts, ratings or testimonials of any kind.`;
}

// ── Writers ─────────────────────────────────────────────────────────────────

function writePost(post, { dryRun }) {
  const file = join(POSTS_DIR, `${post.slug}.json`);
  if (dryRun) return file;

  mkdirSync(POSTS_DIR, { recursive: true });
  writeFileSync(file, JSON.stringify(post));

  // Without this the route is never generated — see the header comment.
  const { content: _omit, ...summary } = post;
  const index = readJson(POSTS_INDEX).filter((p) => p.slug !== post.slug);
  index.push(summary);
  index.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  writeFileSync(POSTS_INDEX, `${JSON.stringify(index, null, 2)}\n`);

  return file;
}

function writeGeo(record, { dryRun }) {
  if (dryRun) return GEO_RECORDS;

  const doc = readJson(GEO_RECORDS);
  doc.serviceLocations = doc.serviceLocations.filter(
    (r) => !(r.serviceSlug === record.serviceSlug && r.citySlug === record.citySlug),
  );
  doc.serviceLocations.push(record);
  writeFileSync(GEO_RECORDS, `${JSON.stringify(doc, null, 2)}\n`);

  return GEO_RECORDS;
}

// ── Row handlers ────────────────────────────────────────────────────────────

async function handlePost(provider, row, ctx, opts) {
  const keyword = row.keyword;
  if (!keyword) throw new Error('post rows need a `keyword` column');

  const { data, usage } = await provider.generate({
    system: ctx.system,
    user: postPrompt({ keyword, category: row.category, angle: row.angle }),
    schema: POST_SCHEMA,
    schemaName: 'blog_post',
  });

  const errors = validatePost(data);
  if (errors.length) throw new Error(`validation failed: ${errors.join('; ')}`);

  const slug = slugify(data.title);
  if (!slug) throw new Error(`could not derive a slug from title "${data.title}"`);

  if (ctx.existingSlugs.has(slug) && !opts.force) {
    return { skipped: `post already exists: ${slug}` };
  }

  const post = {
    slug,
    title: data.title,
    date: new Date().toISOString(),
    excerpt: data.excerpt,
    categories: data.categories,
    tags: data.tags,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    readingTime: readingTime(data.content),
    faqs: data.faqs,
    content: data.content,
  };

  const file = writePost(post, opts);
  ctx.existingSlugs.add(slug);
  return { written: file, label: `/blog/${slug}`, usage, preview: post };
}

async function handleGeo(provider, row, ctx, opts) {
  const serviceSlug = row.keyword;
  const citySlug = row.city;
  if (!serviceSlug || !citySlug) throw new Error('geo rows need `keyword` (service slug) and `city`');

  const service = ctx.services.find((s) => s.slug === serviceSlug);
  if (!service) {
    throw new Error(`unknown service "${serviceSlug}" — not in lib/services.ts`);
  }
  const city = ctx.cities.find((c) => c.slug === citySlug);
  if (!city) {
    throw new Error(`unknown city "${citySlug}" — add it to src/lib/geo/cities.json first`);
  }

  const pair = `${serviceSlug}::${citySlug}`;
  if (ctx.existingPairs.has(pair) && !opts.force) {
    return { skipped: `geo record already exists: ${pair}` };
  }

  const { data, usage } = await provider.generate({
    system: ctx.system,
    user: geoPrompt({ service, city, angle: row.angle }),
    schema: GEO_SCHEMA,
    schemaName: 'geo_landing',
  });

  const errors = validateGeo(data);
  if (errors.length) throw new Error(`validation failed: ${errors.join('; ')}`);

  const record = { serviceSlug, citySlug, ...data };
  const file = writeGeo(record, opts);
  ctx.existingPairs.add(pair);
  return { written: file, label: `/services/${serviceSlug}/${citySlug}`, usage, preview: record };
}

// ── Runner ──────────────────────────────────────────────────────────────────

/** Bounded-concurrency map that preserves input order in the results. */
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor;
      cursor += 1;
      results[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return results;
}


async function main() {
  const opts = parseArgs(process.argv.slice(2));

  // `--list-models` answers "what can my key actually reach right now", which
  // is the fastest way to unstick a stale or wrong model ID.
  if (opts.listModels) {
    const provider = await makeProvider(opts);
    const models = await provider.listModels();
    console.log(`Models available to your ${opts.provider} key:\n`);
    for (const m of models.sort()) console.log(`  ${m}`);
    console.log(`\nUse one with:  --provider ${opts.provider} --model <id>`);
    return;
  }

  if (!opts.input) {
    console.error('Error: --input is required.');
    usage();
    process.exit(1);
  }

  const inputPath = resolve(process.cwd(), opts.input);
  if (!existsSync(inputPath)) {
    console.error(`Error: input file not found: ${inputPath}`);
    process.exit(1);
  }

  let rows;
  try {
    rows = (await readInput(inputPath, opts))
      .map((r) => ({ ...r, type: (r.type || opts.type || 'post').toLowerCase() }))
      .filter((r) => r.keyword)
      .slice(0, opts.limit);
  } catch (err) {
    console.error(`Error reading input: ${err.message}`);
    process.exit(1);
  }

  if (rows.length === 0) {
    console.error('Error: no usable data rows found (every row needs a topic/keyword).');
    process.exit(1);
  }

  const site = readSite();
  const ctx = {
    site,
    system: systemPrompt(site),
    services: readServices(),
    cities: readJson(GEO_CITIES).cities,
    existingSlugs: new Set(readJson(POSTS_INDEX).map((p) => p.slug)),
    existingPairs: new Set(
      readJson(GEO_RECORDS).serviceLocations.map((r) => `${r.serviceSlug}::${r.citySlug}`),
    ),
  };

  const provider = await makeProvider(opts);

  console.log(
    `Generating ${rows.length} item(s) via ${opts.provider} · ${provider.label} ` +
      `(concurrency=${opts.concurrency})${opts.dryRun ? ' [DRY RUN]' : ''}\n`,
  );

  const results = await mapLimit(rows, opts.concurrency, async (row, i) => {
    const id = `${row.type}:${row.keyword}${row.city ? `/${row.city}` : ''}`;
    try {
      if (row.type !== 'post' && row.type !== 'geo') {
        throw new Error(`unknown type "${row.type}" (expected post or geo)`);
      }
      const handler = row.type === 'post' ? handlePost : handleGeo;
      const out = await handler(provider, row, ctx, opts);

      if (out.skipped) {
        console.log(`  ○ ${id} — skipped (${out.skipped}); use --force to overwrite`);
        return { row: i, id, status: 'skipped' };
      }

      const u = out.usage ?? {};
      console.log(
        `  ✓ ${id} → ${out.label}` +
          `  [in ${u.input ?? 0} / cached ${u.cached ?? 0} / out ${u.output ?? 0}]` +
          (opts.dryRun ? '  (not written)' : ''),
      );
      if (opts.dryRun) console.log(`${JSON.stringify(out.preview, null, 2)}\n`);
      return { row: i, id, status: 'ok' };
    } catch (err) {
      console.error(`  ✗ ${id} — ${describeError(err)}`);
      return { row: i, id, status: 'failed' };
    }
  });

  const tally = (s) => results.filter((r) => r.status === s).length;
  console.log(
    `\n${tally('ok')} generated, ${tally('skipped')} skipped, ${tally('failed')} failed.`,
  );

  if (!opts.dryRun && tally('ok') > 0) {
    console.log('Run `npm run build` to validate and generate the new routes.');
  }
  if (tally('failed') > 0) process.exit(1);
}

main().catch((err) => {
  console.error(`\nFatal: ${describeError(err)}`);
  process.exit(1);
});

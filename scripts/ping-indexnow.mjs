#!/usr/bin/env node
/*
 * Pings the IndexNow API for every post or geo-landing page that was added
 * or changed in the most recent commit. IndexNow is honoured by Bing and
 * Yandex — Google does not participate and has no public push API for
 * ordinary pages, so Google discovery still relies on sitemap.xml plus its
 * own crawl (or a manual "Request indexing" in Search Console — the
 * /admin/review approve screen links straight to that).
 *
 * Run right after a merge lands on the deploy branch:
 *   node scripts/ping-indexnow.mjs
 *
 * Needs:
 *   INDEXNOW_KEY   the key published at public/<key>.txt — see README
 *   SITE_URL       e.g. https://itzdigital.co
 *
 * Safe to run on every push: does nothing if INDEXNOW_KEY is unset, or if
 * the commit touched no post/geo file.
 */
import { execSync } from 'node:child_process';

const KEY = process.env.INDEXNOW_KEY;
const SITE = (process.env.SITE_URL || '').replace(/\/$/, '');

function changedFiles() {
  try {
    return execSync('git diff --name-status HEAD^ HEAD', { encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
      .map((line) => {
        const parts = line.split('\t');
        return { status: parts[0], path: parts[parts.length - 1] };
      });
  } catch {
    return []; // no parent commit to diff against (shallow clone / first commit)
  }
}

/** Diffs the geo-records array (old vs new) and returns URLs for entries that are new or changed. */
function geoUrlsChanged() {
  let before = { serviceLocations: [] };
  try {
    before = JSON.parse(
      execSync('git show HEAD^:src/lib/geo/service-locations.json', { encoding: 'utf8' }),
    );
  } catch {
    // file did not exist before this commit — every current record is new
  }
  const after = JSON.parse(
    execSync('git show HEAD:src/lib/geo/service-locations.json', { encoding: 'utf8' }),
  );

  const key = (r) => `${r.serviceSlug}::${r.citySlug}`;
  const beforeByKey = new Map(before.serviceLocations.map((r) => [key(r), JSON.stringify(r)]));

  return after.serviceLocations
    .filter((r) => beforeByKey.get(key(r)) !== JSON.stringify(r))
    .map((r) => `${SITE}/services/${r.serviceSlug}/${r.citySlug}`);
}

function urlsFromDiff(files) {
  const urls = new Set();

  for (const { status, path } of files) {
    if (status === 'D') continue; // never announce a deleted URL

    const postMatch = path.match(/^src\/content\/posts\/([^/]+)\.json$/);
    if (postMatch) {
      urls.add(`${SITE}/${postMatch[1]}`);
      continue;
    }

    if (path === 'src/lib/geo/service-locations.json') {
      for (const url of geoUrlsChanged()) urls.add(url);
    }
  }

  return [...urls];
}

async function main() {
  if (!KEY) {
    console.log('INDEXNOW_KEY not set — skipping.');
    return;
  }
  if (!SITE) {
    console.log('SITE_URL not set — skipping.');
    return;
  }

  const urls = urlsFromDiff(changedFiles());
  if (urls.length === 0) {
    console.log('No post or geo-page URLs changed in the last commit.');
    return;
  }

  console.log(`Pinging IndexNow for ${urls.length} URL(s):`);
  urls.forEach((u) => console.log(`  ${u}`));

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key: KEY,
      keyLocation: `${SITE}/${KEY}.txt`,
      urlList: urls,
    }),
  });

  if (res.ok) {
    console.log(`IndexNow accepted the submission (HTTP ${res.status}).`);
  } else {
    console.error(`IndexNow returned ${res.status}: ${(await res.text()).slice(0, 300)}`);
    process.exitCode = 1;
  }
}

main();

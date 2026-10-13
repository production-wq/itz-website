#!/usr/bin/env node
/**
 * Email production@builtrightdigital.com a summary of what
 * scripts/run-roadmap-batch.mjs just generated, with links to every new
 * page. Reads content-queue/roadmap/.last-run.json (written by that script).
 *
 *   node scripts/send-roadmap-notification.mjs [--pr-url <url>]
 *
 * Standalone Resend REST call (same approach as src/lib/email.ts) because
 * this runs from GitHub Actions, not the Next.js server — no access to that
 * module's `server-only` runtime.
 *
 * No-ops (logs and exits 0) if RESEND_API_KEY isn't set or there's nothing
 * to report, so a missing secret never fails the workflow that generated
 * real content.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const NOTIFY_TO = 'production@builtrightdigital.com';
const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const SUMMARY_PATH = resolve(process.cwd(), 'content-queue/roadmap/.last-run.json');

function parseArgs(argv) {
  const opts = { prUrl: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--pr-url') opts.prUrl = argv[(i += 1)];
  }
  return opts;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!existsSync(SUMMARY_PATH)) {
    console.log(`No run summary at ${SUMMARY_PATH} — nothing to email.`);
    return;
  }
  const { date, generated, failed } = JSON.parse(readFileSync(SUMMARY_PATH, 'utf8'));

  if (generated.length === 0 && failed.length === 0) {
    console.log('Nothing was generated or failed this run — skipping notification email.');
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      `RESEND_API_KEY is not set — skipping notification email to ${NOTIFY_TO}.\n` +
        `Would have reported: ${generated.length} generated, ${failed.length} failed.`,
    );
    return;
  }

  const subject =
    failed.length > 0
      ? `ITZ Digital content: ${generated.length} published, ${failed.length} failed (${date})`
      : `ITZ Digital content: ${generated.length} page(s) published (${date})`;

  const linksHtml = generated.map((g) => `<li><a href="${g.url}">${g.title}</a></li>`).join('\n');
  const failuresHtml = failed.length
    ? `<h2>Failed (${failed.length})</h2><ul>${failed
        .map((f) => `<li>${f.title} — ${f.error}</li>`)
        .join('\n')}</ul>`
    : '';
  const prHtml = opts.prUrl ? `<p>Pull request: <a href="${opts.prUrl}">${opts.prUrl}</a></p>` : '';

  const html = `
    <p>Automated content run for ${date}.</p>
    <h2>Published (${generated.length})</h2>
    <ul>${linksHtml || '<li>(none)</li>'}</ul>
    ${failuresHtml}
    ${prHtml}
  `.trim();

  const text = [
    `Automated content run for ${date}.`,
    '',
    `Published (${generated.length}):`,
    ...generated.map((g) => `- ${g.title} — ${g.url}`),
    ...(failed.length ? ['', `Failed (${failed.length}):`, ...failed.map((f) => `- ${f.title} — ${f.error}`)] : []),
    ...(opts.prUrl ? ['', `Pull request: ${opts.prUrl}`] : []),
  ].join('\n');

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'ITZ Digital <info@itzdigital.co>',
      to: [NOTIFY_TO],
      reply_to: process.env.EMAIL_REPLY_TO || 'info@itzdigital.co',
      subject,
      html,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(`Notification email failed (${res.status}): ${detail}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Notification email sent to ${NOTIFY_TO}.`);
}

main().catch((err) => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});

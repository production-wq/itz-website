import { NextResponse } from 'next/server';

import { adminConfig, getFile, isGithubConfigured } from '@/lib/admin/github';
import { isSlackConfigured, sendSlackMessage } from '@/lib/slack';

export const runtime = 'nodejs';

const QUEUE_PATH = 'content-queue/roadmap/queue.json';

type QueueRow = {
  status: 'pending' | 'published';
  launchDate: string;
  publishedDate: string | null;
};

/** The Monday (UTC) on or before `day`, as YYYY-MM-DD. */
function mondayOnOrBefore(day: string): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

/**
 * Independent check on the weekly publisher (/api/cron/roadmap). Runs later
 * on Mondays and alerts Slack when no roadmap page has been published since
 * this week's Monday even though rows are due. This catches the failure modes
 * the publisher can't report about itself: the Vercel cron not firing, the
 * function being killed before it posts, or a deploy/env problem.
 *
 * Configured in vercel.json. Same auth as the publisher: Vercel sends
 * `Authorization: Bearer $CRON_SECRET` on cron-triggered requests.
 */
export async function GET(request: Request) {
  try {
    return await runWatchdog(request);
  } catch (err) {
    // The watchdog reads GitHub too, so a rejected token would otherwise fail
    // silently here as well.
    const error = err instanceof Error ? err.message : String(err);
    const today = new Date().toISOString().slice(0, 10);
    const hint = /\b401\b/.test(error) && /Bad credentials/i.test(error)
      ? '\nGitHub rejected GITHUB_API_TOKEN (401). Rotate it in Vercel, then redeploy.'
      : '';
    return alert(today, `watchdog could not check the queue: ${error}${hint}`);
  }
}

async function runWatchdog(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not set. See .env.example.' }, { status: 503 });
  }
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!isGithubConfigured()) {
    return NextResponse.json({ error: 'GITHUB_API_TOKEN / GITHUB_REPO are not set.' }, { status: 503 });
  }

  const { baseBranch } = adminConfig();
  const today = new Date().toISOString().slice(0, 10);
  const weekStart = mondayOnOrBefore(today);

  const queueFile = await getFile(QUEUE_PATH, baseBranch);
  if (!queueFile) {
    return alert(today, `Roadmap queue missing at ${QUEUE_PATH}; the weekly publisher has nothing to run.`);
  }
  const queue: QueueRow[] = JSON.parse(queueFile.content);

  const due = queue.filter((r) => r.status === 'pending' && r.launchDate <= today);
  const publishedThisWeek = queue.filter((r) => r.publishedDate && r.publishedDate >= weekStart);

  if (due.length > 0 && publishedThisWeek.length === 0) {
    return alert(
      today,
      `No roadmap page has been published since Monday ${weekStart}, and ${due.length} row(s) are due. ` +
        `Check the Vercel cron (/api/cron/roadmap) logs and that its env vars are set.`,
    );
  }

  return NextResponse.json({
    ok: true,
    weekStart,
    due: due.length,
    publishedThisWeek: publishedThisWeek.length,
  });
}

async function alert(today: string, text: string) {
  console.error(`[roadmap-watchdog] ${text}`);
  if (isSlackConfigured()) {
    await sendSlackMessage(`*ITZ Digital roadmap content — ${today}*\n:warning: Watchdog: ${text}`);
  }
  return NextResponse.json({ ok: false, alert: text }, { status: 500 });
}

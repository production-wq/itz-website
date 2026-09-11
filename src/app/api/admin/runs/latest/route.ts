import { NextResponse } from 'next/server';

import { findLatestRun, isGithubConfigured } from '@/lib/admin/github';

export const runtime = 'nodejs';

const WORKFLOW_FILE = 'daily-content.yml';

/**
 * Polled by NewBatchForm after it dispatches a run. `after` is the ISO
 * timestamp the client recorded right before dispatching — GitHub takes a
 * few seconds to register a workflow_dispatch as an actual run, so the
 * client keeps asking until one shows up that's newer than that timestamp.
 */
export async function GET(request: Request) {
  if (!isGithubConfigured()) {
    return NextResponse.json({ error: 'GitHub is not configured.' }, { status: 503 });
  }

  const after = new URL(request.url).searchParams.get('after');

  try {
    const run = await findLatestRun(WORKFLOW_FILE);
    if (!run || (after && run.created_at <= after)) {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({ found: true, run });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to check run status.' },
      { status: 502 },
    );
  }
}

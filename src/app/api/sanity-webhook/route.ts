import { NextResponse } from 'next/server';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

import { adminConfig, dispatchWorkflow, isGithubConfigured } from '@/lib/admin/github';

export const runtime = 'nodejs';

const WORKFLOW_FILE = 'sanity-sync.yml';

/**
 * Sanity calls this the moment someone publishes a document in the Studio
 * (configured as a webhook in sanity.io/manage — see README §13). All it
 * does is verify the signature and kick off the same GitHub Actions workflow
 * a human could trigger by hand; the workflow does the actual work
 * (scripts/sync-sanity-posts.mjs, image backfill, build, open a PR).
 *
 * Deliberately NOT gated by src/proxy.ts's Basic Auth — that's for a human
 * in a browser, and Sanity's servers can't supply it. This route's own
 * signature check is the auth boundary here.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[sanity-webhook] SANITY_WEBHOOK_SECRET is not set — refusing.');
    return NextResponse.json({ error: 'Webhook not configured.' }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
  }

  if (!isGithubConfigured()) {
    return NextResponse.json({ error: 'GitHub is not configured.' }, { status: 503 });
  }

  try {
    await dispatchWorkflow({
      workflowFile: WORKFLOW_FILE,
      ref: adminConfig().baseBranch,
      inputs: {},
    });
  } catch (err) {
    console.error('[sanity-webhook] failed to dispatch sync workflow:', err);
    return NextResponse.json({ error: 'Failed to trigger sync.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

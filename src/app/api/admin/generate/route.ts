import { NextResponse } from 'next/server';

import { adminConfig, dispatchWorkflow, isGithubConfigured, putFile } from '@/lib/admin/github';

export const runtime = 'nodejs';

const WORKFLOW_FILE = 'daily-content.yml';
const MAX_BYTES = 8 * 1024 * 1024; // generous headroom over a real content sheet

/**
 * Receives the sheet a colleague just uploaded (or the quick-list CSV built
 * client-side), commits it to content-queue/incoming/ on the base branch,
 * and dispatches the daily-content workflow to actually write the posts.
 * Auth is handled entirely by src/proxy.ts — this route trusts anything that
 * reaches it.
 */
export async function POST(request: Request) {
  if (!isGithubConfigured()) {
    return NextResponse.json(
      { error: 'GITHUB_API_TOKEN / GITHUB_REPO are not set. See .env.example.' },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart form data.' }, { status: 400 });
  }

  const file = form.get('file');
  const provider = String(form.get('provider') ?? 'claude');
  const limit = String(form.get('limit') ?? '10');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file was uploaded.' }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'The file is empty.' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'That file is larger than expected (8MB max).' }, { status: 400 });
  }
  if (!['claude', 'gemini'].includes(provider)) {
    return NextResponse.json({ error: `Unknown provider "${provider}".` }, { status: 400 });
  }

  const name = file.name.toLowerCase();
  if (/\.(xls|docx?|pdf|png|jpe?g|gif)$/i.test(name)) {
    return NextResponse.json(
      { error: `"${file.name}" is not a supported type — use .csv or .xlsx.` },
      { status: 400 },
    );
  }
  const ext = name.endsWith('.xlsx') ? 'xlsx' : 'csv';

  const bytes = Buffer.from(await file.arrayBuffer());
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const path = `content-queue/incoming/${stamp}.${ext}`;

  try {
    await putFile({
      path,
      content: ext === 'xlsx' ? bytes.toString('base64') : bytes.toString('utf8'),
      encoding: ext === 'xlsx' ? 'base64' : 'utf8',
      message: `Content queue upload: ${file.name}`,
      branch: adminConfig().baseBranch,
    });

    await dispatchWorkflow({
      workflowFile: WORKFLOW_FILE,
      ref: adminConfig().baseBranch,
      inputs: { queue_path: path, provider, limit },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Upload failed.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, queuePath: path });
}

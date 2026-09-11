import 'server-only';

/**
 * Thin GitHub REST client for the /admin content pipeline.
 *
 * The admin app runs on Vercel, outside any GitHub Actions run, so it needs
 * its own credential — a Personal Access Token with `contents:write`,
 * `pull-requests:write` and `actions:write` on this one repo, set as
 * GITHUB_API_TOKEN in Vercel's env vars. This is deliberately a different
 * variable from the `GITHUB_TOKEN` GitHub injects automatically inside a
 * workflow run — that one has no meaning here.
 *
 * Every write lands on a branch and goes out as a PR (opened by the
 * daily-content workflow, merged here after human review) — nothing in this
 * file pushes straight to the production branch.
 */

const API = 'https://api.github.com';

function config() {
  const token = process.env.GITHUB_API_TOKEN;
  const repo = process.env.GITHUB_REPO; // "owner/name"
  const baseBranch = process.env.GITHUB_BASE_BRANCH || 'main';
  return { token, repo, baseBranch };
}

export function isGithubConfigured(): boolean {
  const { token, repo } = config();
  return Boolean(token && repo);
}

export class GithubNotConfiguredError extends Error {
  constructor() {
    super(
      'GITHUB_API_TOKEN and/or GITHUB_REPO are not set. See .env.example — the admin ' +
        'content pipeline cannot read or write the repo without them.',
    );
    this.name = 'GithubNotConfiguredError';
  }
}

type GhInit = Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };

async function gh(path: string, init: GhInit = {}) {
  const { token } = config();
  if (!token) throw new GithubNotConfiguredError();

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
    // This is a server-only admin tool talking to GitHub's API, not a page
    // fetch — always get the latest state.
    cache: 'no-store',
  });
  return res;
}

async function ghJson<T>(path: string, init?: GhInit): Promise<T> {
  const res = await gh(path, init);
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub API ${init?.method ?? 'GET'} ${path} → ${res.status}: ${body.slice(0, 400)}`);
  }
  return res.json() as Promise<T>;
}

function repoPath() {
  const { repo } = config();
  if (!repo) throw new GithubNotConfiguredError();
  return `/repos/${repo}`;
}

// ── Files ────────────────────────────────────────────────────────────────

/** Base64 content + sha of a file at a ref, or null if it does not exist there. */
export async function getFile(
  path: string,
  ref?: string,
): Promise<{ content: string; sha: string } | null> {
  const qs = ref ? `?ref=${encodeURIComponent(ref)}` : '';
  const res = await gh(`${repoPath()}/contents/${encodeURIComponent(path)}${qs}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub getFile ${path}: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { content: string; sha: string; encoding: string };
  return { content: Buffer.from(data.content, 'base64').toString('utf8'), sha: data.sha };
}

/** Fetches a file's raw text at a specific ref. Throws if it does not exist. */
export async function readFileAtRef(path: string, ref: string): Promise<string> {
  const file = await getFile(path, ref);
  if (!file) throw new Error(`${path} not found at ${ref}`);
  return file.content;
}

/**
 * Creates or updates a file on a branch in one commit. Pass the branch's
 * current file sha (from getFile) when updating an existing file; omit it to
 * create a new one. `content` is UTF-8 text unless `encoding: 'base64'` is
 * given, for binary uploads (an .xlsx queue file) already base64-encoded by
 * the caller.
 */
export async function putFile(opts: {
  path: string;
  content: string;
  message: string;
  branch: string;
  sha?: string;
  encoding?: 'utf8' | 'base64';
}): Promise<{ commitSha: string }> {
  const body = {
    message: opts.message,
    content: opts.encoding === 'base64' ? opts.content : Buffer.from(opts.content, 'utf8').toString('base64'),
    branch: opts.branch,
    ...(opts.sha ? { sha: opts.sha } : {}),
  };
  const data = await ghJson<{ commit: { sha: string } }>(
    `${repoPath()}/contents/${encodeURIComponent(opts.path)}`,
    { method: 'PUT', body: JSON.stringify(body) },
  );
  return { commitSha: data.commit.sha };
}

// ── Branches ─────────────────────────────────────────────────────────────

export async function getBranchSha(branch: string): Promise<string> {
  const data = await ghJson<{ object: { sha: string } }>(
    `${repoPath()}/git/ref/heads/${encodeURIComponent(branch)}`,
  );
  return data.object.sha;
}

/** Creates a new branch off the base branch if it does not already exist. Returns true if created. */
export async function ensureBranch(branch: string): Promise<boolean> {
  const existing = await gh(`${repoPath()}/git/ref/heads/${encodeURIComponent(branch)}`);
  if (existing.status === 200) return false;

  const { baseBranch } = config();
  const baseSha = await getBranchSha(baseBranch);
  await ghJson(`${repoPath()}/git/refs`, {
    method: 'POST',
    body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
  });
  return true;
}

// ── Actions ──────────────────────────────────────────────────────────────

/** Triggers a workflow_dispatch run. `workflowFile` is the filename under .github/workflows/. */
export async function dispatchWorkflow(opts: {
  workflowFile: string;
  ref?: string;
  inputs: Record<string, string>;
}): Promise<void> {
  const { baseBranch } = config();
  const res = await gh(
    `${repoPath()}/actions/workflows/${encodeURIComponent(opts.workflowFile)}/dispatches`,
    {
      method: 'POST',
      body: JSON.stringify({ ref: opts.ref ?? baseBranch, inputs: opts.inputs }),
    },
  );
  if (!res.ok) {
    throw new Error(`GitHub dispatchWorkflow: ${res.status} ${await res.text()}`);
  }
}

export type WorkflowRun = {
  id: number;
  status: 'queued' | 'in_progress' | 'completed' | string;
  conclusion: 'success' | 'failure' | 'cancelled' | 'skipped' | null;
  html_url: string;
  created_at: string;
  display_title: string;
};

/** Finds the run GitHub just created for a workflow_dispatch, by polling the list (dispatch has no id). */
export async function findLatestRun(workflowFile: string): Promise<WorkflowRun | null> {
  const data = await ghJson<{ workflow_runs: WorkflowRun[] }>(
    `${repoPath()}/actions/workflows/${encodeURIComponent(workflowFile)}/runs?event=workflow_dispatch&per_page=1`,
  );
  return data.workflow_runs[0] ?? null;
}

export async function getRun(runId: number): Promise<WorkflowRun> {
  return ghJson<WorkflowRun>(`${repoPath()}/actions/runs/${runId}`);
}

// ── Pull requests ────────────────────────────────────────────────────────

export type PullRequest = {
  number: number;
  title: string;
  html_url: string;
  state: 'open' | 'closed';
  created_at: string;
  head: { ref: string; sha: string };
  base: { ref: string };
  labels: { name: string }[];
  body: string | null;
  mergeable: boolean | null;
  merged: boolean;
};

/** Content-batch PRs are tagged with this label by the daily-content workflow. */
export const CONTENT_PR_LABEL = 'automated-content';

export async function listContentPulls(state: 'open' | 'closed' | 'all' = 'open'): Promise<PullRequest[]> {
  const all = await ghJson<PullRequest[]>(
    `${repoPath()}/pulls?state=${state}&per_page=50&sort=created&direction=desc`,
  );
  return all.filter((pr) => pr.labels.some((l) => l.name === CONTENT_PR_LABEL));
}

export async function getPull(number: number): Promise<PullRequest> {
  return ghJson<PullRequest>(`${repoPath()}/pulls/${number}`);
}

export type PullFile = { filename: string; status: string; additions: number; deletions: number };

export async function getPullFiles(number: number): Promise<PullFile[]> {
  return ghJson<PullFile[]>(`${repoPath()}/pulls/${number}/files?per_page=100`);
}

export async function mergePull(number: number, message?: string): Promise<void> {
  const res = await gh(`${repoPath()}/pulls/${number}/merge`, {
    method: 'PUT',
    body: JSON.stringify({
      merge_method: 'squash',
      ...(message ? { commit_title: message } : {}),
    }),
  });
  if (!res.ok) throw new Error(`GitHub mergePull #${number}: ${res.status} ${await res.text()}`);
}

export async function closePull(number: number, comment?: string): Promise<void> {
  if (comment) {
    await gh(`${repoPath()}/issues/${number}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body: comment }),
    });
  }
  await ghJson(`${repoPath()}/pulls/${number}`, {
    method: 'PATCH',
    body: JSON.stringify({ state: 'closed' }),
  });
}

export function repoWebUrl(): string {
  const { repo } = config();
  return `https://github.com/${repo}`;
}

export function adminConfig() {
  return config();
}

import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

import { POST_SCHEMA, readingTime, slugify, validatePost } from '@/lib/content-schemas.mjs';
import { isEmailConfigured, sendEmail } from '@/lib/email';
import {
  adminConfig,
  createPullRequest,
  ensureBranch,
  findOpenPullForBranch,
  getFile,
  isGithubConfigured,
  putFile,
} from '@/lib/admin/github';
import { DEFAULT_MODEL, describeError, makeGeminiProvider, postPrompt, readServices, readSite, systemPrompt } from '../../../../../scripts/lib/content-gen.mjs';
import { generateImage, promptFor } from '../../../../../scripts/lib/image-gen.mjs';
import { buildLinkManifest, resolveInternalLinks } from '../../../../../scripts/lib/internal-links.mjs';

/** See the two .mjs modules' own JSDoc for the full shape — pinning down only what this route uses. */
type Provider = {
  generate(args: { system: string; user: string; schema: unknown; schemaName?: string }): Promise<{
    data: {
      title: string;
      excerpt: string;
      categories: string[];
      tags: string[];
      seoTitle?: string;
      seoDescription?: string;
      faqs: { question: string; answer: string }[];
      content: string;
    };
  }>;
};

type QueueRow = {
  slug: string;
  title: string;
  category: string;
  keyword: string;
  angle: string;
  /** Raw URLs from the CSV's Internal Links column — resolved against the
   *  live manifest at generation time, not trusted as-is (see below). */
  internalLinks?: string[];
  launchDate: string;
  status: 'pending' | 'published';
  publishedDate: string | null;
  publishedUrl: string | null;
};

export const runtime = 'nodejs';
// Rows are generated concurrently (see below), so wall-clock time is roughly
// one item's duration, not N x that — but this still needs a Pro-or-higher
// plan (Hobby caps functions at 60s). The Studio "Generate with AI" route
// already proves one post + one image comfortably clears 120s; this gives a
// same-order-of-magnitude batch of up to DAILY_LIMIT headroom to run in
// parallel without relying on Fluid Compute's higher ceiling.
export const maxDuration = 300;

const DAILY_LIMIT = 4;
const SITE_ORIGIN = 'https://itzdigital.co';
const NOTIFY_TO = 'production@builtrightdigital.com';
const QUEUE_PATH = 'content-queue/roadmap/queue.json';
const POSTS_INDEX_PATH = 'src/content/posts-index.json';
const POST_IMAGES_PATH = 'src/content/post-images.json';

/**
 * Vercel Cron entry point for the client's dated SEO content roadmap (see
 * README §16). Runs entirely on Vercel — no GitHub Actions secrets required
 * — because everything it needs (GITHUB_API_TOKEN, GEMINI_API_KEY,
 * RESEND_API_KEY) is already a Vercel env var for the existing /admin and
 * Studio pipelines. Reads content-queue/roadmap/queue.json straight off the
 * base branch via the GitHub API, generates whichever rows are due (Gemini,
 * forced — this queue is Gemini-only), opens a PR for the same
 * /admin/review gate every other content pipeline in this repo uses, and
 * emails production@builtrightdigital.com with links once the PR is ready.
 *
 * Configured in vercel.json. Auth: Vercel sends
 * `Authorization: Bearer $CRON_SECRET` on cron-triggered requests when
 * CRON_SECRET is set — required here since this route has real side effects
 * (API spend, a commit, an email) and must not be triggerable by anyone who
 * finds the URL.
 */
export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return NextResponse.json({ error: 'CRON_SECRET is not set. See .env.example.' }, { status: 503 });
  }
  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isGithubConfigured()) {
    return NextResponse.json(
      { error: 'GITHUB_API_TOKEN / GITHUB_REPO are not set. See .env.example.' },
      { status: 503 },
    );
  }
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not set. See .env.example.' }, { status: 503 });
  }

  const { baseBranch } = adminConfig();
  const today = new Date().toISOString().slice(0, 10);

  const queueFile = await getFile(QUEUE_PATH, baseBranch);
  if (!queueFile) {
    return NextResponse.json({ ok: true, message: `No queue at ${QUEUE_PATH}.` });
  }
  const queue: QueueRow[] = JSON.parse(queueFile.content);

  const due = queue
    .filter((r) => r.status === 'pending' && r.launchDate <= today)
    .sort((a, b) => a.launchDate.localeCompare(b.launchDate))
    .slice(0, DAILY_LIMIT);

  if (due.length === 0) {
    return NextResponse.json({ ok: true, message: `Nothing due as of ${today}.` });
  }

  const site = readSite(process.cwd());
  const system = systemPrompt(site);
  const provider = (await makeGeminiProvider({ model: DEFAULT_MODEL.gemini })) as Provider;
  const ai = new GoogleGenAI({ apiKey: geminiKey });

  // Built once from this deployment's own filesystem (same pattern readSite/
  // readServices already use) — may lag a post merged in the last few
  // minutes, but never offers a link to a page that doesn't actually exist.
  const linkManifest = buildLinkManifest(process.cwd(), readServices(process.cwd()));

  // ── Generate concurrently (the slow part: one Gemini text + one Gemini
  // image call per row) — failures here don't touch GitHub at all, so a
  // failed row is simply retried automatically on tomorrow's run.
  const results = await Promise.all(
    due.map(async (row) => {
      try {
        const internalLinks = resolveInternalLinks(row.internalLinks ?? [], linkManifest, {
          selfPath: `/${row.slug}`,
        });
        const { data } = await provider.generate({
          system,
          user: postPrompt({ keyword: row.keyword, category: row.category, angle: row.angle, internalLinks }),
          schema: POST_SCHEMA,
          schemaName: 'blog_post',
        });

        // Title/slug are forced to the roadmap's planned values, not the
        // model's own title — other rows' internal-linking plans reference
        // these exact URLs.
        data.title = row.title;
        const slug = slugify(row.title) ?? row.slug;

        const errors = validatePost(data);
        if (errors.length) throw new Error(`validation failed: ${errors.join('; ')}`);

        const linkedCount = internalLinks.filter((l) => data.content.includes(`href="${l.path}"`)).length;
        if (internalLinks.length > 0 && linkedCount < internalLinks.length) {
          console.warn(
            `[roadmap-cron] ${slug}: used ${linkedCount}/${internalLinks.length} requested internal links`,
          );
        }

        const post = {
          slug,
          title: row.title,
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

        let image: Buffer | null = null;
        try {
          image = (await generateImage(ai, {
            prompt: promptFor({ title: post.title, category: post.categories?.[0] }),
            aspect: '4:3',
          })) as Buffer;
        } catch (err) {
          console.error(`[roadmap-cron] image failed for ${slug}: ${describeError(err)}`);
        }

        return { row, post, image, error: null as string | null };
      } catch (err) {
        return { row, post: null, image: null, error: describeError(err) };
      }
    }),
  );

  const generatedOk = results.filter((r) => r.post);
  const failed = results.filter((r) => !r.post) as {
    row: QueueRow;
    post: null;
    image: null;
    error: string;
  }[];

  if (generatedOk.length === 0) {
    return NextResponse.json({ ok: true, generated: [], failed: failed.map((f) => f.row.slug) });
  }

  // ── Commit everything to one branch for the day, then open a PR ─────────
  // A per-row write failure (e.g. this exact file already exists on the
  // branch — possible if this route is ever invoked twice before the day's
  // PR merges) demotes that row to `failed` rather than aborting the whole
  // batch; every other row still lands and the email/PR steps still run.
  const branch = `content/roadmap-${today}`;
  await ensureBranch(branch);

  const ok: typeof generatedOk = [];
  for (const r of generatedOk) {
    try {
      await putFile({
        path: `src/content/posts/${r.post!.slug}.json`,
        content: JSON.stringify(r.post),
        message: `Content: ${r.post!.slug}`,
        branch,
      });
      if (r.image) {
        await putFile({
          path: `public/images/blog/${r.post!.slug}.webp`,
          content: r.image.toString('base64'),
          encoding: 'base64',
          message: `Image: ${r.post!.slug}`,
          branch,
        });
      }
      ok.push(r);
    } catch (err) {
      failed.push({ row: r.row, post: null, image: null, error: describeError(err) });
    }
  }

  if (ok.length === 0) {
    return NextResponse.json({ ok: true, generated: [], failed: failed.map((f) => f.row.slug) });
  }

  const indexFile = await getFile(POSTS_INDEX_PATH, branch);
  const index = indexFile ? JSON.parse(indexFile.content) : [];
  for (const r of ok) {
    const { content: _omit, ...summary } = r.post!;
    const next = index.filter((p: { slug: string }) => p.slug !== summary.slug);
    next.push(summary);
    index.length = 0;
    index.push(...next);
  }
  index.sort((a: { date?: string }, b: { date?: string }) => (b.date ?? '').localeCompare(a.date ?? ''));
  await putFile({
    path: POSTS_INDEX_PATH,
    content: `${JSON.stringify(index, null, 2)}\n`,
    message: `Content: update posts index (${ok.length} new)`,
    branch,
    sha: indexFile?.sha,
  });

  const imagesWithFile = ok.filter((r) => r.image);
  if (imagesWithFile.length > 0) {
    const mapFile = await getFile(POST_IMAGES_PATH, branch);
    const map = mapFile ? JSON.parse(mapFile.content) : {};
    for (const r of imagesWithFile) {
      map[r.post!.slug] = { image: `/images/blog/${r.post!.slug}.webp`, alt: r.post!.title };
    }
    const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
    await putFile({
      path: POST_IMAGES_PATH,
      content: `${JSON.stringify(sorted, null, 2)}\n`,
      message: `Content: update post image map (${imagesWithFile.length} new)`,
      branch,
      sha: mapFile?.sha,
    });
  }

  const queueFileOnBranch = await getFile(QUEUE_PATH, branch);
  const queueOnBranch: QueueRow[] = queueFileOnBranch ? JSON.parse(queueFileOnBranch.content) : queue;
  for (const r of ok) {
    const target = queueOnBranch.find((q) => q.slug === r.row.slug);
    if (target) {
      target.status = 'published';
      target.publishedDate = today;
      target.publishedUrl = `${SITE_ORIGIN}/${r.post!.slug}`;
    }
  }
  await putFile({
    path: QUEUE_PATH,
    content: `${JSON.stringify(queueOnBranch, null, 2)}\n`,
    message: `Content: mark ${ok.length} roadmap row(s) published`,
    branch,
    sha: queueFileOnBranch?.sha,
  });

  // ── Open (or reuse) the review PR ────────────────────────────────────────
  let prUrl: string | null = null;
  try {
    const existing = await findOpenPullForBranch(branch);
    if (existing) {
      prUrl = existing.html_url;
    } else {
      const pr = await createPullRequest({
        head: branch,
        title: `Roadmap content batch — ${ok.length} page(s) (${today})`,
        body:
          `Generated automatically by the roadmap-content cron, from \`${QUEUE_PATH}\`.\n\n` +
          `- **Provider:** gemini (forced)\n` +
          `- **Rows:** ${ok.map((r) => r.post!.slug).join(', ')}\n\n` +
          `Review each item at \`/admin/review\` — merging this PR (or **Approve & publish** there) deploys it.`,
      });
      prUrl = pr.html_url;
    }
  } catch (err) {
    console.error(`[roadmap-cron] PR step failed: ${describeError(err)}`);
  }

  // ── Notify ────────────────────────────────────────────────────────────
  if (isEmailConfigured()) {
    const links = ok.map((r) => `<li><a href="${SITE_ORIGIN}/${r.post!.slug}">${r.post!.title}</a></li>`).join('\n');
    const failuresHtml = failed.length
      ? `<h2>Failed (${failed.length})</h2><ul>${failed.map((f) => `<li>${f.row.title} — ${f.error}</li>`).join('\n')}</ul>`
      : '';
    await sendEmail({
      to: NOTIFY_TO,
      subject: `ITZ Digital content: ${ok.length} page(s) ready for review (${today})`,
      html: `
        <p>Roadmap content batch for ${today} — ${ok.length} page(s) generated, awaiting review.</p>
        <h2>Ready for review (${ok.length})</h2>
        <ul>${links}</ul>
        ${failuresHtml}
        ${prUrl ? `<p>Review and publish: <a href="${prUrl}">${prUrl}</a></p>` : ''}
      `.trim(),
      text: [
        `Roadmap content batch for ${today} — ${ok.length} page(s) generated, awaiting review.`,
        '',
        ...ok.map((r) => `- ${r.post!.title} — ${SITE_ORIGIN}/${r.post!.slug}`),
        ...(failed.length ? ['', 'Failed:', ...failed.map((f) => `- ${f.row.title} — ${f.error}`)] : []),
        ...(prUrl ? ['', `Review and publish: ${prUrl}`] : []),
      ].join('\n'),
    });
  }

  return NextResponse.json({
    ok: true,
    generated: ok.map((r) => ({ slug: r.post!.slug, title: r.post!.title })),
    failed: failed.map((f) => ({ slug: f.row.slug, error: f.error })),
    pr: prUrl,
  });
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

import { getPull } from '@/lib/admin/github';
import { loadDraftPost } from '@/lib/admin/drafts';
import { PostPage } from '@/app/[slug]/PostPage';

export const dynamic = 'force-dynamic';

/**
 * Renders a not-yet-merged post with the exact same component the live site
 * uses, fed from the pull request's branch instead of this build's
 * filesystem — see PostPage's `post` prop and lib/admin/drafts.ts.
 */
export default async function DraftPostPreviewPage({
  params,
}: {
  params: Promise<{ number: string; slug: string }>;
}) {
  const { number, slug } = await params;
  const prNumber = Number(number);
  if (!Number.isFinite(prNumber)) notFound();

  const pr = await getPull(prNumber).catch(() => null);
  if (!pr) notFound();

  const post = await loadDraftPost(slug, pr.head.sha).catch(() => null);
  if (!post) notFound();

  return (
    <div className="bg-white text-ink-700">
      <div className="on-dark bg-amber-500 py-2.5 text-center text-sm font-semibold text-navy-900">
        Draft preview — batch #{prNumber} — not live yet
        <Link href={`/admin/review/${prNumber}`} className="ml-3 inline-flex items-center gap-1 underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back to batch
        </Link>
      </div>
      <PostPage slug={slug} post={post} />
    </div>
  );
}

'use server';

import { revalidatePath } from 'next/cache';

import { closePull, isGithubConfigured, mergePull } from '@/lib/admin/github';

/**
 * Server Actions for the review queue. Both run as a POST to whichever
 * /admin/review/... page invoked them, so src/proxy.ts's Basic Auth already
 * covers this route before either function body executes — the check below
 * is a clear failure message, not the security boundary.
 */

export async function approvePull(number: number) {
  if (!isGithubConfigured()) throw new Error('GitHub is not configured.');

  await mergePull(number, `Publish content batch #${number}`);

  revalidatePath('/admin');
  revalidatePath('/admin/review');
  revalidatePath(`/admin/review/${number}`);
}

export async function rejectPull(number: number, formData: FormData) {
  if (!isGithubConfigured()) throw new Error('GitHub is not configured.');

  const reason = String(formData.get('reason') ?? '').trim();
  await closePull(
    number,
    reason ? `Rejected from /admin/review: ${reason}` : 'Rejected from /admin/review.',
  );

  revalidatePath('/admin');
  revalidatePath('/admin/review');
  revalidatePath(`/admin/review/${number}`);
}

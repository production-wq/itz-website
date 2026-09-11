import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, Clock } from 'lucide-react';

import { isGithubConfigured, listContentPulls } from '@/lib/admin/github';
import { formatDate } from '@/lib/posts';

export const metadata: Metadata = { title: 'Review queue' };
export const dynamic = 'force-dynamic';

export default async function ReviewQueuePage() {
  if (!isGithubConfigured()) {
    return (
      <div className="container py-10">
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-amber-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>GitHub is not configured — see .env.example for GITHUB_API_TOKEN / GITHUB_REPO.</p>
        </div>
      </div>
    );
  }

  const pulls = await listContentPulls('open');

  return (
    <div className="container py-10">
      <h2 className="text-2xl font-bold text-white">Review queue</h2>
      <p className="mt-2 text-navy-300">
        Every generated batch lands here before it goes live. Open one to read it exactly as it
        will appear on the site, then approve or send it back.
      </p>

      {pulls.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-navy-200">
          Nothing waiting right now.{' '}
          <Link href="/admin/new" className="font-medium text-blue-300 hover:text-blue-200">
            Start a new batch
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
          {pulls.map((pr) => (
            <li key={pr.number}>
              <Link
                href={`/admin/review/${pr.number}`}
                className="flex items-center justify-between gap-4 px-6 py-5 transition-colors hover:bg-white/5"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-white">{pr.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-navy-300">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Opened {formatDate(pr.created_at)} · #{pr.number}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-navy-400" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

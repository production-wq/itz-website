'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

// Error boundaries are Client Components. Note the `retry` prop — Next.js 16
// renamed it from `reset`; see node_modules/next/dist/docs/.../error.md.
export default function AdminError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="container max-w-2xl py-10">
      <div className="flex items-start gap-3 rounded-2xl border border-red-400/30 bg-red-400/10 p-6 text-red-100">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-semibold">Something went wrong.</p>
          <p className="mt-1 text-sm text-red-100/80">{error.message}</p>
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={retry}
              className="rounded-lg bg-red-400/20 px-4 py-2 text-sm font-semibold hover:bg-red-400/30"
            >
              Try again
            </button>
            <Link href="/admin" className="rounded-lg px-4 py-2 text-sm font-semibold hover:bg-white/10">
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

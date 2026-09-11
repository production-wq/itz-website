import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ExternalLink, FileText, MapPin, XCircle } from 'lucide-react';

import { getPull, getPullFiles } from '@/lib/admin/github';
import { loadChangedGeoRecords } from '@/lib/admin/drafts';
import { approvePull, rejectPull } from '../../actions';

export const metadata: Metadata = { title: 'Review batch' };
export const dynamic = 'force-dynamic';

export default async function ReviewBatchPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const number = Number((await params).number);
  if (!Number.isFinite(number)) notFound();

  const pr = await getPull(number).catch(() => null);
  if (!pr) notFound();

  const files = await getPullFiles(number);
  const postSlugs = files
    .filter((f) => f.status !== 'removed' && /^src\/content\/posts\/[^/]+\.json$/.test(f.filename))
    .map((f) => f.filename.replace('src/content/posts/', '').replace(/\.json$/, ''));

  const geoChanged = files.some((f) => f.filename === 'src/lib/geo/service-locations.json');
  const geoRecords = geoChanged && !pr.merged
    ? await loadChangedGeoRecords(pr.head.sha, pr.base.ref).catch(() => [])
    : [];

  const approveAction = approvePull.bind(null, number);
  const rejectAction = rejectPull.bind(null, number);

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-blue-300">
            Batch #{number}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-white">{pr.title}</h2>
        </div>
        <a
          href={pr.html_url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-sm font-medium text-navy-300 hover:text-white"
        >
          View diff on GitHub <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>

      {pr.state !== 'open' ? (
        <p className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-navy-300">
          This batch is {pr.merged ? 'already published' : 'closed'} — nothing left to review.
        </p>
      ) : (
        <>
          {postSlugs.length > 0 ? (
            <section className="mt-8">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy-300">
                <FileText className="h-4 w-4" aria-hidden="true" /> Blog posts ({postSlugs.length})
              </h3>
              <ul className="mt-3 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
                {postSlugs.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/admin/review/${number}/${slug}`}
                      className="block px-5 py-4 font-medium text-white hover:bg-white/5"
                    >
                      {slug.replace(/-/g, ' ')}
                      <span className="ml-2 text-sm font-normal text-blue-300">
                        Read the full preview →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {geoRecords.length > 0 ? (
            <section className="mt-8">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy-300">
                <MapPin className="h-4 w-4" aria-hidden="true" /> Location pages ({geoRecords.length})
              </h3>
              <ul className="mt-3 space-y-4">
                {geoRecords.map((r) => (
                  <li key={`${r.serviceSlug}-${r.citySlug}`} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-medium uppercase tracking-wide text-blue-300">
                      /services/{r.serviceSlug}/{r.citySlug}
                    </p>
                    <p className="mt-1.5 text-lg font-bold text-white">{r.headline}</p>
                    <p className="mt-2 text-sm leading-relaxed text-navy-200">{r.intro}</p>

                    <dl className="mt-4 grid grid-cols-3 gap-3">
                      {r.stats.map((s) => (
                        <div key={s.label} className="rounded-lg bg-white/5 p-3">
                          <dt className="text-xs text-navy-400">{s.label}</dt>
                          <dd className="font-bold text-white">{s.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-navy-200">
                      {r.localFactors.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>

                    <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                      {r.faqs.map((f) => (
                        <div key={f.question}>
                          <p className="text-sm font-semibold text-white">{f.question}</p>
                          <p className="mt-0.5 text-sm text-navy-300">{f.answer}</p>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8">
            <form action={approveAction}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 font-bold text-white transition-colors hover:bg-emerald-400"
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Approve &amp; publish
              </button>
            </form>

            <details className="group">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg border border-white/15 px-6 py-2.5 font-semibold text-navy-100 hover:bg-white/5">
                <XCircle className="h-4 w-4" aria-hidden="true" /> Send back
              </summary>
              <form action={rejectAction} className="mt-3 flex max-w-md items-start gap-2">
                <textarea
                  name="reason"
                  rows={2}
                  placeholder="Why? (optional — helps next time)"
                  className="flex-1 rounded-lg border border-white/15 bg-ink-900 px-3 py-2 text-sm text-white placeholder:text-navy-400"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
                >
                  Close batch
                </button>
              </form>
            </details>
          </div>

          <p className="mt-4 text-xs text-navy-400">
            Approving merges this batch and deploys it — usually live within a couple of minutes.
            Sitemap and search-engine pings happen automatically.
          </p>
        </>
      )}
    </div>
  );
}

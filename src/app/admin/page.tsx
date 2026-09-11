import Link from 'next/link';
import { AlertTriangle, ArrowRight, ExternalLink, Search } from 'lucide-react';

import { isGithubConfigured, listContentPulls, repoWebUrl } from '@/lib/admin/github';
import { allPosts, formatDate } from '@/lib/posts';
import { site } from '@/lib/site';

export const dynamic = 'force-dynamic';

/** Google's URL Inspection tool accepts a prefilled resource + url via query params. */
function searchConsoleInspectUrl(pageUrl: string) {
  const resourceId = `sc-domain:${new URL(site.url).host}`;
  const params = new URLSearchParams({ resource_id: resourceId, id: pageUrl });
  return `https://search.google.com/search-console/inspect?${params.toString()}`;
}

export default async function AdminDashboard() {
  const configured = isGithubConfigured();
  const pulls = configured ? await listContentPulls('open') : [];
  const recentPosts = allPosts.slice(0, 5);

  return (
    <div className="container space-y-10 py-10">
      {!configured ? (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 text-amber-100">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-semibold">GitHub connection not set up</p>
            <p className="mt-1 text-sm text-amber-100/80">
              Set <code className="rounded bg-black/30 px-1.5 py-0.5">GITHUB_API_TOKEN</code> and{' '}
              <code className="rounded bg-black/30 px-1.5 py-0.5">GITHUB_REPO</code> in this
              site&rsquo;s environment variables before uploading a batch. See{' '}
              <code className="rounded bg-black/30 px-1.5 py-0.5">.env.example</code>.
            </p>
          </div>
        </div>
      ) : null}

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Open for review</h2>
          <Link href="/admin/review" className="flex items-center gap-1 text-sm font-medium text-blue-300 hover:text-blue-200">
            All batches <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {pulls.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-navy-200">
            Nothing waiting on you right now.{' '}
            <Link href="/admin/new" className="font-medium text-blue-300 hover:text-blue-200">
              Start a new batch
            </Link>{' '}
            by uploading a sheet.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {pulls.map((pr) => (
              <li key={pr.number}>
                <Link
                  href={`/admin/review/${pr.number}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-blue-400/40 hover:bg-white/10"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-blue-300">
                    #{pr.number} · opened {formatDate(pr.created_at)}
                  </p>
                  <p className="mt-1.5 font-semibold text-white">{pr.title}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">Recently published</h2>
        <p className="mt-1 text-sm text-navy-300">
          Once a post is live, Google finds it via the sitemap on its own schedule — usually within
          a day or two. To speed one up, request indexing directly:
        </p>

        <ul className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/5">
          {recentPosts.map((post) => (
            <li key={post.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <Link
                  href={`/${post.slug}`}
                  target="_blank"
                  className="font-medium text-white hover:text-blue-300"
                >
                  {post.title}
                </Link>
                <p className="mt-0.5 text-xs text-navy-300">{formatDate(post.date)}</p>
              </div>
              <a
                href={searchConsoleInspectUrl(`${site.url}/${post.slug}`)}
                target="_blank"
                rel="noreferrer"
                className="flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-medium text-navy-100 hover:border-blue-400/40 hover:text-white"
              >
                <Search className="h-3.5 w-3.5" aria-hidden="true" />
                Request Google indexing
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-bold text-white">Repository</h2>
        <p className="mt-2 text-sm text-navy-300">
          Every batch is generated on its own branch and opened as a pull request — nothing publishes
          until you approve it here.
        </p>
        {configured ? (
          <a
            href={repoWebUrl()}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            View repository on GitHub <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </section>
    </div>
  );
}

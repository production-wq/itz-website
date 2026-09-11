'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle2, Download, Loader2, Plus, Trash2, Upload } from 'lucide-react';

type Row = {
  kind: 'post' | 'geo';
  keyword: string; // topic (post) or service slug (geo)
  city: string; // geo only
  category: string; // post only
  angle: string; // optional brief, both
};

const emptyRow = (): Row => ({ kind: 'post', keyword: '', city: '', category: '', angle: '' });

const CATEGORIES = [
  'SEO',
  'Google Ads',
  'PPC Management',
  'Meta Ads',
  'Social Media Ads',
  'Programmatic Ads',
  'Websites',
  'Web Design',
  'Website Services',
  'Digital Marketing',
];

/** CSV cell quoting per RFC 4180 — matches scripts/generate-daily-content.mjs's reader. */
function csvCell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function rowsToCsv(rows: Row[]) {
  const header = ['type', 'keyword', 'city', 'category', 'angle'];
  const lines = [header.join(',')];
  for (const r of rows) {
    if (!r.keyword.trim()) continue;
    lines.push(
      [r.kind, r.keyword, r.kind === 'geo' ? r.city : '', r.kind === 'post' ? r.category : '', r.angle]
        .map(csvCell)
        .join(','),
    );
  }
  return lines.join('\n');
}

type RunState =
  | { phase: 'idle' }
  | { phase: 'submitting' }
  | { phase: 'running'; runUrl: string }
  | { phase: 'done'; runUrl: string }
  | { phase: 'failed'; runUrl?: string; message: string };

export function NewBatchForm({
  services,
  cities,
}: {
  services: { slug: string; name: string }[];
  cities: { slug: string; name: string }[];
}) {
  const [mode, setMode] = useState<'quick' | 'upload'>('quick');
  const [rows, setRows] = useState<Row[]>([emptyRow()]);
  const [file, setFile] = useState<File | null>(null);
  const [provider, setProvider] = useState<'claude' | 'gemini'>('claude');
  const [limit, setLimit] = useState<number | ''>('');
  const [run, setRun] = useState<RunState>({ phase: 'idle' });

  const rowCount = useMemo(() => rows.filter((r) => r.keyword.trim()).length, [rows]);
  const effectiveLimit = limit === '' ? Math.max(1, rowCount || 1) : limit;

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function downloadTemplate() {
    const csv =
      'type,keyword,city,category,angle\n' +
      'post,how much does local seo cost for a dentist,,SEO,\n' +
      'geo,seo,denver,,\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content-queue-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function pollRun(after: string) {
    for (;;) {
      await new Promise((r) => setTimeout(r, 4000));
      const res = await fetch(`/api/admin/runs/latest?after=${encodeURIComponent(after)}`, {
        cache: 'no-store',
      });
      const data = await res.json();
      if (!data.found) continue; // GitHub hasn't registered the run yet

      setRun({ phase: 'running', runUrl: data.run.html_url });

      if (data.run.status === 'completed') {
        if (data.run.conclusion === 'success') {
          setRun({ phase: 'done', runUrl: data.run.html_url });
        } else {
          setRun({
            phase: 'failed',
            runUrl: data.run.html_url,
            message: `The run finished with "${data.run.conclusion}". Open the log to see which row failed.`,
          });
        }
        return;
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let payload: Blob;
    let filename: string;
    if (mode === 'upload') {
      if (!file) return;
      payload = file;
      filename = file.name;
    } else {
      if (rowCount === 0) return;
      payload = new Blob([rowsToCsv(rows)], { type: 'text/csv' });
      filename = `quick-list-${new Date().toISOString().slice(0, 10)}.csv`;
    }

    setRun({ phase: 'submitting' });

    const form = new FormData();
    form.set('file', payload, filename);
    form.set('provider', provider);
    form.set('limit', String(effectiveLimit));

    try {
      const dispatchedAt = new Date().toISOString();
      const res = await fetch('/api/admin/generate', { method: 'POST', body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);

      setRun({ phase: 'running', runUrl: data.run?.html_url ?? '' });
      await pollRun(dispatchedAt);
    } catch (err) {
      setRun({ phase: 'failed', message: err instanceof Error ? err.message : String(err) });
    }
  }

  const busy = run.phase === 'submitting' || run.phase === 'running';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode('quick')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            mode === 'quick' ? 'bg-blue-500 text-white' : 'bg-white/5 text-navy-200 hover:bg-white/10'
          }`}
        >
          Quick list
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            mode === 'upload' ? 'bg-blue-500 text-white' : 'bg-white/5 text-navy-200 hover:bg-white/10'
          }`}
        >
          Upload a sheet
        </button>
      </div>

      {mode === 'quick' ? (
        <div className="space-y-4">
          <p className="text-sm text-navy-300">
            Add one row per post or location page you want written today. Everything else — the
            words, the SEO title, the FAQs — is generated for you to review.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-left text-xs uppercase tracking-wide text-navy-300">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Topic / service</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Notes (optional)</th>
                  <th className="px-2 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-4 py-2.5">
                      <select
                        value={row.kind}
                        onChange={(e) => updateRow(i, { kind: e.target.value as Row['kind'] })}
                        className="w-full rounded-lg border border-white/15 bg-ink-900 px-2.5 py-1.5 text-white"
                      >
                        <option value="post">Blog post</option>
                        <option value="geo">Location page</option>
                      </select>
                    </td>

                    {row.kind === 'post' ? (
                      <td className="px-4 py-2.5">
                        <input
                          value={row.keyword}
                          onChange={(e) => updateRow(i, { keyword: e.target.value })}
                          placeholder="e.g. how much does local seo cost for a dentist"
                          className="w-full min-w-[16rem] rounded-lg border border-white/15 bg-ink-900 px-2.5 py-1.5 text-white placeholder:text-navy-400"
                        />
                      </td>
                    ) : (
                      <td className="px-4 py-2.5">
                        <select
                          value={row.keyword}
                          onChange={(e) => updateRow(i, { keyword: e.target.value })}
                          className="w-full min-w-[12rem] rounded-lg border border-white/15 bg-ink-900 px-2.5 py-1.5 text-white"
                        >
                          <option value="">Choose a service…</option>
                          {services.map((s) => (
                            <option key={s.slug} value={s.slug}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    <td className="px-4 py-2.5">
                      {row.kind === 'geo' ? (
                        <select
                          value={row.city}
                          onChange={(e) => updateRow(i, { city: e.target.value })}
                          className="w-full min-w-[9rem] rounded-lg border border-white/15 bg-ink-900 px-2.5 py-1.5 text-white"
                        >
                          <option value="">Choose a city…</option>
                          {cities.map((c) => (
                            <option key={c.slug} value={c.slug}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-navy-500">—</span>
                      )}
                    </td>

                    <td className="px-4 py-2.5">
                      {row.kind === 'post' ? (
                        <select
                          value={row.category}
                          onChange={(e) => updateRow(i, { category: e.target.value })}
                          className="w-full min-w-[10rem] rounded-lg border border-white/15 bg-ink-900 px-2.5 py-1.5 text-white"
                        >
                          <option value="">Let the writer choose</option>
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-navy-500">—</span>
                      )}
                    </td>

                    <td className="px-4 py-2.5">
                      <input
                        value={row.angle}
                        onChange={(e) => updateRow(i, { angle: e.target.value })}
                        placeholder="Any steer for the writer"
                        className="w-full min-w-[12rem] rounded-lg border border-white/15 bg-ink-900 px-2.5 py-1.5 text-white placeholder:text-navy-400"
                      />
                    </td>

                    <td className="px-2 py-2.5 text-right">
                      <button
                        type="button"
                        aria-label="Remove row"
                        onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))}
                        disabled={rows.length === 1}
                        className="rounded-lg p-2 text-navy-400 hover:bg-white/10 hover:text-red-300 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => setRows((prev) => [...prev, emptyRow()])}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-navy-100 hover:bg-white/5"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Add row
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-navy-300">
            Columns: <code className="rounded bg-white/10 px-1.5 py-0.5">type</code>,{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5">keyword</code>,{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5">city</code>,{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5">category</code>,{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5">angle</code> — headings are matched
            loosely, so close variants work too. Accepts .csv or .xlsx.
          </p>

          <button
            type="button"
            onClick={downloadTemplate}
            className="flex items-center gap-1.5 text-sm font-medium text-blue-300 hover:text-blue-200"
          >
            <Download className="h-4 w-4" aria-hidden="true" /> Download a template
          </button>

          <label className="flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-white/20 px-6 py-10 text-center hover:border-blue-400/50">
            <Upload className="h-6 w-6 text-navy-300" aria-hidden="true" />
            <span className="text-sm font-medium text-white">
              {file ? file.name : 'Click to choose a .csv or .xlsx file'}
            </span>
            <input
              type="file"
              accept=".csv,.xlsx"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-6 border-t border-white/10 pt-6">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-navy-300">
            AI writer
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as 'claude' | 'gemini')}
            className="mt-1.5 rounded-lg border border-white/15 bg-ink-900 px-3 py-2 text-white"
          >
            <option value="claude">Claude (recommended)</option>
            <option value="gemini">Gemini</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-navy-300">
            Max items this run
          </label>
          <input
            type="number"
            min={1}
            value={limit === '' ? effectiveLimit : limit}
            onChange={(e) => setLimit(e.target.value === '' ? '' : Number(e.target.value))}
            className="mt-1.5 w-24 rounded-lg border border-white/15 bg-ink-900 px-3 py-2 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={busy || (mode === 'quick' ? rowCount === 0 : !file)}
          className="ml-auto flex items-center gap-2 rounded-lg bg-amber-400 px-6 py-2.5 font-bold text-navy-800 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          {busy ? 'Working…' : 'Generate & send for review'}
        </button>
      </div>

      {run.phase !== 'idle' ? (
        <div
          className={`flex items-start gap-3 rounded-2xl border p-5 ${
            run.phase === 'failed'
              ? 'border-red-400/30 bg-red-400/10 text-red-100'
              : run.phase === 'done'
                ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-100'
                : 'border-blue-400/30 bg-blue-400/10 text-blue-100'
          }`}
        >
          {run.phase === 'failed' ? (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : run.phase === 'done' ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          ) : (
            <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin" aria-hidden="true" />
          )}

          <div className="text-sm">
            {run.phase === 'submitting' && <p>Sending your sheet to the writer…</p>}
            {run.phase === 'running' && (
              <>
                <p>Writing now — this usually takes a few minutes for a handful of items.</p>
                {run.runUrl ? (
                  <a href={run.runUrl} target="_blank" rel="noreferrer" className="underline">
                    Watch the live log ↗
                  </a>
                ) : null}
              </>
            )}
            {run.phase === 'done' && (
              <>
                <p className="font-semibold">Done — ready for your review.</p>
                <Link href="/admin/review" className="underline">
                  Open the review queue →
                </Link>
              </>
            )}
            {run.phase === 'failed' && (
              <>
                <p className="font-semibold">Something went wrong.</p>
                <p className="mt-1">{run.message}</p>
                {run.runUrl ? (
                  <a href={run.runUrl} target="_blank" rel="noreferrer" className="underline">
                    Open the run log ↗
                  </a>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </form>
  );
}

/*
 * Shared AI-generation core for scripts/generate-daily-content.mjs (CLI) and
 * src/app/api/studio/generate/route.ts (the "Generate with AI" button inside
 * the Sanity Studio). One prompt, one voice, one set of house rules — a
 * post's quality and tone should not depend on which door it came in through.
 *
 * Pure generation only: given a topic, produces validated post JSON. No file
 * I/O, no CLI concerns — those stay in generate-daily-content.mjs and the
 * route handler respectively.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const DEFAULT_MODEL = {
  claude: 'claude-opus-5',
  // 'gemini-2.5-pro' still shows up in --list-models but 404s on an actual
  // generateContent call ("no longer available to new users") — this is what
  // Google's own error message names as the replacement. Model IDs move;
  // re-run --list-models if this one goes stale too.
  gemini: 'gemini-3.1-pro-preview',
};

// ── Site context ────────────────────────────────────────────────────────────

/**
 * Pull the service catalogue out of lib/services.ts without a TS build.
 * Only slug/name/tagline are needed for prompting, and they are all string
 * literals on their own lines, so a scan is enough.
 */
export function readServices(root) {
  const src = readFileSync(join(root, 'src/lib/services.ts'), 'utf8');
  const services = [];
  const blocks = src.split(/\n {2}\{\n/).slice(1);
  for (const block of blocks) {
    const get = (key) => block.match(new RegExp(`^\\s{4}${key}: '((?:[^'\\\\]|\\\\.)*)'`, 'm'))?.[1];
    const slug = get('slug');
    if (slug) services.push({ slug, name: get('name'), tagline: get('tagline') });
  }
  if (services.length === 0) throw new Error('Could not read any services from lib/services.ts');
  return services;
}

export function readSite(root) {
  const src = readFileSync(join(root, 'src/lib/site.ts'), 'utf8');
  // `\\s*` after the colon: some values in site.ts wrap onto the next line.
  const get = (key) => src.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`))?.[1];
  return {
    name: get('name') ?? 'the company',
    tagline: get('tagline') ?? '',
    description: get('description') ?? '',
    phone: get('phone') ?? '',
  };
}

// ── Prompts ─────────────────────────────────────────────────────────────────

/**
 * Stable across every row in a CLI batch, so it is worth a cache breakpoint
 * there: one cache write, then N-1 reads at ~0.1x. Nothing per-row goes in
 * here.
 */
export function systemPrompt(site) {
  return `You write SEO content for ${site.name}, a small business marketing agency.

ABOUT THE BUSINESS
${site.description}
Tagline: ${site.tagline}

They run SEO, Google Ads, Meta Ads, programmatic advertising, website design and
lead generation for five industries: legal, medical, real estate, education and
automotive. Clients are owner-operators and practice managers, not marketers.

VOICE
- Direct and concrete. Short sentences. Plain US English.
- Lead with the useful thing. No throat-clearing preamble.
- Specific over general: "cost per booked job" beats "great results".
- Admit tradeoffs and timelines honestly. Say when something takes six months.
- Second person ("your firm"), never "we at ${site.name} believe".

NEVER DO THESE
- Never open with "In today's fast-paced digital landscape" or any variant.
- Never invent statistics, percentages, dollar figures, study citations or
  survey results. Write around the absence of a number rather than making one up.
- Never invent client names, testimonials, review counts or star ratings. This
  matters: fabricated ratings become structured data and earn manual actions.
- Never promise specific rankings, lead volumes or timeframes as guarantees.
- No emoji. No "Conclusion" heading. No "Introduction" heading.
- Do not repeat the target keyword mechanically. Write for a reader first.

FORMAT
Body content is an HTML fragment using only <h2>, <h3>, <p>, <ul>, <ol>, <li>,
<strong> and <a>. No <h1> (the page renders the title). No markdown. No
wrapper <html>/<body>. No inline styles, classes or images.`;
}

/**
 * The blog's actual category taxonomy — NOT derived from services.ts's
 * `name` fields (those are full display names like "Search Engine
 * Optimization" for page titles; the blog uses the short form "SEO"). This
 * list is what /blog's category filter (src/app/blog/page.tsx) matches
 * against, confirmed against every category used across the 612 existing
 * posts. Getting this wrong doesn't fail loudly — a post just silently never
 * shows up under any category filter.
 */
export const BLOG_CATEGORIES = [
  'SEO',
  'Google ads',
  'PPC Management',
  'Meta Ads',
  'Social Media Ads',
  'Programmatic Ads',
  'Websites',
  'Web Design',
  'Website Services',
  'Digital Marketing',
  'Real Estate Agent',
];

export function postPrompt({ keyword, category, angle }) {
  return `Write a blog post targeting the keyword: "${keyword}"${
    category ? `\nCategory: ${category}` : ''
  }${angle ? `\n\nEDITOR'S BRIEF (from the content queue — follow it):\n${angle}` : ''}

Requirements:
- At least 1,300 words of body content (the floor is 1,200 — clear it comfortably).
- Structure with <h2> sections, and <h3> subsections where a section earns one.
- Open by answering the reader's actual question within the first two sentences.
- Include one section that covers cost or budgeting honestly, and one that covers
  what typically goes wrong.
- Exactly 4 FAQs. Each answer 40-80 words, answering the question directly in the
  first sentence. Write questions the way someone would type them into Google.
- seoTitle: at most 60 characters, keyword near the front, no pipe-separated brand suffix.
- seoDescription: 140-160 characters, written to earn the click.
- excerpt: 1-2 sentences, at most 180 characters.
- categories: pick 1-2 from exactly this list (use these exact strings, not a
  paraphrase): ${BLOG_CATEGORIES.join(', ')}.
- tags: 3-6 lowercase specific phrases.

The FAQs will be rendered on the page AND emitted as FAQPage structured data, so
every answer must stand on its own as visible page content.`;
}

// ── Providers ───────────────────────────────────────────────────────────────

/*
 * Both providers expose the same shape to the caller:
 *
 *   { generate({system, user, schema, schemaName}) → {data, usage},
 *     listModels() → string[] }
 *
 * Both are asked for schema-constrained JSON, so neither path needs regex
 * extraction or a JSON.parse retry loop. Model config differs:
 *   Claude — streaming + output_config.effort, no temperature (400s on Opus 5)
 *   Gemini — responseJsonSchema + responseMimeType, thinking left on default
 */

export async function makeClaudeProvider(opts) {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();

  return {
    label: `${opts.model} (effort=${opts.effort ?? 'medium'})`,

    async listModels() {
      const out = [];
      for await (const m of client.models.list()) out.push(m.id);
      return out;
    },

    async generate({ system, user, schema, schemaName }) {
      // Streaming: a 1,300-word article plus adaptive thinking runs well past
      // the ~16K non-streaming HTTP timeout threshold.
      const stream = client.messages.stream({
        model: opts.model,
        max_tokens: 32000,
        system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
        output_config: {
          effort: opts.effort ?? 'medium',
          format: { type: 'json_schema', name: schemaName, schema },
        },
        messages: [{ role: 'user', content: user }],
      });

      const message = await stream.finalMessage();

      if (message.stop_reason === 'refusal') {
        throw new Error(`model declined (${message.stop_details?.category ?? 'unknown'})`);
      }
      if (message.stop_reason === 'max_tokens') {
        throw new Error('hit max_tokens — output truncated, not writing');
      }

      const text = message.content.find((b) => b.type === 'text')?.text;
      if (!text) throw new Error(`no text block in response (stop_reason=${message.stop_reason})`);

      return {
        data: JSON.parse(text),
        usage: {
          input: message.usage?.input_tokens ?? 0,
          cached: message.usage?.cache_read_input_tokens ?? 0,
          output: message.usage?.output_tokens ?? 0,
        },
      };
    },
  };
}

export async function makeGeminiProvider(opts) {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error('GEMINI_API_KEY is not set — get one at https://aistudio.google.com/apikey');
  }
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY,
    // GEMINI_BASE_URL exists so this path can be exercised against a local
    // mock in tests; unset in normal use.
    ...(process.env.GEMINI_BASE_URL
      ? { httpOptions: { baseUrl: process.env.GEMINI_BASE_URL } }
      : {}),
  });

  return {
    label: opts.model,

    async listModels() {
      // Model families that can't generate text content, for when the API
      // response carries no capability list to filter on.
      const NON_TEXT = /embedding|imagen|veo|aqa|tts|image-generation|native-audio/i;

      const out = [];
      const page = await ai.models.list();
      for await (const m of page) {
        const id = (m.name ?? '').replace(/^models\//, '');
        if (!id) continue;

        const actions = m.supportedActions ?? m.supportedGenerationMethods;
        if (Array.isArray(actions) && actions.length > 0) {
          if (actions.includes('generateContent')) out.push(id);
        } else if (!NON_TEXT.test(id)) {
          // Capability list absent — fall back to the name. Err toward showing
          // a model rather than hiding one that would have worked.
          out.push(id);
        }
      }
      return out;
    },

    async generate({ system, user, schema }) {
      const response = await ai.models.generateContent({
        model: opts.model,
        contents: user,
        config: {
          systemInstruction: system,
          // Constrains the response to the schema, same role output_config.format
          // plays on the Claude path.
          responseMimeType: 'application/json',
          responseJsonSchema: schema,
          maxOutputTokens: 32000,
        },
      });

      const blocked = response.promptFeedback?.blockReason;
      if (blocked) throw new Error(`prompt blocked by safety filter (${blocked})`);

      const candidate = response.candidates?.[0];
      if (candidate?.finishReason && !['STOP', 'MAX_TOKENS'].includes(candidate.finishReason)) {
        throw new Error(`generation stopped: ${candidate.finishReason}`);
      }
      if (candidate?.finishReason === 'MAX_TOKENS') {
        throw new Error('hit maxOutputTokens — output truncated, not writing');
      }

      const text = response.text;
      if (!text) throw new Error('empty response from Gemini');

      const u = response.usageMetadata ?? {};
      return {
        data: JSON.parse(text),
        usage: {
          input: u.promptTokenCount ?? 0,
          cached: u.cachedContentTokenCount ?? 0,
          output: u.candidatesTokenCount ?? 0,
        },
      };
    },
  };
}

export const makeProvider = (opts) =>
  opts.provider === 'gemini' ? makeGeminiProvider(opts) : makeClaudeProvider(opts);

/**
 * Most specific first. Note the TS SDK exports these as named exports (not as
 * statics on the default export), has no `APIStatusError` (that is the Python
 * name — `APIError` is the base here), and makes `APIConnectionError` a
 * *subclass* of `APIError`, so it has to be checked first.
 */
export function describeError(err) {
  // Both SDKs surface an HTTP status, so this stays provider-agnostic rather
  // than importing either SDK's error classes.
  const status = err?.status ?? err?.statusCode ?? err?.response?.status;
  if (status === 401 || status === 403) {
    return `auth failed (${status}) — check your API key for this provider`;
  }
  if (status === 429) return 'rate limited — retry later or lower --concurrency';
  if (typeof status === 'number' && status >= 500) return `provider error ${status} — retry later`;
  if (typeof status === 'number') return `API ${status}: ${err.message}`;
  if (/fetch failed|ENOTFOUND|ECONNRESET|socket hang up/i.test(err?.message ?? '')) {
    return `connection failed: ${err.message}`;
  }
  return err?.message ?? String(err);
}

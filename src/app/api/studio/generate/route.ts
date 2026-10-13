import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

import { POST_SCHEMA, readingTime, slugify, validatePost } from '@/lib/content-schemas.mjs';
import { htmlToPortableText } from '@/lib/admin/html-to-portable-text';
import { DEFAULT_MODEL, describeError, makeProvider, postPrompt, readSite, systemPrompt } from '../../../../../scripts/lib/content-gen.mjs';
import { generateImage, promptFor } from '../../../../../scripts/lib/image-gen.mjs';

/** The two .mjs modules above have no type declarations — pin down the one
 * shape this route actually relies on rather than trusting loose inference. */
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

export const runtime = 'nodejs';
export const maxDuration = 120; // a 1,300-word article + an image comfortably clears Vercel's default 10s/60s

/**
 * Backend for the "Generate with AI" document action inside the Sanity
 * Studio (studio-itz-digital/actions/generateWithAI.tsx). The Studio is a
 * static SPA with no server of its own, so this is where the actual model
 * calls happen and where the API keys live — the Studio only ever gets back
 * a finished draft, never a key.
 *
 * Auth is a shared secret (STUDIO_AI_SECRET), not src/proxy.ts's Basic Auth:
 * the real access control is Sanity's own login — only a logged-in project
 * member ever sees the button that calls this. The secret mainly keeps this
 * endpoint from being hit directly by anyone who isn't going through the
 * Studio at all.
 */

const ALLOWED_ORIGINS = new Set([
  'https://itz-digital.sanity.studio',
  'http://localhost:3333', // `npm run dev` inside studio-itz-digital
]);

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-studio-secret',
  };
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('origin')) });
}

type Body = {
  topic?: string;
  category?: string;
  angle?: string;
  provider?: 'claude' | 'gemini';
  image?: boolean;
};

export async function POST(request: Request) {
  const headers = corsHeaders(request.headers.get('origin'));

  const secret = process.env.STUDIO_AI_SECRET;
  if (!secret) {
    return NextResponse.json({ ok: false, error: 'Not configured (STUDIO_AI_SECRET unset).' }, { status: 503, headers });
  }
  if (request.headers.get('x-studio-secret') !== secret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401, headers });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body.' }, { status: 400, headers });
  }

  const topic = body.topic?.trim();
  if (!topic) {
    return NextResponse.json({ ok: false, error: 'A topic is required.' }, { status: 400, headers });
  }
  const provider = body.provider === 'gemini' ? 'gemini' : 'claude';

  const root = process.cwd();

  try {
    const site = readSite(root);

    const ai = (await makeProvider({ provider, model: DEFAULT_MODEL[provider], effort: 'medium' })) as Provider;
    const { data } = await ai.generate({
      system: systemPrompt(site),
      user: postPrompt({ keyword: topic, category: body.category, angle: body.angle }),
      schema: POST_SCHEMA,
      schemaName: 'blog_post',
    });

    const errors = validatePost(data);
    if (errors.length) {
      return NextResponse.json(
        { ok: false, error: `The draft didn't pass quality checks: ${errors.join('; ')}` },
        { status: 422, headers },
      );
    }

    const slug = slugify(data.title);
    if (!slug) {
      return NextResponse.json({ ok: false, error: `Could not make a URL slug from "${data.title}".` }, { status: 422, headers });
    }

    const result: Record<string, unknown> = {
      ok: true,
      title: data.title,
      slug,
      excerpt: data.excerpt,
      categories: data.categories,
      tags: data.tags,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      faqs: data.faqs,
      body: htmlToPortableText(data.content),
      readingTime: readingTime(data.content),
    };

    if (body.image) {
      const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!geminiKey) {
        result.imageWarning = 'No GEMINI_API_KEY configured — draft created without a featured image.';
      } else {
        try {
          const imgClient = new GoogleGenAI({ apiKey: geminiKey });
          const webp = await generateImage(imgClient, {
            prompt: promptFor({ title: data.title, category: data.categories?.[0] }),
            aspect: '4:3',
          });
          result.image = { base64: (webp as Buffer).toString('base64'), mimeType: 'image/webp' };
        } catch (err) {
          result.imageWarning = `Image generation failed: ${describeError(err)}`;
        }
      }
    }

    return NextResponse.json(result, { headers });
  } catch (err) {
    return NextResponse.json({ ok: false, error: describeError(err) }, { status: 502, headers });
  }
}

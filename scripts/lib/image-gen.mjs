/*
 * Shared Gemini image pipeline for the scripts/ generators.
 *
 * `generate-images.mjs`      — the hand-written marketing-illustration manifest.
 * `generate-blog-images.mjs` — one editorial illustration per un-matched post.
 *
 * Both want the same house style and the same PNG→WebP-on-white encode, so it
 * lives here once.
 */
import sharp from 'sharp';

export const MODEL = 'gemini-2.5-flash-image';

/* Appended to every prompt so the whole set reads as one system. */
export const STYLE =
  ' — flat vector editorial illustration on a plain solid pure-white background (#FFFFFF), ' +
  'the white fills the whole frame edge to edge. Absolutely no checkerboard pattern, no grey ' +
  'squares, no transparency grid, no drop shadow behind the artwork. Deep navy #00386C and ' +
  'bright blue #0974E4 as the primary colours with warm amber #FBBB5B used sparingly for ' +
  'accents, soft pale-blue circles and fine dot-grid textures in the negative space, clean ' +
  'minimal geometry, rounded shapes, subtle depth. Any people are simplified and stylised ' +
  'with minimal facial detail, shown small within the composition. Fully illustrated flat ' +
  'shapes only — no photographic or 3D-rendered elements. ' +
  'CRITICAL: the illustration must contain ZERO text — no words, no letters, no numbers, no ' +
  'labels, captions, headings, UI copy, button text, chart axis text or logos anywhere in the ' +
  'frame. Represent any label as a plain rounded bar or block shape, never as characters. ' +
  'Generous white space, balanced composition, professional and modern. Consistent line ' +
  'weight and colour palette across the set.';

export const WIDTHS = { '4:3': 1400, '1:1': 1200, '16:9': 1600, '3:2': 1500 };

export function resolveKey(cliKey) {
  const key = cliKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error('Missing key: pass --api-key <KEY> or set GEMINI_API_KEY');
    process.exit(1);
  }
  return key;
}

/**
 * One image. `prompt` is the scene only — STYLE is appended here. Returns a WebP
 * buffer flattened onto white (any stray alpha the model returns would otherwise
 * render as a grey checkerboard on the page).
 */
export async function generateImage(ai, { prompt, aspect = '4:3' }, attempt = 1) {
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: prompt + STYLE,
    config: {
      responseModalities: ['IMAGE'],
      imageConfig: { aspectRatio: aspect },
    },
  });

  const parts = res?.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) {
    const text = parts.find((p) => p.text)?.text ?? 'no image in response';
    if (attempt < 3) {
      console.warn(`  retry ${attempt} (${text.slice(0, 80)})`);
      return generateImage(ai, { prompt, aspect }, attempt + 1);
    }
    throw new Error(`no image after ${attempt} attempts: ${text.slice(0, 160)}`);
  }

  const png = Buffer.from(img.inlineData.data, 'base64');
  const width = WIDTHS[aspect] ?? 1400;
  return sharp(png)
    .flatten({ background: '#ffffff' })
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();
}

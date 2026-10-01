/*
 * Shared Gemini image pipeline for the scripts/ generators.
 *
 * `generate-images.mjs`      — the hand-written marketing-illustration manifest.
 * `generate-blog-images.mjs` — one editorial illustration per un-matched post.
 * `src/app/api/studio/generate/route.ts` — the "Generate with AI" Studio button.
 *
 * All three want the same house style and the same PNG→WebP-on-white encode,
 * so it lives here once.
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

// ── Blog-post prompt builder ────────────────────────────────────────────────
// Shared by generate-blog-images.mjs (backfilling posts with no image) and
// the Studio "Generate with AI" button (generating one on demand), so a post
// gets a visually consistent illustration regardless of which door made it.

// category (lower-cased) → the scene half of the prompt
export const SCENES = {
  seo:
    'a search-results page with one listing climbing to the top spot, a magnifying glass, a ' +
    'small local map-pack of three results, an upward rank ladder',
  'google ads':
    'a search-results page with the top sponsored ad slot highlighted amber, a bid-strategy ' +
    'dial, a single click turning into a ringing phone',
  'ppc management':
    'a paid-search dashboard: the top ad slot highlighted amber, a bid dial, a negative-keyword ' +
    'filter, a conversion funnel ending in a phone call',
  'meta ads':
    'a phone showing one sponsored post in a social feed, concentric audience-targeting rings, ' +
    'two creative variants side by side, a small results chart',
  'social media ads':
    'a phone showing a social feed with one boosted post, engagement icons rising from it, ' +
    'audience-targeting rings, a compact performance chart',
  'programmatic ads':
    'a display-ad exchange: banner slots across several device screens linked by routing lines ' +
    'to a central audience graph and a bid meter',
  websites:
    'a rough wireframe on the left resolving into a polished fast website shown on a phone and ' +
    'a desktop on the right, a speed gauge, a call-to-action button highlighted amber',
  'web design':
    'a designer\'s canvas: a wireframe becoming a finished website on phone and desktop, colour ' +
    'and type swatches, a highlighted call-to-action button',
  'website services':
    'an ongoing-care view of a website: a dashboard with uptime and speed gauges, a small ' +
    'checklist of monthly fixes, a shield badge',
  'digital marketing':
    'a multi-channel funnel: search, social and email icons feeding into one dashboard with an ' +
    'upward revenue curve and a ringing phone at the end',
  'real estate agent':
    'a house with a sold sign and a map pin, a phone showing a stream of new buyer enquiries, ' +
    'an upward listings chart',
};
export const DEFAULT_SCENE = SCENES['digital marketing'];

// title keyword → the subject half of the prompt. First match wins.
export const SUBJECTS = [
  [/chiropract/i, 'a chiropractic clinic'],
  [/dentist|dental/i, 'a dental practice'],
  [/med spa|medspa|medical spa|esthetician/i, 'a med spa'],
  [/physical therapy|physiotherap/i, 'a physical-therapy clinic'],
  [/urgent care/i, 'an urgent-care clinic'],
  [/massage/i, 'a massage-therapy practice'],
  [/\b(law|legal|lawyer|attorney|counsel)\b|divorce|injury|bankruptcy|immigration|estate planning|criminal defense/i, 'a law firm'],
  [/roofing|roofer/i, 'a roofing company'],
  [/plumb/i, 'a plumbing company'],
  [/\bhvac\b|heating|air conditioning/i, 'an HVAC company'],
  [/electrician|electrical/i, 'an electrical contractor'],
  [/painter|painting/i, 'a painting company'],
  [/concrete|flooring|siding|remodel|contractor|construction|builder/i, 'a home-improvement contractor'],
  [/property management/i, 'a property-management company'],
  [/real estate|realtor|broker/i, 'a real-estate brokerage'],
  [/auto detailing|car wash/i, 'an auto-detailing and car-wash business'],
  [/auto repair|mechanic|auto center|repair shop/i, 'an auto-repair shop'],
  [/tire/i, 'a tire shop'],
  [/windshield|auto glass/i, 'an auto-glass shop'],
  [/locksmith/i, 'a locksmith business'],
  [/restoration|water damage|removal|cleanup/i, 'a restoration company'],
  [/\b(school|schools|education|university|universities|college|enrol)/i, 'a school or college'],
  [/automotive|dealership|dealer/i, 'an automotive dealership group'],
  [/pool|spa builder/i, 'a pool and spa builder'],
  [/hotel|hospitality|restaurant/i, 'a hospitality business'],
];

/** Builds an image prompt from a post's title + primary category. */
export function promptFor({ title, category }) {
  const subjectMatch = SUBJECTS.find(([re]) => re.test(title));
  const subject = subjectMatch ? subjectMatch[1] : 'a local service business';
  const scene = SCENES[String(category || '').toLowerCase()] ?? DEFAULT_SCENE;
  return `Editorial illustration for a small-business marketing article about ${subject}. Scene: ${scene}. A single balanced composition, not a collage of separate panels.`;
}

// ── Alt text ────────────────────────────────────────────────────────────────
// Describes what the house-style illustration actually shows (see SCENES),
// not the post title, so the alt adds information instead of repeating the
// heading next to it.
const ALT_SCENES = {
  seo: 'a search results page with one listing climbing to the top spot beside a local map pack',
  'google ads': 'a search results page with the top ad slot highlighted next to a bid dial and a ringing phone',
  'ppc management': 'a paid search dashboard with a highlighted ad slot, a bid dial and a conversion funnel',
  'meta ads': 'a phone showing a sponsored social post, audience targeting rings and a small results chart',
  'social media ads': 'a phone showing a boosted social post with rising engagement icons and a performance chart',
  'programmatic ads': 'display ad slots across several screens connected to an audience graph and a bid meter',
  websites: 'a rough wireframe turning into a finished, fast website on a phone and a desktop',
  'web design': 'a wireframe becoming a finished website on a phone and a desktop, with color and type swatches',
  'website services': 'a website care dashboard with uptime and speed gauges, a monthly checklist and a security shield',
  'digital marketing': 'search, social and email channels feeding one dashboard with a rising revenue curve',
  'real estate agent': 'a house with a sold sign, a map pin and a rising listings chart',
};
const DEFAULT_ALT_SCENE = ALT_SCENES['digital marketing'];

/** Alt text for a generated house-style featured image. */
export function altFor({ title, category }) {
  const subjectMatch = SUBJECTS.find(([re]) => re.test(title));
  const subject = subjectMatch ? subjectMatch[1] : 'a local service business';
  const scene = ALT_SCENES[String(category || '').toLowerCase()] ?? DEFAULT_ALT_SCENE;
  return `Illustration of ${scene}, for ${subject}`;
}

/**
 * Some older images were saved with their full image-generation prompt as alt
 * text ("…no text overlays, no competitors, no low-lighting"). Keep the part
 * that describes the picture: the first sentence, minus the negative-prompt
 * tail, capped at a screen-reader-friendly length.
 */
export function altFromPrompt(prompt, max = 125) {
  let text = String(prompt).replace(/\s+/g, ' ').trim();
  text = text.split(/(?<=[.!?])\s+/)[0];
  text = text.replace(/[,;]?\s*(?:with\s+)?(?:and\s+)?\bno\b.*$/i, '').replace(/[.\s]+$/, '');
  // "A detailed, clear image showing a mechanic…" → "A mechanic…"
  const lead = text.match(/^(?:an?|the)\s+(?:[\w-]+,?\s+){0,3}?(?:image|illustration|scene|graphic|infographic)\s+(?:showing|of|depicting|illustrating)\s+/i);
  if (lead) text = text.slice(lead[0].length).replace(/^./, (c) => c.toUpperCase());
  if (text.length > max) {
    const head = text.slice(0, max);
    // End on a clause boundary so the alt doesn't stop mid-phrase; failing that,
    // on a word boundary with any dangling connective dropped.
    const clause = head.slice(55).search(/,\s|\swith\s/);
    text =
      clause >= 0
        ? head.slice(0, 55 + clause)
        : head.slice(0, head.lastIndexOf(' ')).replace(/\s+(?:with|and|of|in|on|for|to|a|an|the)$/i, '');
    text = text.replace(/[,;:\s]+$/, '');
  }
  return text;
}

/** True when an alt value is just the title, empty, or a leaked generation prompt. */
export function needsBetterAlt(alt, title) {
  const a = String(alt ?? '').trim();
  return !a || a === title || a.length > 200 || /\bno (?:text|competitors?|low-lighting|brand logos)\b|text overlays?/i.test(a);
}

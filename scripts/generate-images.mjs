/**
 * generate-images.mjs — brand illustrations for the marketing templates.
 *
 * Calls Gemini's image model (`gemini-2.5-flash-image`) once per manifest entry,
 * then resizes + re-encodes the PNG to WebP with `sharp` so the repo stays light
 * (existing public/images is ~1.5 MB for 37 assets — we keep new art to a similar
 * budget). Transparent backgrounds are preserved.
 *
 *   node scripts/generate-images.mjs --api-key <KEY>       # or GEMINI_API_KEY
 *   node scripts/generate-images.mjs --only industries     # substring filter on file path
 *   node scripts/generate-images.mjs --force               # overwrite existing files
 *   node scripts/generate-images.mjs --list                # print the manifest and exit
 *
 * The key is read from --api-key or the environment only; it is never written to
 * disk. Cost: ~1290 output tokens per image on gemini-2.5-flash-image.
 */
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GoogleGenAI } from '@google/genai';

import { generateImage, resolveKey } from './lib/image-gen.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'public', 'images');

/** @type {{file:string, aspect:string, prompt:string}[]} */
const MANIFEST = [
  // ── Home Services industry (round 2) ──────────────────────────────────────
  {
    file: 'industries/home-services.webp',
    aspect: '4:3',
    prompt:
      'A home-services tradesperson composite: a simplified figure in work clothes holding a ' +
      'clipboard, with floating UI cards around them showing a booking calendar, a five-star ' +
      'review, a ringing phone and a house with a location pin. Warm, trustworthy.',
  },
  {
    file: 'industries/home-services-hvac.webp',
    aspect: '4:3',
    prompt:
      'HVAC marketing: a house with an air-conditioning unit and a thermostat dial, a small ' +
      'weather badge showing heat and a snowflake, a phone with a local search result and a ' +
      'same-day booking slot highlighted in amber.',
  },
  {
    file: 'industries/home-services-plumbing.webp',
    aspect: '4:3',
    prompt:
      'Plumbing marketing: a pipe-and-wrench emblem, a burst-pipe warning icon, a 24/7 clock, ' +
      'a phone showing an emergency call being answered, a map pin over a house.',
  },
  {
    file: 'industries/home-services-roofing.webp',
    aspect: '4:3',
    prompt:
      'Roofing marketing: a house roof with a storm cloud and a hail badge above it, an ' +
      'inspection checklist card, a quote-request form, a location pin and review stars.',
  },
  {
    file: 'industries/home-services-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a home-services marketing strategy: a local map with a highlighted three-result ' +
      'map pack, a Google-business-style profile card with stars and hours, a seasonal demand ' +
      'curve with marked spikes, service badges for HVAC, plumbing and roofing.',
  },
  {
    file: 'industries/home-services-approach.webp',
    aspect: '4:3',
    prompt:
      'Running campaigns for a home-services company: a call-recording waveform being reviewed, ' +
      'a dispatch and booking calendar, a review-request message going out after a job, a ' +
      'budget dial being turned up ahead of a heat wave.',
  },
  {
    file: 'industries/home-services-market.webp',
    aspect: '4:3',
    prompt:
      'How homeowners choose a contractor: a homeowner holding a phone showing a local map with ' +
      'pins and a nearby contractor card with reviews, a clock signalling urgency, a house ' +
      'with a small problem icon (a drip, a spark, a leak).',
  },

  // ── New services (round 2) ────────────────────────────────────────────────
  {
    file: 'services/review-management.webp',
    aspect: '4:3',
    prompt:
      'A reputation dashboard mockup: a large average-rating number with five stars, a stream ' +
      'of incoming review cards, a reply being drafted to one of them, a small trend line ' +
      'rising, an outgoing review-request message.',
  },
  {
    file: 'services/review-management-process.webp',
    aspect: '4:3',
    prompt:
      'Review management as a loop: after a completed job, an automated request goes to the ' +
      'customer, a new star review comes back, the team replies, and the rating ticks up — ' +
      'shown as connected rounded nodes with a phone and a stars card.',
  },
  {
    file: 'services/creative.webp',
    aspect: '4:3',
    prompt:
      'A creative and video production dashboard mockup: a video timeline with clips, a play ' +
      'button, two ad-creative variants side by side for an A/B test, a captions toggle, a ' +
      'brand colour swatch row.',
  },
  {
    file: 'services/creative-process.webp',
    aspect: '4:3',
    prompt:
      'Creative production flow: raw footage on the left, an editing timeline in the middle, ' +
      'and finished outputs on the right — a vertical social clip on a phone, a testimonial ' +
      'thumbnail, and an ad banner — shown as connected rounded nodes.',
  },

  // ── Homepage ───────────────────────────────────────────────────────────────
  {
    file: 'home/process.webp',
    aspect: '4:3',
    prompt:
      'A marketing strategy journey: a winding path with three or four milestone markers ' +
      'leading to a large upward-trending line chart, a magnifying glass hovering over the ' +
      'path, small floating cards showing a bar chart and a checkmark.',
  },
  {
    file: 'home/difference.webp',
    aspect: '4:3',
    prompt:
      'The idea of specialisation over volume: five distinct labelled doorways or arched ' +
      'portals in a row, each a slightly different shape, one glowing amber, versus a single ' +
      'generic grey box off to the side. A small figure choosing the amber doorway.',
  },
  {
    file: 'home/reporting.webp',
    aspect: '4:3',
    prompt:
      'Reporting on booked work rather than impressions: a clean analytics dashboard panel ' +
      'where the hero metric is a ringing phone icon and a calendar with a booked appointment ' +
      'slot highlighted in amber, secondary small sparkline charts behind it.',
  },

  // ── About ──────────────────────────────────────────────────────────────────
  {
    file: 'about/story.webp',
    aspect: '4:3',
    prompt:
      'Two decades of steady growth: a horizontal timeline road with small year markers, a ' +
      'seedling growing into a leafy plant along it, a cluster of simple city buildings in ' +
      'the background, a rising arrow.',
  },
  {
    file: 'about/approach-strategy.webp',
    aspect: '1:1',
    prompt:
      'Strategic guidance: a navigational compass overlaid on a folded map with a dotted ' +
      'route line and a destination pin, a small magnifying glass.',
  },
  {
    file: 'about/approach-ownership.webp',
    aspect: '1:1',
    prompt:
      'You own every account: a ring of keys and a simple open vault door, small floating ' +
      'tiles representing an ad account, an analytics graph and a globe/domain, all inside ' +
      'the vault.',
  },
  {
    file: 'about/approach-honesty.webp',
    aspect: '1:1',
    prompt:
      'Saying no to the wrong channel: a signpost at a fork in the road, one arm pointing to ' +
      'a clear amber checkmark path, the other arm crossed out, a small figure pausing to ' +
      'read it.',
  },
  {
    file: 'about/process.webp',
    aspect: '4:3',
    prompt:
      'A five-step engagement flow shown as connected rounded nodes left to right: a ' +
      'magnifying-glass audit, a wrench fixing tracking, a stacked-blocks foundation, a ' +
      'compounding upward curve, and a report card with a phone icon.',
  },
  {
    file: 'about/industries.webp',
    aspect: '4:3',
    prompt:
      'Five specialisms as a tidy row of emblem tiles: a balance scale, a medical cross with ' +
      'a heartbeat line, a house with a location pin, a graduation cap, and a car — each in ' +
      'its own rounded tile, unified by the palette.',
  },

  // ── Industries: <slug>-approach + <slug>-market ────────────────────────────
  {
    file: 'industries/lawyers-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a law firm: a practice-area folder set, a call-recording ' +
      'waveform being reviewed, a shield with a checkmark for bar compliance, a campaign ' +
      'dashboard card with a rising line.',
  },
  {
    file: 'industries/lawyers-market.webp',
    aspect: '4:3',
    prompt:
      'How legal buyers decide: a person late at night with several browser tab shapes ' +
      'floating above a laptop, comparing attorney profile cards and star ratings, a clock ' +
      'showing urgency, a phone about to be dialled.',
  },
  {
    file: 'industries/medical-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a medical practice: a clinic reception desk with an appointment ' +
      'calendar, a privacy shield for HIPAA, a review-stars card, a phone showing a booked ' +
      'call.',
  },
  {
    file: 'industries/medical-market.webp',
    aspect: '4:3',
    prompt:
      'How patients choose a clinic: a patient holding a phone showing a local map with pins ' +
      'and a nearby clinic card, an insurance card shape, a heartbeat line, a location marker.',
  },
  {
    file: 'industries/real-estate-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a real-estate team: listing cards fanned out, a lead funnel ' +
      'narrowing into a CRM contact card, a neighbourhood map with pins, a rising price ' +
      'chart.',
  },
  {
    file: 'industries/real-estate-market.webp',
    aspect: '4:3',
    prompt:
      'How buyers and sellers search: a person browsing property listing cards on a phone, a ' +
      'front-yard "for sale" sign, a simple house with a location pin, a heart/save icon.',
  },
  {
    file: 'industries/education-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for a school: an admissions funnel from enquiry to enrolled student, ' +
      'a calendar marked with seasonal windows, a campus-tour walking route, program cards.',
  },
  {
    file: 'industries/education-market.webp',
    aspect: '4:3',
    prompt:
      'How families choose a school: a parent and a student looking together at a laptop ' +
      'showing program cards, a graduation cap, a financial-aid form shape, a campus building.',
  },
  {
    file: 'industries/automotive-approach.webp',
    aspect: '4:3',
    prompt:
      'Running marketing for an auto shop: a local map with a three-result map pack, a ' +
      'Google-business-style profile card, review stars, a phone ringing, a wrench and gear.',
  },
  {
    file: 'industries/automotive-market.webp',
    aspect: '4:3',
    prompt:
      'How drivers find a shop: a car with a small weather cloud above it (heat and a ' +
      'snowflake), a phone showing a local search result, a location pin, a calendar spike ' +
      'for seasonal demand.',
  },

  // Third industry illustration — the "strategy" row of the approach section.
  {
    file: 'industries/lawyers-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a law-firm marketing strategy: a set of labelled practice-area page ' +
      'cards arranged in a plan, a compliance shield with a checkmark, a route line ' +
      'connecting them to a rising results chart.',
  },
  {
    file: 'industries/medical-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a medical-practice marketing strategy: a Google-business-style profile ' +
      'card at the centre with service tags, review stars and a map pin, connected to a ' +
      'short booking flow ending in a calendar slot.',
  },
  {
    file: 'industries/real-estate-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a real-estate marketing strategy: neighbourhood map tiles feeding a ' +
      'lead funnel into an owned CRM contact list, with a follow-up sequence shown as ' +
      'connected message dots over time.',
  },
  {
    file: 'industries/education-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building a school marketing strategy: an annual calendar ring marked with ' +
      'seasonal admissions windows, a funnel from enquiry to booked tour to enrolled ' +
      'student, two small figures representing a parent and a student.',
  },
  {
    file: 'industries/automotive-strategy.webp',
    aspect: '4:3',
    prompt:
      'Building an auto-shop marketing strategy: a local map with a highlighted ' +
      'three-result map pack, specialisation badges (EV, diesel, European), and a ' +
      'seasonal demand curve with marked spikes.',
  },

  // ── Services: <slug>-process ──────────────────────────────────────────────
  {
    file: 'services/seo-process.webp',
    aspect: '4:3',
    prompt:
      'Local SEO compounding over time: a leafy plant growing out of a search bar, a ladder ' +
      'of rising ranking positions beside it, a Google-business-style profile card with ' +
      'stars, a steady upward curve.',
  },
  {
    file: 'services/google-ads-process.webp',
    aspect: '4:3',
    prompt:
      'Managing Google Ads: a search results page with the top ad slot highlighted amber, a ' +
      'bid-strategy dial, a conversion funnel ending in a phone call, negative-keyword ' +
      'filter shapes.',
  },
  {
    file: 'services/meta-ads-process.webp',
    aspect: '4:3',
    prompt:
      'Managing Meta ads: a phone showing a single sponsored post in a social feed, ' +
      'concentric audience-targeting rings, two creative variants side by side for an A/B ' +
      'test, a small results chart.',
  },
  {
    file: 'services/website-design-process.webp',
    aspect: '4:3',
    prompt:
      'Designing a website: a rough wireframe on the left resolving into a polished, fast ' +
      'website shown on both a phone and a desktop screen on the right, a speed gauge, a ' +
      'conversion button highlighted amber.',
  },
  {
    file: 'services/lead-generation-process.webp',
    aspect: '4:3',
    prompt:
      'Lead generation: a wide funnel at the top catching click and cursor shapes, narrowing ' +
      'down to a ringing phone and a booked-calendar card at the bottom, a couple of ' +
      'qualified-check badges.',
  },

  // ── Who We Serve ──────────────────────────────────────────────────────────
  {
    file: 'who-we-serve/hero.webp',
    aspect: '4:3',
    prompt:
      'Five industries, one method: five small emblem tiles (scale, medical cross, house, ' +
      'graduation cap, car) on the left, connected by converging lines into a single central ' +
      'upward-trending strategy chart on the right.',
  },

  // ── Page headers (round 7) — sit framed on the right of a dark PageHero ────
  {
    file: 'headers/about.webp',
    aspect: '4:3',
    prompt:
      'A strategic marketing consultant and a small-business owner side by side, both looking ' +
      'at a shared plan on a large screen that shows a clear upward growth path; a compass ' +
      'motif and a small handshake nearby, conveying guidance and partnership.',
  },
  {
    file: 'headers/who-we-serve.webp',
    aspect: '4:3',
    prompt:
      'Five industry emblems — a legal scale, a medical cross, a house with a key, a ' +
      'graduation cap, a car — arranged around a central shared "method" hub, each linked to ' +
      'the hub by its own distinct coloured line.',
  },
  {
    file: 'headers/locations.webp',
    aspect: '4:3',
    prompt:
      'A stylised United States map with glowing location pins on several metro markets, and ' +
      'a magnifying glass over one city revealing a local map-pack of three business results.',
  },
  {
    file: 'headers/services.webp',
    aspect: '4:3',
    prompt:
      'Connected marketing-channel tiles — a search bar, a highlighted paid-ad slot, a ' +
      'browser window, a review star, a video play button — all feeding into one central ' +
      'performance dashboard with an upward chart.',
  },
  {
    file: 'headers/case-studies.webp',
    aspect: '4:3',
    prompt:
      'A before-and-after split inside a case-study card: a flat, stalled line on the left ' +
      'and a compounding upward curve on the right, with small labelled milestone markers ' +
      'along the curve.',
  },
  {
    file: 'headers/pricing.webp',
    aspect: '4:3',
    prompt:
      'Three clean pricing cards of increasing height, each with a price tag and a short ' +
      'feature list, the middle card highlighted amber with a small star; a calculator and a ' +
      'magnifier resting beside them.',
  },
  {
    file: 'headers/contact.webp',
    aspect: '4:3',
    prompt:
      'A speech bubble containing a short contact form, next to a ringing phone, a map pin ' +
      'and a calendar with one slot booked in amber — the welcoming start of a conversation.',
  },
  {
    file: 'headers/resources.webp',
    aspect: '4:3',
    prompt:
      'An open guidebook with tabbed sections, surrounded by floating how-to cards — a ' +
      'checklist, a search result, a small bar chart, a lightbulb — suggesting a library of ' +
      'practical marketing guides.',
  },
];

function parseArgs(argv) {
  const args = { force: false, list: false, only: null, apiKey: null };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--force') args.force = true;
    else if (a === '--list') args.list = true;
    else if (a === '--only') args.only = argv[(i += 1)];
    else if (a === '--api-key') args.apiKey = argv[(i += 1)];
  }
  return args;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const args = parseArgs(process.argv);

  let manifest = MANIFEST;
  if (args.only) manifest = manifest.filter((e) => e.file.includes(args.only));

  if (args.list) {
    for (const e of manifest) console.log(`${e.aspect.padEnd(5)} ${e.file}`);
    console.log(`\n${manifest.length} images`);
    return;
  }

  const ai = new GoogleGenAI({ apiKey: resolveKey(args.apiKey) });
  let made = 0;
  let skipped = 0;
  const failures = [];

  for (const entry of manifest) {
    const outPath = join(OUT_DIR, entry.file);
    if (!args.force && (await exists(outPath))) {
      skipped += 1;
      console.log(`skip  ${entry.file}`);
      continue;
    }
    process.stdout.write(`gen   ${entry.file} … `);
    try {
      const webp = await generateImage(ai, { prompt: entry.prompt, aspect: entry.aspect });
      await mkdir(dirname(outPath), { recursive: true });
      await writeFile(outPath, webp);
      made += 1;
      console.log(`${(webp.length / 1024).toFixed(0)} KB`);
    } catch (err) {
      failures.push(entry.file);
      console.log(`FAILED — ${err.message}`);
    }
  }

  console.log(`\n${made} generated, ${skipped} skipped, ${failures.length} failed`);
  if (failures.length) {
    console.log('failed:', failures.join(', '));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

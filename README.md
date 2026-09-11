# ITZ Digital — Next.js rebuild

A modernised rebuild of [itzdigital.co](https://itzdigital.co) (WordPress + Elementor)
on Next.js 16 App Router, TypeScript and Tailwind CSS 3.4.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # 646 routes, fully static except the contact endpoint
npm run typecheck
npm run lint
```

**Tailwind 3.4, not 4.** v4 moves configuration into CSS (`@theme`) and drops
`tailwind.config.js` as the source of truth. The config file is an explicit
deliverable here and the `@tailwindcss/typography` plugin (used for the 595
migrated blog posts) is most stable on v3. Migrating later is mechanical —
the tokens in `tailwind.config.js` map 1:1 onto `@theme` variables.

`npm audit` reports **0 vulnerabilities**.

---

## 1. Brand palette

Extracted from the Elementor global kit in the WordPress export
(`_elementor_page_settings → system_colors`) and confirmed against the rendered
CSS on the live site.

| Role           | Hex       | Tailwind token                      | Where it's used                          |
| -------------- | --------- | ----------------------------------- | ---------------------------------------- |
| **Primary**    | `#00386C` | `navy-700` / `brand-primary`        | Headings, nav, dark sections, footer     |
| **Secondary**  | `#0974E4` | `blue-500` / `brand-secondary`      | Primary CTA, links, eyebrow labels       |
| **Accent**     | `#FBBB5B` | `amber-400` / `brand-accent`        | Icon strokes, marker underlines, dark CTA|
| **Background** | `#FFFFFF` | `white` / `surface`                 | Page canvas                              |
| **Surface**    | `#F4F6FB` | `surface-muted`                     | Alternating section bands                |
| **Text**       | `#0B1220` | `ink-950`                           | Body copy                                |

Each hue is expanded into a full 50–950 ramp in `tailwind.config.js` so contrast
pairs are pickable rather than guessed. Two deliberate departures from the
original:

- **Body text** moved from pure `#000000` to `ink-700` (`#3D4859`, 9.25:1 on
  white). Pure black on white vibrates at long reading lengths.
- **Secondary button text** moved from `blue-500` to `blue-600`. The original
  measured **4.54:1** — passing AA by 0.04. `blue-600` gives **6.43:1**.

### Measured contrast

| Pair                                   | Ratio      | Level |
| -------------------------------------- | ---------- | ----- |
| White on `blue-500` (CTA gradient start)| 4.54:1    | AA    |
| White on `blue-600` (CTA gradient end)  | 6.43:1    | AA    |
| `blue-600` on white (secondary button)  | 6.43:1    | AA    |
| `navy-700` on white (headings)          | 11.78:1   | AAA   |
| `ink-700` on white (body)               | 9.25:1    | AAA   |
| `navy-800` on `amber-400` (dark CTA)    | 8.09:1    | AAA   |
| White on `navy-800` (dark sections)     | 13.75:1   | AAA   |
| `navy-100` on `navy-800` (dark body)    | 10.75:1   | AAA   |

---

## 2. Typography

The live site licenses two commercial faces, neither on Google Fonts:

| Original            | Used for                          | Google Fonts substitute |
| ------------------- | --------------------------------- | ----------------------- |
| **Greycliff CF**    | Headings + body (Light→Heavy)     | **Figtree** (300–900)   |
| **Verveine**        | Handwritten eyebrows & flourishes | **Caveat** (500–700)    |

**Why Figtree:** Greycliff CF is a geometric humanist with a double-storey `a`,
tall x-height and softly rounded terminals. Figtree matches all three and ships
as a variable font covering the full Light→Heavy range the original uses.
(Poppins — the usual reflex — has a single-storey `a` and reads noticeably
rounder.) **Why Caveat:** Verveine is a casual marker pen with an irregular
baseline; Caveat is the closest free match at the sizes used here.

Both are self-hosted by `next/font/google` at build time — no render-blocking
request to `fonts.googleapis.com` and no layout shift.

### Scale

Display sizes are fluid (`clamp()`), so there is no jump between a 390px phone
and a 1440px desktop:

| Token          | Range           | Use                        |
| -------------- | --------------- | -------------------------- |
| `display-xl`   | 40 → 72px       | Homepage H1                |
| `display-lg`   | 34 → 56px       | Inner page H1              |
| `display-md`   | 28 → 44px       | Section H2                 |
| `display-sm`   | 24 → 32px       | Sub-section H3             |
| `body-lg`      | 18px / 1.7      | Intro paragraphs           |
| `eyebrow`      | 13px / 0.12em   | Uppercase labels           |

Helper classes in `globals.css`: `.eyebrow-script` (Caveat), `.eyebrow-caps`,
`.marker-underline` (amber stroke under a word).

---

## 3. Visual polish changes

| Area | Original | Now |
| ---- | -------- | --- |
| Section rhythm | ~60px | 72px mobile / 120px desktop (`section-y`) |
| Tap targets | 32–40px common | Every control ≥48px, verified by script |
| CTA contrast | `blue-500` text at 4.54:1 | `blue-600` at 6.43:1; gradient-filled primary |
| Hero CTA | One button | Primary + secondary, so non-ready visitors don't bounce |
| Focus states | Suppressed by theme reset | Visible 2px ring everywhere, amber on dark |
| Client logos | Fixed 4-up, squeezed to ~60px on mobile | Responsive 2/3/4-up grid |
| Mobile nav | Sub-industry pages unreachable | Full accordion drawer exposing all 22 |
| Shadows | Neutral grey | Blue-tinted, so they read as lift on `#F4F6FB` |
| Motion | — | Honours `prefers-reduced-motion` |

### 3a. Refresh pass (bolder visual language)

Same structure, palette and fonts — a more assertive treatment on top of the
existing system. All new component props are optional, so every prior call site
still works.

| Area | Change |
| ---- | ------ |
| Display type | `display-xl` up to ~76px; new `display-2xl` for the homepage H1; tighter tracking; new `body-xl` |
| Backgrounds | `gradient-mesh` / `gradient-mesh-dark` soft colour pools behind heroes, Stats, CTA, Footer (`.mesh` / `.mesh-dark` in `globals.css`) |
| Utilities | `.text-gradient` (navy→blue clip), `.glass` (frosted panel), `.accent-orb` (standardised drifting blur), `.hairline-divider` |
| Buttons | New `xl` size; primary carries `shadow-glow` and a hover lift; ghost gets a faint rest fill |
| Cards | `rounded-[1.75rem]`, deeper `shadow-card-lg`, a gradient hairline that fades in on hover |
| Header | Persistent frosted glass, not only after scroll |
| Section rhythm | ~10% more vertical space (`section` 5rem / `section-lg` 8.5rem); container caps at 1312–1376px |

New shared components: `sections/FeatureRows` (alternating image/text rows),
`sections/ProcessTimeline` + `ProcessSection` (numbered vertical timeline —
replaces the inline `STEPS` array in the sub-industry page), `sections/SignalGrid`
("how we know it's working" cards), `ui/PullQuote`.

---

## 4. Structure

```
src/
  app/
    layout.tsx              root layout — fonts, metadata, JSON-LD, header/footer
    page.tsx                homepage
    globals.css             Tailwind layers + design-system helpers
    [industry]/             /lawyers, /medical, /real-estate, /education, /automotive
      [sub]/                /lawyers/personal-injury, … (22 pages)
    services/[slug]/        9 service pages
    who-we-serve/  about-us/  case-studies/  contact/  terms-conditions/
    blog/  blog/[slug]/      595 migrated posts
    api/contact/route.ts    form endpoint (needs a transport — see below)
    sitemap.ts  robots.ts  not-found.tsx
  components/
    layout/   Header, MobileNav, Footer, Logo
    ui/       Button, Section, Card, PageHero, PostCard
    sections/ Hero, ClientLogos, ServicesGrid, Stats, IndustriesGrid,
              Mission, Testimonials, CtaBanner, ContactForm
  lib/        site, nav, services, industries, case-studies, posts, cn
  content/    posts-index.json + posts/*.json (imported from WordPress)
public/       520 KB total — logos, favicons, hero, client logos, icons
```

### URL preservation

Every original WordPress path is preserved so rankings and backlinks survive:
`/lawyers/personal-injury`, `/services/seo`, `/medical/dentists`, `/blog/<slug>`.
The service segment is `[service]` (renamed from `[slug]` so the nested
`[city]` route could sit under it) — public URLs are unchanged.
The flat duplicates WordPress accumulated (`/dentists`, `/auto-repair`, …) 301
to their nested canonical in `next.config.mjs`.

---

## 5. Content migration

`scripts/import-wordpress.mjs` converts a WXR export into JSON:

```bash
node scripts/import-wordpress.mjs ../itzdigital.WordPress.2026-08-18.xml
```

595 published posts → `src/content/posts/*.json` (6.6 MB of text).

### Post images

Post images live in the repo at `public/images/blog/<post-slug>.webp` — no
external host, no env var. Three scripts build them, in order, and all are
idempotent (safe to re-run after a fresh import):

| Script | What it does |
| --- | --- |
| `migrate-post-images.mjs <uploads-dir>` | Copies each post's inline `<img>` out of the old `wp-content/uploads` tree and rewrites the `<img src>` to `/images/blog/<slug>.webp`. |
| `derive-post-images.mjs [uploads-dir] [--no-fuzzy]` | Promotes that inline image to the **featured image**, stripping the now-duplicate `<figure>` from the body. Posts with no inline image are fuzzy-matched against the uploads tree by title (skip with `--no-fuzzy`); the rest are queued in `scripts/.post-images-generate.json`, with `scripts/.post-images-report.json` scoring every match. The old WordPress featured images turned out to be inconsistent photo renders (some with garbled text or fabricated stat overlays), so the current build runs with `--no-fuzzy` and generates all 177. |
| `generate-blog-images.mjs --api-key <KEY>` | Generates an on-brand flat-vector illustration for each still-queued post (prompt built from title + primary category). |

The featured image is kept in `src/content/post-images.json` (`slug → { image,
alt }`), merged into every post by `src/lib/posts.ts` — *not* in the post JSON or
the generated index, so a re-import can't clobber it. It drives the post hero,
the `PostCard` thumbnail, `og:image` and the `Article` schema.

`NEXT_PUBLIC_MEDIA_BASE` (default `https://itzdigital.co/wp-content/uploads`) is
still honoured by `getPost()` for any *future* import that leaves a
`${MEDIA_BASE}` token in its content; none of the current posts use it.

### Page-header art

`public/images/headers/*.webp` — one illustration per text-only `PageHero`
page (Pricing, About, Services, …), generated by
`scripts/generate-images.mjs --only headers`. The Gemini + `sharp` pipeline
shared by both generators lives in `scripts/lib/image-gen.mjs`.

---

## 6. Programmatic geo-landing pages

`/services/[service]/[city]` — 6 pages from 2 services x 3 cities in the mock
dataset.

### Dataset

```
src/lib/geo/
  types.ts                 interfaces only
  cities.json              3 cities (Denver, Austin, Phoenix)
  service-locations.json   6 service x city records
  index.ts                 typed loader + lookups + build-time validation
```

The JSON is validated against the interfaces on import, so a malformed record
**fails `next build`** rather than shipping a broken page or invalid structured
data. Guards cover: kebab-case slugs, coordinate ranges, exactly 3 stats,
>= 2 FAQs (Google's FAQPage minimum), unknown service/city slugs, duplicate
service x city pairs, and unattributed review data.

Pairs with no content record 404 — `dynamicParams = false`. Falling back to
generic copy would produce exactly the thin doorway pages Google penalises.

### Structured data

One `@graph` per page, nodes cross-referenced by `@id`:

| Node | `@id` | Notes |
| ---- | ----- | ----- |
| `WebPage` | `#webpage` | Links breadcrumb + primary entity |
| `BreadcrumbList` | `#breadcrumb` | Home > Services > Service > City |
| `ProfessionalService` | `#localbusiness` | `areaServed` + `GeoCircle serviceArea`, real HQ address, `parentOrganization` -> site org |
| `Service` | `#service` | `hasOfferCatalog` built from the service's deliverables |
| `FAQPage` | `#faq` | Mirrors the on-page accordion exactly |

**No fabricated location data.** The business operates from Casper, WY, so each
city node carries the real `address` plus `areaServed`/`serviceArea` rather
than an invented per-city street address.

**No fabricated ratings.** `aggregateRating` is emitted only when a city has
`reviews` with a `ratingValue`, `reviewCount`, `source` and `lastVerified`.
Every city in the mock has `reviews: null`, so no rating renders. Repeating the
site-wide 4.9 across every generated city page is the pattern Google issues
manual actions for. The loader rejects a rating with no `source` at build time.

> Note: the root layout still emits a site-wide org node carrying the 4.9 / 500
> rating on *every* page, including these. That is an organisation-level claim
> on the organisation entity rather than a per-city one, but if you want geo
> pages to carry no rating signal at all, that node needs scoping too.

### Page layout

Hero (`Top-Rated [Service] in [City], [State]` + stat band + dual CTA) ->
localized trust (`Serving [City] and surrounding neighborhoods`, neighborhood
and drive-time chips, city-specific factors) -> what's included / process ->
FAQ accordion -> internal links to sibling cities and services -> CTA banner,
plus a sticky mobile CTA bar.

- **`FaqAccordion`** implements the ARIA disclosure pattern (`aria-expanded` +
  `aria-controls`, panels as labelled `region`s). Collapsed answers stay in the
  DOM via `hidden` rather than being unmounted, which is what keeps the
  FAQPage markup valid — verified: all 5 JSON-LD Q&As match the rendered DOM.
- **`StickyCtaBar`** appears past 560px of scroll so it never competes with the
  hero CTA, is mobile-only, respects `env(safe-area-inset-bottom)`, and adds
  body padding so it cannot cover the footer.

### Adding a city

1. Append to `cities.json`.
2. Add one `service-locations.json` record per service you want a page for.
3. `npm run build` — routes, sitemap entries and the "by city" links on
   `/services/[service]` all pick it up automatically.

Write genuinely local content. Six strong pages beat six hundred templated ones.

## 7. Generating new content

`scripts/generate-daily-content.mjs` calls Claude and writes new posts or
geo-landing records straight into the content directories.

### 1. Get an API key

Pick a provider and export its key. You only need one.

| Provider | Env var | Where to get it |
| --- | --- | --- |
| Claude (default) | `ANTHROPIC_API_KEY` | <https://console.anthropic.com/settings/keys> |
| Gemini | `GEMINI_API_KEY` | <https://aistudio.google.com/apikey> |

```bash
export GEMINI_API_KEY=AIza...            # or ANTHROPIC_API_KEY=sk-ant-...
```

For anything beyond a one-off run, put it in `.env.local` (already gitignored)
or your CI secrets rather than your shell history.

Check what your key can actually reach — model IDs change, and a stale one is
the most common failure:

```bash
npm run generate:content -- --provider gemini --list-models
```

### 2. Fill in the spreadsheet

Start from **`scripts/content-queue.template.xlsx`** — open it in Excel, Numbers
or Google Sheets. It has two tabs: `Content Queue` to fill in, and a `README` tab
documenting every column. Save it anywhere; you pass the path in.

| Column | Required | Meaning |
| --- | --- | --- |
| `Type` | no (defaults to `post`) | `post` = blog article, `geo` = service+city landing page |
| `Topic Name` | **yes** | `post`: the target keyword. `geo`: the service slug (`seo`, `google-ads`, …) |
| `Location` | geo rows only | City slug that exists in `src/lib/geo/cities.json` (`denver`, `austin`, `phoenix`) |
| `Category` | no | Blog category label |
| `Notes` | no | Editor's brief passed straight into the prompt — steer the angle, emphasis, what to avoid |

**Column names are matched loosely.** Case, spaces, hyphens and underscores are
ignored, and each field accepts aliases (`Topic Name` / `Keyword` / `Title` /
`Subject` all work; `Location` / `City` / `Market` / `Metro` all work). Any extra
columns — Owner, Status, Due Date — are ignored, so keep your own workflow
columns in the same sheet. Full alias list is in `COLUMN_ALIASES` at the top of
the script.

`.csv` works too; the format is identical.

### 3. Run it

```bash
# Always dry-run first: generates and validates, writes nothing, prints the JSON
npm run generate:content -- --input content-queue.xlsx --dry-run

# Then for real, a few rows at a time
npm run generate:content -- --input content-queue.xlsx --limit 3

# With Gemini instead
npm run generate:content -- --input content-queue.xlsx --provider gemini --limit 3

npm run build                            # validates + generates the routes
```

| Flag | Default | |
| --- | --- | --- |
| `--input <file>` | — | `.xlsx` or `.csv` (required) |
| `--sheet <name>` | first usable tab | Which worksheet to read |
| `--provider` | `claude` | `claude` or `gemini` |
| `--model <id>` | per provider | Override the default model |
| `--effort` | `medium` | Claude only: `low`–`max` |
| `--limit N` | 5 | Rows this run |
| `--concurrency N` | 2 | Parallel generations |
| `--dry-run` | off | Generate + validate, write nothing |
| `--force` | off | Overwrite an existing slug / service+city pair |
| `--list-models` | — | Print reachable models and exit |

Where the output lands:

| type | Output |
| ---- | ------ |
| `post` | `src/content/posts/<slug>.json` **+** an entry in `posts-index.json` |
| `geo` | a record merged into `src/lib/geo/service-locations.json` |

### Provider notes

Both are asked for **schema-constrained JSON** — Claude via
`output_config.format`, Gemini via `responseJsonSchema` + `responseMimeType` — so
neither path needs regex extraction or a `JSON.parse` retry loop. The SDKs are
imported dynamically, so a Gemini run never loads the Anthropic client.

Claude adds a prompt-cache breakpoint on the system prompt, so a batch pays one
cache write and N−1 reads; the per-row log shows `cached` tokens. Gemini has no
equivalent here, so its `cached` column reads 0.

### Why those destinations

The spec for this script asked for `/content/posts/<slug>.json` and
`/content/geo/<slug>.json`. Neither is how this site loads content:

- **`posts-index.json` is not optional.** `src/lib/posts.ts` reads `allPosts`
  from it, and `blog/[slug]` sets `dynamicParams = false` — a post file with no
  index entry gets **no route generated** and 404s. The script writes both.
- **There is no per-slug geo directory.** `src/lib/geo/index.ts` statically
  imports `service-locations.json`; a `content/geo/*.json` file would be inert.
  Records are merged into that file instead, which also keeps them under the
  existing build-time validation.

### Guarantees

- **Valid JSON, always.** The response is constrained by `output_config.format`
  (structured outputs) at the API layer — no regex extraction, no `JSON.parse`
  retry loop. `src/lib/content-schemas.mjs` holds the schemas and re-checks
  locally for the things JSON Schema can't express (word count, exact array
  lengths, slug shape, `<h1>` leakage).
- **Bad content never ships.** A row that fails validation is skipped with a
  reason and the run exits non-zero. Generated geo records are validated *again*
  at build time by `assertServiceLocation`, so a malformed record fails
  `npm run build` rather than reaching production.
- **Idempotent.** Existing slugs and service×city pairs are skipped unless
  `--force`.
- **No fabricated data.** The system prompt forbids invented statistics, client
  names, testimonials and review counts. Nothing the script writes can produce
  an `aggregateRating` — consistent with the policy in section 6.

### Structured data

Posts now go through `buildArticleGraph()` in `src/lib/schema.ts` (`WebPage` +
`BreadcrumbList` + `Article`, plus `FAQPage` when the post has FAQs), replacing
the inline `BlogPosting` object the blog page used to build. Every page's JSON-LD
now derives from `site.ts` through the same builders. Post FAQs render through
the same `FaqAccordion` as the geo pages, so the markup and the visible content
cannot drift.

### Model configuration

`claude-opus-5`, streaming (`max_tokens: 32000` — a 1,300-word article plus
thinking exceeds the non-streaming timeout threshold), `output_config.effort`
as the cost lever, and a `cache_control` breakpoint on the system prompt so a
batch of N rows pays one cache write and N−1 reads. No `temperature`/`top_p`
(rejected on this model); thinking is left at its default (on).

### Scheduling

The script is a one-shot batch — no scheduler built in. Example crontab and
GitHub Actions snippets are in the script header. Prefer opening a PR rather
than committing generated content straight to the default branch.

## 8. Imagery and motion

### Image library

37 images curated from the WordPress uploads (1.4 GB → **1.48 MB** as WebP),
under `public/images/`:

| Set | Source family | Used by |
| --- | --- | --- |
| `industries/<slug>.webp` | Transparent person composites — blue circles, dot fields, floating UI cards, same language as the homepage hero | Industry page split heroes |
| `industries/<industry>-<sub>.webp` | Near-square photography, cropped 4:3 | Sub-industry heroes + specialisation cards |
| `services/<slug>.webp` | Transparent device mockups — dashboards, SERPs, phone sites | Service page heroes |

Composites keep their alpha and render `object-contain`; photographs render
`object-cover`. Device mockups are bleed-cropped in the source, so on desktop
they run toward the viewport edge (`lg:-mr-[6vw]`) — the crop then reads as
intentional.

### Generated illustrations

The refresh added ~30 flat-vector illustrations (navy/blue/amber on a solid
white background — they sit in white `ring-1` framed cards) for the new
long-form sections:

| Set | Used by |
| --- | --- |
| `home/{process,difference,reporting}.webp` | Homepage "Why teams switch to us" rows |
| `about/{story,approach-*,process,industries}.webp` | About page story + approach rows |
| `industries/<slug>-{strategy,approach,market}.webp` | Industry "How we run … campaigns" rows |
| `services/<slug>-process.webp` | Service page expanded intro (5 primary services) |
| `who-we-serve/hero.webp` | Who We Serve intro |

```bash
npm run generate:images -- --api-key <GEMINI_KEY>   # or GEMINI_API_KEY
npm run generate:images -- --only industries --force # regenerate a subset
npm run generate:images -- --list                   # print the manifest
```

`scripts/generate-images.mjs` calls `gemini-2.5-flash-image`, then flattens onto
white and re-encodes to WebP with `sharp` (~15–40 KB each). The prompt asks for a
solid white background explicitly — asking the model for a *transparent*
background makes it paint the grey transparency-checkerboard pattern into the
pixels. Idempotent: existing files are skipped unless `--force`. The key is read
from the flag or the environment only, never written to disk.

### Template identities

Each template now has its own layout so no two page types read the same:

| Template | Hero | Body |
| --- | --- | --- |
| Home | Collage + drifting wash | Marquee logos, count-up stats |
| Industry | Light split, composite + floating stat card | Photo cards per specialisation |
| Sub-industry | Dark full-bleed photo band | Problem column vs. vertical fix timeline |
| Service | Dark split, device mockup bleeding off-edge | Numbered engagement steps |
| Geo | Stat band (unchanged) | Neighbourhood chips, FAQ accordion |
| Case study | Split photo hero (**new** — detail pages didn't exist) | Client/channel panel + prose |

### Motion

One client controller — `src/components/motion/ScrollFx.tsx` — drives
everything from data attributes, so pages stay server components:

```tsx
<div data-reveal>                          fade + rise, once
<li data-reveal data-reveal-delay={i}>     stagger, 60ms per step
<div data-reveal="left|right|scale">       directional variants
<span data-count="38" data-count-suffix="%">  count up on scroll into view
```

Plus a CSS-only `<Marquee>` for the logo strip, `.drift` for ambient hero
glows, and `.media-zoom` for hover.

Two safeguards worth knowing about:

- **No-JS safety.** The pre-reveal hidden state is scoped to `html.js`, set by
  an inline script in `<head>`. If JS never runs, nothing is ever hidden — the
  page renders normally rather than blank.
- **`prefers-reduced-motion`** switches off every reveal, marquee, drift and
  zoom, and the count-up renders its final value immediately. Verified: 17/17
  reveal elements at `opacity: 1` under reduced motion.

### Two layout bugs fixed along the way

- **`overflow-x: clip` on `html`.** The `translateX(24px)` starting state of a
  right-entering reveal created a 4px horizontal scrollbar at 1024px before the
  element animated in. `clip` (not `hidden`) suppresses it without creating a
  scroll container, which would have broken the sticky header.
- **Container gutters.** `theme.container.padding` keys resolve against
  `theme.container.screens`; overriding `screens` to just `2xl` silently
  dropped the sm/lg/xl padding steps, so every breakpoint had been using the
  20px default. Tailwind's container plugin is now disabled and `.container` is
  defined by hand in `globals.css` — gutters step 20 → 28 → 40 → 48px and the
  container caps at 1280px.

## 9. On-page content and FAQs

Every template carries substantially more copy than the first pass. Word counts
of rendered visible text:

| Page | Words |
| --- | --- |
| `/about-us` | ~1,740 |
| `/lawyers` (industry) | ~1,045 |
| `/services/seo` | ~1,035 |
| `/services/seo/denver` (geo) | ~1,030 |
| `/medical/dentists` (sub-industry) | ~835 |

### New data fields

| Field | On | Renders as |
| --- | --- | --- |
| `context` | industries, sub-industries | `ContextBlock` — prose section on how buyers in that market decide |
| `perks` | industries | `PerksBand` — checked list in a tinted panel |
| `whoItsFor` + `notFor` | services | `PerksBand`, with the "and who it isn't" caveat called out |
| `faqs` | industries, sub-industries, services | `FaqSection` + `FAQPage` schema |

The refresh added a second, deeper layer of copy, kept in dedicated
augment files so the validated core structures stay small:

| File | Fields | Renders as |
| --- | --- | --- |
| `src/lib/home-content.ts` | `differenceRows`, `howWeWork`, `faqs` | Homepage `FeatureRows` + `ProcessSection` + `FaqSection` |
| `src/lib/industry-content.ts` | `industryExtras[slug]` — `approach`, `expandedContext`, `signals`, `channelNotes`; `subIndustryExtras[slug]` — `expandedContext`, `checklist` | Industry `FeatureRows` / `SignalGrid` / longer `ContextBlock`; sub-industry checklist band |
| `src/lib/service-content.ts` | `serviceExtras[slug]` — `expandedSummary`, `process`, `commonMistakes`, `outcomes` | Service expanded intro, `ProcessSection`, mistakes grid, `SignalGrid` |
| `src/lib/about-content.ts` | added `approach`, `process`, `workingWith`, `results`, `industriesIntro` | About `FeatureRows`, `ProcessSection`, "who you work with", `SignalGrid` |

Every extra record is keyed by slug and rendered only when present, so a page
with no augment record falls back to exactly its previous layout.

`src/lib/about-content.ts` holds the About page copy. FAQ questions 1–6 there are
the **exact questions from the live WordPress About page**; the answers were
written for this rebuild (questions 7–8 were added for the refresh).

All of it was drafted under the same house rules as the generator prompt — no
invented statistics, percentages, dollar figures, review counts or client names.
Where a number would have helped, the copy explains what drives it instead.

### Testimonials

Now a proper carousel with **two verbatim quotes** — Bill Patterson (Denton
Record-Chronicle) and Judi Lessard (Flathead Beacon Productions). Both are real,
from the live site. `TestimonialCarousel` keeps every slide in the DOM (inert ones
`hidden`) so quotes stay crawlable, has no autoplay, and supports arrow keys.
Add entries only with a client's actual words.

### One CSS fix this surfaced

`[hidden] { display: none !important }` in `globals.css`. The `hidden` attribute
gets its `display: none` from the UA stylesheet, which **any** author-level
display utility beats — so a `<figure hidden className="grid">` stayed visible
and the carousel showed both slides at once. Same trap would hit any `hidden`
element with a `flex`/`grid` class.

## 10. Architecture round 2 (Home Services, Locations, Pricing, Case Studies)

A second pass brought the IA in line with `ITZ_Website_Architecture_Internal_Linking.pptx`
and a set of design mockups. Mockup *content* was adopted; the site's own design
system was kept (the mockups' Archivo / `#1c5fd6` styling was not used).

| Change | Where |
| --- | --- |
| **Home Services** — 6th industry (HVAC / Plumbing / Roofing) | `src/lib/industries.ts` (`icon: 'Wrench'`, new union member), `src/lib/industry-content.ts`; icon maps in `[industry]/page.tsx`, `IndustriesGrid.tsx`, `who-we-serve/page.tsx`; industry grids widened to 6-up |
| **Review Management** + **Creative & Video** — 2 new services | `src/lib/services.ts`, `src/lib/service-content.ts`, hand-authored `public/images/icons/{review-management,creative}.svg`, nav "What We Do" is now a 5-column mega-menu |
| **Pricing page** (`/pricing`) | `src/lib/pricing-content.ts` (owner's own ranges — not invented), `src/components/sections/PricingTiers.tsx`, `src/app/pricing/page.tsx` |
| **Locations** (`/locations`, `/locations/[city]`) | `src/lib/locations.ts` (`hubCopy`, `servicesForCity`, `activeLocations`), two new route files. City hubs give the existing `/services/[service]/[city]` geo pages a way in from the nav. Dallas + Tampa added to `cities.json` with **verifiable facts only** (`reviews: null`) — they get a hub but no `<service> in <city>` pages until real localized content exists. |
| **Case Studies** → template layout | `src/lib/case-studies.ts` gains optional `challenge` / `strategy` / `results` / `faqs` / `metrics`; `[slug]/page.tsx` renders Challenge / Strategy / Results + a shared FAQ (`caseStudyFaqs`). The metrics band renders **only** when a study has real `metrics` — none do yet, so the "results on request" callout still shows. |
| **Homepage** | Who We Serve moved above What We Do; a "results that compound" prose block and a `BlogTeaser` (3 most-recent posts, `src/components/sections/BlogTeaser.tsx`) added. |
| **Navigation** | `mainNav` is now Who We Serve · What We Do · Pricing · Locations · Resources · Company. Contact moved into the Company dropdown (the "Get a Free Quote" CTA already points there); this keeps the bar to one line down to 1024px. |
| **Killed the smooth scroll** | `scroll-behavior: smooth` removed from `html` in `globals.css` — it made every route change visibly animate a scroll-to-top. Anchor jumps are now instant. |

Round-2 images (11) were generated with the same `scripts/generate-images.mjs` white-bg
prompt: `industries/home-services*` and `services/{review-management,creative}*`.

## 11. Still to do before launch

1. **Contact form transport — wired, needs the Resend key.**
   `src/app/api/contact/route.ts` now sends two emails per submission via Resend
   (`src/lib/email.ts` — REST, no SDK; `src/lib/email-templates.ts` — the HTML):
   an internal notification to `CONTACT_NOTIFY_TO` (`production@itzontarget.com`,
   `reply_to` the enquirer) and a branded confirmation to the enquirer. Delivery
   never blocks the response — a provider failure is logged and the form still
   returns `{ ok: true }`. **To go live:** add the `itzdigital.co` domain in
   Resend, add its DNS records, create an API key, and set `RESEND_API_KEY` (see
   `.env.example`). The `from` is `info@itzdigital.co`. Email logo is
   `public/logo/itz-digital-email-white.png` (rendered from the SVG); it loads
   from `EMAIL_ASSET_BASE || site.url`.
2. **Case study bodies.** Titles and slugs in `src/lib/case-studies.ts` are the
   real ones from the export, but the bodies live in Elementor/ACF fields the XML
   does not carry. Summaries there are neutral and contain **no invented
   metrics** — migrate the real numbers from the live pages.
3. **Terms & Conditions.** Placeholder copy; replace with the reviewed legal text.
4. **Testimonials.** Only one verbatim quote (Bill Patterson) survived the export.
   The section features it rather than padding the row with invented quotes.
5. **Case study imagery is illustrative.** There is no photography of the actual
   engagements, so each study is assigned a distinct stock image from the
   industry library — the water park is represented by a generic consultation
   photo, for instance. Swap these for real campaign assets when available.
   A build-time guard in `lib/case-studies.ts` fails if two studies share an
   image (that shipped once).
6. **Social URLs** in `src/lib/site.ts` are assumed patterns — confirm them.
7. **Content Studio (`/admin`) — built, needs three things set before your
   colleague can use it.** See §12 for the full picture; in short:
   `ADMIN_USERNAME`/`ADMIN_PASSWORD` (Vercel env vars — gates `/admin` itself),
   `GITHUB_API_TOKEN`/`GITHUB_REPO` (Vercel env vars — lets the deployed app
   read/write this repo), and `ANTHROPIC_API_KEY` or `GEMINI_API_KEY` as
   **GitHub Actions repository secrets** (different from the same-named Vercel
   var in §7 — that copy runs the CLI locally, this one runs the workflow that
   actually writes content). `INDEXNOW_KEY` is optional.

## 12. Content Studio — the `/admin` daily workflow

A web front end for §7's script, so a non-technical colleague can create
posts and location pages without touching a terminal, a spreadsheet column
name, or an API key. They fill in a short list or upload a sheet; everything
else — the writing, the validation, the featured image, the sitemap entry —
happens on its own. Nothing goes live until someone clicks **Approve &
publish**.

```
colleague fills in /admin/new
        │  (upload a .csv/.xlsx, or the built-in row table)
        ▼
POST /api/admin/generate            commits the sheet to
        │                           content-queue/incoming/, then
        ▼                           dispatches the workflow below
.github/workflows/daily-content.yml
        │  runs scripts/generate-daily-content.mjs (§7, unchanged)
        │  runs scripts/derive-post-images.mjs + generate-blog-images.mjs
        │  runs `npm run build` as a validation gate — a bad row fails here,
        │    before anything is offered for review
        ▼
opens a PR, labeled `automated-content`
        │
        ▼
colleague reviews at /admin/review — every post renders through the exact
same PostPage component the live site uses, fed from the PR branch; geo
pages show a structured summary (headline, stats, FAQs)
        │
        ▼  Approve & publish                      Send back
        ▼  (Server Action → merges the PR)         (closes the PR, optional reason)
Vercel deploys the merge → live in ~2 minutes
        │
        ▼
.github/workflows/indexnow-ping.yml → pings Bing/Yandex for the new URLs.
sitemap.xml already includes them (src/app/sitemap.ts reads posts-index.json
and service-locations.json at build time — nothing to do). For Google, the
/admin dashboard links each recent post straight to Search Console's
"Request indexing" — there is no public push API for ordinary pages.
```

### What "posts and pages" means here

The pipeline only knows the two content shapes §7 already validates:

| Row type | Produces | Lives at |
| --- | --- | --- |
| **Blog post** | `src/content/posts/<slug>.json` + a `posts-index.json` entry | `/<slug>` |
| **Location page** | a record merged into `src/lib/geo/service-locations.json` | `/services/<service>/<city>` |

There is no generic third "page" type — every other page on the site (each
service, each industry, `/pricing`, `/locations`, …) is a hand-built template
reading from its own `src/lib/*.ts` file, not something a sheet of rows can
safely generate. If a genuinely new page type is needed later, it needs its
own template and schema, the same way Home Services or Review Management were
added — see §10.

### Setup (one time)

1. **A GitHub token for the deployed app.** Create a **fine-grained Personal
   Access Token** at <https://github.com/settings/tokens> scoped to just this
   repository, with **Contents**, **Pull requests** and **Actions** set to
   *Read and write*. In Vercel → Settings → Environment Variables, add:
   - `GITHUB_API_TOKEN` — the token
   - `GITHUB_REPO` — `production-wq/itz-website`
   - `GITHUB_BASE_BRANCH` — whatever branch is actually set as **Production**
     in Vercel right now (this repo is currently on `redesign-refresh` —
     confirm that's still current before relying on this)

   This is a *different* credential from the `GITHUB_TOKEN` GitHub injects
   automatically inside an Actions run — that one needs no setup.

2. **Admin login.** In Vercel, set `ADMIN_USERNAME` and `ADMIN_PASSWORD` (any
   values you choose). `/admin` is gated behind these with plain HTTP Basic
   Auth — the browser's own prompt, no account system to build or lose access
   to. Without them set, `/admin` refuses every request rather than sit open.
   Share the two values with your colleague directly (not over email).

3. **A writer key, as a GitHub *Actions secret* — not a Vercel env var.**
   Repo → Settings → Secrets and variables → Actions → New repository secret:
   `ANTHROPIC_API_KEY` (recommended) or `GEMINI_API_KEY`. This is what the
   `daily-content.yml` workflow uses to actually write each post — it runs
   inside GitHub Actions, not on Vercel, so setting the Vercel copy from §7
   does not cover it. This was the exact failure mode that broke the contact
   form's emails earlier (right key, wrong place) — see the git history on
   `src/lib/email.ts` if that story is useful context.

4. **(Optional) IndexNow.** A key is already generated and published at
   `public/51480d415fc51d69b3d02e0f4f46bd8f.txt`. Add
   `INDEXNOW_KEY=51480d415fc51d69b3d02e0f4f46bd8f` as a GitHub Actions
   repository secret to turn on the Bing/Yandex ping in step 4 of the diagram
   above. Skip this and everything else still works — it only affects how
   fast Bing/Yandex notice, never Google.

5. **Confirm the workflow's schedule matches what you want.** `daily-content.yml`
   also runs itself on a weekday cron against `content-queue/queue.csv`, if
   that file exists — a second, standing way to queue work besides the
   `/admin/new` upload. If you only want on-demand runs from `/admin`, delete
   the `schedule:` block at the top of that file.

### Day to day (what your colleague actually does)

1. Go to `/admin/new`.
2. Either fill in the row table (topic + category per blog post; service +
   city per location page) or upload a `.csv`/`.xlsx` — same column format as
   §7, `type,keyword,city,category,angle`, headings matched loosely.
3. Pick a writer (Claude or Gemini) and click **Generate & send for review**.
   The page shows live progress and a link to the run log.
4. A few minutes later, go to `/admin/review`. Open the batch, read each post
   exactly as it will look live, and either **Approve & publish** or **Send
   back** with a note.
5. That's it — sitemap, IndexNow and the build are automatic. For a post that
   needs to rank *today* rather than whenever Google gets to it, use the
   "Request Google indexing" link on the `/admin` dashboard.

### Files

| File | Role |
| --- | --- |
| `src/proxy.ts` | HTTP Basic Auth on `/admin*` and `/api/admin*` (Next.js 16 renamed `middleware.ts` → `proxy.ts`) |
| `src/lib/admin/github.ts` | REST client — files, branches, workflow dispatch, pull requests |
| `src/lib/admin/drafts.ts` | Reads a post or geo record off a PR branch instead of the local filesystem |
| `src/app/admin/*` | Dashboard, new-batch form, review queue, draft preview |
| `src/app/api/admin/*` | Upload → commit → dispatch; run-status polling |
| `.github/workflows/daily-content.yml` | Runs §7's script, generates images, builds, opens the PR |
| `.github/workflows/indexnow-ping.yml` | Pings Bing/Yandex after a merge touches a post or geo record |
| `scripts/ping-indexnow.mjs` | The IndexNow call, diffing the last commit for changed URLs |

`src/app/[slug]/PostPage.tsx` now accepts an optional pre-loaded `post` prop
(instead of always reading one by slug off disk) so the draft-preview route
can feed it a post fetched straight from a PR branch — the live route's
behavior (`getPost(slug)`) is unchanged.

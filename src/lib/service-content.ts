/**
 * Expanded, template-driven copy for the service pages.
 *
 * Kept separate from `services.ts` so the core structure there stays small.
 * Keyed by service slug; the template renders each block when the record exists.
 *
 * House rules: no invented statistics, percentages, dollar figures, client
 * names or review counts. Where a number would help, explain what drives it.
 */

export type ServiceExtra = {
  /** Two or three intro paragraphs shown under the "What's included" block. */
  expandedSummary: string[];
  /** The engagement, as a numbered timeline. */
  process: { phase: string; body: string }[];
  /** What goes wrong when this channel is run badly. */
  commonMistakes: { title: string; body: string }[];
  /** Leading indicators — rendered as a SignalGrid. */
  outcomes: { label: string; body: string }[];
};

export const serviceExtras: Record<string, ServiceExtra> = {
  seo: {
    expandedSummary: [
      'SEO is the one channel that keeps paying after the invoice clears. A paid campaign stops producing the day the card is declined; a clean site, a complete Google Business Profile and a page structure that matches real search demand keep pulling in clicks month after month. That is why cost per lead usually falls over the first two quarters — organic traffic starts doing the work paid clicks used to.',
      'It is also slow, and anyone who tells you otherwise is selling something. Technical fixes and Business Profile work land fastest. Content and links compound over months. We treat the first 90 days as foundation work — getting tracking right, fixing what caps everything above it — and judge the account on booked calls and forms, not on a rankings screenshot.',
    ],
    process: [
      { phase: 'Weeks 1–2', body: 'Technical and content audit, keyword and competitor map, and a fix list ordered by impact. Conversion tracking gets verified or rebuilt first.' },
      { phase: 'Weeks 3–6', body: 'On-page rebuild — titles, headings, internal links, schema — plus Google Business Profile and citation cleanup. The fastest-moving levers first.' },
      { phase: 'Months 2–4', body: 'Page architecture built around real search demand: one strong page per service and location worth ranking for, and a review-generation workflow.' },
      { phase: 'Ongoing', body: 'Content that answers buyer questions, ethical link acquisition, and monthly reporting led by calls and forms rather than rankings alone.' },
    ],
    commonMistakes: [
      { title: 'Optimising against broken tracking', body: 'Most accounts we inherit have double-counted or missing conversions. Every "improvement" made before that is fixed is a guess.' },
      { title: 'One page trying to rank for everything', body: 'A single "Services" page cannot outrank competitors who built a dedicated page per service. Depth beats breadth in local search.' },
      { title: 'Chasing rankings instead of revenue', body: 'Position one for a term nobody searches is worthless. We map keywords to intent and buying value, not just volume.' },
    ],
    outcomes: [
      { label: 'Cost per lead trends down', body: 'As organic rankings climb, the blended cost per lead falls because free traffic takes on work that paid clicks were doing.' },
      { label: 'Non-brand organic calls grow', body: 'Calls and forms from people who found you without searching your name — the clearest sign the foundation is working.' },
      { label: 'Map-pack visibility improves', body: 'Where you sit in the local three-pack for your core services, tracked over time. Movement here usually precedes call volume.' },
      { label: 'Traffic that survives an ad pause', body: 'The point of SEO: turn off paid for a week and the phone still rings, because the organic asset is doing its job.' },
    ],
  },

  'ai-seo-company': {
    expandedSummary: [
      'Buyers increasingly ask an assistant before they open a search results page. Answer Engine Optimisation structures your content and your entity data so ChatGPT, Gemini and AI Overviews quote you rather than a competitor when someone asks for your service in your city.',
      'It overlaps heavily with classic SEO — most of the technical foundation is shared — but the target differs. Classic SEO chases a position in a list of links. Answer engine work aims to be the source a model trusts and cites, which rewards clear definitions, structured data, consistent entity signals and content shaped like a direct answer.',
    ],
    process: [
      { phase: 'Week 1', body: 'Answer audit: what the major assistants currently say when someone asks for your service in your market, and which sources they pull from.' },
      { phase: 'Weeks 2–4', body: 'Entity cleanup — consistent naming, schema and third-party signals so models resolve your business to one confident entity.' },
      { phase: 'Months 2–3', body: 'Citable content: pages written in the format assistants extract from, with defined terms, sourced data and direct answers.' },
      { phase: 'Ongoing', body: 'Monthly checks on which assistants name you and for which prompts, plus content that closes the gaps against currently-cited sources.' },
    ],
    commonMistakes: [
      { title: 'Treating it as a separate program', body: 'Run in isolation it duplicates cost. It belongs alongside SEO, sharing the same technical and entity foundation.' },
      { title: 'Expecting instant results', body: 'Assistants that use live search update in weeks; models leaning on training data can lag past a year. This is a slow signal.' },
      { title: 'Buying "guaranteed AI placement"', body: 'Nobody can force an assistant to recommend you. Anyone selling a guarantee is describing something that does not exist.' },
    ],
    outcomes: [
      { label: 'Assistant citations for your service', body: 'How often the major assistants name you when asked for your service in your city, tracked prompt by prompt.' },
      { label: 'Cleaner entity resolution', body: 'One consistent business identity across the web, so models stop confusing you with a similarly-named competitor.' },
      { label: 'Answer-shaped content coverage', body: 'The share of buyer questions in your category where your page is structured to be the quotable answer.' },
      { label: 'Referral traffic from AI surfaces', body: 'Visits arriving from AI Overviews and assistant links — small today, growing, and worth instrumenting now.' },
    ],
  },

  'website-services': {
    expandedSummary: [
      'A care plan keeps a site you are broadly happy with fast, patched and backed up, so small edits do not sit for weeks and a plugin update does not take the site down. It is maintenance, not a rebuild.',
      'It is the wrong spend if your site is years old, painful to edit and converting badly. Paying monthly to maintain a page that does not generate calls is money spent preserving the problem. In that case, rebuild first.',
    ],
    process: [
      { phase: 'Week 1', body: 'Full audit: hosting, performance, security posture, backup status, plugin and dependency health, and a list of the edits already queued.' },
      { phase: 'Weeks 2–3', body: 'Stabilise — move to solid hosting if needed, fix the Core Web Vitals issues, set up monitoring and off-site backups.' },
      { phase: 'Ongoing', body: 'Scheduled updates and testing, a fixed monthly allowance of content and design edits, and uptime and performance monitoring.' },
      { phase: 'Quarterly', body: 'A review of what the site is being asked to do and whether a care plan is still the right call or a rebuild would pay for itself.' },
    ],
    commonMistakes: [
      { title: 'No off-site backups', body: 'A backup on the same server as the site is not a backup. The first time you need it is the first time you find out.' },
      { title: 'Maintaining a site that should be replaced', body: 'If edits are slow and conversion is poor, a care plan just keeps a weak asset alive. Rebuild, then maintain.' },
      { title: 'Ad spend pointed at a slow site', body: 'Paying per click to send mobile visitors to a page that takes six seconds to load is an expensive way to lose them.' },
    ],
    outcomes: [
      { label: 'Edits ship in days, not weeks', body: 'A fixed monthly allowance and a known point of contact, so routine changes stop being a project.' },
      { label: 'Core Web Vitals in the green', body: 'Load performance that does not drag down rankings or bounce mobile visitors before the page renders.' },
      { label: 'Recoverable in an incident', body: 'Tested off-site backups and a documented restore path, so a bad update is an inconvenience rather than a crisis.' },
      { label: 'No surprise downtime', body: 'Monitoring that catches an expired certificate or a failed update before a customer does.' },
    ],
  },

  'website-design': {
    expandedSummary: [
      'A marketing website has one job: turn the visitor a campaign paid for into a call or a form. We design around that — the questions a buyer needs answered, the proof that reassures them, and the shortest credible path to contact — then build it fast and keep it that way.',
      'This is not a brand-agency exercise in art direction. It is a conversion tool that also happens to look current. Every page earns its place by moving someone closer to booking, and the structure is built so SEO and paid campaigns have somewhere good to land.',
    ],
    process: [
      { phase: 'Weeks 1–2', body: 'Discovery: who buys, what they need to know, what stops them, and which pages the paid and organic plans need. Sitemap and wireframes.' },
      { phase: 'Weeks 3–5', body: 'Design of the key templates — home, service, location, contact — reviewed against real content, not lorem ipsum.' },
      { phase: 'Weeks 6–8', body: 'Build on a fast, maintainable stack, with tracking, schema and accessibility baked in rather than bolted on.' },
      { phase: 'Launch', body: 'Redirect mapping so existing rankings survive, QA across devices, and a staged cutover. Then a care plan keeps it fast.' },
    ],
    commonMistakes: [
      { title: 'Designing before the content exists', body: 'Templates built around placeholder text break the moment real copy arrives. Content and design have to move together.' },
      { title: 'Losing rankings at launch', body: 'A rebuild without a redirect map throws away years of SEO overnight. This is the most common and most expensive launch mistake.' },
      { title: 'Beautiful and slow', body: 'Heavy hero videos and animation libraries that look great on the designer’s laptop and cost you the mobile visitor.' },
    ],
    outcomes: [
      { label: 'Higher conversion rate', body: 'More of the traffic you already pay for turns into calls and forms, because the page answers objections instead of just describing services.' },
      { label: 'Rankings survive the move', body: 'A redirect map and clean migration mean organic traffic holds through launch rather than cratering.' },
      { label: 'Fast on a phone', body: 'The site loads quickly on the mid-range Android a real customer is holding, not just on office wifi.' },
      { label: 'A base campaigns can use', body: 'Service and location pages structured so SEO and paid have strong, relevant places to send traffic.' },
    ],
  },

  'ppc-management': {
    expandedSummary: [
      'Paid search is the fast lane: on an existing account, a well-scoped campaign can be producing calls within about a week. The catch is that it stops the day you stop funding it, and a poorly managed account quietly wastes a large share of the budget on the wrong searches.',
      'Management is mostly discipline: weekly search-term review, negative keyword hygiene, landing-page and offer testing, and bid strategy matched to how much conversion data the account actually has. We report on cost per booked job, not cost per click.',
    ],
    process: [
      { phase: 'Week 1', body: 'Account audit or build: conversion tracking verified, wasted spend identified, campaign structure mapped to the jobs you want.' },
      { phase: 'Weeks 2–4', body: 'Launch or restructure, tighten targeting, and let the bidding gather roughly a month of conversion data before it steadies.' },
      { phase: 'Monthly', body: 'Search-term review, negative keyword updates, ad and landing-page testing, and budget moved toward the campaigns producing booked work.' },
      { phase: 'Quarterly', body: 'A step back: is paid still the right share of the mix, or has the organic work matured enough to shift budget?' },
    ],
    commonMistakes: [
      { title: 'Ignoring the search-terms report', body: 'Without weekly review, the account bleeds budget on irrelevant and out-of-area searches that a negative keyword would have stopped.' },
      { title: 'Nudging campaigns daily', body: 'Every material edit resets the learning period. Small changes should be batched into a weekly release, not made on impulse.' },
      { title: 'Sending every click to the homepage', body: 'A campaign about one service should land on a page about that service, with the matching offer and a short path to contact.' },
    ],
    outcomes: [
      { label: 'Cost per booked job', body: 'The headline number: what it actually costs to win a customer, not what it costs to buy a click.' },
      { label: 'Wasted spend shrinking', body: 'The share of budget going to irrelevant search terms should fall month over month as the negative list matures.' },
      { label: 'Steadier performance', body: 'Once bidding has a month of clean conversion data, cost per lead stops swinging week to week.' },
      { label: 'Faster pipeline than organic', body: 'Calls within weeks while the slower SEO work compounds underneath — paid covers the gap.' },
    ],
  },

  'google-ads': {
    expandedSummary: [
      'Google Ads puts you at the top of the results for a search someone is making right now. Intent is high and so is the price — in competitive local categories a single click can cost more than a month of hosting — which makes account discipline the difference between a channel that pays and one that just spends.',
      'The work is unglamorous and constant: match types and negative keywords kept clean, ad copy and extensions tested, landing pages aligned to the query, and bid strategy chosen for the amount of conversion data the account has. We judge it on booked jobs.',
    ],
    process: [
      { phase: 'Week 1', body: 'Audit or build. Conversion tracking and call tracking verified first, then campaign and ad-group structure mapped to your services.' },
      { phase: 'Weeks 2–4', body: 'Launch with tight targeting and manual oversight while the account gathers the conversion data automated bidding needs.' },
      { phase: 'Monthly', body: 'Search-term mining, negative keywords, ad and extension testing, landing-page iteration, and budget reallocation toward what converts.' },
      { phase: 'Ongoing', body: 'Watch for competitor bid shifts, seasonal demand and Local Services Ads eligibility where it applies to your category.' },
    ],
    commonMistakes: [
      { title: 'Broad match with no negatives', body: 'Broad match without a maintained negative list is how an account spends a week’s budget on searches that were never going to convert.' },
      { title: 'Letting Smart campaigns run unmonitored', body: 'Automated campaign types hide the search terms. Convenient, and expensive, when nobody checks what they are actually buying.' },
      { title: 'No call tracking', body: 'In categories where most conversions are phone calls, an account without call tracking is optimising on half the data.' },
    ],
    outcomes: [
      { label: 'Cost per booked job', body: 'What a customer actually costs through the channel, tracked through calls and forms rather than clicks.' },
      { label: 'Impression share on core terms', body: 'How often you show for the searches that matter, so you can see whether budget or quality is the constraint.' },
      { label: 'Higher-quality calls', body: 'Tighter targeting and better negatives mean a larger share of the calls you pay for are actually in-scope work.' },
      { label: 'Quick read on offer and targeting', body: 'Within two to four weeks the account tells you whether the offer and audience are right, well before SEO could.' },
    ],
  },

  'meta-ads': {
    expandedSummary: [
      'Meta ads — Facebook and Instagram — reach people who are not searching yet. That makes them strong for demand generation, retargeting and visually-driven services, and weaker for capturing someone with an urgent, right-now need. Used for the right job they are one of the cheapest ways to stay in front of a market.',
      'Creative is the lever. On Meta the audience is broad and the algorithm is good, so the ad itself — the hook, the image or video, the offer — does most of the work. We run a steady test of variants rather than setting one ad and hoping.',
    ],
    process: [
      { phase: 'Week 1', body: 'Pixel and conversions API check, audience mapping, and a first creative slate built around your actual services and offers.' },
      { phase: 'Weeks 2–4', body: 'Launch with a small number of clean tests, let each ad set gather enough conversion data to judge, then cut and scale.' },
      { phase: 'Monthly', body: 'New creative on a schedule to fight fatigue, retargeting kept current, and budget moved to the audiences and formats that convert.' },
      { phase: 'Ongoing', body: 'Landing-page testing, offer iteration, and coordination with search so the two channels are not fighting over the same click.' },
    ],
    commonMistakes: [
      { title: 'One ad, set and forget', body: 'Meta creative fatigues fast. Without a pipeline of new variants, cost per result climbs week after week.' },
      { title: 'Editing inside the learning phase', body: 'Changing budget or targeting before an ad set has enough conversions restarts learning and wastes the spend so far.' },
      { title: 'Using it for urgent-need services', body: 'Someone with a burst pipe is on Google, not scrolling Instagram. Meta is for demand you build, not demand that already exists.' },
    ],
    outcomes: [
      { label: 'Cost per lead by audience', body: 'Which audiences and creative angles actually produce inquiries, so spend concentrates where it works.' },
      { label: 'Retargeting recovery', body: 'Visitors who did not convert the first time, brought back by a relevant follow-up ad rather than lost.' },
      { label: 'Creative that keeps working', body: 'A tested library of hooks and formats, refreshed on a schedule so results do not decay.' },
      { label: 'Top-of-funnel awareness', body: 'Steady, affordable presence in a market so your name is familiar by the time someone is ready to buy.' },
    ],
  },

  'programmatic-ads': {
    expandedSummary: [
      'Programmatic advertising places your ads across the screens your buyers already use — connected TV, streaming audio, apps, news sites, digital billboards — bought through automated exchanges with audience and location targeting layered on top. It is how a local business gets the reach that used to require a TV or radio buy, without the minimums.',
      'It is a reach and awareness channel, billed on delivered impressions, and it needs longer lead times because inventory is booked ahead. Underdelivery shows up as unspent budget, not a charge, and usually means the audience was drawn too tight — a signal worth acting on.',
    ],
    process: [
      { phase: 'Weeks 1–2', body: 'Audience and geography definition, channel mix, creative specs, and flight planning against available inventory.' },
      { phase: 'Weeks 3–4', body: 'Creative production or adaptation for each format, tracking and brand-safety setup, and flight booking.' },
      { phase: 'In flight', body: 'Pacing monitored against the schedule. If a flight tracks behind, you get the choice: extend, widen targeting, or take the budget back.' },
      { phase: 'Post-flight', body: 'Delivery, reach and frequency reporting, plus lift in branded search and direct traffic as the read on awareness.' },
    ],
    commonMistakes: [
      { title: 'Judging it on click-through rate', body: 'Programmatic display is an awareness buy. CTR is a vanity metric here; branded search lift and assisted conversions are the read.' },
      { title: 'Audiences drawn too tight', body: 'Over-narrow targeting causes underdelivery. Some breadth is necessary for the channel to spend and to reach.' },
      { title: 'No frequency cap', body: 'Without a cap, a small audience sees the same ad dozens of times — wasted impressions and brand fatigue.' },
    ],
    outcomes: [
      { label: 'Reach and frequency delivered', body: 'How many people in your target area saw the ads and how often, against the plan.' },
      { label: 'Branded search lift', body: 'An increase in people searching your name during and after a flight — the clearest proof awareness moved.' },
      { label: 'Assisted conversions', body: 'Conversions where a programmatic impression was an early touch, visible once multi-touch attribution is set up.' },
      { label: 'Budget you keep if it underdelivers', body: 'Billing on delivered impressions means an underperforming flight returns money rather than charging for nothing.' },
    ],
  },

  'social-media-ads': {
    expandedSummary: [
      'Beyond Meta, paid social spans TikTok, LinkedIn, Pinterest, YouTube, Snapchat and Reddit — each with a different audience, ad format and cost profile. The job is matching the platform to the buyer: LinkedIn for professional services and B2B, TikTok and Pinterest for visual and consumer, YouTube for consideration-stage video.',
      'Most small businesses do not need more than one or two of these. Spreading a modest budget across five platforms produces five underpowered campaigns. We pick where your buyers actually are and run that well.',
    ],
    process: [
      { phase: 'Week 1', body: 'Platform selection based on where your buyers spend time and which formats suit your service, plus tracking setup.' },
      { phase: 'Weeks 2–4', body: 'Creative built to each platform’s native format, launched as clean tests with enough budget to reach statistical signal.' },
      { phase: 'Monthly', body: 'Creative refresh, audience iteration, and a hard look at whether each active platform is earning its share of the budget.' },
      { phase: 'Quarterly', body: 'Re-evaluate the platform mix as your offer, audience and the platforms themselves change.' },
    ],
    commonMistakes: [
      { title: 'Being on every platform at once', body: 'A small budget split six ways is six campaigns that never reach the volume needed to learn anything.' },
      { title: 'Reposting the same creative everywhere', body: 'A Meta static ad dropped into TikTok reads as an ad and gets skipped. Each platform needs native creative.' },
      { title: 'Wrong platform for the buyer', body: 'Running LinkedIn ads for a consumer service, or TikTok for a niche B2B tool, burns budget on the wrong room.' },
    ],
    outcomes: [
      { label: 'Cost per lead by platform', body: 'A clear read on which platform actually produces business, so the budget can consolidate.' },
      { label: 'Native creative that performs', body: 'Ads built for each platform’s format, which the feed rewards with cheaper reach.' },
      { label: 'A focused, not scattered, spend', body: 'One or two platforms run properly instead of five run thinly.' },
      { label: 'Audience insight you keep', body: 'What you learn about who responds and to what message informs every other channel.' },
    ],
  },

  'lead-generation': {
    expandedSummary: [
      'Lead generation is the whole path treated as one system: the channels that create demand, the pages that capture it, the tracking that proves where it came from, and the follow-up that turns a form fill into a booked job. Run as separate pieces by separate vendors, the handoffs are where leads leak.',
      'The number we manage to is cost per booked job, and the biggest lever is usually not the ad spend — it is speed to first contact and the second and third follow-up attempts that most businesses never make.',
    ],
    process: [
      { phase: 'Weeks 1–2', body: 'Map the current funnel end to end, find the leaks — dead tracking, slow callbacks, forms going to an unwatched inbox — and fix those first.' },
      { phase: 'Weeks 3–6', body: 'Stand up the capture and routing: landing pages, call tracking, CRM or inbox routing, and an automated follow-up sequence.' },
      { phase: 'Months 2–3', body: 'Turn on the demand channels — search, social, or both — feeding the now-instrumented funnel, and tune against booked jobs.' },
      { phase: 'Ongoing', body: 'Weekly review of lead source, response time and close rate, with budget and follow-up scripts adjusted to what converts.' },
    ],
    commonMistakes: [
      { title: 'No follow-up past the first attempt', body: 'Most booked work comes from the second or third contact. A single "we tried them once" call throws away paid leads.' },
      { title: 'Leads landing in an unwatched inbox', body: 'A form that emails an address nobody checks after 5pm is a lead-generation system that generates competitors’ customers.' },
      { title: 'No source attribution at intake', body: 'If staff do not capture where each lead came from, you cannot tell which channel to fund and which to cut.' },
    ],
    outcomes: [
      { label: 'Cost per booked job', body: 'The one number the system is managed to — what it costs to put a real, scheduled job on the calendar.' },
      { label: 'Faster speed to lead', body: 'Time from inquiry to first live contact, measured and shortened, because it is the single biggest driver of close rate.' },
      { label: 'Every lead attributed', body: 'A source on every inquiry, so budget follows what actually books work instead of what looks busy.' },
      { label: 'Fewer leaks', body: 'The gaps between ad, page, CRM and callback closed, so the leads you already pay for stop falling through them.' },
    ],
  },

  'review-management': {
    expandedSummary: [
      'A review profile does two jobs at once: it is a ranking signal for the map pack, and it is the single most-read thing on your listing before someone calls. Recent, specific, well-answered reviews move both — which is why a rating a few tenths higher than the competitor next door is worth real money in a local category.',
      'The work is unglamorous and continuous. Ask every customer, at the moment they are most satisfied, in one tap. Watch every platform daily. Reply to everything — the calm, specific public response to a bad review is often read by more future customers than the review itself. Never gate, never incentivise, never fake it: those get profiles suspended.',
    ],
    process: [
      { phase: 'Week 1', body: 'Audit the current profile across every platform your buyers use, benchmark against the three competitors in your map pack, and find where the review flow is breaking.' },
      { phase: 'Weeks 2–3', body: 'Wire one-tap review requests into your CRM or field-service software, write the messages by customer type, and set the send timing.' },
      { phase: 'Ongoing', body: 'Daily monitoring with same-day alerts, a drafted public response to every review within a day, and removal requests filed for anything that breaks platform policy.' },
      { phase: 'Monthly', body: 'Report on rating trend, review velocity and response time, alongside the map-pack movement that follows.' },
    ],
    commonMistakes: [
      { title: 'Review gating', body: 'Screening customers so only happy ones reach the public form violates Google policy and risks the whole profile. Ask everyone.' },
      { title: 'Ignoring or arguing with negatives', body: 'An unanswered one-star, or a defensive reply, is read by every future prospect. A calm, specific response converts better than a flawless rating.' },
      { title: 'Bursts, not cadence', body: 'A pile of reviews in one week followed by six months of silence reads as inauthentic and does nothing for ranking. Steady is what compounds.' },
    ],
    outcomes: [
      { label: 'Rating trend', body: 'The average climbing as recent positive reviews outweigh older ones — the signal the map pack and every prospect both read.' },
      { label: 'Review velocity', body: 'A steady number of new reviews every month rather than occasional bursts, which is what actually moves ranking.' },
      { label: 'Response time', body: 'Every review answered within a day. Google weights it, and prospects notice whether you engage.' },
      { label: 'Map-pack position', body: 'Movement in the local three-pack for your core services, which review strength directly feeds.' },
    ],
  },

  creative: {
    expandedSummary: [
      'On paid social the audience is broad and the algorithm is good, so the ad itself does most of the work — the hook, the first two seconds, the format. That also means creative fatigues fast: the same three images across every audience is why a healthy account needs a pipeline of new variants every month, not one polished hero video.',
      'Most of what we produce is editing, not shooting: cutting a testimonial down to the line that lands, turning one long job-site video into a month of vertical clips, and building the ad variants that a proper test needs. In our core metros we can arrange a shoot; everywhere else we direct a simple self-shoot and edit from there.',
    ],
    process: [
      { phase: 'Week 1', body: 'Audit what is running, flag what has fatigued, and map the gaps against what each active campaign is asking for. Set light brand guidelines if none exist.' },
      { phase: 'Weeks 2–3', body: 'Shoot brief or self-shoot guide, then the first slate: a testimonial reel, a service explainer, and an initial set of ad variants to test.' },
      { phase: 'Monthly', body: 'A steady output of new social clips and ad variants — multiple hooks, formats and lengths — cut from ongoing footage and delivered on schedule.' },
      { phase: 'Ongoing', body: 'Review which hooks and formats won, and feed that into the next round.' },
    ],
    commonMistakes: [
      { title: 'One hero video, set and forget', body: 'A single expensive edit fatigues in weeks. Paid social rewards volume and variety, not production value.' },
      { title: 'Reposting the same cut everywhere', body: 'A horizontal ad dropped into Reels or TikTok reads as an ad and gets skipped. Each platform needs a native aspect ratio and pacing.' },
      { title: 'Polished but generic', body: 'Stock footage of smiling strangers underperforms a slightly rough clip of your actual team on an actual job, every time.' },
    ],
    outcomes: [
      { label: 'Creative that keeps working', body: 'A tested library of hooks and formats, refreshed on a schedule so cost per result does not climb week over week.' },
      { label: 'Lower cost per result', body: 'Native, well-hooked creative earns cheaper reach from the platforms and holds attention longer.' },
      { label: 'A content library you own', body: 'Every clip, edit and template delivered to you in every ratio and length, reusable across organic and the site.' },
      { label: 'Faster testing', body: 'Enough variants in rotation that the account can actually learn which message works, rather than guessing.' },
    ],
  },

  'cold-outreach': {
    expandedSummary: [
      'Inbound channels wait for someone to search or scroll into an ad. Outreach goes and finds the specific companies and people who fit your buyer profile, whether or not they are actively looking yet — which is the only way to reach a market that rarely searches for what you sell, or to hit a growth number inbound alone will not cover on its own timeline.',
      'It only works when the list is right. A perfectly written sequence sent to the wrong companies still fails, and a rough one sent to the right fifty people can book real meetings. We spend real time on the buyer definition and the list before a single call or email goes out, because that decision matters more than any script.',
    ],
    process: [
      { phase: 'Week 1', body: 'Define the buyer profile precisely, build and verify the prospect list, and set the qualification criteria for what counts as a real meeting.' },
      { phase: 'Week 2', body: 'Write the calling script and email sequence, set up sending infrastructure, and launch against a small test segment.' },
      { phase: 'Weeks 3–4', body: 'Full sequence live across the list. Early responses reviewed to see which angle is landing, and the sequence adjusted.' },
      { phase: 'Ongoing', body: 'Continued outreach against a refreshed list, with weekly reporting on touches, responses and meetings booked.' },
    ],
    commonMistakes: [
      { title: 'A broad list instead of a precise one', body: 'Casting wide feels like more opportunity but produces lower response rates and wastes every touch on people who were never going to buy.' },
      { title: 'One channel, one attempt', body: 'A single cold email or a single unanswered call is not a real test of interest. Most replies come from the second or third coordinated touch.' },
      { title: 'No plan for the reply', body: 'A campaign that generates interest with nobody ready to follow up within a day loses the momentum that got that reply in the first place.' },
    ],
    outcomes: [
      { label: 'Qualified meetings booked', body: 'The number that actually matters — meetings with people who match your buyer profile, not a raw count of replies.' },
      { label: 'Response rate by segment', body: 'Which part of your target list is actually responding, so future outreach spends more time where it is working.' },
      { label: 'A reusable, verified list', body: 'A prospect list built once and kept current, rather than rebuilt from scratch on the next push.' },
      { label: 'A sequence that keeps improving', body: 'Scripts and copy refined from real response data, not written once and left unchanged.' },
    ],
  },

  'cold-calling': {
    expandedSummary: [
      'A phone call is still the fastest way to have a real, two-way conversation with someone who has never heard of you — it just has to be a conversation, not a script read at them. The work is in the list, the script, and a real process for the contacts who do not pick up the first time, since most connections happen on the second or third attempt, not the first.',
      'We track connect rate and qualified-conversation rate separately from raw dial count, because a caller who makes two hundred calls and books nothing is not succeeding by any measure that matters to you. The goal every day is conversations with the right person, not activity for its own sake.',
    ],
    process: [
      { phase: 'Week 1', body: 'Script and objection-handling built from your actual pitch, call list prepared, qualification criteria agreed.' },
      { phase: 'Week 2', body: 'Calling begins against a test segment of the list, with recordings reviewed to refine the script and approach.' },
      { phase: 'Weeks 3+', body: 'Full calling cadence against the list, with a defined multi-attempt process for voicemail and gatekeepers.' },
      { phase: 'Ongoing', body: 'Weekly reporting on connect rate and qualified conversations, with script adjustments based on what is actually landing.' },
    ],
    commonMistakes: [
      { title: 'One attempt, then moving on', body: 'Most contacts do not answer the first call. Without a defined follow-up cadence, the list is being wasted after a single ring.' },
      { title: 'A script read verbatim', body: 'Prospects can hear when a call is a script rather than a conversation. The best callers know the material well enough to actually listen and respond.' },
      { title: 'No qualification standard', body: 'Counting every "sure, send me something" as a win floods your pipeline with contacts who were never really interested.' },
    ],
    outcomes: [
      { label: 'Connect rate', body: 'How many attempted calls reach a real person, tracked so we know whether the list or the calling times need adjusting.' },
      { label: 'Qualified conversations', body: 'Calls that met your actual qualification bar, not just a call that lasted more than thirty seconds.' },
      { label: 'Same-day handoffs', body: 'Interested, qualified prospects reaching your team the same day, with context, while the interest is still fresh.' },
      { label: 'A script that improves', body: 'Objection handling and pitch language refined from real call outcomes, not written once and left static.' },
    ],
  },

  'cold-email': {
    expandedSummary: [
      'Cold email fails for one of two reasons almost every time: it never reaches the inbox, or it reaches the inbox and reads like it was sent to ten thousand people at once. We treat both as separate problems that need separate fixes — proper domain setup and warm-up before volume, and copy specific enough to one recipient that it does not read like a template with a name swapped in.',
      'The sequence matters as much as any single email. A prospect who ignores the first message might respond to the third, if the third actually adds something new rather than repeating the same pitch with more urgency in the subject line.',
    ],
    process: [
      { phase: 'Week 1', body: 'Domain authentication set up (SPF, DKIM, DMARC), sending mailbox warmed up, list built and verified.' },
      { phase: 'Week 2', body: 'Sequence written — three to five emails with a distinct angle each — and sent to a small test segment to check deliverability and response.' },
      { phase: 'Weeks 3+', body: 'Full sequence live across the verified list, sending volume ramped gradually to protect domain reputation.' },
      { phase: 'Ongoing', body: 'Weekly reporting on open, reply and meeting-booked rate by segment, with copy refined from what is actually getting replies.' },
    ],
    commonMistakes: [
      { title: 'Sending before the domain is ready', body: 'A cold domain sending high volume on day one gets flagged by spam filters before the copy is ever a factor. Warm-up is not optional.' },
      { title: 'A generic template with a merge field', body: 'Recipients can tell the difference between a name dropped into a template and an email that actually references something true about them.' },
      { title: 'One email, repeated with more urgency', body: 'Resending the same pitch with "just following up" rarely works. Each email in a real sequence needs its own reason to exist.' },
    ],
    outcomes: [
      { label: 'Inbox placement', body: 'Whether the sequence is actually landing in the inbox rather than spam — checked directly, not assumed from open rate alone.' },
      { label: 'Reply rate by segment', body: 'Which part of the list and which email angle is getting responses, so the next sequence spends less time on what does not work.' },
      { label: 'Meetings booked', body: 'The number that actually matters, tracked separately from replies — a reply that never becomes a meeting is not yet a result.' },
      { label: 'Domain reputation held', body: 'Sending practices that keep your domain healthy for outreach next quarter, not just this campaign.' },
    ],
  },

  'social-media-management': {
    expandedSummary: [
      'An abandoned social profile is worse than no profile — a prospect who finds a business page with no post in eight months reasonably wonders if the business is still operating. Organic social is not usually a lead-volume channel on its own; its job is making a business look active and credible to the people who check before they call, and building familiarity over months that pays off when they are ready to buy.',
      'Consistency matters more than production value here. A steady cadence of honest, real-business content — a finished job, a team photo, a quick tip — outperforms a burst of polished posts followed by silence. We plan a calendar around what your business actually has to show, rather than inventing content that does not reflect the work.',
    ],
    process: [
      { phase: 'Week 1', body: 'Audit existing profiles, agree which platforms actually matter for your customers, and set the content pillars and posting cadence.' },
      { phase: 'Weeks 2–3', body: 'First content calendar built and reviewed with you, first batch of posts produced from your own material.' },
      { phase: 'Monthly', body: 'Consistent publishing on schedule, plus a content calendar reviewed with you in batches ahead of time.' },
      { phase: 'Ongoing', body: 'Monthly reporting on reach, engagement and profile growth, with the content mix adjusted based on what actually performs.' },
    ],
    commonMistakes: [
      { title: 'Posting in bursts, then going quiet', body: 'A month of daily posts followed by three months of silence reads worse than infrequent but consistent posting.' },
      { title: 'Generic stock content', body: 'Stock photos and borrowed quotes do less for trust than an honest photo of your actual team or a finished job.' },
      { title: 'No plan for comments and DMs', body: 'A profile that posts but never responds to a comment or message looks unattended, which undercuts the credibility the posting was meant to build.' },
    ],
    outcomes: [
      { label: 'Consistent posting cadence', body: 'A profile that looks active to anyone checking, on a schedule that does not lapse.' },
      { label: 'Engagement trending up', body: 'Comments, shares and saves growing as the content finds what your specific audience responds to.' },
      { label: 'Profile growth', body: 'Followers and reach expanding over months — the slow-building asset organic social actually is.' },
      { label: 'Genuine leads routed fast', body: 'Real inquiries that come through comments or DMs reaching you promptly, not sitting unanswered in a queue.' },
    ],
  },
};

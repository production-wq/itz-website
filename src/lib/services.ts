import type { Faq } from './geo/types';

export type Service = {
  slug: string;
  name: string;
  /** Short label used in nav columns. */
  navLabel?: string;
  tagline: string;
  summary: string;
  icon: string;
  /** Nested children keep the original WordPress "Paid Ads" / "Website" grouping. */
  children?: string[];
  bullets: string[];
  deliverables: { title: string; body: string }[];
  /** Who this service suits — and, honestly, who it doesn't. */
  whoItsFor?: string[];
  notFor?: string;
  faqs?: Faq[];
};

export const services: Service[] = [
  {
    slug: 'seo',
    whoItsFor: [
      "You serve a defined metro or set of towns and want calls that do not stop the day you pause ad spend.",
      "Your site already earns some traffic, but competitors outrank you for the services with the best margin.",
      "You can wait two to three months before the work shows up in your pipeline."
    ],
    notFor: "Skip SEO if you need cases or patients booked this month, or if you are launching with no site, no reviews and no local history. Paid search will get the phone moving faster while the organic foundation gets built underneath it.",
    faqs: [
      {
        "question": "How long before SEO produces leads?",
        "answer": "Expect first ranking movement around 90 days and a real change in lead volume between months four and six. Technical fixes and Google Business Profile work land fastest. Content and links compound slowly. If your site has been migrated badly, penalized, or never had a sane page structure, add a couple of months before anything moves at all."
      },
      {
        "question": "What does SEO cost?",
        "answer": "The number is driven by how many services and cities you need to rank in, how far behind your technical foundation is, and how entrenched the incumbents are. A single-location practice targeting one metro costs a fraction of a firm covering six suburbs and four practice areas. We scope it after an audit, so you see the plan and the price together."
      },
      {
        "question": "Can you guarantee first page rankings?",
        "answer": "No, and neither can anyone else. Google does not sell placement in organic results. What we commit to is the work: technical fixes, page architecture, Google Business Profile, review generation, links. We report rankings, but we judge the account on calls and submitted forms. An agency guaranteeing position one is either targeting terms nobody searches or assuming you will not check."
      },
      {
        "question": "What happens to our rankings if we stop after six months?",
        "answer": "They decay rather than vanish. The technical fixes and the pages stay in place, so the slide is gradual, usually over several months as competitors keep publishing and your review velocity drops. You keep the site, the analytics and the Google Business Profile either way. But SEO is a compounding asset, and stopping early is where most of the money gets wasted."
      }
    ],
    name: 'Search Engine Optimization',
    navLabel: 'SEO',
    tagline: 'More organic traffic that improves your search ranking',
    summary:
      'Local SEO compounds. Unlike an ad campaign that stops the moment you stop paying, a well-optimised Google Business Profile and a clean on-page foundation keep earning clicks month after month — which is why cost per lead usually falls as rankings climb.',
    icon: '/images/icons/seo.svg',
    children: ['ai-seo-company'],
    bullets: [
      'Google Business Profile optimisation and review velocity',
      'Technical audit: Core Web Vitals, crawl, schema, indexation',
      'Location and service page architecture built around real search demand',
      'Ethical link acquisition from relevant local and industry publications',
    ],
    deliverables: [
      { title: 'Keyword & competitor map', body: 'Every term worth ranking for in your metro, scored by intent and difficulty, mapped to a page that should own it.' },
      { title: 'On-page rebuild', body: 'Titles, headings, internal links and schema corrected across the site — not just the homepage.' },
      { title: 'Local footprint', body: 'Google Business Profile, citations and review generation, kept consistent across every directory that matters.' },
      { title: 'Monthly reporting', body: 'Rankings, traffic and — the number that actually matters — booked calls and submitted forms.' },
    ],
  },
  {
    slug: 'ai-seo-company',
    whoItsFor: [
      "Your buyers research before they call, and increasingly ask an assistant before they open a search page.",
      "You already rank reasonably in Google and want the same visibility inside AI answers.",
      "You have real expertise worth quoting: procedures, eligibility rules, process steps, how pricing works."
    ],
    notFor: "Not for businesses chosen on proximity alone. An urgent care or a tire shop three miles away wins on map pack, hours and reviews, not on being cited by ChatGPT. Fix the local fundamentals first and come back to this later.",
    faqs: [
      {
        "question": "How is this different from regular SEO?",
        "answer": "It overlaps heavily, but the target differs. Classic SEO chases a position in a list of links. Answer engine work aims to be the source a model quotes, which rewards clear definitions, structured data, consistent entity signals and content shaped like a direct answer. Most of the technical foundation is shared, so we usually run it alongside SEO rather than as a separate program."
      },
      {
        "question": "How quickly do AI assistants reflect changes?",
        "answer": "Weeks to months, and it varies by assistant. Tools that pull live search results update fastest. Models leaning on training data lag much longer, sometimes past a year. We check monthly which assistants name you and for which prompts, so you can watch movement instead of guessing. Treat this as a slow, ongoing signal rather than a switch you flip."
      },
      {
        "question": "What drives the cost of this work?",
        "answer": "Mostly content volume and how tangled your entity signals are. A business with one name, one address and consistent listings needs far less cleanup than one that rebranded, moved offices, or trades under three name variants. After that, cost tracks how many questions you want to own the answer to. We scope it against what the audit finds, not a package tier."
      },
      {
        "question": "Can you make ChatGPT recommend us?",
        "answer": "Nobody can force it. Assistants synthesize from sources they trust, so the work is making your site one of those sources: unambiguous entity data, content that answers questions directly, and third-party mentions that corroborate what you claim. That improves the odds of being cited. Anyone selling guaranteed placement inside an AI answer is describing something that does not exist."
      }
    ],
    name: 'AI SEO',
    tagline: 'Get cited by ChatGPT, Gemini and AI Overviews',
    summary:
      'Buyers increasingly ask an assistant before they open a search results page. Answer Engine Optimisation structures your content so those assistants quote you rather than a competitor.',
    icon: '/images/icons/seo.svg',
    bullets: [
      'Entity and topic modelling so models associate your brand with your service',
      'Structured data and answer-shaped content blocks',
      'Monitoring of brand mentions across AI assistants',
      'Content gap analysis against the sources assistants currently cite',
    ],
    deliverables: [
      { title: 'Answer audit', body: 'What ChatGPT, Gemini and AI Overviews currently say when someone asks for your service in your city.' },
      { title: 'Entity cleanup', body: 'Consistent naming, schema and third-party signals so models resolve your business to one confident entity.' },
      { title: 'Citable content', body: 'Pages written in the format assistants extract from — direct answers, defined terms, sourced data.' },
      { title: 'Mention tracking', body: 'Monthly checks on which assistants name you, and for which prompts.' },
    ],
  },
  {
    slug: 'website-services',
    whoItsFor: [
      "You have a site you are broadly happy with and nobody in-house to keep it patched, backed up and fast.",
      "Small edits sit for weeks because your last developer bills by the ticket and answers when convenient.",
      "You are spending on ads or SEO and sending that traffic to a site that loads slowly on a phone."
    ],
    notFor: "If your site is years old, painful to edit and converts badly, a care plan just keeps a weak asset alive. Rebuild first. Paying monthly to maintain a page that does not generate calls is money spent preserving the problem.",
    faqs: [
      {
        "question": "How is the monthly price set?",
        "answer": "It follows the size and platform of your site, how much traffic it carries, and how many edits you send. A five-page brochure site sits at the bottom of the range. A two-hundred-page site with booking, custom plugins and weekly content changes sits well above it. We quote after looking at the actual install rather than reading off a tier chart."
      },
      {
        "question": "What counts as an included content edit?",
        "answer": "Text changes, image swaps, new staff bios, hours, pricing updates, adding a page from an existing template, fixing a broken form. Those go in a queue and usually ship the same business day. New templates, custom functionality, integrations and design work get quoted separately. We tell you which bucket a request falls into before we start, not after."
      },
      {
        "question": "How fast can you fix a site that is down or hacked?",
        "answer": "Uptime monitoring usually alerts us before you notice, and a clean restore from the daily backup is quick. Malware cleanup takes longer, often a day or two, because we have to find the entry point rather than just delete files, or it comes back. If the host itself is the problem, a migration adds time. We give you a specific estimate once we can see it."
      },
      {
        "question": "Do we have to move hosting to you?",
        "answer": "Not always, though it is often the cheapest fix. Bargain shared hosting sits behind a large share of the speed problems we see, and we cannot stand behind performance on infrastructure we do not control. If your current host is solid, we will manage the site where it lives. If it is not, we will show you the load times before recommending a move."
      }
    ],
    name: 'Website Services',
    navLabel: 'Website',
    tagline: 'Fast, modern sites that turn visitors into calls',
    summary:
      'Hosting, maintenance, speed and security for the site you already have — plus the ongoing changes most agencies charge a ticket for.',
    icon: '/images/icons/content-marketing.svg',
    children: ['website-design'],
    bullets: [
      'Managed hosting with daily backups and uptime monitoring',
      'Core Web Vitals tuning — LCP, CLS and INP',
      'Security patching, WAF and malware remediation',
      'Unlimited small content edits',
    ],
    deliverables: [
      { title: 'Performance pass', body: 'Image pipeline, caching, render-blocking scripts and font loading fixed until the site scores green on mobile.' },
      { title: 'Maintenance retainer', body: 'Plugin, theme and platform updates applied on a staging copy first, so nothing breaks in production.' },
      { title: 'Conversion tracking', body: 'GA4, Search Console and call tracking wired correctly, with goals that map to revenue.' },
      { title: 'Content edits', body: 'Send the change, we ship it — usually same business day.' },
    ],
  },
  {
    slug: 'website-design',
    whoItsFor: [
      "Your site was built years ago, looks dated on a phone, and you hesitate before sending people to it.",
      "Visitors arrive but calls do not follow, and you cannot tell where people drop off.",
      "You are about to spend on ads and need somewhere worth sending the clicks."
    ],
    notFor: "Not for anyone who needs a site live next week for a few hundred dollars. Use a template builder for that, honestly. Our process runs through wireframes, content and revisions, and it is not the cheapest way to get a page on the internet.",
    faqs: [
      {
        "question": "How long does a new site take?",
        "answer": "Usually six to ten weeks for a standard small business site. Design and build are the predictable part. The delay is almost always content: photos, staff bios, service descriptions and approvals. Clients who block out time for content in week one finish near the low end. Projects waiting on one busy decision-maker's inbox run long, every time."
      },
      {
        "question": "What makes one site cost more than another?",
        "answer": "Page count, custom functionality, and how much of the writing we do versus you supply. Eight pages with copy you provide sits at one end. A multi-location site with online booking, intake forms, CRM integration and a written page for every service and city sits at the other. Photography, if it needs to be shot, is a separate line rather than a hidden markup."
      },
      {
        "question": "Will we lose our search rankings when we launch?",
        "answer": "Not if the migration is handled properly. Every existing URL gets mapped to its new equivalent with a permanent redirect, and titles, headings and page content carry over rather than being rewritten from scratch. Expect a short wobble while Google recrawls. Ranking losses after a redesign nearly always trace back to launching without a redirect map."
      },
      {
        "question": "Can our team edit the site afterward?",
        "answer": "Yes, and we treat that as a build requirement rather than an afterthought. You get a stack your staff can update for pages, text, images, staff and posts, plus a recorded walkthrough. Structural changes and new templates still need a developer. If nobody on your team wants to touch it, the maintenance plan covers edits instead."
      }
    ],
    name: 'Website Design',
    tagline: 'Mobile-first sites built to convert, not just to look good',
    summary:
      'Most small business sites lose the visitor in the first eight seconds. We design around the two things a local buyer wants: proof you can do the job, and an obvious way to reach you.',
    icon: '/images/icons/content-marketing.svg',
    bullets: [
      'Mobile-first layouts — most local searches happen on a phone',
      'Clear, repeated calls to action above and below the fold',
      'Accessible colour contrast and 48px tap targets throughout',
      'Built on a stack your team can actually edit',
    ],
    deliverables: [
      { title: 'Conversion-led wireframes', body: 'Page structure agreed before a pixel of visual design, so the argument happens early and cheap.' },
      { title: 'Design system', body: 'Colour, type and component library so every future page stays on brand without a designer.' },
      { title: 'Build & launch', body: 'Responsive build, QA across real devices, redirects mapped so you keep your rankings.' },
      { title: 'Post-launch tuning', body: 'Heatmaps and form analytics for the first 90 days, with fixes applied as the data lands.' },
    ],
  },
  {
    slug: 'ppc-management',
    whoItsFor: [
      "You need leads this month and can fund a testing period before the account gets efficient.",
      "You already spend on ads and cannot tell which campaigns produce booked work.",
      "You have capacity for more jobs and someone who answers the phone quickly."
    ],
    notFor: "Do not start paid ads if a week of platform learning would consume most of your monthly budget, or if inquiries currently sit unanswered for hours. Fix intake first. Ads take an existing follow-up problem and make it expensive.",
    faqs: [
      {
        "question": "How much should we budget?",
        "answer": "Two numbers matter: media spend and management. Media depends on what a click costs in your category and market, and how many leads you need to fill capacity. A personal injury click and a massage therapy click are not in the same universe. Management scales with account complexity. We work backward from your target cost per booked job instead of quoting a flat percentage."
      },
      {
        "question": "How long before the account is profitable?",
        "answer": "First leads usually arrive within days of launch. Efficiency takes longer. Plan on four to six weeks of gathering conversion data before bidding settles, and a full quarter before cost per booked job is a number you can plan around. Accounts with low lead volume take longer, because the platform needs conversions to learn from and a trickle teaches it slowly."
      },
      {
        "question": "Who owns the ad account?",
        "answer": "You do. We work inside your Google Ads and Meta accounts with your billing attached, and you keep admin access the whole time. If you leave, the account, the spend history, the conversion data and the campaign structure stay with you. Agencies that build inside their own manager account and refuse to hand it over are holding your data as leverage."
      },
      {
        "question": "Why do we need separate landing pages per campaign?",
        "answer": "Because sending a click for one specific service to a general homepage wastes it. The visitor has to hunt for what the ad promised, and most will not. A page per campaign matches the ad's message, shortens the path to contact, and gives you clean data on which service actually converts. Over time it also tends to lower what you pay per click."
      }
    ],
    name: 'PPC Management',
    navLabel: 'Paid Ads',
    tagline: 'Paid campaigns managed against booked revenue, not clicks',
    summary:
      'Ad platforms optimise for what you tell them to optimise for. Most accounts are quietly buying cheap clicks from people who will never call. We fix the signal first, then scale spend.',
    icon: '/images/icons/paid-advertising.svg',
    children: ['google-ads', 'meta-ads', 'programmatic-ads', 'social-media-ads'],
    bullets: [
      'Offline conversion imports so bidding learns from real leads',
      'Negative keyword hygiene and search term review every week',
      'Landing pages built per campaign, not one page for everything',
      'Transparent reporting — you own the ad account',
    ],
    deliverables: [
      { title: 'Account audit', body: 'Wasted spend, mis-set bidding, broken conversion tracking and structural problems, itemised.' },
      { title: 'Rebuild', body: 'Campaign structure rebuilt around your margin, service areas and capacity.' },
      { title: 'Creative testing', body: 'Ad copy and creative tested in a queue, not swapped on a hunch.' },
      { title: 'Weekly optimisation', body: 'Search terms, placements, bids and budget rebalanced against cost per booked job.' },
    ],
  },
  {
    slug: 'google-ads',
    whoItsFor: [
      "People actively search for what you do: emergency dentist, DUI attorney, brake repair near me.",
      "You can answer the phone during the hours you advertise, or pay someone who will.",
      "Your average job carries enough margin to absorb competitive click prices."
    ],
    notFor: "A poor fit if nobody searches your category yet, or if your goal is the cheapest possible leads. Search buys people at the moment of highest intent, and that moment is priced accordingly. Demand creation belongs on other channels.",
    faqs: [
      {
        "question": "What are Local Service Ads and should we run them?",
        "answer": "LSAs sit above regular search ads, charge per lead instead of per click, and require license, insurance and background verification to earn the Google Guaranteed badge. For qualifying trades and professions they are often the most efficient lead source in the account, so we set them up first. They do not cover every service, and disputing bad leads is ongoing work we handle."
      },
      {
        "question": "Why do clicks cost so much in our category?",
        "answer": "Click price reflects what a customer is worth to the highest bidder in your market, not what the click costs Google. Legal, insurance and cosmetic medical clicks run high because one signed case pays for a lot of them. The lever is not cheaper clicks. It is tighter targeting, better landing pages and faster intake so more of those clicks turn into work."
      },
      {
        "question": "How soon can campaigns go live?",
        "answer": "A search build can launch in one to two weeks once we have account access, conversion tracking and landing pages in place. LSA verification is the slow part: background checks and license review often take several weeks and sit outside anyone's control. We usually launch search first and shift budget across as LSAs come online."
      },
      {
        "question": "Do you actually listen to the calls?",
        "answer": "Yes, and that is where most of the improvement comes from. Recordings show which search terms produce real inquiries and which produce wrong numbers, job applicants and people outside your service area. Bad terms become negatives, good ones get budget. Listening also tends to surface intake problems that no ad change can fix, which is uncomfortable but useful."
      }
    ],
    name: 'Google Ads',
    tagline: 'Reach people at the exact moment they are ready to call',
    summary:
      'Search, Performance Max and Local Service Ads, managed together so they stop cannibalising each other and start covering the whole funnel.',
    icon: '/images/icons/paid-advertising.svg',
    bullets: [
      'Local Service Ads setup, verification and dispute management',
      'Search campaigns segmented by intent and service margin',
      'Performance Max asset groups with real audience signals',
      'Call tracking and call recording review',
    ],
    deliverables: [
      { title: 'LSA & Google Guaranteed', body: 'Licence, insurance and background check paperwork handled through to the green badge.' },
      { title: 'Search build', body: 'Tight ad groups, exact and phrase coverage, and a negative list maintained weekly.' },
      { title: 'Landing pages', body: 'One page per service and city, matched to the ad copy that sent the click.' },
      { title: 'Lead review', body: 'We listen to the calls. Bad leads become negatives; good leads become bid signals.' },
    ],
  },
  {
    slug: 'meta-ads',
    whoItsFor: [
      "Your service is visual or discretionary: med spa treatments, detailing, campus tours, new listings.",
      "Search volume in your category is thin, so you need to create demand rather than only capture it.",
      "You already get site traffic that does not convert and want a way to bring those people back."
    ],
    notFor: "Wrong first channel for urgent, high-intent services. Someone whose transmission just failed is on Google, not scrolling Instagram. Run search first, then use Meta to stay in front of everyone who looked and did not call.",
    faqs: [
      {
        "question": "How long before Meta produces leads?",
        "answer": "Inquiries often appear in the first week. Useful ones take longer. Plan on three to four weeks to clear the learning phase and identify which creative works, then continuous iteration after that. Meta creative fatigues faster than search ads. An image that performs in month one usually needs replacing by month three, so this is not a set-and-forget channel."
      },
      {
        "question": "How does the budget split between media and creative?",
        "answer": "Creative is a bigger variable here than on search. Meta needs a steady supply of fresh video and images, so either we produce them, you send footage we edit, or performance flattens. Media budget depends on audience size and lead volume needed. Small local audiences saturate quickly, so pushing more spend at the same handful of people stops working."
      },
      {
        "question": "Are Meta leads lower quality than search leads?",
        "answer": "Often, yes, and that is expected. You are interrupting someone rather than answering a question they asked, so more form fills are casual. Two things fix most of it: qualifying questions in the form, and following up within minutes. Compare cost per booked appointment rather than cost per lead. Meta frequently wins the first number while losing the second."
      },
      {
        "question": "Does tracking still work with browser privacy restrictions?",
        "answer": "Partly, and only when it is configured properly. Pixel-only tracking now misses a meaningful share of conversions, so we run the Conversions API server-side and deduplicate against pixel events, which recovers much of the signal. Attribution still will not match your CRM exactly. Expect Meta to report differently than your intake sheet, and treat the CRM as the truth."
      }
    ],
    name: 'Meta Ads',
    tagline: 'Facebook and Instagram campaigns that build local demand',
    summary:
      'Search captures people already looking. Meta creates the people who will look next month — and retargets the ones who visited but did not call.',
    icon: '/images/icons/social-media.svg',
    bullets: [
      'Conversions API so tracking survives browser restrictions',
      'Creative built for sound-off, thumb-stopping mobile feeds',
      'Retargeting sequences off site visits, video views and form starts',
      'Lead form and click-to-call campaigns tested side by side',
    ],
    deliverables: [
      { title: 'Pixel & CAPI', body: 'Server-side events configured properly, deduplicated, and verified in Events Manager.' },
      { title: 'Creative production', body: 'Static, carousel and short-form video variants shot or assembled from your existing footage.' },
      { title: 'Audience architecture', body: 'Cold, warm and retargeting tiers with budgets set to the stage of the funnel.' },
      { title: 'Reporting', body: 'Cost per qualified lead by creative, so you know which asset to make more of.' },
    ],
  },
  {
    slug: 'programmatic-ads',
    whoItsFor: [
      "You have a defined geographic footprint and want presence on TV, audio and display without buying local broadcast.",
      "Search and social are already running efficiently and you need reach beyond what they can buy.",
      "Your buying cycle is long enough that awareness before the search matters: schools, elective medical, estate planning."
    ],
    notFor: "Not a fit if you need trackable leads from a modest budget. This is a coverage and awareness channel, attribution is directional, and a small budget spread across CTV, audio and display buys too few impressions for anyone to remember you.",
    faqs: [
      {
        "question": "What determines the budget?",
        "answer": "The population inside your target geography and how many times you want each household to see the message. Programmatic is bought per thousand impressions, so a five-mile radius costs a fraction of a full metro. Below a certain spend, frequency is too low to register with anyone. We will tell you when a budget cannot work rather than take it anyway."
      },
      {
        "question": "How do we know whether it worked?",
        "answer": "Not from a last-click report. We measure site visit and foot traffic lift against a holdout audience that did not see the ads, and we watch whether branded search and direct traffic move. That is directional evidence, not a row in your CRM. If you need lead-level attribution on every dollar, put the money into search instead."
      },
      {
        "question": "How long should we run before judging it?",
        "answer": "At least 90 days. Frequency has to build before recall does, and lift measurement needs enough exposed and unexposed households to mean anything. A 30-day flight tells you the ads delivered, and little else. Seasonal businesses are the exception: a tight flight timed around a known demand spike can be judged on that spike."
      },
      {
        "question": "How is this different from display ads inside Google Ads?",
        "answer": "Inventory and targeting. Google's display network is one large pool of websites and apps. Programmatic buying also reaches connected TV, streaming audio and digital billboards, and lets us target households and physical places, such as a competitor's lot or a hospital campus. It costs more per impression and is worth it only when that precision changes the outcome."
      }
    ],
    name: 'Programmatic Ads',
    tagline: 'Highly targeted ads delivered to the right audience at the right time',
    summary:
      'Display, connected TV, streaming audio and digital out-of-home, bought programmatically against the same audience — so a household sees a consistent message across every screen it owns.',
    icon: '/images/icons/programmatic-advertising.svg',
    bullets: [
      'Household and geofence targeting down to the neighbourhood',
      'Connected TV and streaming audio inventory',
      'Competitor conquesting and event-based geofencing',
      'View-through attribution tied to site visits and calls',
    ],
    deliverables: [
      { title: 'Audience build', body: 'First-party lists, in-market segments and geofences combined into one addressable audience.' },
      { title: 'Channel mix', body: 'Budget split across CTV, display, audio and DOOH based on where your buyers actually spend attention.' },
      { title: 'Creative adaptation', body: 'One campaign concept resized and re-cut for every placement.' },
      { title: 'Lift measurement', body: 'Foot traffic and site visit lift measured against a holdout, not just impressions served.' },
    ],
  },
  {
    slug: 'social-media-ads',
    whoItsFor: [
      "Your buyer clearly lives on a specific platform: prospective trade students, referral partners, local parents.",
      "You already produce video, or someone on staff is willing to be on camera regularly.",
      "You want organic posting and paid budget working from one plan instead of two disconnected efforts."
    ],
    notFor: "Skip this if the only reason you are considering it is that a competitor posts a lot. Presence on a platform your buyers do not use costs real money and returns nothing. We would rather tell you to stay off TikTok than sell you a content calendar.",
    faqs: [
      {
        "question": "How do you decide which platforms we should be on?",
        "answer": "By who your buyer is and what the decision looks like, not by platform popularity. LinkedIn fits when a referral partner or employer is the decision-maker. TikTok and Instagram fit younger, visual, discretionary purchases. Pinterest suits planning-heavy decisions. If none of them fits your buyer, we will say so and recommend putting the budget into search or local instead."
      },
      {
        "question": "What does content production add to the cost?",
        "answer": "It is usually the largest line item. Paid social burns through creative, so the real question is where video comes from: a recurring shoot, footage your team captures on a phone that we edit, or repurposing what you already have. Editing existing material is cheapest. Regular production shoots cost most and generally perform best. Media spend sits on top of whichever route you pick."
      },
      {
        "question": "How long until social turns into actual business?",
        "answer": "Paid amplification can produce inquiries within the first month. Organic growth is slower: three to six months of consistent posting before it contributes anything measurable, and longer in categories where trust builds slowly. Anyone promising a large following in weeks is describing bought followers. We would rather set that expectation now than explain it in month two."
      },
      {
        "question": "Who handles comments and direct messages?",
        "answer": "We do, working from a response guide you approve, and anything that reads like a real inquiry or a complaint gets escalated to you the same day. In regulated categories, medical especially, we keep public replies generic and never discuss anyone's specific situation in a thread. You decide up front which topics we answer and which always come to your team."
      }
    ],
    name: 'Social Media Ads',
    tagline: 'Engaging content that resonates with your target audience',
    summary:
      'Paid social beyond Meta — TikTok, LinkedIn, Pinterest and YouTube — matched to where your specific buyer actually is rather than where everyone advertises by default.',
    icon: '/images/icons/social-media.svg',
    bullets: [
      'Platform selection based on your buyer, not on trend cycles',
      'Short-form video production and editing',
      'Organic and paid working from one content calendar',
      'Comment and DM response workflows',
    ],
    deliverables: [
      { title: 'Channel strategy', body: 'A defensible answer to "should we be on TikTok?" for your specific business.' },
      { title: 'Content calendar', body: 'A month of posts and ad creative planned, produced and scheduled in advance.' },
      { title: 'Paid amplification', body: 'The organic posts that perform get budget behind them; the rest do not.' },
      { title: 'Community management', body: 'Responses handled inside your brand voice, escalated when a real lead appears.' },
    ],
  },
  {
    slug: 'lead-generation',
    whoItsFor: [
      "Leads arrive from several places and nobody can say which source produced paying work.",
      "Inquiries sit for hours before anyone responds, and no-shows are a recurring cost.",
      "You use a CRM, or are ready to adopt one, and someone is accountable for follow-up."
    ],
    notFor: "This is not a lead-buying service. We do not resell shared contacts from a broker list. If you want a pile of leads delivered without changing how your team responds to them, we are the wrong agency for the job.",
    faqs: [
      {
        "question": "Do you sell leads?",
        "answer": "No. We build the system that generates and routes your own leads: ads, forms, calls and chat feeding your CRM with attribution attached. Purchased broker leads are shared with your competitors, arrive without context, and stop the day you stop paying. What we build belongs to you, including the contact records, the tracking setup and the reporting."
      },
      {
        "question": "How fast can this be set up?",
        "answer": "CRM integration, call tracking and instant-response automation usually take two to four weeks, depending on how cooperative your CRM is and whether your follow-up process is written down anywhere. Nurture sequences come next, once we know what real objections sound like. Closed-loop reporting needs a full sales cycle of data before the numbers mean anything, often a quarter or more."
      },
      {
        "question": "What drives the cost?",
        "answer": "The number of systems that have to talk to each other, and how much of the follow-up content we write. Connecting one form to one CRM is straightforward. Routing calls, chat and forms across several locations into a CRM with custom fields, then pushing outcomes back to the ad platforms, is a bigger build. Software subscriptions get billed to you directly, not marked up."
      },
      {
        "question": "Why does speed to lead matter so much?",
        "answer": "Because someone who just submitted forms on three websites goes with whoever calls back first. Responding within a couple of minutes is a different business than responding in an hour, and the gap shows up in contact rate more clearly than almost any other change we make. Automation buys you the first touch. A human still has to make the second."
      }
    ],
    name: 'Lead Generation',
    tagline: 'A predictable pipeline, measured to the booked job',
    summary:
      'The channels above only matter if the lead reaches a human and gets followed up. We connect the ads to your CRM, chase the no-shows, and report on revenue rather than form fills.',
    icon: '/images/icons/email-marketing.svg',
    bullets: [
      'CRM integration and lead routing',
      'Speed-to-lead automation — SMS and email within 60 seconds',
      'Long-term nurture for leads that are not ready yet',
      'Reporting from first click through to closed revenue',
    ],
    deliverables: [
      { title: 'Lead capture', body: 'Forms, chat and call tracking unified so no source goes unattributed.' },
      { title: 'Instant response', body: 'Automated SMS and email the moment a lead lands — the single biggest driver of contact rate.' },
      { title: 'Nurture sequences', body: 'Email and SMS journeys for the 70% of leads who are researching, not buying today.' },
      { title: 'Closed-loop reporting', body: 'CRM outcomes pushed back into the ad platforms so bidding optimises on revenue.' },
    ],
  },
  {
    slug: 'review-management',
    whoItsFor: [
      "Your rating is a few tenths below the competitor in the map pack and it is costing you clicks.",
      "Reviews come in bursts when someone remembers to ask, then go quiet for months.",
      "Negative reviews sit unanswered, or get a defensive reply that makes things worse.",
    ],
    notFor: "We will not write fake reviews, gate negative feedback so only happy customers can post publicly, or pay for a rating. Those tactics violate platform policies and get profiles suspended. If that is the service you are looking for, we are not it.",
    faqs: [
      {
        "question": "How do you actually generate more reviews?",
        "answer": "By building the request into the moment the customer is most satisfied — the end of a job, the follow-up call, the paid invoice — and making it one tap. We set up the automation, write the messages, pick the timing per customer type, and route people to the platform that matters most for your category. No incentives, no gating: just asking every customer, consistently, at the right time.",
      },
      {
        "question": "What do you do about negative reviews?",
        "answer": "Monitor every platform daily, alert you the moment one lands, and draft a calm, specific, public response within a day — acknowledging the issue, avoiding defensiveness, and moving the detail offline. We cannot remove a genuine review, but a good response is read by every future prospect and often does more for conversion than the rating itself. Where a review clearly violates platform policy, we prepare and file the removal request.",
      },
      {
        "question": "Which review sites should we focus on?",
        "answer": "Google Business Profile first, almost always — it feeds the map pack and it is what most people check. After that it depends on your industry: Healthgrades and Zocdoc for medical, Avvo for legal, industry directories for trades, Facebook for some local services. We audit where your prospects actually look and where your competitors are winning, then concentrate the effort rather than spreading it thin.",
      },
      {
        "question": "How long before it moves the rating?",
        "answer": "If you are doing real volume and the work is good, the average rating starts climbing within a couple of months as recent, positive reviews outweigh older ones. A profile with very few reviews moves faster in either direction. The compounding benefit — better map-pack position, higher click-through, more conversion — builds over quarters, not weeks.",
      },
    ],
    name: 'Review Management',
    navLabel: 'Reviews',
    tagline: 'Turn your rating into your best salesperson',
    summary:
      'A steady flow of recent, genuine reviews moves your map-pack position and your conversion rate at the same time. We build the request into your workflow, monitor every platform, and respond to what comes in.',
    icon: '/images/icons/review-management.svg',
    bullets: [
      'Automated review requests timed to the end of the job, by customer type',
      'Daily monitoring across Google, Facebook and your industry platforms',
      'Drafted public responses to every review, positive and negative, within a day',
      'Policy-compliant removal requests for reviews that break platform rules',
    ],
    deliverables: [
      { title: 'Request automation', body: 'One-tap review requests wired into your CRM or field-service software, sent at the moment satisfaction is highest.' },
      { title: 'Monitoring & alerts', body: 'Every platform watched daily, with a same-day alert the moment a new review lands.' },
      { title: 'Response drafting', body: 'A calm, specific public reply to every review — the thing future prospects actually read.' },
      { title: 'Reporting', body: 'Rating trend, review velocity and response time, alongside the map-pack movement that follows.' },
    ],
  },
  {
    slug: 'creative',
    whoItsFor: [
      "Your ad accounts are healthy but the creative is stale and results are sliding.",
      "You have raw footage — testimonials, job sites, walkthroughs — and no one to cut it.",
      "You are running the same three images across every platform and every audience.",
    ],
    notFor: "If you have no footage and no budget to shoot any, this is limited. We can do a lot with stock, motion graphics and your existing photos, but the creative that performs in home services, medical and legal is almost always real people and real work. Plan a half-day shoot first.",
    faqs: [
      {
        "question": "Do you shoot video or just edit?",
        "answer": "Both, depending on the market. In our core metros we can arrange a shoot; everywhere else we direct you through a simple self-shoot — what to capture, on what, in what order — and edit from there. Most of our work is editing: cutting testimonials, turning one long job-site video into a month of social clips, and producing ad variants for testing.",
      },
      {
        "question": "How many pieces of creative do we actually need?",
        "answer": "For paid social, more than most businesses run. Creative fatigues in weeks, so a healthy account needs a few new variants every month — different hooks, formats and lengths — not one polished hero video. For organic and the website, less: a strong testimonial reel, a service explainer or two, and a library of short clips you can post from.",
      },
      {
        "question": "Can you match our brand?",
        "answer": "Yes. We work from your colours, fonts, logo and tone, and if those are not defined we will set light guidelines first so everything is consistent. The goal is creative that looks like you, not like a template — captions, lower-thirds, intro and outro all built once and reused.",
      },
      {
        "question": "What does this cost?",
        "answer": "It scales with volume and whether we are shooting. A single testimonial edit from your footage is a small fixed project; an ongoing monthly plan that feeds a steady stream of ad and social creative is priced per month against how many pieces you need. We scope it after seeing what footage you have and what the ad accounts are asking for.",
      },
    ],
    name: 'Creative & Video',
    navLabel: 'Creative',
    tagline: 'Ad and video creative built to be tested, not admired',
    summary:
      'The creative is the lever on paid social, and it fatigues fast. We produce testimonial edits, social clips and ad variants — cut from your footage, matched to your brand, and ready to run across every channel.',
    icon: '/images/icons/creative.svg',
    bullets: [
      'Testimonial and case-study video edits from your raw footage',
      'Short vertical clips for Reels, TikTok and YouTube Shorts',
      'A/B ad-creative variants — multiple hooks, formats and lengths per test',
      'Captions, lower-thirds and brand templates built once and reused',
    ],
    deliverables: [
      { title: 'Creative audit', body: 'What is running now, what has fatigued, and the gaps against what each ad platform is asking for.' },
      { title: 'Production plan', body: 'A shoot brief or a self-shoot guide, plus a monthly output target tied to your active campaigns.' },
      { title: 'Edit & deliver', body: 'Finished cuts in every aspect ratio and length the channels need, on a predictable schedule.' },
      { title: 'Performance review', body: 'Which hooks and formats won, feeding the next round of variants.' },
    ],
  },
  {
    slug: 'cold-outreach',
    whoItsFor: [
      'You sell to businesses, not consumers, and can name the exact job title or company type that buys from you.',
      'Your sales cycle can absorb a steady trickle of new conversations rather than needing volume overnight.',
      'You have someone who can actually take a qualified call or demo when outreach books one.',
    ],
    notFor: 'Skip outreach if you sell a low-ticket consumer product, or if you have nobody available to follow up on a response within a day or two — a good reply that sits for a week is a wasted one.',
    faqs: [
      {
        question: 'How is this different from just running cold calling or cold email on their own?',
        answer: 'Most B2B prospects need more than one touch before they respond, and different people respond to different channels. We run calling and email as one coordinated sequence against the same target list — a call that references an email sent two days earlier converts differently than either alone. If your list or offer only supports one channel, we will say so rather than sell you both by default.',
      },
      {
        question: 'How do you build the prospect list?',
        answer: 'From your ideal-customer definition — industry, company size, title, geography, whatever actually predicts a good client for you — cross-checked against verified contact data so we are not calling and emailing bounced or outdated records. We review the list with you before anything goes out, because a list built on the wrong definition wastes every touch that follows it.',
      },
      {
        question: 'What counts as a qualified result?',
        answer: 'A booked call or meeting with someone who fits your buyer definition and confirmed real interest — not a list of anyone who replied. We track response rate and meetings booked separately, because a campaign generating replies that never turn into meetings has a qualifying problem, not an outreach volume problem, and we adjust the targeting rather than just sending more.',
      },
      {
        question: 'How long before we see booked meetings?',
        answer: 'Expect the first two to three weeks to be list-building, sequence-writing and testing which message actually lands — meetings before that point usually mean the targeting was already narrow and easy. Real, repeatable volume typically shows up by week four to six, once we know which angle gets a response from your specific buyer.',
      },
    ],
    name: 'Cold Outreach',
    navLabel: 'Cold Outreach',
    tagline: 'Coordinated calling and email that books meetings with the buyers you actually want',
    summary:
      'A single cold email or a single cold call gets ignored more often than not. We run both as one sequence against a list built on your real buyer definition, so the second and third touch land instead of starting over each time.',
    icon: '/images/icons/cold-outreach.svg',
    children: ['cold-calling', 'cold-email'],
    bullets: [
      'Verified prospect lists built from your actual buyer definition, not a generic industry export',
      'Calling and email sequenced together so later touches reference earlier ones',
      'Every meeting booked reviewed against your buyer criteria, not counted as a raw reply',
      'Scripts and email copy rewritten from what is actually getting responses, not written once and left alone',
    ],
    deliverables: [
      { title: 'Buyer & list build', body: 'Your ideal-customer profile turned into a verified, deduplicated list of real prospects who fit it.' },
      { title: 'Sequence & scripts', body: 'A coordinated calling and email cadence, with scripts and copy built around your actual offer.' },
      { title: 'Live outreach', body: 'Calls made and emails sent on schedule, with every meaningful response routed to you the same day.' },
      { title: 'Weekly reporting', body: 'Touches made, response rate and meetings booked — by list segment, so you see what is actually working.' },
    ],
  },
  {
    slug: 'cold-calling',
    whoItsFor: [
      'You have a defined list of companies or contacts worth calling, not just a general market.',
      'Someone on your team can pick up a warm handoff within the same day it is booked.',
      'Your product or service is worth a five-minute phone conversation to explain.',
    ],
    notFor: "Skip standalone calling if you have no list to call yet or your offer needs a visual demo to make sense over the phone — pair it with email or outreach that can send something to look at first.",
    faqs: [
      {
        question: 'Who is actually making the calls?',
        answer: 'A dedicated caller working from your script and your list, not an overseas call center reading a generic pitch. We brief callers on your actual product, common objections and what a qualified prospect sounds like, and you can listen to call recordings to hear exactly how your company is being represented.',
      },
      {
        question: 'What happens when someone says yes?',
        answer: 'A qualified prospect gets handed to you the same day — a calendar link sent live on the call where possible, or a same-day summary with contact details and what they said if a live transfer is not practical. The handoff includes enough context that your team is not calling back cold.',
      },
      {
        question: 'How do you handle gatekeepers and voicemail?',
        answer: 'With a defined process rather than giving up after one attempt — a documented number of touches per contact across different times of day, a short voicemail script that earns a callback rather than a generic pitch, and gatekeeper scripts that ask for the right person by name and title. Contacts that never connect after the full sequence are reported back so you know what did not work, not just what did.',
      },
      {
        question: 'Can you call on a specific script we already use?',
        answer: 'Yes — if your team already has a script that works, we adapt it rather than replace it, then refine based on what actually gets a response from the specific list we are calling. If you do not have one yet, we write it with you from your actual pitch, not a generic template.',
      },
    ],
    name: 'Cold Calling',
    navLabel: 'Cold Calling',
    tagline: 'Live phone outreach that hands you a qualified conversation, not a dial-count report',
    summary:
      "Cold calling done badly is a script read fast at a list that was never qualified. Done properly it is a real conversation, a defined follow-up process for the contacts who do not answer, and a same-day handoff the moment someone is worth your time.",
    icon: '/images/icons/cold-calling.svg',
    bullets: [
      'Dedicated callers briefed on your product, not a script read cold off a generic list',
      'A defined multi-touch process for voicemail and gatekeepers instead of one attempt and done',
      'Call recordings available so you can hear exactly how prospects hear your company',
      'Same-day handoff of qualified conversations, with enough context to skip the cold callback',
    ],
    deliverables: [
      { title: 'Script & objection handling', body: 'A calling script built from your actual pitch, plus responses to the objections your list will realistically raise.' },
      { title: 'Live dialing', body: 'Calls made against your list on a defined cadence, with a documented number of attempts per contact.' },
      { title: 'Qualified handoffs', body: 'Interested, qualified contacts routed to you the same day, with context on what they said.' },
      { title: 'Call reporting', body: 'Connect rate, qualified conversations and outcomes by list segment — not just a raw dial count.' },
    ],
  },
  {
    slug: 'cold-email',
    whoItsFor: [
      'You have a specific buyer you can describe well enough to write to directly.',
      'Your offer can be explained and made interesting in a few short paragraphs.',
      'You can respond to interested replies within a day so the momentum is not lost.',
    ],
    notFor: 'Skip cold email if your list is unverified or bought in bulk — deliverability and your domain reputation both suffer, and the campaign underperforms before the copy is even a factor.',
    faqs: [
      {
        question: 'How do you avoid landing in spam?',
        answer: 'Domain and mailbox setup matters more than most people expect — proper SPF, DKIM and DMARC records, a warmed-up sending domain separate from your main company email, and sending volume that ramps up gradually rather than blasting a full list on day one. We set this up before a single prospecting email goes out, because a great email that lands in spam never gets read regardless of the copy.',
      },
      {
        question: 'How personalized are the emails really?',
        answer: 'Each email references something specific and true about the recipient or their company — not a mail-merge first name dropped into a generic template. That takes more time per contact than a mass blast, which is why list quality matters more than list size: a smaller, well-researched list that actually gets read outperforms a huge one that gets deleted.',
      },
      {
        question: 'How many emails are in a sequence, and how far apart?',
        answer: 'Typically three to five emails spaced several days apart, each with a different angle rather than the same pitch resent — the first states the reason for reaching out, later ones add a new piece of value or social proof, and the last is a genuine breakup email. We stop the sequence the moment someone replies or unsubscribes, and never re-add them without a fresh opt-in.',
      },
      {
        question: 'What do you report on?',
        answer: 'Open rate, reply rate and — the number that actually matters — qualified meetings booked, broken out by list segment and by which email in the sequence got the response. That tells us which message is working and which segment of the list is worth expanding, rather than one blended number that hides both.',
      },
    ],
    name: 'Cold Email',
    navLabel: 'Cold Email',
    tagline: 'Prospecting email that reaches the inbox and reads like it was written by a person',
    summary:
      'Most cold email fails on deliverability before the copy is ever read. We fix the sending setup first — domain authentication, warm-up, sending limits — then write sequences specific enough to your prospect that they read past the first line.',
    icon: '/images/icons/cold-email.svg',
    bullets: [
      'Domain authentication and mailbox warm-up handled before any prospecting email sends',
      'Sequences written around a specific, true detail per recipient, not a mail-merge template',
      'A defined multi-email cadence with a genuine breakup email, not one blast repeated',
      'Reporting split by list segment and by which email in the sequence actually got the reply',
    ],
    deliverables: [
      { title: 'Deliverability setup', body: 'SPF, DKIM, DMARC and a warmed-up sending domain, checked before volume ramps up.' },
      { title: 'List & personalization research', body: 'A verified list with the specific detail per contact the copy will actually reference.' },
      { title: 'Sequence copywriting', body: 'A multi-email sequence with a distinct angle per email, ending in a genuine breakup message.' },
      { title: 'Reply handling & reporting', body: 'Interested replies routed to you promptly, with open, reply and meeting-booked rates by segment.' },
    ],
  },
  {
    slug: 'social-media-management',
    whoItsFor: [
      'You want a consistent organic presence on the platforms your customers actually use, not paid reach.',
      'You can approve a content calendar in advance rather than needing everything real-time and reactive.',
      'You have real material to draw on — a team, a workspace, finished jobs — even if you have no time to post it.',
    ],
    notFor: 'Skip organic social management if your buyers do not spend time on social at all, or if you need it to directly replace paid lead generation — organic builds brand and trust over months, it is not a lead-volume channel on its own.',
    faqs: [
      {
        question: 'How is this different from Social Media Ads?',
        answer: 'This is your organic presence — the everyday posts, the profile, the community replies — the thing people see when they check whether a business is real before they call. Social Media Ads is paid placement aimed at driving leads directly. Many clients run both, because a strong organic profile makes the paid ads look more credible when someone clicks through to check.',
      },
      {
        question: 'What platforms do you cover?',
        answer: 'Whichever ones your actual customers use — usually Facebook and Instagram for most local businesses, with LinkedIn added for B2B-facing accounts. We do not push every platform by default; a profile posted to and then abandoned looks worse than not having one, so we would rather run two platforms consistently than five badly.',
      },
      {
        question: 'Do we need to approve every post before it goes live?',
        answer: 'Most clients review a content calendar in batches — a few weeks at a time — rather than approving each post individually, which keeps the cadence consistent without becoming a daily task for you. If you want tighter approval on specific topics or campaigns, we build that into the workflow; it just means a slower posting pace on the material that needs it.',
      },
      {
        question: 'Do you handle comments and messages, or just posting?',
        answer: 'We can cover both. Posting-only keeps the scope simple; adding community management means responding to comments and routing genuine leads from DMs to you promptly, on a response-time standard we agree upfront. What we will always flag rather than handle silently is anything that looks like a complaint or a reputation issue — that goes to you immediately, not into a queue.',
      },
    ],
    name: 'Social Media Management',
    navLabel: 'Social Media',
    tagline: 'A consistent organic presence that makes a business look real before anyone calls',
    summary:
      'Most local businesses have a social profile that was posted to for a month and then abandoned. We run a content calendar and a real posting cadence, so the profile a prospect checks before they call looks like an active, credible business.',
    icon: '/images/icons/social-media-management.svg',
    bullets: [
      'A content calendar planned around your actual business, not generic stock-photo filler',
      'Consistent posting cadence on the platforms your customers actually use',
      'Optional community management — comments and DMs handled, genuine leads routed to you fast',
      'Reputation-risk comments flagged to you immediately, never left sitting in a queue',
    ],
    deliverables: [
      { title: 'Content calendar', body: 'A planned posting schedule built around your services, jobs and team — reviewed with you in batches.' },
      { title: 'Content production', body: 'Posts written and designed to your brand, using your own material wherever you have it.' },
      { title: 'Consistent publishing', body: 'Posts published on schedule across the platforms that matter for your business.' },
      { title: 'Monthly reporting', body: 'Reach, engagement and profile growth, plus any genuine leads the channel produced.' },
    ],
  },
];

export const serviceBySlug = new Map(services.map((s) => [s.slug, s]));

/** The six cards shown in the homepage services grid, in original order. */
export const homepageServices = [
  'programmatic-ads',
  'seo',
  'ppc-management',
  'social-media-ads',
  'lead-generation',
  'website-design',
].map((slug) => serviceBySlug.get(slug)!);

/**
 * Expanded, template-driven copy for the industry and sub-industry pages.
 *
 * Kept in its own file rather than folded into `industries.ts` so the existing
 * validated structure there stays small and reviewable. Keyed by slug; the
 * templates look the record up and render the extra sections when present.
 *
 * House rules (same as the content generator): no invented statistics,
 * percentages, dollar figures, client names or review counts. Where a number
 * would help, explain what drives it instead.
 */

export type IndustryExtra = {
  /** "How we actually run campaigns for this vertical" — rendered as FeatureRows. */
  approach: { title: string; body: string }[];
  /** Extra context paragraphs, rendered below the existing `context` block. */
  expandedContext: string[];
  /** Leading indicators the engagement is judged on — rendered as SignalGrid. */
  signals: { label: string; body: string }[];
  /** Vertical-specific notes attached to the three channel cards. */
  channelNotes: { seo: string; paid: string; website: string };
};

export type SubIndustryExtra = {
  expandedContext: string[];
  /** "What a well-run account has in place" — a checked list. */
  checklist: string[];
};

export const industryExtras: Record<string, IndustryExtra> = {
  lawyers: {
    approach: [
      {
        title: 'Practice-area pages, not a services list',
        body: 'Someone searching a specific charge or a specific deadline wants a page about that, with the process, the likely timeline and what happens first. We build one strong page per practice area you actually want more of, reviewed against your state bar advertising rules before it goes live, rather than one thin "Areas of Practice" page trying to rank for everything.',
      },
      {
        title: 'Intake is half the campaign',
        body: 'A legal click is expensive enough that a missed call is a real loss. We listen to recorded calls with your intake team, sort the wasted spend from the intake gaps, and turn what we hear into negative keywords, better scripts and after-hours coverage. The campaign and the phone get fixed together.',
      },
      {
        title: 'Authority signals over ad budget',
        body: 'You will not outspend the lead brokers and TV firms bidding your terms. Local Services Ads, genuine review velocity, bar-compliant result content and citations in legal directories do work that a bigger bid cannot. We run those alongside paid search so the account is not standing on one leg.',
      },
    ],
    expandedContext: [
      'The other constraint is that legal buyers do not trust easily and they compare hard. They will read your bio, your recent reviews and a competitor’s before they call, and for urgent matters that whole comparison takes minutes. Everything on the page has to earn the call: a real attorney photo, a specific description of how you handle the matter, and reviews recent enough to look current.',
      'Directory sites — Avvo, FindLaw, Justia — hold positions you often cannot outrank for the broadest terms. The workable goal is to take one of the remaining organic slots plus the map pack for your city and your narrow practice-area terms, while being listed well on the directories themselves. That is a six-to-twelve-month project in a competitive metro, not a switch.',
    ],
    signals: [
      {
        label: 'Signed matters by practice area',
        body: 'The first honest read on a legal campaign. If signed retainers in the practice areas you want are trending up — and the case mix is improving — the campaign is working even though fee revenue lags by months or years.',
      },
      {
        label: 'Call answer rate and time to first callback',
        body: 'We track how many campaign calls are answered live and how fast the second attempt goes out. This is usually where signed cases are won or lost, and it is fixable within weeks.',
      },
      {
        label: 'Wasted-spend terms trending down',
        body: 'Weekly search-term review means the money bidding on case types you cannot take should shrink month over month as the negative keyword list matures.',
      },
      {
        label: 'Review velocity',
        body: 'A steady flow of recent, genuine reviews moves both map-pack ranking and conversion. Flat or aging reviews are an early warning that intake follow-up has slipped.',
      },
    ],
    channelNotes: {
      seo: 'Practice-area page architecture, Google Business Profile, legal-directory citations and review generation — the compounding base that keeps producing calls between ad flights.',
      paid: 'Local Services Ads (licensing and Google Screened handled end to end) plus tightly-scoped search campaigns, reviewed weekly against your case-type criteria.',
      website: 'Fast, credible practice-area pages with real attorney bios and bar-compliant result content — the page the expensive click actually lands on.',
    },
  },

  medical: {
    approach: [
      {
        title: 'The Google Business Profile is the front door',
        body: 'For most medical searches the map pack takes the call before your website is ever opened. We treat the Business Profile as a first-class asset: complete service list, current hours, real photos, a steady flow of recent reviews, and Q&A that answers what patients actually ask. Proximity you cannot change, but everything else on that panel you can.',
      },
      {
        title: 'Compliance built into the workflow',
        body: 'Health advertising carries rules — what you can claim about outcomes, how you handle before-and-after imagery, what belongs in a HIPAA-safe form. We keep those constraints in the brief rather than discovering them in a disapproval, so campaigns launch on schedule and stay live.',
      },
      {
        title: 'Book the appointment, do not just capture the lead',
        body: 'A form fill that sits in an inbox overnight is a booked competitor. We wire campaigns to online scheduling where it exists, keep the phone path short, and review with your front desk how quickly inquiries turn into appointments — because that conversion is where the budget is actually spent.',
      },
    ],
    expandedContext: [
      'Patient acquisition splits sharply by service line. Insurance-driven primary and urgent care compete on proximity, hours and reviews. Elective and cash-pay work — cosmetic, aesthetic, some dental — behaves more like retail, with a longer consideration window, price comparison and a need for reassurance before booking. The same practice often needs two different playbooks running at once.',
      'Reviews do double duty in medicine: they move map-pack ranking and they are the single biggest on-page conversion factor, because a nervous patient reads them before anything else. Building a compliant, consistent review request into the visit workflow matters more here than in almost any other category.',
    ],
    signals: [
      {
        label: 'Booked appointments from campaign sources',
        body: 'Not form fills — appointments that actually landed on the calendar, tagged back to the channel that produced them. This is the number the engagement lives or dies on.',
      },
      {
        label: 'New-patient share',
        body: 'How much of your booked volume is genuinely new versus existing patients rebooking. Campaigns should be growing the former without cannibalising your recall system.',
      },
      {
        label: 'Map-pack visibility for core services',
        body: 'Where you sit in the local three-pack for the services you want more of, tracked over time. Movement here usually precedes call volume.',
      },
      {
        label: 'Review recency and response rate',
        body: 'A current, answered review profile. Aging reviews or unanswered negatives are an early signal that both ranking and conversion are about to soften.',
      },
    ],
    channelNotes: {
      seo: 'Google Business Profile optimisation, service-line pages, local citations and a compliant review workflow — the work that wins the map pack.',
      paid: 'Search and, for elective service lines, paid social — with HIPAA-safe forms and outcome claims kept inside platform and regulatory rules.',
      website: 'Service-line pages with real photos, transparent process and pricing context, and the shortest possible path to an appointment.',
    },
  },

  'real-estate': {
    approach: [
      {
        title: 'A database, not just a lead list',
        body: 'Real estate is a long, relationship-driven sale. We build campaigns that feed a CRM you own, with follow-up sequences that keep you in front of a prospect for the months between "just looking" and "ready to list". A lead with no nurture attached is a lead you paid for and lost.',
      },
      {
        title: 'Hyper-local content that actually ranks',
        body: 'Buyers and sellers search by neighbourhood, school zone and street, not by brokerage. We build genuine area pages — market conditions, what sells, what to expect — rather than templated pages with the city name swapped in, because Google has stopped rewarding the latter and buyers never trusted it.',
      },
      {
        title: 'Listings as marketing assets',
        body: 'Every listing is a reason to be in front of the neighbourhood: the just-listed and just-sold campaigns, the single-property page, the social proof. We run those on a repeatable system so a new listing turns into visibility instead of a scramble.',
      },
    ],
    expandedContext: [
      'The attribution problem is real: a seller might follow your content for a year, attend an open house, and only then call — by which point last-click reporting credits a branded search. We instrument for assisted conversions and lead source at intake so the channels doing the slow work of building trust do not look worthless next to the ones that catch the final click.',
      'Portals — Zillow, Realtor.com, Redfin — own the buyer-search intent and sell that traffic back to agents. Competing there directly is expensive and rented. The durable position is owning your name, your neighbourhoods and your past-client relationships, and treating portal spend as a supplement rather than the strategy.',
    ],
    signals: [
      {
        label: 'Appointments set, not raw leads',
        body: 'Listing appointments and buyer consultations booked from campaign sources. Raw lead count is noisy in real estate; booked time on the calendar is the honest measure.',
      },
      {
        label: 'Database growth and re-engagement',
        body: 'Net new contacts entering a nurture sequence, plus how many dormant contacts re-engage. The pipeline value here is mostly in follow-up, not first touch.',
      },
      {
        label: 'Neighbourhood page rankings',
        body: 'Visibility for the specific areas you want to own. These pages compound and are the cheapest long-term source of qualified traffic.',
      },
      {
        label: 'Cost per appointment by source',
        body: 'What it actually costs to get a qualified seller or buyer in front of you, broken out by channel, so budget can move to whatever is producing conversations.',
      },
    ],
    channelNotes: {
      seo: 'Genuine neighbourhood and market-report pages, Google Business Profile, and a review system — traffic that keeps arriving without a per-click charge.',
      paid: 'Seller-lead and buyer-lead campaigns wired to a CRM you own, with retargeting that keeps you present through a long decision.',
      website: 'IDX search that works, fast single-property pages, and lead capture that feeds follow-up instead of an inbox.',
    },
  },

  education: {
    approach: [
      {
        title: 'Campaigns run on the admissions calendar',
        body: 'Awareness and open-house campaigns belong in one part of the year, applications and financial aid in another, decisions and re-enrolment in a third. We build the annual plan around your calendar so spend lands when families are actually deciding, not spread flat across twelve months.',
      },
      {
        title: 'Two audiences, one campaign',
        body: 'The person who pays and the person who attends are rarely the same, and they respond to different things. Our messaging and landing pages speak to the parent’s questions about outcomes and cost and the student’s question about whether they will belong — because you need both to say yes.',
      },
      {
        title: 'The tour is the conversion event',
        body: 'Inquiries are cheap and mostly meaningless; a booked tour or a completed application is the real signal. We optimise the whole funnel toward those, and we help you shorten the gap between an inquiry and a scheduled visit, which is where most enrolment is won or lost.',
      },
    ],
    expandedContext: [
      'Retention is part of the marketing math. A family that re-enrols is years of tuition at near-zero acquisition cost, so campaigns that only chase new families while attrition leaks out the back are solving half the problem. We factor re-enrolment communication into the plan.',
      'Compliance varies by segment. Accredited institutions and Title IV schools face real limits on what they can claim about placement, salaries and outcomes, and how recruiters may be compensated. Private K-12 has more latitude but still needs care around financial-aid messaging. We keep the applicable rules in the brief.',
    ],
    signals: [
      {
        label: 'Tours booked and applications started',
        body: 'The mid-funnel actions that actually predict enrolment. Inquiry volume is easy to generate and tells you almost nothing on its own.',
      },
      {
        label: 'Inquiry-to-visit time',
        body: 'How many days pass between a family raising their hand and a scheduled tour. Shortening this is usually the single biggest lever on yield.',
      },
      {
        label: 'Cost per enrolled student by channel',
        body: 'Traced through to census or start date, not to the inquiry. This is the number that tells you where next year’s budget belongs.',
      },
      {
        label: 'Re-enrolment / retention rate',
        body: 'Tracked alongside recruitment, because a campaign that fills the front door while families leave the back one is not actually growing the school.',
      },
    ],
    channelNotes: {
      seo: 'Programme and outcome pages that match how families search — by career, format and location — plus the local profile work for K-12.',
      paid: 'Seasonally-timed search and paid social aimed at tours and applications, with outcome claims kept inside accreditation rules.',
      website: 'A site that answers the parent’s and the student’s questions and makes booking a visit the obvious next step.',
    },
  },

  automotive: {
    approach: [
      {
        title: 'Win the map pack first',
        body: 'The local three-pack takes most of the calls for repair and service searches. Proximity, review recency and a complete Google Business Profile outrank almost anything on your website, so that is where the first work goes: services listed, hours accurate, photos current, reviews flowing.',
      },
      {
        title: 'Specialise to escape the bidding war',
        body: 'European, diesel, EV, transmissions, fleet, ceramic coating — a specialisation cuts the competitor set and raises the average ticket at the same time. We build the pages and campaigns around what you want more of rather than chasing every "mechanic near me" click against every shop in town.',
      },
      {
        title: 'Plan for the weather',
        body: 'Air conditioning in the first hot week, batteries in the first hard freeze, detailing before holidays and sales. Demand in this category spikes on a predictable calendar, and campaigns that are already live and bid up when the spike hits capture it while slower competitors are still reacting.',
      },
    ],
    expandedContext: [
      'A second location changes what you can rank for in a way more content never will — two Business Profiles, two service areas, two sets of local reviews. If growth is the goal, the marketing plan and the real-estate plan are connected.',
      'For collision and higher-ticket work, the customer often calls their insurer before they call a shop and does not know they can choose where the car goes. A direct-to-owner strategy — being visible and trusted before the accident, and clear about the choose-your-shop right after — is a different and more durable play than competing only for the people already searching.',
    ],
    signals: [
      {
        label: 'Calls and booked jobs from the Business Profile',
        body: 'Tracked separately from website conversions, because for this category the profile is often the whole funnel. Call volume and booked appointments are the read.',
      },
      {
        label: 'Average ticket by service line',
        body: 'Specialisation should be pulling the mix toward higher-value work. If the phone is ringing but tickets are flat, the targeting is too broad.',
      },
      {
        label: 'Review recency and rating trend',
        body: 'Recent reviews move map-pack position and conversion together. A slowing review flow is an early warning for both.',
      },
      {
        label: 'Seasonal capture',
        body: 'Whether you actually caught the AC, battery or pre-holiday spike this year — campaigns live and funded ahead of the curve versus scrambling after it started.',
      },
    ],
    channelNotes: {
      seo: 'Google Business Profile, service and specialisation pages, and a review workflow tied to the service write-up — the map-pack fundamentals.',
      paid: 'Search bid up ahead of seasonal spikes, Local Services Ads where eligible, and offer campaigns for the slower weeks.',
      website: 'Clear service and pricing-context pages, easy appointment booking, and specialisation pages that justify a higher ticket.',
    },
  },

  'home-services': {
    approach: [
      {
        title: 'Own the map pack, then the after-hours call',
        body: 'The emergency jobs come from the local three-pack, so that is where the first work goes: complete trade and service categories, accurate hours including nights and weekends, real photos of your crews and trucks, and a steady flow of recent reviews. Then we make sure the after-hours ad schedule is live and the phone path actually books a truck — because the map-pack ranking is wasted if the third ring goes to voicemail.',
      },
      {
        title: 'A campaign per trade, paced to the season',
        body: 'HVAC, plumbing and roofing have different search terms, different competitors, different margins and completely different calendars. We run each as its own campaign with its own budget, and we pace that budget against the forecast — bid up before the heat wave or the freeze, hold a base through the shoulder season, surge within days of a storm. One blended campaign spends your winter budget on summer clicks.',
      },
      {
        title: 'Separate the $99 call from the $12,000 job',
        body: 'A drain clear and a full system replacement are different buyers on different timelines, and marketing them the same way wastes budget on both ends. Emergency and low-ticket work gets proximity-and-speed campaigns and instant booking; replacements, repipes and re-roofs get research-stage content, financing messaging, and a quote-request conversion with real follow-up. Reporting is split by job type so you can see which one is paying.',
      },
    ],
    expandedContext: [
      'The other constant is the trust deficit. Home-services buyers have heard the horror stories — the surprise upsell, the storm-chaser who vanished, the "diagnostic fee" that became a four-figure bill — so the companies that win lead with the things a bad operator cannot fake: named technicians with photos, published pricing ranges, written estimates, a real warranty, and a review history that is long and specific rather than a recent burst of five stars.',
      'Financing is a quiet lever on the high-ticket work. A homeowner facing a $9,000 system replacement or a $15,000 re-roof is often choosing between "do it now on a payment plan" and "patch it and wait" — and the company that makes the monthly number visible early, on the page and in retargeting, captures the jobs the others lose to hesitation.',
    ],
    signals: [
      {
        label: 'Booked jobs by trade',
        body: 'Not calls — trucks actually dispatched or estimates actually scheduled, tagged to the trade and the campaign. This is the number each per-trade campaign lives or dies on.',
      },
      {
        label: 'Call answer rate and time to dispatch',
        body: 'How many campaign calls are answered live, and how fast a truck is booked, tracked with recordings. For emergency work this is usually where jobs are won or lost, and it is fixable in weeks.',
      },
      {
        label: 'Average ticket and replacement share',
        body: 'Whether the mix is moving toward the higher-value work you want. A ringing phone with a flat, low average ticket means the targeting is pulling coupon shoppers.',
      },
      {
        label: 'Seasonal capture',
        body: 'Whether you were live, funded and bid up before this year’s heat wave, freeze or storm — versus scrambling to catch up a week after it started.',
      },
    ],
    channelNotes: {
      seo: 'Google Business Profile per location, a page per trade and per town you cover, and a review workflow the technician triggers at the end of the job.',
      paid: 'Local Services Ads (verification and weekly lead disputes handled), plus search campaigns bid up ahead of the season and offer campaigns for the slow weeks.',
      website: 'Trade and town pages with upfront pricing ranges, financing on the replacement work, and the shortest possible path to booking a service call.',
    },
  },

  'marketing-agencies': {
    approach: [
      {
        title: 'Your brand on every deliverable, no exceptions',
        body: 'Reports, dashboard logins, even the naming convention on files carry your agency’s identity. We do not attach our logo anywhere a client could see it, and we do not reach out to a client directly — every message, every file, every status update goes through you first. The account should feel, from the client’s side, indistinguishable from work your own team produced.',
      },
      {
        title: 'We work from your strategy, not around it',
        body: 'A fulfillment engagement starts with your existing brand guidelines, account history and whatever strategy is already agreed with the client, not a blank slate. If we think something in the current approach is a mistake, we flag it to you, not to the client, and you decide what changes. The strategic relationship stays yours.',
      },
      {
        title: 'Scoped to the gap, not a fixed package',
        body: 'An agency that needs one overflow account covered for a quarter and an agency handing us an entire channel permanently are different engagements, priced differently. We scope per account — sometimes per deliverable — rather than sell a standard retainer that does not match what you actually need covered.',
      },
    ],
    expandedContext: [
      'The accounts that go well share a pattern: the agency treats the relationship as an extension of its own delivery team, gives real context on the client (history, sensitivities, what has already been tried and failed) rather than a bare brief, and keeps one point of contact on each side so nothing gets lost in a forwarded email chain. The accounts that go badly are usually ones handed over with no context and reviewed only when the client complains.',
      'Pricing conversations are worth having early and honestly. Fulfillment makes sense while an account is below the volume that justifies a dedicated hire, or while you are testing whether a channel is worth building in-house at all. Once a channel is consistently full-time work across several accounts, running it internally can end up cheaper — we would rather tell you that than keep an engagement running past the point it still makes sense for you.',
    ],
    signals: [
      {
        label: 'Client retention on fulfilled accounts',
        body: 'The account stays and renews at the same rate as your directly-run accounts. If a fulfilled account is churning faster than the rest of your book, something in the handoff or the work itself needs attention.',
      },
      {
        label: 'Turnaround on client requests',
        body: 'How long it takes a request that comes through you to reach the client with an answer. Fulfillment should not add a visible delay to how fast your agency responds.',
      },
      {
        label: 'Escalations that reach you before they reach the client',
        body: 'Whether problems — a platform issue, a missed deadline risk, a strategy question — surface to you with time to manage them, rather than showing up as a surprised client email.',
      },
      {
        label: 'Margin held on the account',
        body: 'Whether the retainer you charge the client still leaves the margin you priced for once fulfillment cost is subtracted. This is the number that tells you whether an account should stay outsourced or move in-house.',
      },
    ],
    channelNotes: {
      seo: 'Technical audits, page architecture and content run to the same standard as our own direct accounts, reported in your format or ours, rebranded.',
      paid: 'Daily account management on Google, Meta and programmatic — bids, negatives, creative testing — not a platform left on autopilot between monthly check-ins.',
      website: 'Builds run from your agency’s design files or ours, QA’d for Core Web Vitals and mobile before handoff, with hosting and maintenance scoped separately.',
    },
  },
};

export const subIndustryExtras: Record<string, SubIndustryExtra> = {
  // ── Lawyers ────────────────────────────────────────────────────────────────
  'personal-injury': {
    expandedContext: [
      'The metric that matters is cost per signed case, and it takes months to stabilise because signed cases lag the click. In the meantime you have to judge the campaign on the steps in between: signed retainers by case type, call answer rate, how many inquiries clear conflicts and your case criteria. A campaign that is buying more of the trucking and premises cases you want is working even before the fees arrive.',
    ],
    checklist: [
      'Conversion tracking that ties a signed retainer — not a form fill — back to the campaign and case type',
      'After-hours call coverage that can qualify the matter and book a consultation, not just take a message',
      'Result content kept on pages your compliance reviewer has signed off, with the required disclaimers',
      'A weekly search-term review so broker-style and out-of-scope clicks become negative keywords',
    ],
  },
  'family-law': {
    expandedContext: [
      'Family law buyers research privately over weeks, often late at night, and visit several times before calling — which quietly breaks last-click attribution and makes patient, unpressured content do the selling. They price-shop hard against flat-fee and DIY services, so the consultation has to sell judgment rather than paperwork, and screening needs to happen before the calendar slot is booked so your attorneys are not spending the week on matters they cannot take.',
    ],
    checklist: [
      'Content that answers the common questions without pressure, so it earns the visit over weeks of research',
      'A short intake form plus phone qualification for conflicts, county, income and case type before booking',
      'A review request process that makes first-name or initials-only an explicit, comfortable option',
      'Clear explanation of what drives cost — contested vs uncontested, custody, discovery — instead of a price list',
    ],
  },
  'criminal-defense': {
    expandedContext: [
      'The person searching is often a spouse or parent, on a phone, at an hour when your office is closed, and they will call three firms in the next twenty minutes. Speed to a live, capable answer beats every other variable. Pages built by charge and by the courts you actually appear in will rank and convert; generic city pages with the offense swapped in do neither.',
    ],
    checklist: [
      'An answering path that qualifies the charge, confirms the county and books a same-day consult around the clock',
      'A dedicated page per charge type you want, covering penalties and what happens at arraignment',
      'County and courthouse pages for the jurisdictions you practise in, written from real experience',
      'Enough fee-structure signalling early in the call to end unaffordable inquiries quickly and respectfully',
    ],
  },
  'immigration-law': {
    expandedContext: [
      'Demand moves with policy, not the calendar — a rule change can multiply searches for one category overnight and flatten another. Prospects search in several languages, often from outside the US, and many have been burned by notarios, so trust signals do more work here than in any other practice area. Case values run from a single filing to years of removal defense, so a blended cost per lead hides more than it shows.',
    ],
    checklist: [
      'Properly translated practice-area pages with their own URLs for the languages your clients actually use',
      'Phone coverage in the language each ad is written in — the most common point of failure',
      'A shortlist of secondary practice areas with pages already built, ready to take budget when policy shifts',
      'Reporting split by case type and value, not a single blended cost-per-lead number',
    ],
  },
  'estate-planning': {
    expandedContext: [
      'Estate planning is a "someday" purchase that a life event — a birth, a diagnosis, a death in the family, a house purchase — suddenly makes urgent. The marketing job is to be the name that is already familiar when that moment arrives, through steady educational content and local presence, rather than to catch a burst of high-intent search that barely exists. Flat-fee packages convert better when priced openly; hourly work does not.',
    ],
    checklist: [
      'Educational content on wills, trusts, powers of attorney and probate that builds familiarity over time',
      'Clear, openly-priced flat-fee packages where you offer them',
      'Seminar or workshop promotion as a lead path, since this audience responds to education-first offers',
      'Referral-source visibility — financial advisors, CPAs — treated as a channel alongside search',
    ],
  },

  // ── Medical ────────────────────────────────────────────────────────────────
  dentists: {
    expandedContext: [
      'General dentistry competes on proximity, insurance acceptance and reviews — a map-pack and Business Profile game. High-value work — implants, clear aligners, cosmetic, full-arch — behaves like elective retail, with a longer consideration window and real price comparison, and often justifies its own campaigns and landing pages separate from the "new patient" funnel.',
    ],
    checklist: [
      'A Google Business Profile with current hours, full service list, real photos and a steady review flow',
      'Separate landing pages and campaigns for high-value procedures, not just a general new-patient page',
      'Online scheduling wired into campaigns, with the phone path kept short for everyone else',
      'Insurance and financing information visible early, since it is a top pre-booking question',
    ],
  },
  chiropractors: {
    expandedContext: [
      'Chiropractic demand is a mix of acute pain ("back pain relief near me", ready to book today) and longer-term wellness patients. The acute searches are proximity- and review-driven and convert fast; the wellness side needs education and trust-building. New-patient offers work in this category but have to stay within your state board’s advertising rules.',
    ],
    checklist: [
      'Fast-loading pages for acute-pain searches with same-day or next-day booking front and centre',
      'New-patient offer messaging checked against state board advertising rules before it runs',
      'A review workflow built into the visit, since acute patients rarely return to leave one unprompted',
      'Condition pages that educate without over-claiming on outcomes',
    ],
  },
  'med-spa': {
    expandedContext: [
      'Med spa is elective, cash-pay and heavily visual, sitting between healthcare and beauty retail. Buyers compare providers, read reviews obsessively and want to see real results, but platform rules on before-and-after imagery and outcome claims are strict. The winning approach pairs a strong social and search presence with landing pages that reassure a nervous first-time client.',
    ],
    checklist: [
      'Before-and-after and results content handled within platform and regulatory rules',
      'Paid social built around your actual treatment menu and your highest-margin services',
      'Landing pages that address safety, provider credentials and what the first visit is like',
      'A booking flow and consultation offer that lowers the commitment for a first-time client',
    ],
  },
  estheticians: {
    expandedContext: [
      'Solo and small-studio estheticians run on repeat visits and referrals, so the marketing job is as much retention and rebooking as new-client acquisition. Instagram and local search carry most of the discovery. A hidden-address, service-area setup is common, which changes how the Google Business Profile has to be configured.',
    ],
    checklist: [
      'A correctly configured service-area Business Profile if you do not take walk-ins',
      'A rebooking and membership prompt built into checkout, since repeat visits are the economics',
      'A simple, mobile-first booking page linked everywhere your name appears',
      'Referral incentives that stay inside advertising and licensing rules',
    ],
  },
  'physical-therapy': {
    expandedContext: [
      'Physical therapy demand splits between insurance-referred patients and the growing cash-pay and direct-access segment. Direct access varies by state and changes what you can market. Cash-pay clients — athletes, post-surgical, chronic pain — research more and respond to specialisation and outcome-focused content.',
    ],
    checklist: [
      'Clear messaging on direct access and what patients can do without a physician referral in your state',
      'Specialisation pages — sports, post-op, pelvic health, chronic pain — rather than one generic PT page',
      'Insurance and cash-pay pricing context visible before the call',
      'A referral-relationship plan for physicians and surgeons alongside consumer search',
    ],
  },
  'urgent-care': {
    expandedContext: [
      'Urgent care is almost pure proximity and immediacy: someone is sick or hurt now and wants the closest open clinic with a reasonable wait. Current hours, real-time wait information, insurance acceptance and map-pack position are the whole game. Website depth matters far less than the accuracy of the Business Profile.',
    ],
    checklist: [
      'Business Profile hours, services and wait-time information kept accurate in real time',
      'Insurance and self-pay information immediately visible',
      'Location pages with directions, parking and what to bring, one per clinic',
      'Map-pack position monitored for the "urgent care near me" cluster in each service area',
    ],
  },
  'massage-therapy': {
    expandedContext: [
      'Massage therapy spans clinical and relaxation demand, and the two buyers want different things. Clinical clients — injury, chronic pain, referral-driven — respond to therapist credentials and modality specifics. Relaxation and gifting demand is seasonal and price-aware. Membership and package models change the acquisition math because lifetime value is front-loaded.',
    ],
    checklist: [
      'Separate messaging for clinical vs relaxation demand rather than one blended page',
      'Online booking with therapist and modality selection, linked from every listing',
      'A membership or package prompt at checkout, since retention is where the margin is',
      'Seasonal gift-certificate campaigns timed to the holidays and local events',
    ],
  },

  // ── Real Estate ────────────────────────────────────────────────────────────
  realtor: {
    expandedContext: [
      'An individual agent or small team competes on personal brand and local knowledge, not on outspending a brokerage. The durable assets are your name in your neighbourhoods, a database of past clients and sphere, and a repeatable listing-marketing system. Portal leads can supplement that but should not be the whole strategy, because they are rented and resold.',
    ],
    checklist: [
      'A CRM you own, with follow-up sequences for buyer, seller and past-client contacts',
      'Genuine neighbourhood pages for the areas you want to be known for',
      'A repeatable just-listed / just-sold marketing system so every listing builds visibility',
      'Lead-source capture at intake so slow-building channels get credit for assisted conversions',
    ],
  },
  investors: {
    expandedContext: [
      'Investor and "we buy houses" marketing is a motivated-seller game measured on cost per contract, and it competes against national wholesalers with large budgets. Sellers in this segment are often in distress and value speed and certainty over price, so response time and a credible, straightforward process matter more than polish.',
    ],
    checklist: [
      'Speed-to-lead measured in minutes, with an answering path that can qualify motivation and timeline',
      'Landing pages that lead with certainty and speed rather than competing on offer price',
      'Tracking through to signed contracts and closed deals, not just form fills',
      'A follow-up sequence for the majority of sellers who are not ready on first contact',
    ],
  },
  'property-management': {
    expandedContext: [
      'Property management marketing targets owners, not tenants, and an owner relationship is worth years of recurring management fees, so cost per acquired door can be relatively high and still pay. Owners compare on fee structure, communication and how you handle maintenance and vacancy. The sales cycle is longer and more consultative than most real-estate lead gen.',
    ],
    checklist: [
      'Owner-focused pages and campaigns kept entirely separate from any tenant-facing content',
      'Clear fee structure and service scope, since that is the first thing an owner compares',
      'Lead tracking through to signed management agreements and doors under management',
      'A nurture sequence for owners who are evaluating but not switching yet',
    ],
  },
  'property-owners-finding-buyers': {
    expandedContext: [
      'Owners marketing a property directly — land, commercial, FSBO, or a specialised asset — need reach to a qualified buyer pool without the standard MLS distribution. The job is targeted exposure to the right buyer type and a page that answers the specifics: zoning, income, condition, terms. Broad consumer traffic is mostly noise here.',
    ],
    checklist: [
      'A single-property page that answers the buyer-type-specific questions up front',
      'Targeting aimed at the specific buyer pool — investors, developers, owner-users — not general search',
      'Inquiry qualification that filters for genuine, funded interest before your time is booked',
      'Retargeting to keep the property in front of buyers through a long consideration window',
    ],
  },

  // ── Education ──────────────────────────────────────────────────────────────
  'private-schools': {
    expandedContext: [
      'Everything runs on the admissions calendar: awareness in the fall, applications and financial aid in winter, decisions and re-enrolment in spring, a summer window for late movers. Two people have to be convinced — the parent who pays and the child who has to want to go. Tours, not inquiries, are the real conversion event, and retention matters as much as recruitment because a family that stays is many years of tuition.',
    ],
    checklist: [
      'A campaign calendar aligned to your admissions season rather than flat year-round spend',
      'Landing pages that speak to both the parent’s and the student’s questions',
      'Tour booking as the primary call to action, with a short inquiry-to-visit gap',
      'A re-enrolment communication plan running alongside new-family recruitment',
    ],
  },
  universities: {
    expandedContext: [
      'Prospects search by programme, career outcome and format — online, evening, accelerated — not by institution name. Web governance sits centrally while every dean wants their programme promoted, so the bottleneck is often internal rather than in the market. The cycle from first touch to census is long enough that campaigns get judged before they can fairly be measured, and outcome claims carry disclosure obligations.',
    ],
    checklist: [
      'Programme pages built around career outcome and format, matching real search language',
      'A CRM and nurture flow that survives a months-long consideration cycle',
      'Agreed leading indicators — applications started, RFI-to-applicant rate — so campaigns are not judged only on census',
      'Outcome and salary claims kept within accreditation and disclosure rules',
    ],
  },
  'trade-schools': {
    expandedContext: [
      'Getting inquiries is easy — broad interest targeting will bury you in them. Turning them into students who show up on day one is the whole problem, and the biggest lever is minutes to first contact. Enrolment runs as a series of start dates, so every campaign works against a deadline, and financial aid is where most decisions stall. Federal rules restrict what you can claim about placement and how recruiters are paid.',
    ],
    checklist: [
      'Speed-to-lead measured in minutes, with staffed follow-up against every start date',
      'Financial-aid guidance surfaced early, since that is where enrolments stall',
      'Campaigns structured around start dates with clear application deadlines',
      'Placement and salary messaging kept inside federal and accreditation rules',
    ],
  },

  // ── Automotive ─────────────────────────────────────────────────────────────
  'auto-repair': {
    expandedContext: [
      'The local map pack shows three results and takes most of the calls, so proximity, review recency and Business Profile completeness outrank almost everything on your website. A second location changes what you can rank for more than any amount of content. Specialising — European, diesel, EV, transmissions, fleet — cuts competition and raises ticket value, and demand spikes with the weather.',
    ],
    checklist: [
      'A complete, current Google Business Profile with services, photos and a live review flow',
      'A review request tied to the service write-up, so it actually happens every time',
      'Specialisation pages for the higher-ticket work you want more of',
      'Seasonal campaigns funded and live ahead of the AC and battery spikes, not after',
    ],
  },
  'auto-detailing': {
    expandedContext: [
      'Mobile and shop-based detailing are different marketing problems: a mobile operator is a service-area business with a hidden address and a defined radius, while a shop competes on location and can hold vehicles for multi-day work. Price anchoring against tunnel washes is constant, so the sale is transformation and protection, not cleaning. Ceramic coating and paint protection film are considered purchases with a different buyer.',
    ],
    checklist: [
      'A service-area Business Profile configured correctly if you operate mobile',
      'Before-and-after visual content that sells transformation over "clean"',
      'Separate pages and campaigns for ceramic coating and PPF, aimed at that higher-consideration buyer',
      'Booking that captures vehicle type and service level up front to keep quoting fast',
    ],
  },
  'collision-repair': {
    expandedContext: [
      'Your customer just had a bad day and usually calls the insurer before they call a shop — and most do not know they have the right to choose where the car goes. That gap is the whole opportunity for a direct-to-owner strategy. Direct repair programmes trade margin for volume, weather events can fill and then empty your schedule, and tow operators, dealers and fleets remain the steady referral sources.',
    ],
    checklist: [
      'Content and campaigns that make the choose-your-own-shop right clear, before and after an accident',
      'A direct-to-owner presence so you are not wholly dependent on DRP volume',
      'Referral-relationship marketing for tow operators, dealers and fleet accounts',
      'Capacity-aware campaign pacing so spend eases when the weather has already filled the bays',
    ],
  },

  // ── Marketing Agencies ───────────────────────────────────────────────────────
  'white-label-seo': {
    expandedContext: [
      'The accounts that churn are almost always the ones where SEO was sold as a line item and then run as one — a handful of thin blog posts a month with no technical work underneath them. We start every fulfillment SEO account with the same audit we run on direct clients: crawl errors, page architecture, Core Web Vitals, and whether the content plan is actually built around what the client’s customers search for, not a generic template with the industry name swapped in.',
    ],
    checklist: [
      'A technical audit before any content work starts, not after a client asks why nothing has moved',
      'Page architecture built around the client’s real services and locations, not a single blended "Services" page',
      'Reporting format that matches how you already talk to the client, rebranded under your name',
      'A clear escalation path to you — not the client — if a technical or account access issue comes up',
    ],
  },
  'white-label-ppc': {
    expandedContext: [
      'A paid account is the fastest place a client notices thin fulfillment, because the spend and the results sit in the same dashboard every day. We treat white-label PPC accounts exactly like direct ones: daily attention to search terms and bids, structured tests on creative, and budget pacing that reacts to performance rather than a platform left to run itself between monthly check-ins.',
    ],
    checklist: [
      'Daily account management, not a weekly or monthly glance at the dashboard',
      'A clear line on who holds platform-level account access versus who sees the white-label report',
      'Search-term and negative-keyword review on a real cadence, not only when spend looks off',
      'A defined process for strategy changes to route through you before they reach the client',
    ],
  },
  'white-label-web-design': {
    expandedContext: [
      'Web projects are the most common first thing an agency outsources, because the need is intermittent rather than constant. The risk is a site that looks finished in a handoff deck but was never checked against Core Web Vitals or real mobile devices — problems that surface after launch, on the client’s time, and become your agency’s problem to explain. We run every build against a QA pass before handoff, whether the design came from your team or ours.',
    ],
    checklist: [
      'A written brief and timeline agreed before build starts, with the real deadline stated upfront',
      'A Core Web Vitals and mobile QA pass before anything is called finished',
      'A clear decision on who hosts and maintains the site after launch',
      'Revision rounds routed through your project lead, not directly to the client',
    ],
  },
};

/**
 * Expanded About-page copy.
 *
 * FAQ questions 1-6 are the exact questions from the live WordPress About page;
 * the answers were written for this rebuild. Questions 7-8 were added for the
 * refresh. No invented figures, client names or review counts anywhere — where
 * a number would help, the copy explains what drives it instead.
 */
import type { Faq } from './geo/types';

export const about = {
  missionHeadline:
    'Our job is to turn your marketing budget into booked work you can trace back to the ad that caused it.',
  missionHighlight: 'booked work you can trace back',
  missionBody: [
    'ITZ Digital exists because small businesses keep paying agency retainers and never find out what they bought. Owners get a slide of impressions and a bill. We started the other way around: pick the number that matters to your business — a signed case, a booked appointment, a listing appointment, an enrolled student, a car sold — and work backward to the channels that move it.',
    'We work with owner-operators and practice managers in six fields: law, medicine and dentistry, real estate, education, automotive, and home services. Those six share a pattern — high-value inquiries, a phone that has to get answered, and rules about what you can claim in an ad. Knowing those rules is most of the job. If your business does not fit, we will say so.',
    'Everything we run is built to keep working after the invoice clears. A paid campaign stops the day you stop funding it; a clean site, a complete Google Business Profile and a page structure that matches real search demand keep earning clicks for months. We treat paid as the fast lane and organic as the asset, and we move budget between them as the account matures.',
  ],
  perks: [
    'You own every account — ads, analytics, domain, website — from day one, and keep them.',
    'Reporting starts with booked calls, forms and appointments; impressions and clicks come second.',
    'We only work in seven industries, so we already know your compliance rules and buying cycle.',
    'If a channel is wrong for you, we say so before you spend, not after.',
    'Month-to-month agreements. No multi-year lock-in, no exit fee for taking your accounts with you.',
    'You work with the person running the account, not an account manager relaying messages to a media desk.',
  ],
  whatWeDoHeadline:
    'We run the whole path from a stranger seeing your name to a customer on the phone.',
  whatWeDoHighlight: 'the whole path',
  whatWeDoBody:
    "Six things, mostly. Programmatic advertising puts your ad on the screens your buyers already use: TV, phone, radio apps, billboards. We design and build the website those ads point at, then host it, patch it and keep it fast, because a slow site is an expensive way to lose a click. SEO earns the traffic you don't pay per click for. We buy and manage social ads on Facebook, Instagram and beyond. And we watch your reviews, so the first thing people read isn't the worst thing anyone wrote.",
  whatWeDoBodyExtra:
    'None of it runs in isolation. The keyword research that shapes your SEO also tells us which paid terms are worth bidding on. The call recordings from a paid campaign tell us which pages the site is missing. We keep the channels in one plan and one report so the spend can follow the results instead of the org chart.',

  industriesIntro:
    'A personal injury firm and a med spa both want more local calls, but almost nothing about how they get them is the same — the keywords, the compliance rules, the buying cycle and the definition of a good lead all differ. These are the six fields we have run enough campaigns in to be genuinely useful.',

  approach: [
    {
      title: 'Strategy before spend',
      body: 'Every engagement opens with an audit: what you rank for, where the paid money is going, whether the tracking is even accurate, and which three competitors are taking the calls you want. You get that read whether or not you hire us. It is the difference between a plan and a guess.',
    },
    {
      title: 'You own the asset',
      body: 'Your ad accounts, analytics, domain and site are set up in your name with us added as a user you can remove. Agencies that hold the accounts are solving their retention problem at your expense. If you leave, you leave with the campaign history, the creative and the data.',
    },
    {
      title: 'We will turn work down',
      body: 'Not every business needs paid social, and some should not run display at all. Saying that out loud costs us revenue in the quarter and keeps you as a client for years. We would rather run three channels well than bill you for six.',
    },
  ],

  process: [
    {
      phase: 'Week 1',
      title: 'Audit and baseline',
      body: 'A full read of current visibility, ad-spend efficiency, conversion tracking and the competitors ranking above you. We agree on the one or two numbers the engagement is judged against.',
    },
    {
      phase: 'Weeks 2–3',
      title: 'Fix the foundation',
      body: 'Tracking first — most accounts we inherit have broken or double-counted conversions. Then the technical and on-page issues that cap everything above them.',
    },
    {
      phase: 'Month 2',
      title: 'Launch and learn',
      body: 'Paid campaigns go live to cover the immediate gap while the organic work compounds underneath. Early creative and targeting get tuned against real conversion data, not projections.',
    },
    {
      phase: 'Months 3–6',
      title: 'Compound and reallocate',
      body: 'As organic rankings climb, paid budget is moved rather than increased. The mix shifts toward the channels your account is actually proving out.',
    },
    {
      phase: 'Ongoing',
      title: 'Report on jobs',
      body: 'Monthly reporting that leads with booked calls, forms and appointments. A 90-day review against the agreed numbers — if a channel is not earning its budget, we change the plan instead of defending it.',
    },
  ],

  workingWith: [
    'A lead strategist who runs your account end to end — not an account manager passing notes to a separate media team.',
    'Direct access by phone and email, with call recordings reviewed alongside your intake staff so wasted spend becomes better scripts and negative keywords.',
    'A single monthly report covering every channel, written in plain language, with the booked-work number at the top.',
    'A named point of contact who knows your market, your compliance constraints and what a good lead looks like for your business.',
  ],

  results: [
    {
      label: 'Cost per lead trends down',
      body: 'Cost per lead tends to fall over the first two quarters as organic rankings take on work that paid clicks were doing, and paid budget gets pointed at the terms that actually convert.',
    },
    {
      label: 'More inquiries become work',
      body: 'The share of inquiries that turn into booked jobs climbs as targeting tightens and the intake gaps — slow callbacks, after-hours voicemail — get closed.',
    },
    {
      label: 'Reporting gets shorter',
      body: 'Once tracking is right there is less to explain and more to show. The monthly report moves from "here is what we did" to "here is what it booked".',
    },
    {
      label: 'Attribution you can act on',
      body: 'You can answer "where did that customer come from?" for most of your new business, which changes how you set next quarter’s budget.',
    },
  ],

  faqs: [
    {
      question: "What if all impressions aren't delivered?",
      answer:
        "You only pay for what runs. Programmatic and display campaigns are billed on delivered impressions, so an underdelivery shows up as unspent budget rather than a charge. When we see a flight tracking behind pace, we tell you before the end date and give you the choice: extend the flight, widen the targeting, or take the money back. Underdelivery usually means the audience was drawn too tight — that's a signal worth acting on, not just a refund.",
    },
    {
      question: 'Can an ad be edited while the campaign is live?',
      answer:
        'Yes. Copy, images, landing page URLs, budgets and targeting can all change mid-flight. Two caveats. New creative goes back through platform review, which is usually minutes but can take a day. And on Google and Meta, edits reset the learning period, so an algorithm that had figured out who to show your ad to starts over. We batch small changes into a weekly release rather than nudging a campaign daily.',
    },
    {
      question: 'Do we get to keep the digital ads that ITZ built?',
      answer:
        "Yes. Ad creative we produce for you is yours — the layered files, the video cuts, the copy. Same for the accounts: Google Ads, Meta Business Manager and your analytics stay in your name, with us added as a user you can remove. Stock photography and licensed music are the one exception, since those licenses carry their own terms, and we'll tell you which assets they cover.",
    },
    {
      question: 'How quickly can we launch a campaign?',
      answer:
        "A paid search or social campaign on an existing account can be live in about a week. The gating item is almost never the ads — it's access, tracking and the page the click lands on. Programmatic flights need longer because inventory is booked ahead. Local Service Ads take longest: license and background checks run on Google's timeline, not ours. If you need something live sooner, we'll tell you which corners that cuts.",
    },
    {
      question: 'What should my budget be for a digital campaign?',
      answer:
        "Three things set it: what a click costs in your category and metro, what one customer is worth to you, and how many you can actually handle. A personal injury click costs many times what a dental hygiene click costs, so the same budget buys very different volume. Work backward — take the revenue from one closed job, decide what you'd pay to win it, and multiply by the jobs you want. We'll price your market before you commit.",
    },
    {
      question: 'How long before we can tell if this is working?',
      answer:
        "Paid ads tell you inside two to four weeks whether the offer and targeting are right, though bidding needs roughly a month of conversion data before it steadies. SEO is slower: expect first ranking movement around 90 days and meaningful lead volume between months four and six. We set a review at 90 days against agreed numbers. If a channel isn't earning its budget by then, we move the money instead of defending the plan.",
    },
    {
      question: 'Do you work with businesses outside your seven industries?',
      answer:
        'Sometimes. If your business runs on local search — a phone that has to get answered, high-value inquiries, a defined service area — the playbook usually transfers. What we will not do is take on a category we have never run and learn it on your budget. Tell us what you do and we will give you an honest answer about whether we are the right fit or whether a specialist in your field would serve you better.',
    },
    {
      question: 'What happens in the first 90 days?',
      answer:
        'Week one is the audit and agreeing the numbers we will be judged on. Weeks two and three are fixing tracking and the technical foundation. Month two is launching paid to cover the immediate gap while the organic work builds. By day 90 you have a review against the agreed targets and a clear decision about where the next quarter’s budget goes.',
    },
  ],
} satisfies {
  missionHeadline: string;
  missionHighlight: string;
  missionBody: string[];
  perks: string[];
  whatWeDoHeadline: string;
  whatWeDoHighlight: string;
  whatWeDoBody: string;
  whatWeDoBodyExtra: string;
  industriesIntro: string;
  approach: { title: string; body: string }[];
  process: { phase: string; title: string; body: string }[];
  workingWith: string[];
  results: { label: string; body: string }[];
  faqs: Faq[];
};

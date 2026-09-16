/**
 * Homepage prose. Kept in one file so the page component stays a thin layout.
 * House rules: no invented statistics, client names or review counts.
 */
import type { Faq } from './geo/types';

export const home = {
  differenceRows: [
    {
      title: 'A plan before a proposal',
      body: [
        'Every engagement opens with an audit — what you rank for, where the paid budget actually goes, whether the conversion tracking is even accurate, and the three competitors taking the calls you want. You get that read whether or not you hire us.',
        'It is the difference between a strategy and a guess, and it is the reason we can tell you on the first call whether a channel is worth your money.',
      ],
      image: '/images/home/process.webp',
      imageAlt: 'A marketing strategy mapped as a path of milestones leading to a growth chart',
      kicker: 'How we are different',
    },
    {
      title: 'Seven industries, learned properly',
      body: [
        'We work in law, medicine and dentistry, real estate, education, automotive, home services and white-label fulfillment for marketing agencies — and nothing else. That means we already know your compliance rules, your buying cycle and what a good lead looks like before the kickoff call.',
        'A generalist agency learns your industry on your budget. We would rather run seven verticals well than a hundred generic accounts.',
      ],
      image: '/images/home/difference.webp',
      imageAlt: 'Seven distinct doorways representing specialised industries versus one generic option',
      kicker: 'How we are different',
    },
    {
      title: 'Reporting that leads with booked work',
      body: [
        'Impressions and clicks are inputs. The number that settles an argument is how many people called and how many of those became work. Every report we send leads with that, in plain language.',
        'And you own every account it comes from — ads, analytics, domain, website. If you leave, you leave with all of it.',
      ],
      image: '/images/home/reporting.webp',
      imageAlt: 'A dashboard where the headline metric is a booked appointment rather than impressions',
      kicker: 'How we are different',
    },
  ],

  howWeWork: [
    {
      phase: 'Week 1',
      title: 'Audit and agree the target',
      body: 'A full read of your visibility, ad-spend efficiency and tracking accuracy, and we agree on the one or two numbers the engagement will be judged against.',
    },
    {
      phase: 'Weeks 2–3',
      title: 'Fix the foundation',
      body: 'Conversion tracking first — most accounts we inherit have it broken. Then the technical and on-page issues that cap everything above them.',
    },
    {
      phase: 'Month 2',
      title: 'Launch the fast lane',
      body: 'Paid campaigns go live to cover the immediate gap while the organic work compounds underneath. Early creative is tuned against real conversion data.',
    },
    {
      phase: 'Months 3–6',
      title: 'Compound and reallocate',
      body: 'As organic rankings climb, paid budget is moved rather than increased. A 90-day review against the agreed numbers decides where the next quarter goes.',
    },
  ],

  faqs: [
    {
      question: 'What does it cost to work with you?',
      answer:
        'It depends on your market and your goal. What a click costs in your category, what one customer is worth to you, and how many you can handle all set the number — a personal injury click costs many times a dental hygiene click, so the same budget buys very different volume. We price your specific market during the free audit, so you see the plan and the price together before you commit to anything.',
    },
    {
      question: 'Do I have to sign a long contract?',
      answer:
        'No. Agreements are month-to-month. There is no multi-year lock-in and no exit fee for taking your accounts with you — because your ad accounts, analytics, domain and website are set up in your name from day one, with us added as a user you can remove.',
    },
    {
      question: 'How soon will I see results?',
      answer:
        'Paid ads tell you within two to four weeks whether the offer and targeting are right, though bidding needs about a month of conversion data to steady. SEO is slower: first ranking movement around 90 days, meaningful lead volume between months four and six. We set a formal review at 90 days against the numbers we agreed at the start.',
    },
    {
      question: 'Which channel should I start with?',
      answer:
        'For most clients SEO is the foundation because it compounds and lowers cost per lead over time, with paid search layered on top to cover the gap while it builds. But the honest answer comes out of the audit — if you need cases or patients booked this month and have no organic history, paid comes first. We tell you which, and why.',
    },
    {
      question: 'Do you work outside your seven industries?',
      answer:
        'Sometimes. If your business runs on local search — a phone that has to get answered, high-value inquiries, a defined service area — the playbook usually transfers. What we will not do is take on a category we have never run and learn it on your budget. Tell us what you do and we will give you an honest answer.',
    },
  ],
} satisfies {
  differenceRows: { title: string; body: string[]; image: string; imageAlt: string; kicker: string }[];
  howWeWork: { phase: string; title: string; body: string }[];
  faqs: Faq[];
};

import type { Faq } from './geo/types';

export type SubIndustry = {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  painPoints: string[];
  /** Longer-form context rendered below the problem/fix split. */
  context?: string;
  faqs?: Faq[];
};

export type Industry = {
  slug: string;
  name: string;
  headline: string;
  summary: string;
  /** Lucide icon name, resolved in the component layer. */
  icon: 'Scale' | 'Stethoscope' | 'Home' | 'GraduationCap' | 'Car' | 'Wrench' | 'Handshake';
  stat: { value: string; label: string };
  children: SubIndustry[];
  /** Two paragraphs of deeper context, rendered as its own section. */
  context?: string[];
  /** Vertical-specific reasons to work with us. */
  perks?: string[];
  faqs?: Faq[];
};

export const industries: Industry[] = [
  {
    slug: 'lawyers',
    context: [
      "Legal buyers rarely browse. They search a specific problem \u2014 a charge, a deadline, a phrase from a letter that just arrived \u2014 open three or four tabs, read the attorney bio and the recent reviews, then call whoever answers. For urgent matters that comparison takes minutes. For family or estate work it runs for weeks, so fast intake and patient, unpressured content both have to exist.",
      "That changes the mix. Paid search is priced at a level where a wasted click hurts, so Local Services Ads, practice-area pages and review velocity do work that budget alone cannot. State bar advertising rules limit what your ads and testimonials can claim, and directory sites hold positions you have to work around rather than outrank."
    ],
    perks: [
      "Practice-area pages and ad copy reviewed against your state bar's advertising rules before anything goes live.",
      "Call recordings reviewed with your intake team, so wasted spend turns into negative keywords and better scripts.",
      "Local Services Ads handled end to end: licensing, insurance and background checks through to the Google Screened badge.",
      "Reporting by case type and signed matter, not by form fill, so you can see which practice area pays."
    ],
    faqs: [
      {
        "question": "Why is our cost per click so much higher than what other businesses pay?",
        "answer": "Because every click is worth a case, and your competitors know it. Legal terms are bid up by firms with large advertising budgets and by lead brokers reselling the same click. You do not fix that by matching their bid. You fix it by narrowing to the case types you actually want, keeping the search terms clean weekly, and converting a higher share of the calls you already get."
      },
      {
        "question": "Will your ads get me in trouble with the state bar?",
        "answer": "No, because we write to your state's rules and you approve everything before it runs. Advertising rules vary by state: some restrict testimonials, some require disclaimers on results, some govern the words specialist and expert. We keep a copy of the applicable rules for your jurisdiction on file and flag any claim that needs your review. If your bar requires ad filing, we prepare the submission."
      },
      {
        "question": "Can we ever outrank Avvo, FindLaw and the other directories?",
        "answer": "For your own name and your narrow practice-area terms in your city, usually yes. For broad terms like personal injury lawyer plus your metro, directories often hold a slot no matter what you do, so the goal is to take one of the remaining positions and the map pack. That work runs six to twelve months in a competitive metro. Getting listed well on those directories is worth doing at the same time."
      },
      {
        "question": "We get calls but few signed cases. Is that a marketing problem?",
        "answer": "Usually it is a targeting problem, an intake problem, or both. Targeting: the campaign is buying case types you do not want or cannot take. Intake: the call goes to voicemail after hours, or nobody follows up on the second attempt. We listen to recorded calls with you to sort one from the other, then fix the campaign side and tell you plainly what has to change on yours."
      }
    ],
    name: 'Lawyers',
    headline: 'Marketing for law firms that competes on more than ad spend',
    summary:
      'Legal is the most expensive keyword set in local search. Winning it takes practice-area-specific pages, genuine authority signals, and bar-compliant ad copy — not a bigger budget.',
    icon: 'Scale',
    stat: { value: '$120+', label: 'Typical cost per legal click before optimisation' },
    children: [
      {
        slug: 'personal-injury',
        context: "Personal injury spend is judged on cost per signed case, not cost per lead, and that number takes months to stabilize because signed cases lag the click. Case types are not interchangeable \u2014 a trucking or premises claim is worth many times a minor soft-tissue rear-ender, so a cheaper lead can be the worse buy. You also compete with lead brokers and TV firms bidding the same terms, plus state bar rules on how you describe past results.",
        faqs: [
          {
            "question": "Should we buy leads from a broker or run our own campaigns?",
            "answer": "Run your own if you can staff intake. Broker leads are sold to several firms, arrive with no context, and give you nothing you keep when you stop paying. Your own campaigns cost more per lead at the start and take a few months to tune, but you own the account, the data and the pages. Most firms end up running both, then cut broker spend as their own cost per signed case drops."
          },
          {
            "question": "How do we tell if a campaign is working before cases resolve?",
            "answer": "Track the steps in between. Signed retainers by case type is the first honest signal, and it lands within weeks rather than years. Below that, watch call answer rate, time to first callback, and how many enquiries clear conflicts and your case criteria. If signed cases per month and the mix of case types both improve, the campaign is working even though the fee revenue is two years out."
          },
          {
            "question": "Can we advertise past settlements and verdicts?",
            "answer": "It depends on your state bar. Most allow it with disclaimers that prior results do not guarantee outcomes, and some require specific wording or restrict how prominently figures appear. Ad platforms apply their own review on top. We keep result claims on pages your compliance reviewer has signed off, and we avoid dollar figures in headlines and ad copy where the disclaimer cannot travel with the number."
          }
        ],
        name: 'Personal Injury',
        headline: 'Personal injury marketing that survives the bidding war',
        summary:
          'PI is the single most contested category in paid search. The firms that win are not outspending — they are converting a higher share of the same clicks with faster intake and better case-type targeting.',
        painPoints: [
          'Cost per click above $200 in competitive metros',
          'Referral and lead-broker leads with no attribution',
          'Intake teams losing signed cases to slow callbacks',
        ],
      },
      {
        slug: 'family-law',
        context: "Family law buyers research privately over weeks, often late at night and in incognito windows, and they visit several times before calling \u2014 which quietly breaks last-click attribution. They rarely leave reviews, because nobody wants a public record of their divorce. They price-shop hard against flat-fee and DIY services, so the consultation has to sell judgment rather than paperwork. Enquiry volume is uneven across the year; many firms see it lift after the holidays.",
        faqs: [
          {
            "question": "How do we get reviews when clients don't want to be named?",
            "answer": "Ask at the right moment and make the option to use initials or a first name explicit. Many clients will write something once they know their full name is not going to sit next to a custody case. Also collect reviews from referring advisors, opposing counsel who send conflicts your way, and consultations that did not become cases. Never draft reviews for clients or offer anything in exchange."
          },
          {
            "question": "Should we publish our fees?",
            "answer": "Publishing a consultation fee filters well. Publishing hourly rates or retainer amounts usually costs you cases, because a number without context reads as expensive next to a cheap online divorce. A better middle ground is explaining what drives cost \u2014 contested versus uncontested, custody disputes, discovery \u2014 so the prospect self-selects before the call. Firms with genuine flat-fee packages are the exception; those convert better when priced openly."
          },
          {
            "question": "Why do so many consultations never retain?",
            "answer": "Usually the screening happens too late. If conflicts, county, income and case type are not checked before the calendar slot is booked, your attorneys spend the week on matters they cannot take. Add a short intake form, have staff qualify by phone, and charge for the consultation if your volume supports it. Track retained cases per consultation as your main number \u2014 raw enquiry count tells you nothing here."
          }
        ],
        name: 'Family Law',
        headline: 'Family law marketing built for a sensitive, high-consideration search',
        summary:
          'Divorce and custody searches are private, repeated and emotionally loaded. Content that answers the question without pressure earns the consultation.',
        painPoints: [
          'Prospects research for weeks before contacting anyone',
          'Price shopping against flat-fee and DIY services',
          'Reviews that clients are reluctant to leave publicly',
        ],
      },
      {
        slug: 'criminal-defense',
        context: "The person searching is often not the defendant. It is a spouse or a parent, on a phone, at an hour when your office is closed, and they will call three firms in the next twenty minutes. Charges and courts are specific: a DUI in one county is a different sale from a felony in the next. Ability to pay filters hard, bar rules limit outcome claims, and volume rises around holiday weekends and enforcement pushes.",
        faqs: [
          {
            "question": "Is an answering service enough, or do we need an attorney on call?",
            "answer": "An answering service that only takes a message loses the case. One that can qualify the charge, confirm the county, book a same-day consultation and text a confirmation will hold most callers. What you cannot do is let calls roll to voicemail between evening and morning, because that is when the volume arrives. Whatever you choose, listen to call recordings monthly \u2014 that is where you find the leaks."
          },
          {
            "question": "Should we build pages by charge or by city?",
            "answer": "Charge first, then the courts you actually appear in. Someone searching a specific offense wants to read about that offense, the likely penalties and what happens at arraignment. Generic city pages with the charge swapped in rank badly and read worse. Once your charge pages are solid, county and courthouse pages add the local relevance, and they let you write something true rather than templated."
          },
          {
            "question": "How do we stop wasting time on callers who can't pay?",
            "answer": "Say enough about fee structure early that unaffordable calls end quickly, without publishing a price list that undercuts negotiation. Retainer ranges, payment plan availability and a clear statement that you are private counsel do most of the filtering. Train intake to ask about the charge and about payment in the same call. Court-appointed enquiries will still come in; a short, respectful referral answer saves everyone time."
          }
        ],
        name: 'Criminal Defense',
        headline: 'Criminal defense marketing for an urgent, after-hours search',
        summary:
          'Criminal defense leads arrive at 2am from a phone, often from a family member rather than the defendant. Speed to answer beats every other variable.',
        painPoints: [
          'Majority of enquiries outside business hours',
          'Charge-specific searches needing dedicated pages',
          'Competing against directory sites for every term',
        ],
      },
      {
        slug: 'immigration-law',
        context: "Demand here moves with policy, not with the calendar. A rule change or a filing window can multiply searches for one category overnight and flatten another. Your prospects search in several languages, often from outside the US, and many have been burned by notarios, so trust signals do more work than in any other practice area. Case values run from a single form filing to years of removal defense, so a blended cost per lead hides more than it shows.",
        faqs: [
          {
            "question": "Do we need a full Spanish-language site?",
            "answer": "If Spanish-speaking clients are a real share of your book, yes \u2014 properly translated pages with their own URLs, not a browser translate widget. Half-measures are visible and they cost trust. Start with the practice areas you actually want more of, translated by someone who knows immigration terminology, and make sure whoever answers the phone speaks the language the ad was written in. That last part is where most firms fall down."
          },
          {
            "question": "A policy change wiped out our main case type. What do we do with the budget?",
            "answer": "Move it quickly. Search demand shifts within days of an announcement, and the firms that reallocate first pick up the categories that just spiked. Keep a shortlist of secondary practice areas with pages already built so you are not writing from scratch mid-surge. Pause rather than delete the affected campaigns; policy reverses, and the historical performance data is worth keeping when it does."
          },
          {
            "question": "How do we compete with notarios and cheap form services?",
            "answer": "Do not compete on price \u2014 compete on consequence. Content explaining what happens when a filing is wrong, who is legally allowed to give immigration advice, and what a licensed attorney does differently converts the people considering the cheap option. Attorney bios, bar admissions, languages spoken and case-type depth all matter here. It is slower than a price message, and it brings clients who do not leave over a small fee difference."
          }
        ],
        name: 'Immigration Law',
        headline: 'Immigration law marketing across languages and jurisdictions',
        summary:
          'Immigration searches happen in multiple languages and reference visa categories most agencies have never heard of. Precision in the content beats volume.',
        painPoints: [
          'Multilingual search demand ignored by generic campaigns',
          'Policy changes that reshape demand overnight',
          'Long consideration cycles with heavy trust requirements',
        ],
      },
      {
        slug: 'estate-planning',
        context: "Nobody wakes up needing a will. Demand is triggered \u2014 a new baby, a diagnosis, a parent's death, a move to another state, a house purchase \u2014 so the job is being present and credible when the trigger hits rather than capturing existing search volume. That makes referral partners, seminars and email the backbone, with search catching the smaller share already looking. State-specific probate and trust rules mean generic national content will not carry the work.",
        faqs: [
          {
            "question": "Do seminars still work?",
            "answer": "For the right audience, yes, though attendance patterns changed and webinars now carry part of the load. The mechanics matter more than the format: a real venue or platform, a topic tied to a trigger event, a registration page you control, and an appointment offered in the room. Judge them on appointments booked and engagements signed, not on seats filled. Many firms run both and let cost per engagement decide the mix."
          },
          {
            "question": "How do we build referrals from financial advisors and CPAs?",
            "answer": "Treat it as a channel with a system, not as networking. Identify advisors whose clients look like your clients, give them something usable \u2014 a client-facing checklist, a short education session, a clear explanation of when to send someone over \u2014 and stay in front of them on a schedule. Track referrals by source. Most firms have three or four partners producing everything and never ask why the rest went quiet."
          },
          {
            "question": "Should we advertise flat fees for wills and trusts?",
            "answer": "A starting price stops you competing with online will services on their terms and filters out shoppers. Publish a floor with what it includes, and be clear about what pushes cost up \u2014 business interests, blended families, property in another state, taxable estates. Firms that hide price entirely get more calls and fewer engagements. Firms that publish one flat number get argued with when the matter turns out to be complicated."
          }
        ],
        name: 'Estate Planning',
        headline: 'Estate planning marketing for a low-urgency, high-value client',
        summary:
          'Nobody searches for a will urgently. Estate planning growth comes from staying visible through seminars, referral partners and evergreen content until the trigger event arrives.',
        painPoints: [
          'Low search volume relative to case value',
          'Competing with online will services on price',
          'Referral relationships that are never systematically worked',
        ],
      },
    ],
  },
  {
    slug: 'medical',
    context: [
      "Patients search a symptom or a procedure, not a practice name. They filter fast: is it close, is it open, does it take my insurance, do the recent reviews mention the front desk. Most of that decision happens on your Google Business Profile before anyone reaches your site. Then they call, and whether the phone gets answered decides the rest.",
      "The mix splits by procedure. Insurance-covered visits are won on proximity, reviews and profile accuracy. Elective and cash-pay work \u2014 implants, cosmetic, memberships \u2014 behaves like a consumer purchase and responds to paid social. Tracking is the constraint: ad platform pixels cannot carry health details, so conversions are measured with de-identified events and call data instead of anything tied to a patient."
    ],
    perks: [
      "Tracking built so ad platforms never receive protected health information, with a BAA in place where one is required.",
      "Campaigns segmented by procedure and payer mix, so you can grow the appointments with margin rather than all of them.",
      "Google Business Profile kept accurate on hours, locations and providers: the details that decide same-day patients.",
      "Review requests timed to the visit, handled without asking patients to disclose anything about their treatment publicly."
    ],
    faqs: [
      {
        "question": "How do you track ad performance without violating HIPAA?",
        "answer": "We keep protected health information out of the ad platforms entirely. That means no third-party pixels on patient portals or scheduling confirmations, server-side conversion events that carry a lead ID rather than a condition, and call tracking configured so recordings stay inside systems covered by a business associate agreement. You still get cost per booked appointment by campaign. You just do not get a report that names a patient and a procedure together."
      },
      {
        "question": "Can you get us more of one procedure instead of just more patients?",
        "answer": "Yes, and that is usually the right ask. Procedure-level campaigns need their own landing page, their own ad group and their own conversion action so the platform learns what a good lead looks like for that service. Expect the cheaper, high-volume terms to keep producing while the specific ones ramp. If your schedule is already full of low-margin visits, the fix is partly marketing and partly what your front desk books."
      },
      {
        "question": "We have fewer reviews than the practice down the street. How much does that matter?",
        "answer": "Enough that it is usually the first thing we work on. Review count and recency affect both map pack position and whether someone calls you after they see you. The fix is a request that goes out after every visit by text or email, not a push once a quarter. Recency counts as much as the total: a practice with steady new reviews tends to beat one with an old pile of them."
      },
      {
        "question": "How soon will we see new patients?",
        "answer": "Paid ads can put calls on the phone in the first week. Organic and profile work take longer, usually three months for first movement in the map pack and six or more before it carries real volume. The honest sequence is ads for immediate appointments, reviews and profile accuracy in parallel, then content and links to bring the cost per patient down over the following year."
      }
    ],
    name: 'Medical',
    headline: 'Patient acquisition that respects HIPAA and still measures results',
    summary:
      'Healthcare marketing has to prove ROI without leaking protected health information. We build tracking that stays compliant and still tells you which campaign filled the chair.',
    icon: 'Stethoscope',
    stat: { value: '77%', label: 'Of patients search online before booking' },
    children: [
      {
        slug: 'dentists',
        context: "Your constraint is chair time, not enquiry volume, so the real question is which procedures fill it. Insurance mix drives everything: a PPO-heavy practice competes on convenience and availability, while a fee-for-service practice has to build trust before the patient ever calls. Demand is predictably seasonal \u2014 benefits expire at year end, deductibles reset in January \u2014 and high-value cases like implants and ortho involve weeks of consideration plus a financing conversation.",
        faqs: [
          {
            "question": "Should we run a new patient special?",
            "answer": "It works if the offer is a gateway to treatment you actually want and your team can convert it. A discounted exam that mostly attracts people who never return costs you chair time twice. Look at what those patients accept over the following year before you judge the campaign. Practices moving toward fee-for-service usually do better leading with availability, a specific problem solved, or a membership plan than with a price cut."
          },
          {
            "question": "How do we get more implant and ortho cases?",
            "answer": "Separate them completely. Different pages, different campaigns, different budgets, and a different conversion \u2014 a consultation, not an appointment request. These are considered purchases; people read, compare and worry about cost, so the page has to cover the process, the timeline and financing honestly. Expect a longer lag between click and booked case than you see for hygiene, and measure by case value accepted rather than lead count."
          },
          {
            "question": "We're dropping a PPO plan. How should marketing change?",
            "answer": "Start before the effective date, not after. Existing patients need a direct explanation of what changes for them, in writing and from your team rather than from the insurer. New patient marketing then shifts away from insurance-led messaging toward what you do that is worth paying for, plus any membership plan you offer. Expect a dip in enquiry volume and a rise in the value of the ones you get."
          }
        ],
        name: 'Dentists',
        headline: 'Dental marketing that fills the schedule, not just the inbox',
        summary:
          'A dental practice does not need more leads — it needs more of the specific procedures with margin. Campaigns segmented by procedure change the mix, not just the volume.',
        painPoints: [
          'New patient specials attracting one-visit price shoppers',
          'Implant and ortho enquiries buried in general hygiene traffic',
          'Insurance questions consuming front-desk time',
        ],
      },
      {
        slug: 'chiropractors',
        context: "The first visit rarely pays for itself. Value sits in completed care plans, so a campaign that fills the schedule with discounted screenings can still lose money. Watch the map pack: long-established clinics with years of review volume are hard to displace, and proximity does a lot of the work, which is why a second location often beats more content. State boards vary on claims and discounted-exam offers, and ad platforms restrict health claims independently.",
        faqs: [
          {
            "question": "Is a discounted first visit worth running?",
            "answer": "Only if you track what happens after it. Measure care plans started and visits completed per new patient, not exams booked. Deep discounts reliably attract people shopping for the discount, and no-show rates on them run high. A cheaper alternative is charging a normal exam fee and competing on availability, same-week appointments and a specific problem. Check your state board's rules before advertising any free or discounted exam offer."
          },
          {
            "question": "How do we get personal injury referrals from attorneys?",
            "answer": "This is outbound relationship work with a marketing layer, not a campaign you can buy. Attorneys refer to clinics that document well, communicate on schedule and do not create problems later in the case. Lead with that. A one-page summary of your documentation and reporting process opens more doors than a lunch drop. In parallel, rank for accident-injury searches locally so patients reach you first and bring the attorney with them."
          },
          {
            "question": "Can we advertise that we treat migraines or sciatica?",
            "answer": "Carefully. Describing conditions you treat is usually fine; claiming cures, guaranteed outcomes or superiority over medical care is where boards and ad platforms intervene, and the rules differ by state. Patient testimonials that imply results carry the same risk. Write about symptoms and what a course of care involves, keep the language conditional, and have someone who knows your board's advertising rules read the pages before they publish."
          }
        ],
        name: 'Chiropractors',
        headline: 'Chiropractic marketing focused on retention, not just first visits',
        summary:
          'The economics of a chiropractic practice live in the care plan, not the first appointment. Marketing should pre-qualify for the plan before the patient walks in.',
        painPoints: [
          'High no-show rate on discounted first visits',
          'Local map pack dominated by three long-established clinics',
          'Personal injury and workers comp referrals not pursued',
        ],
      },
      {
        slug: 'med-spa',
        context: "Buyers decide on photographs, and the platforms where photographs work best restrict what you can show. Meta's health and personal-attribute rules reject a lot of before-and-after creative, so the accounts that work move that content to organic, the website and email. Injectables recur every few months, which puts the profit in rebooking and memberships rather than the first appointment. Demand swings around weddings, holidays and the fall shift to laser treatments that require sun avoidance.",
        faqs: [
          {
            "question": "Meta keeps rejecting our before-and-after ads. What can we run?",
            "answer": "Move the transformation off the ad and onto the landing page, where the rules are yours. Ads can carry the practitioner, the room, the process, the offer and social proof that does not imply a personal outcome. Avoid side-by-side comparisons, tight crops of body areas, and copy that addresses the viewer's appearance directly. Let organic Instagram do the visual work, and use ads to send people there and to booking."
          },
          {
            "question": "Should we discount to fill the schedule?",
            "answer": "Discounting injectables trains people to wait for the next promotion, and those buyers move to whoever is cheapest next quarter. If you need volume, discount something that leads somewhere \u2014 a first facial, a consultation, a package trial \u2014 and hold price on recurring services. Filling gaps is usually a scheduling and recall problem rather than a marketing one; a text to lapsed clients costs nothing and works faster."
          },
          {
            "question": "How do we sell memberships instead of one-off treatments?",
            "answer": "Market the membership as its own product with its own page, its own ads and a clear monthly number, rather than as an upsell at checkout. The pitch is predictable maintenance at a better rate, not a discount club. Present it during the consultation while the treatment plan is on the table. Then measure retention months and revenue per member, because that is the number the practice is actually built on."
          }
        ],
        name: 'Med Spa',
        headline: 'Med spa marketing across a genuinely visual buying decision',
        summary:
          'Med spa buyers decide on before-and-afters. Paid social and a well-run Instagram do more here than any other vertical we work in.',
        painPoints: [
          'Ad platform restrictions on before-and-after imagery',
          'Membership and package upsells not marketed separately',
          'Seasonal demand swings around events and holidays',
        ],
      },
      {
        slug: 'estheticians',
        context: "You are the capacity. More leads than you can book is not a win, so the goal is filling specific gaps, raising the average ticket and getting the next appointment booked before the client leaves. Most of the business runs on Instagram and a booking app you do not own. If you rent a suite inside a larger salon, expect Google Business Profile friction at a shared address \u2014 and expect med spas with real ad budgets bidding on your terms.",
        faqs: [
          {
            "question": "Can I have my own Google Business Profile in a rented suite?",
            "answer": "Usually yes, if you have your own signage, your own hours and staff present during those hours. Google's guidelines target virtual offices, and shared salon addresses draw extra scrutiny, so verification requests and suspensions are common. Use your own suite number, your own phone number, and photos showing your signage. Keep those details identical everywhere else online, because inconsistency makes reinstatement much harder."
          },
          {
            "question": "I'm fully booked. Should I still be marketing?",
            "answer": "Yes, but change the goal. A full book is the moment to raise prices, shift the mix toward higher-value services, build a waitlist and move clients onto standing appointments. Marketing then protects you from the quiet month that follows a wave of cancellations. If you stop entirely, you restart from zero with no pipeline and a cold audience \u2014 that gap is what makes solo studios feel feast-or-famine."
          },
          {
            "question": "What happens if I lose my Instagram account?",
            "answer": "You lose your client list, which is why it should not be the only place it lives. Export bookings into an email or SMS list you control, put a simple site with services and a booking link on your own domain, and keep your Google Business Profile current. Lockouts and hacks are not rare, and recovery can take weeks. Ten minutes a month exporting contacts is the whole insurance policy."
          }
        ],
        name: 'Estheticians',
        headline: 'Esthetician marketing for a booking-driven, repeat-visit business',
        summary:
          'Solo and small studio estheticians compete against med spas with ten times the budget. Local specificity and a frictionless booking flow close that gap.',
        painPoints: [
          'Booking friction losing clients at the last step',
          'Low differentiation in a crowded local market',
          'Instagram-dependent with no owned channel',
        ],
      },
      {
        slug: 'physical-therapy',
        context: "Direct access rules vary by state, and most patients do not know which rules apply to them, so a large share of enquiries open with \"do I need a referral?\". They search by injury and activity, not by specialty. Insurance network status decides who can actually convert, and a cash-based clinic is a different funnel entirely. Care is episodic and finite, so growth comes from new episodes and reactivation rather than retention in the usual sense.",
        faqs: [
          {
            "question": "How do we handle the referral question in our marketing?",
            "answer": "Answer it on the page, in your state's terms, including any visit or time limits that apply before a physician sign-off is needed. Put it high on your main service pages and in your Google Business Profile Q&A, because it is the question that stops people calling. Train the front desk on the same answer. This one clarification usually moves more appointments than any campaign change you could make."
          },
          {
            "question": "We're out of network. Does that change the strategy?",
            "answer": "Substantially. You cannot compete on a copay, so the marketing has to sell one-on-one time, the same clinician every visit, and fewer total sessions. Be explicit about pricing and about out-of-network reimbursement, because people choosing cash-based care want the number before they call. Expect fewer enquiries at higher value, and expect the sales conversation to happen on the phone rather than at the front desk."
          },
          {
            "question": "Physician referrals are drying up. What replaces them?",
            "answer": "Direct-to-patient search, mostly, plus non-physician sources. Rank for the injuries and activities you treat rather than for \"physical therapy\", because that is how patients actually type. Then build relationships with gyms, running stores, coaches and surgical schedulers rather than only surgeons. Keep sending outcome summaries to referring physicians regardless \u2014 the ones still sending patients should keep hearing from you, and that costs nothing."
          }
        ],
        name: 'Physical Therapy',
        headline: 'Physical therapy marketing for direct access and referral growth',
        summary:
          'Direct access changed how patients find a PT clinic. Ranking for the injury, not the specialty, is where the volume moved.',
        painPoints: [
          'Physician referral volume declining year over year',
          'Patients searching by injury rather than by service',
          'Insurance network status affecting who can actually convert',
        ],
      },
      {
        slug: 'urgent-care',
        context: "The decision takes about as long as it takes to read three map results: how far, how long is the wait, do they take my insurance. Your Google Business Profile carries more weight than your website, and wrong hours cost you patients you will never hear about. Respiratory season swings volume hard from fall into winter. The steadier money often sits in occupational health and employer contracts, which is a B2B sale with none of the same urgency.",
        faqs: [
          {
            "question": "How much of our marketing should go to occupational health?",
            "answer": "Enough to be deliberate about it, because it will not arrive through consumer search. Employer accounts are won with outreach to HR and safety managers, a page listing your services and turnaround for drug screens, physicals and injury care, and a named person who answers. The revenue is contracted and predictable, which offsets clinic seasonality. Track it separately or the walk-in numbers will hide it entirely."
          },
          {
            "question": "Do we need to publish wait times?",
            "answer": "If you can keep them accurate, they win you patients \u2014 it is one of the two or three things people compare. If you cannot keep them accurate, publishing them will cost you reviews. A safer middle path is an online check-in or reserve-a-spot link, which sets an expectation you control. Whatever you decide, get hours, holiday hours and insurance information right on Google first."
          },
          {
            "question": "Should we advertise year-round or only in flu season?",
            "answer": "Run a base level year-round and add budget ahead of respiratory season rather than during it, so your listings and pages are already ranking when volume arrives. Use the off-season to build reviews, correct Google Business Profile details and market services that do not depend on the weather \u2014 sports physicals, occupational health, travel needs. Turning ads off in spring usually means starting from behind in October."
          }
        ],
        name: 'Urgent Care',
        headline: 'Urgent care marketing built for a same-hour decision',
        summary:
          'Urgent care is a proximity and wait-time decision made in under two minutes. Google Business Profile accuracy matters more than the website.',
        painPoints: [
          'Wait times and hours wrong or missing on Google',
          'Losing walk-ins to a closer competitor with better reviews',
          'Seasonal surges the schedule is not staffed for',
        ],
      },
      {
        slug: 'massage-therapy',
        context: "Capacity is rooms times therapists times hours, so the useful marketing goal is filling named gaps \u2014 weekday mornings, the hour after a cancellation \u2014 rather than generating undifferentiated leads. Deal-site clients tend not to return at full price. Gift card sales concentrate around the holidays and deserve a campaign of their own. Ad platforms flag massage terms for adult-content adjacency more often than owners expect, and clients frequently follow a therapist who leaves.",
        faqs: [
          {
            "question": "Should we use a deal site to get started?",
            "answer": "It fills a schedule fast and it teaches your market what you charge. Some practices convert enough of those clients to a membership to justify it; most do not, and the review pressure from discount buyers is real. If you try it, cap the number sold, restrict redemption to your slow hours, and have a rebooking offer ready at checkout. Judge it on second visits at full price, nothing else."
          },
          {
            "question": "Why do our ads keep getting disapproved?",
            "answer": "Massage terminology overlaps with adult content in ad platform classifiers, and enforcement is automated and inconsistent. Keep copy and imagery clinical \u2014 modalities, conditions treated, licensed therapists \u2014 and avoid words the classifier reads as suggestive. Appeals sometimes succeed. Because paid channels are unreliable here, put more weight on your Google Business Profile, review flow, and an email or SMS list you own outright."
          },
          {
            "question": "A therapist left and took clients with them. How do we prevent that?",
            "answer": "Some of it you cannot, because the relationship is with the hands. What you can control is ownership of the client relationship: bookings in your system, your reminders, your membership, your review requests, so clients are attached to the practice as well as the person. Market the practice and its modalities alongside individual therapists. When someone leaves, contact their clients yourself that week with a named alternative."
          }
        ],
        name: 'Massage Therapy',
        headline: 'Massage therapy marketing that builds a repeat client base',
        summary:
          'One-off bookings do not sustain a practice. The marketing job is converting a first visit into a membership or standing appointment.',
        painPoints: [
          'Deal-site clients who never return at full price',
          'Booking gaps mid-week with no fill mechanism',
          'Competing with franchise chains on price',
        ],
      },
    ],
  },
  {
    slug: 'real-estate',
    context: [
      "Sellers and buyers behave nothing alike. A buyer is on Zillow within a minute and gone. A seller starts months earlier with a valuation search, then checks who has actually sold on their street, reads your reviews, and looks at your recent posts before filling in anything. By the time they call, they have usually shortlisted two or three agents.",
      "So the channel mix leans toward staying visible in one area rather than buying intent. Household-level programmatic, geofenced social and neighborhood content keep your name in front of the same few thousand homes all year. Lead capture matters less than the follow-up system behind it, because the person who downloads a valuation today may list eighteen months from now, or never, if nobody keeps in touch."
    ],
    perks: [
      "Farm-area targeting down to the subdivision, so your budget reaches the homes you actually want to list.",
      "Seller and buyer campaigns kept separate, with different pages and follow-up, because they are worth different money.",
      "Long-horizon nurture built in: email, retargeting and listing alerts that keep working on a seller eighteen months out.",
      "Listing content produced on your schedule \u2014 new listing, open house, just sold \u2014 without you editing anything."
    ],
    faqs: [
      {
        "question": "Are portal leads from Zillow worth it compared to running my own campaigns?",
        "answer": "They buy speed; your own campaigns buy ownership. Portal leads arrive fast and are often shared, so you compete on response time with agents who paid for the same person. Campaigns you run cost more per lead at the start and take a few months to settle, but the traffic, the list and the brand recognition stay with you when you switch brokerages. Most agents we work with keep both and shift the ratio over time."
      },
      {
        "question": "How do I get listing appointments instead of buyer leads?",
        "answer": "Change what you offer and where you show it. Buyer leads come from property search; seller leads come from valuation, equity and what-did-my-neighbor-sell-for content aimed at one farm area. Expect a higher cost per lead and a longer wait, because homeowners contact you when life changes, not when your ad runs. The offsetting math is that fewer conversations turn into more commission."
      },
      {
        "question": "Should I market myself or my brokerage?",
        "answer": "Market yourself. Clients hire an agent, and you keep the audience if you change brokerages. Use the brokerage brand for credibility on the page and in listing presentations, but put your name on the domain, the Google Business Profile and the social accounts. Check your brokerage's branding rules first: most require logo and license display, and some restrict what you can claim about sales volume."
      },
      {
        "question": "The market slowed down. Should I cut marketing?",
        "answer": "Cut the parts that only work in a fast market, not the visibility. Buyer-lead spend usually gets trimmed first because those leads take longer to transact. Farm-area presence, past-client contact and valuation content are what put you on the shortlist when inventory returns, and rebuilding them from zero costs more than maintaining them. If the budget has to shrink, shrink the geography before you shrink the frequency."
      }
    ],
    name: 'Real Estate',
    headline: 'Real estate marketing that generates listings, not just leads',
    summary:
      'Buyer leads are cheap and abundant. Listing appointments are where the commission is — and they come from consistent local visibility rather than portal spend.',
    icon: 'Home',
    stat: { value: '3x', label: 'Value of a listing lead vs a buyer lead' },
    children: [
      {
        slug: 'realtor',
        context: "You are marketing a person, and it takes time. A geographic farm needs consistent presence for a year or more before listing appointments arrive predictably, which is why most agents quit halfway. Listing-side marketing has to run in the quiet months, because spring sellers decide in winter. Portal leads are shared and buyer-heavy. Since the commission rules changed, buyer representation agreements come up earlier, so your content should address that before the first call.",
        faqs: [
          {
            "question": "Is farming a neighborhood still worth it versus buying leads?",
            "answer": "They solve different problems. Bought leads create activity next week \u2014 mostly buyers, usually shared with other agents \u2014 and they stop when you stop paying. Farming produces listing appointments and referrals, but only after sustained presence through mailers, local content, events and sold updates over a year or more. Most agents who succeed at farming fund it with something faster while it matures. Pick a farm small enough to dominate."
          },
          {
            "question": "How long before geographic farming produces listings?",
            "answer": "Plan for a year of consistent contact before it produces predictable appointments, longer in a farm with an entrenched incumbent. You should see leading indicators earlier: name recognition at open houses, inbound valuation requests, neighbors mentioning your mailers. Track turnover in the farm and your share of the listings taken there. If your share has not moved after eighteen months of real consistency, the farm or the message is wrong."
          },
          {
            "question": "Should I market my own brand or my brokerage?",
            "answer": "Yours. Clients hire an agent, brokerages change, and anything built under a brokerage brand stays behind when you move. Use your own domain, your own email list and a Google Business Profile in your name where your brokerage allows it. Follow your brokerage's disclosure and logo requirements \u2014 those are licensing rules in most states, not preferences \u2014 but keep the audience attached to you."
          }
        ],
        name: 'Realtor',
        headline: 'Agent marketing that builds a personal brand in one farm area',
        summary:
          'An individual agent cannot outspend a brokerage. Owning one geographic farm area completely beats being tenth-best across the whole metro.',
        painPoints: [
          'Portal leads shared with four other agents',
          'No consistent presence between transactions',
          'Sphere of influence never systematically marketed to',
        ],
      },
      {
        slug: 'investors',
        context: "This is direct response, run at volume across mail, calls, texts and search, and it lives or dies on follow-up. Most motivated sellers are not ready on first contact; the contract comes months later, on the fifth or eighth touch. Lead costs rise whenever capital floods the market, and the same lists get worked by everyone. Compliance is the underrated risk \u2014 texting and cold calling homeowners carries real TCPA exposure, and enforcement is active.",
        faqs: [
          {
            "question": "PPC or direct mail for motivated sellers?",
            "answer": "Search buys intent that already exists and costs more per lead. Mail creates intent from a list, costs less per contact, and converts on a longer lag. Most operators doing consistent volume run both plus one outbound channel. If your budget is limited, search gives faster feedback on your offer and your intake script. Judge either on cost per contract, and allow enough months for contracts to appear."
          },
          {
            "question": "How long should we follow up on a seller lead?",
            "answer": "Longer than feels reasonable. Sellers with a real problem often sign months after the first conversation, when circumstances force the decision. Build a follow-up sequence measured in months rather than days, mixing calls, texts and email, and keep clean records of consent and opt-outs. Operators who complain that lead quality dropped are usually running the same channels with a two-week follow-up window."
          },
          {
            "question": "Is texting homeowners safe?",
            "answer": "Not without care. TCPA claims are a genuine cost of doing business in this niche. Consent, scrubbing against do-not-call lists and honoring opt-outs immediately are the minimum. Buying phone-appended lists and blasting them is where operators get hurt. Talk to a lawyer who handles TCPA before scaling any outbound texting program \u2014 the advice is cheap beforehand and expensive afterward."
          }
        ],
        name: 'Investors',
        headline: 'Investor marketing for off-market deal flow',
        summary:
          'Motivated seller campaigns are a direct response discipline. Volume of contacts and speed of follow-up determine deal count.',
        painPoints: [
          'Rising cost per motivated seller lead',
          'Cash buyer list not segmented by criteria',
          'Competing with national iBuyer ad budgets',
        ],
      },
      {
        slug: 'property-management',
        context: "Owner acquisition and tenant acquisition are different businesses sharing one website. Tenant searches vastly outnumber owner searches and will swamp your traffic and your reviews if you let them. Owners switch on a trigger \u2014 a bad tenant, a long vacancy, a fee dispute \u2014 or at contract renewal, so the job is being visible for months before that moment arrives. Your real competitor is often the landlord managing the property themselves.",
        faqs: [
          {
            "question": "Tenant reviews are wrecking our rating. What can we do?",
            "answer": "Some of it is structural: you enforce leases, so some tenants will be unhappy. What you control is volume. Systematically ask owners for reviews, and ask tenants at moments they are genuinely satisfied, like move-in or a fast maintenance fix. Respond to every negative review calmly and factually, because owners read the replies more closely than the complaints. Separate profiles for a leasing office can help where that genuinely applies."
          },
          {
            "question": "How do we market against owners managing it themselves?",
            "answer": "Compare against the real cost of self-management, not against other managers. Vacancy days, a bad tenant placement, an eviction, late-night maintenance calls and compliance exposure on deposits and notices are what move a self-manager. Content walking through your state's landlord obligations does double duty: it ranks for what self-managers search, and it shows them exactly what they are taking on."
          },
          {
            "question": "Is agent referral marketing worth the effort?",
            "answer": "It is one of the most reliable door sources, because plenty of agents want the commission without the management work and need somewhere safe to send it. Make the referral terms explicit, commit in writing that you will not take their sales client, and report back when the property re-lists. Treat it as a tracked channel rather than occasional lunches. Check your state's rules on referral fees first."
          }
        ],
        name: 'Property Management',
        headline: 'Property management marketing for door count growth',
        summary:
          'Every door is recurring revenue. The marketing goal is owner acquisition, which is a completely different search than tenant acquisition.',
        painPoints: [
          'Tenant searches drowning out owner searches',
          'Long sales cycle with owners on existing contracts',
          'Reviews skewed by tenants rather than owners',
        ],
      },
      {
        slug: 'property-owners-finding-buyers',
        context: "This is a one-time campaign with a fixed budget, a deadline and a single conversion: a qualified showing. Without MLS syndication you are buying the exposure the listing would otherwise have had, and a flat-fee MLS service covers part of that gap. Showing time is your scarcest resource, so pre-qualification matters more than enquiry volume. Since the commission rules changed, buyer-agent compensation is a decision you make upfront. No campaign fixes an overpriced listing.",
        faqs: [
          {
            "question": "How much should I spend marketing my own sale?",
            "answer": "Weigh the exposure against the commission you are saving, and set a budget for a defined window rather than an open-ended monthly spend. The essentials are professional photography, a flat-fee MLS listing, and targeted local advertising to buyers in your area. Front-load it: the first two weeks on market produce most of the serious interest, and listings that sit start attracting discount offers."
          },
          {
            "question": "Do I still need to offer a buyer's agent commission?",
            "answer": "It is negotiable and no longer advertised through the MLS the way it once was, but buyer agents now have signed agreements with their clients, and a listing offering nothing can see fewer showings. Decide your position before you list, state it clearly in your marketing, and be ready to discuss it. An hour with a real estate attorney in your state is worth it here."
          },
          {
            "question": "Lots of views, no showings. What's wrong?",
            "answer": "Almost always price or photography, in that order. Views mean the listing is being seen; no showings mean people are seeing it and passing. Compare your price against what has actually closed nearby in recent months, not against active listings. Then look at your first three photos on a phone screen. Adding budget to a listing with this pattern just shows more people the same problem."
          }
        ],
        name: 'Property Owners Finding Buyers',
        headline: 'For-sale-by-owner marketing that reaches qualified buyers',
        summary:
          'Selling without an agent means buying the exposure an agent would have provided. Targeted local campaigns replace the MLS reach.',
        painPoints: [
          'No MLS syndication or portal presence',
          'Unqualified enquiries wasting showing time',
          'Pricing and presentation without professional input',
        ],
      },
    ],
  },
  {
    slug: 'education',
    context: [
      "Two people have to be convinced and they want different things. The student wants to know what the day looks like and where it leads. The parent paying for it wants cost, financing and evidence it was worth it. Both read forums and third-party ratings you do not control, then judge you on a campus visit or an open house your ads exist to fill.",
      "That makes the calendar the strategy. Spend front-loads into inquiry season, then shifts to nurturing the people already in your CRM through deadlines. Programs, not the institution, are what people search, so each one needs its own page and budget. And every claim about outcomes, jobs or salaries has to be substantiated before it runs, which rules out the copy most agencies would write."
    ],
    perks: [
      "Reporting on tours, applications and starts, pulled from your CRM rather than inquiry counts from the ad platform.",
      "Budget shaped to the admissions calendar, heavier before open houses and deadlines instead of a flat monthly spend.",
      "Program-level pages and campaigns, so high-demand programs stop subsidizing the ones nobody searches for.",
      "Copy written to survive compliance review, with outcome and financial aid claims sourced before anyone sees a draft."
    ],
    faqs: [
      {
        "question": "How do we get inquiries to actually show up for a tour?",
        "answer": "Shorten the gap between the form and a human. Most no-shows come from a lead that sat overnight, or a confirmation that never repeated. What works: a call attempt within minutes, a text confirmation with a map and a name to ask for, and a reminder the morning of. On the campaign side, we send fewer people who were only chasing a brochure and more who picked a date."
      },
      {
        "question": "Can we advertise job placement and salary outcomes?",
        "answer": "Only what you can document, and the documentation has to exist before the ad runs. Accreditors, state regulators and the FTC all take an interest in outcome claims, and for Title IV schools the disclosure requirements are specific. We work from figures your institutional research team signs off on, cite the cohort and time period on the page, and write around anything you cannot support. Vague is safer than an unsourced number."
      },
      {
        "question": "Should we advertise to the student or the parent?",
        "answer": "Both, with different messages and usually different channels. For K-12 and traditional undergrad, the parent controls the decision and responds to safety, outcomes and cost clarity, while the student decides whether they want to be there. For adult and trade programs, the student is the buyer but a spouse often approves the money. We build separate audiences and landing content rather than one page for everyone."
      },
      {
        "question": "When should we start spending for next fall?",
        "answer": "Earlier than most schools do, because the research window opens long before your application deadline. Practically, that means building the pages and audiences in the quarter before inquiry season, running awareness while competitors are quiet, and saving the heaviest spend for the weeks around open houses and deadlines. Starting the month applications open means paying peak prices to reach people who already shortlisted somewhere else."
      }
    ],
    name: 'Education',
    headline: 'Enrolment marketing across a long, multi-decision-maker funnel',
    summary:
      'Education buyers research for months and rarely decide alone. Campaigns need to speak to the student and the person paying, often in the same visit.',
    icon: 'GraduationCap',
    stat: { value: '9mo', label: 'Typical enrolment research window' },
    children: [
      {
        slug: 'private-schools',
        context: "Everything runs on the admissions calendar. Awareness and open house campaigns belong in the fall, applications and financial aid in winter, decisions and re-enrolment in spring, with a summer window for late movers. Two people have to be convinced \u2014 the parent who pays and the child who has to want to go. Tours are the real conversion event, not enquiries. Retention matters as much as recruitment, because a family that stays is many years of tuition.",
        faqs: [
          {
            "question": "When should we start advertising for next year's intake?",
            "answer": "Earlier than most schools do. Families who relocate or switch schools start looking a full cycle ahead, so awareness work should run well before your first open house, with enquiry capture and nurture in place to hold them until a tour. If you only advertise in the weeks around application deadlines, you are competing for families who already have a shortlist you are not on."
          },
          {
            "question": "Should we measure enquiries or tours?",
            "answer": "Tours, then applications, then enrolled students. Enquiry counts are easy to inflate and tell you nothing about fit. Track the whole path \u2014 enquiry to tour, tour to application, application to enrolled \u2014 and you will see exactly where families drop out. Most schools discover the loss sits between enquiry and tour, which is a follow-up speed and scheduling problem rather than an advertising problem."
          },
          {
            "question": "How do we talk about financial aid without devaluing tuition?",
            "answer": "Put affordability information on its own page and be concrete about the process, the deadlines and what families are typically asked to provide, without implying that the sticker price is negotiable. Framing it as access to the programme rather than as a discount keeps the value conversation intact. Families who do not know aid exists will not enquire at all, so silence costs you more applications than it protects."
          }
        ],
        name: 'Private Schools',
        headline: 'Private school marketing built around the admissions calendar',
        summary:
          'Enrolment is seasonal and the window is narrow. Campaigns front-load open house attendance and then nurture through application deadlines.',
        painPoints: [
          'Enquiries that never convert to a campus tour',
          'Justifying tuition against a strong public alternative',
          'Enrolment concentrated in a three-month window',
        ],
      },
      {
        slug: 'universities',
        context: "Prospects search by programme, career outcome and format \u2014 online, evening, accelerated \u2014 not by your institution's name. Meanwhile web governance sits centrally and every dean wants their programme promoted, so the bottleneck is often internal rather than in the market. The cycle from first touch to census is long enough that campaigns get judged before they can be measured. International recruitment runs on different channels and intermediaries, and outcome claims carry disclosure obligations.",
        faqs: [
          {
            "question": "How do we attribute enrolments when the cycle runs over a year?",
            "answer": "Capture the source at enquiry, store it on the CRM record, and pass enrolment outcomes back to the ad platforms as offline conversions. Then report on cohorts rather than months: this term's starts against the campaigns that ran a year ago. In between, use application submitted and deposit paid as working signals. Anything judged on last-click inside a single quarter will mislead you."
          },
          {
            "question": "Should programmes get their own sites or live on the main domain?",
            "answer": "Keep them on the main domain in nearly all cases. Separate domains split your authority, start from nothing, and multiply the governance problem instead of solving it. If the real issue is that central web slows you down, fix that with a programme page template and delegated editing rights. Reserve separate domains for genuinely distinct brands, such as an executive education arm or a joint venture."
          },
          {
            "question": "How is international recruitment different?",
            "answer": "Different search behavior, different platforms, different intermediaries. Agent networks carry much of the volume in some markets, and Google is not the default search engine everywhere. Visa questions, English requirements and total cost including living expenses dominate the decision, so pages that dodge them lose the enquiry. Build country-specific content only for markets you genuinely recruit from, and staff response times for those time zones."
          }
        ],
        name: 'Universities',
        headline: 'University marketing across programme-level demand',
        summary:
          'Prospective students search by programme, not by institution. Programme-level pages and campaigns capture demand the brand campaign misses.',
        painPoints: [
          'Brand campaigns that cannot be attributed to enrolments',
          'Programme pages competing with the central site for rankings',
          'Domestic and international demand needing separate strategies',
        ],
      },
      {
        slug: 'trade-schools',
        context: "Getting enquiries is easy; broad interest targeting will bury you in them. Turning them into students who show up on day one is the whole problem, and the biggest lever is minutes to first contact. Enrolment runs as a series of start dates, so every campaign works against a deadline. Financial aid is where most decisions stall. Accreditation and federal rules restrict what you can claim about placement, salaries and outcomes, and how recruiters may be paid.",
        faqs: [
          {
            "question": "Why do so many enquiries never enroll?",
            "answer": "Two reasons, usually. Contact speed: enquiries answered within minutes enroll at a far better rate than ones called back the next day, and most schools are slow after hours and on weekends. And qualification: broad targeting brings people who cannot meet an entrance requirement, arrange childcare or transport, or fund the programme. Fix the first with staffing and automation, the second with tighter targeting and better form questions."
          },
          {
            "question": "Can we advertise job placement rates and starting salaries?",
            "answer": "Only with substantiated figures presented the way your accreditor and federal disclosure rules require, and those requirements are specific about methodology and how placement is defined. State agencies add their own rules. This is one area where an agency should not write claims unsupervised \u2014 the copy has to come from, or be signed off by, your compliance team. Testimonials implying typical outcomes are treated the same way."
          },
          {
            "question": "Should we buy leads from education aggregators?",
            "answer": "They fill the funnel, and the same lead is often sold to several schools, so you compete on who calls first. If you use them, treat each source as its own channel with start-rate reporting, and cut the ones producing enquiries but not starts. Compliance matters too: you carry responsibility for how those leads were collected and what was promised. Own-channel enquiries almost always start at a better rate."
          }
        ],
        name: 'Trade Schools',
        headline: 'Trade school marketing measured on starts, not enquiries',
        summary:
          'Trade school enquiry volume is easy. Turning enquiries into students who actually start is the whole problem, and it is a speed-to-lead problem.',
        painPoints: [
          'High enquiry volume, low start rate',
          'Financial aid questions stalling the decision',
          'Compliance limits on outcome and salary claims',
        ],
      },
    ],
  },
  {
    slug: 'automotive',
    context: [
      "Almost every one of these searches happens on a phone, within a few miles, and often with the car already making a noise. The buyer looks at the map pack, scans the star rating and the two most recent reviews, and calls the first shop that looks competent. If nobody picks up, they call the next one. That is most of the decision.",
      "Underneath it sits a trust problem \u2014 people expect to be upsold \u2014 so photos of your bay, named technicians, written estimates and a stated warranty do more than a coupon. Higher-ticket work behaves differently: collision, coatings and restoration are considered for days, which is where paid social and retargeting earn their place. Everything else is proximity, hours, reviews and someone answering the phone."
    ],
    perks: [
      "Map pack work first: hours, service categories, photos and review velocity, since that is where the calls come from.",
      "Call tracking with recordings, so you can hear how many booked jobs the front counter is losing.",
      "Campaigns split by service and ticket size, so brake jobs and ceramic coating are not bought the same way.",
      "Service-radius targeting matched to how far people will actually drive, instead of a blanket citywide budget."
    ],
    faqs: [
      {
        "question": "How do I get into the top three on Google Maps?",
        "answer": "Proximity, relevance and prominence, in roughly that order, and you cannot change proximity. What you can change: complete service categories and attributes on your profile, a page on your site for each service you want to rank for, correct hours including weekends, real photos posted regularly, and a steady flow of new reviews. In a dense metro this takes months, and a shop on the wrong side of town may never rank downtown."
      },
      {
        "question": "Half my calls are people asking for a price over the phone. Can you fix that?",
        "answer": "Partly. Price shoppers come from ads that lead with a discount, and from pages with no pricing information at all, which forces the question. Putting ranges, diagnostic fees and what is included on the page filters out some of them before they call. The rest is a counter script: answer the price question, then move to the diagnosis. We can send better traffic; we cannot turn a coupon shopper into a full-service customer."
      },
      {
        "question": "We are getting beaten by the dealership service department. What actually works?",
        "answer": "Compete on the things a dealer cannot easily copy: same-week availability, a named technician, a clear warranty, and reviews that mention specific repairs rather than generic praise. On search, target the make and model plus the service, Subaru timing belt style terms, where dealer ads are less aggressive than on generic repair keywords. And claim the maintenance work customers assume they must do at the dealer to keep a warranty."
      },
      {
        "question": "Do I need a new website, or just better Google presence?",
        "answer": "For most shops, the profile and reviews come first. If your site loads on a phone, shows your services, hours and phone number without pinching, and has a page per service, it is good enough to start. Rebuild when it is slow, hard to read on a phone, or you cannot add a page yourself. Spending on a redesign while your Google Business Profile is half-filled is the wrong order."
      }
    ],
    name: 'Automotive',
    headline: 'Automotive marketing for a proximity-and-trust decision',
    summary:
      'Auto services are chosen on distance, reviews and whether the shop answers the phone. Everything we do points at those three.',
    icon: 'Car',
    stat: { value: '5mi', label: 'Typical search radius for auto services' },
    children: [
      {
        slug: 'auto-repair',
        context: "The local map pack shows three results and takes most of the calls, so proximity, review recency and Google Business Profile completeness outrank almost everything on your website. A second location changes what you can rank for in a way more content never will. Specialising \u2014 European, diesel, EV, transmissions, fleet \u2014 cuts competition and raises ticket value. Demand spikes with weather: air conditioning in the first hot week, batteries in the first hard freeze.",
        faqs: [
          {
            "question": "We're not in the map pack. What actually moves that?",
            "answer": "Proximity to the searcher, which you cannot change, then review volume and recency, category and service accuracy, photos, hours, and consistent name, address and phone details across the web. Ask every customer for a review at pickup and keep the flow steady rather than in bursts. Complete every service and attribute on your profile. Expect months, not weeks, and expect less lift the further you sit from the town center."
          },
          {
            "question": "Should we advertise a cheap oil change to bring people in?",
            "answer": "It works only if your inspection and follow-up process converts that visit into real work, and if you can absorb the bay time. Measure average repair order from oil-change customers over the following year before scaling it. Many shops do better advertising diagnostics, a specific repair they are known for, or their warranty, which brings in customers who are not primarily price-driven."
          },
          {
            "question": "Is it worth building pages for specific repairs and vehicle makes?",
            "answer": "Yes, for the work you actually want and are known for \u2014 the repairs with margin and the makes you have the tools and training for. Those pages rank for lower-competition searches and pre-qualify the caller. What does not work is generating dozens of thin pages for every make and model; they dilute the site and rank for nothing. Six good pages beat sixty templated ones."
          }
        ],
        name: 'Auto Repair',
        headline: 'Auto repair marketing that wins the map pack',
        summary:
          'The three results in the local map pack take the overwhelming majority of calls. Getting into that pack is the entire strategy.',
        painPoints: [
          'Losing calls to dealership service departments',
          'Review volume behind the shop down the road',
          'Emergency searches happening outside opening hours',
        ],
      },
      {
        slug: 'auto-detailing',
        context: "Mobile and shop-based detailing are different marketing problems. A mobile operator runs as a service-area business with a hidden address and a defined radius; a shop competes on location and can hold vehicles for multi-day work. Price anchoring against tunnel washes is constant, so the sale is transformation and protection rather than cleaning. Ceramic coating and paint protection film are considered purchases with a different buyer. Weather and pre-sale, pre-holiday timing drive the calendar.",
        faqs: [
          {
            "question": "Does mobile versus a fixed shop change how we market?",
            "answer": "Yes, structurally. Mobile means a service-area profile on Google with the address hidden, pages for the suburbs you actually drive to, and pricing that accounts for travel time. A shop can rank on proximity, show the facility, and sell multi-day work like coatings and paint correction. If you do both, keep them clearly separated in your pages and campaigns so neither message muddies the other."
          },
          {
            "question": "How do we sell ceramic coating instead of basic details?",
            "answer": "Give it its own page, its own campaign and its own conversion \u2014 a quote request, not an online booking. Buyers research for weeks, compare brands and warranties, and worry about being oversold, so the content must cover preparation, correction, realistic durability and honest maintenance requirements. Target new-vehicle owners and enthusiasts rather than your general audience. Expect a longer sales cycle and a much higher ticket."
          },
          {
            "question": "What do we do in the slow months?",
            "answer": "Build the accounts that do not care about weather. Dealership reconditioning, fleets and interior-focused services fill winter better than discounting retail details does. Use the quiet weeks to shoot content, chase reviews, and offer a maintenance plan to existing customers. If you must discount, discount services that use time you cannot sell anyway rather than cutting the price of your premium packages."
          }
        ],
        name: 'Auto Detailing',
        headline: 'Detailing marketing for a visual, premium-priced service',
        summary:
          'Detailing sells on the transformation. Consistent before-and-after content plus mobile-service targeting drives premium package bookings.',
        painPoints: [
          'Competing with $40 tunnel washes on perceived value',
          'Mobile service areas not defined in the campaigns',
          'Ceramic coating and PPF upsells not marketed separately',
        ],
      },
      {
        slug: 'collision-repair',
        context: "Your customer just had a bad day and usually calls the insurer before they call a shop. In most states they have the right to choose the shop, and most do not know it \u2014 that gap is the whole opportunity for a direct-to-owner strategy. Direct repair programmes trade margin for volume. Weather events can fill your schedule for a season and then leave you empty. Tow operators, dealers and fleets remain the steady referral sources.",
        faqs: [
          {
            "question": "Can we market against steering without losing our DRP?",
            "answer": "You can run a right-to-choose message to vehicle owners without naming insurers or attacking programmes, which is where relationships break. Keep it factual and consumer-facing: you can pick your shop, here is what we do differently, here is how we handle the claim for you. Many shops run both and shift the mix as direct business grows. Check your state's rules on what shops may say about insurer relationships."
          },
          {
            "question": "Are OEM certifications worth marketing?",
            "answer": "For the makes common in your area, yes. Owners of newer vehicles search by manufacturer, certification programmes usually come with a locator listing you should claim, and the certification justifies a price difference on repairs needing calibration and specific procedures. Build a page per certification, use the exact programme name people search for, and keep your locator details identical to your Google Business Profile."
          },
          {
            "question": "Our volume swings with the weather. How should we budget?",
            "answer": "Hold a steady base spend year-round so your rankings and reviews are already in place when a storm hits, and keep a reserve you can deploy within days of a hail or ice event \u2014 that window is short and demand is highest inside it. Use the slow stretches to build referral relationships with tow operators, dealers and fleet managers, which produce work regardless of the forecast."
          }
        ],
        name: 'Collision Repair',
        headline: 'Collision repair marketing beyond the insurance DRP',
        summary:
          'Direct repair programmes squeeze margin. Marketing directly to vehicle owners — who legally choose the shop — restores it.',
        painPoints: [
          'Dependence on insurer referral programmes',
          'Owners unaware they can choose their own shop',
          'Estimate requests that never become approved jobs',
        ],
      },
    ],
  },
  {
    slug: 'home-services',
    context: [
      "Almost every one of these jobs starts with something broken and a homeowner on a phone. They open the map pack, read the rating and the two most recent reviews, and call the first company that looks capable and can come today. If nobody answers, they call the next one on the list. Speed to a live answer decides more of these jobs than anything on the website.",
      "Underneath sits a trust problem — people expect to be overcharged or upsold — so photos of real technicians, upfront pricing ranges, written estimates and a clear warranty do more work than a coupon. Demand is highly seasonal and weather-driven: air conditioning in the first heat wave, heating in the first freeze, roofing and water damage after a storm. Higher-ticket work — a system replacement, a re-roof, a repipe — is considered for days or weeks, which is where paid social, retargeting and financing messaging earn their place.",
    ],
    perks: [
      "Map pack first: service categories, hours (including after-hours and weekends), photos and a steady flow of recent reviews, since that is where the emergency calls come from.",
      "Call tracking with recordings, reviewed with your dispatch team, so you can hear how many booked jobs the phone is losing.",
      "Campaigns split by trade, urgency and ticket size, so a $99 drain clear and a $12,000 system replacement are not bought the same way.",
      "Seasonal budgets set ahead of the curve — bid up before the heat wave, not after — and service-radius targeting matched to how far your trucks actually drive.",
    ],
    faqs: [
      {
        "question": "How do we get into the top three on Google Maps for our area?",
        "answer": "Proximity, relevance and prominence, roughly in that order, and proximity is fixed. What you can change: complete and accurate service categories and attributes, correct hours including nights and weekends if you run emergency service, a page on your site for each service and each town you cover, real photos of your team and trucks posted regularly, and a steady stream of new reviews. In a competitive metro this is a months-long effort, and a company based on one side of town will always struggle to rank on the far side.",
      },
      {
        "question": "Most of our calls are price shoppers. Can marketing fix that?",
        "answer": "Partly. Price shoppers come from ads that lead with a discount and from pages with no pricing information, which forces the phone call. Publishing service-call fees, diagnostic charges and typical ranges filters out some of them before they dial. The rest is a phone script: answer the price question, then pivot to the diagnosis and the appointment. We can send better-qualified traffic; we cannot turn a coupon shopper into a system-replacement customer.",
      },
      {
        "question": "Should we advertise cheap tune-ups and drain clears to get in the door?",
        "answer": "Only if your technicians reliably convert that visit into real work and you can absorb the truck time. Track average ticket and 12-month revenue from tune-up customers before you scale it. Many companies do better advertising a specific repair they are known for, their emergency response time, or financing on replacements — offers that bring in customers who are not primarily chasing the lowest price.",
      },
      {
        "question": "We do HVAC, plumbing and electrical. Should that be one campaign or several?",
        "answer": "Several. Each trade has its own search terms, its own seasonality, its own competitors and its own margin profile. One blended campaign spends your heating budget on plumbing clicks in July. We build a campaign per trade, each with its own pages, budget and seasonal pacing, reporting on booked jobs by trade so you can see which one is actually paying.",
      },
    ],
    name: 'Home Services',
    headline: 'Home services marketing for an urgent, proximity-driven decision',
    summary:
      'HVAC, plumbing and roofing jobs are won by the company that shows up in the map pack, answers the phone, and looks trustworthy in the reviews. Everything we run points at those three.',
    icon: 'Wrench',
    stat: { value: '<1hr', label: 'Window before an emergency-service caller has phoned a competitor' },
    children: [
      {
        slug: 'hvac',
        context: "HVAC demand is almost entirely weather-triggered: the phone rings off the hook in the first week of real heat and the first hard freeze, and goes quiet in the shoulder seasons. Emergency no-cool and no-heat calls are pure proximity, hours and reviews — and they arrive outside business hours as often as not. System replacements are a different sale entirely: a multi-thousand-dollar considered purchase where financing, efficiency ratings, brand and a trusted in-home consultation matter, and where paid social and retargeting have a real role.",
        faqs: [
          {
            "question": "How do we capture the demand spike when the weather turns?",
            "answer": "You have to already be live and bid competitively before the spike, because the firms that wait until the phone starts ringing are a week behind. We keep a base campaign running year-round to hold rankings and reviews, then a seasonal budget that scales up on the forecast — the first sustained hot or cold stretch. After-hours ad scheduling and an answering path that can actually book a truck are non-negotiable during those windows.",
          },
          {
            "question": "Should replacements and repairs be marketed separately?",
            "answer": "Yes. A no-cool emergency wants the closest company that can come now — proximity, hours, reviews, a fast answer. A replacement buyer is comparing efficiency, financing, brand and installer reputation over days. Separate pages, separate campaigns, separate conversions (a booked service call versus a requested in-home estimate), and separate follow-up. Blending them wastes emergency budget on tyre-kickers and buries replacement leads in a pile of drain-clear calls.",
          },
          {
            "question": "Is it worth chasing maintenance-plan sign-ups through ads?",
            "answer": "Maintenance plans are worth marketing, but usually to existing customers and warm leads rather than cold search traffic — the economics rarely work at cold-acquisition cost. Use email, invoice inserts and the technician at the end of a service call. Where paid does help is promoting the plan as a differentiator on your service pages and in retargeting, so it is part of why someone chooses you rather than a standalone acquisition play.",
          },
        ],
        name: 'HVAC',
        headline: 'HVAC marketing built around the weather and the replacement sale',
        summary:
          'No-cool and no-heat calls are won on proximity and speed to answer. System replacements are won on trust, financing and a good in-home consultation. We run them as two different campaigns.',
        painPoints: [
          'Demand spikes the campaign is not scaled up to catch',
          'Emergency calls landing outside business hours',
          'Replacement leads lost in a pile of low-ticket repair calls',
        ],
      },
      {
        slug: 'plumbing',
        context: "Plumbing splits cleanly into emergencies and planned work. Emergencies — burst pipes, sewer backups, no hot water — are the highest-intent, least price-sensitive searches on the internet, and they are won purely on being close, being open, and answering the phone within a couple of rings. Planned work — repipes, water heater upgrades, fixture installs, remodels — is researched and quoted, and rewards content, financing options and reviews that mention the specific job. Commercial and property-management accounts are a separate, relationship-driven channel that produces steady volume regardless of season.",
        faqs: [
          {
            "question": "How do we win more of the emergency calls?",
            "answer": "Be in the map pack for your core service area, run Local Services Ads if you are eligible, keep your hours and emergency-service attributes accurate, and — above all — answer the phone live, day and night, with someone who can dispatch a truck. Most of the losses in emergency plumbing are not marketing losses; they are the third ring going to voicemail. We track answer rate and time-to-callback alongside the campaign metrics because that is where the money leaks.",
          },
          {
            "question": "Are Local Services Ads worth it for plumbers?",
            "answer": "In most markets, yes — they sit above the regular search ads, are billed per lead rather than per click, and carry the Google Guaranteed badge that emergency callers look for. The catch is the setup: license and insurance verification, background checks, and disciplined lead disputes for calls that were clearly not real jobs. We handle the verification and the weekly dispute process, which is where a lot of the value is either captured or lost.",
          },
          {
            "question": "How do we sell repipes and water heaters instead of just $99 drain clears?",
            "answer": "Give the high-ticket work its own pages and campaigns, aimed at homeowners researching a known problem — low water pressure, rusty water, an aging tank — rather than people with an active emergency. The content has to cover options, what drives the cost, financing, and realistic timelines, and the conversion is a quote request, not an instant booking. Expect a longer sales cycle and a much larger job.",
          },
        ],
        name: 'Plumbing',
        headline: 'Plumbing marketing that wins the emergency and the planned job',
        summary:
          'Emergency plumbing searches are the highest-intent traffic there is, and they are lost at the third unanswered ring. Planned work needs content and financing. We build for both, plus the commercial accounts that carry the slow months.',
        painPoints: [
          'Emergency calls going to voicemail after hours',
          'Local Services Ads set up but not actively managed or disputed',
          'High-value repipe and water-heater work not marketed separately',
        ],
      },
      {
        slug: 'roofing',
        context: "Roofing is storm-driven and high-ticket. A hail or wind event can fill your schedule for a season and then leave it empty, so the marketing has to hold a steady baseline presence year-round and then surge within days of a storm, when demand is highest and shortest-lived. Insurance claims complicate every conversation — many homeowners do not know the process or their options. Repairs and full replacements are different buyers, storm-chaser competitors flood the market after every event, and trust signals (licensing, local reputation, warranty, real project photos) do enormous work because the horror stories are well known.",
        faqs: [
          {
            "question": "How should we budget around storm season?",
            "answer": "Hold a steady base spend all year so your rankings, reviews and Google Business Profile are already strong when a storm hits — you cannot build authority in the 72 hours after a hail event. Then keep a reserve you can deploy fast, because the window where displaced homeowners are actively searching is short and the storm-chasers move immediately. Use the quiet stretches to build referral relationships with realtors, property managers and insurance adjusters, which produce work regardless of the weather.",
          },
          {
            "question": "Should we market to insurance-claim customers or cash-pay retail?",
            "answer": "Most established roofers want both, but they convert differently. Claim customers need education — how the process works, what a supplement is, why you should not just take the first adjuster number — and that content builds trust and captures search demand. Cash-pay retail (older roofs, real-estate transactions, upgrades) responds to financing, warranty and curb-appeal messaging. Keep the two tracks separate in your pages and campaigns so neither message gets muddled.",
          },
          {
            "question": "How do we compete with the storm-chasers who show up after every hail event?",
            "answer": "Lean on everything they cannot fake: a local address and phone number, years in the community, a long and specific review history, manufacturer certifications, a real warranty backed by a company that will still be here in five years, and photos of actual local projects. Your search and social content should make the permanence explicit. Out-of-town operators win on speed and door-knocking; you win on being the company still standing behind the roof when they have moved to the next state.",
          },
        ],
        name: 'Roofing',
        headline: 'Roofing marketing for a storm-driven, high-trust purchase',
        summary:
          'Roofing demand surges and collapses with the weather, and every storm brings out-of-town chasers. The work is holding a strong local presence year-round, surging fast after an event, and making your permanence impossible to miss.',
        painPoints: [
          'Feast-or-famine demand tied to storm events',
          'Storm-chaser competitors flooding the market after every hail event',
          'Insurance-claim confusion stalling the homeowner decision',
        ],
      },
    ],
  },
  {
    slug: 'marketing-agencies',
    context: [
      "Most agencies hit the same wall: a client asks for a channel the shop does not run, or the account list grows past what the current team can service without every retainer sliding. Hiring for one more discipline is slow and expensive for work that might not stay at this volume, and handing the client to a generalist freelancer risks the relationship you spent months building. White-label fulfillment exists for exactly that gap — the work gets delivered under your name, on your reporting cadence, while you keep the client relationship, the strategy calls and the margin.",
      "The agencies that use a fulfillment partner well treat it as capacity, not as an admission of a gap: a way to say yes to a bigger retainer, launch a channel the agency has not built an in-house team for yet, or cover overflow during a hiring search without the client ever noticing a seam. It only works if the partner is genuinely invisible — no branded reports, no partner logo anywhere a client could see it, and communication that goes through you, not around you.",
    ],
    perks: [
      "Fully white-label: reports, dashboards and any client-facing material carry your agency's name, not ours. We do not contact your client directly, ever.",
      "Built to plug into an existing account without a re-onboarding — we work from your strategy and your client's brand guidelines rather than replacing either.",
      "Scoped per account, so a single overflow retainer and a full channel build-out are priced differently rather than forced into one package.",
      "Direct line to the people actually doing the work, not an account manager relaying messages — faster turnarounds when a client needs something same-day.",
    ],
    faqs: [
      {
        "question": "Will our client ever find out the work is outsourced?",
        "answer": "Not from anything we send. Every report, login and piece of client-facing communication carries your branding, and we do not reach out to your client directly under any circumstance — every message goes through you. The arrangement is between your agency and us; nothing in the deliverables identifies a third party.",
      },
      {
        "question": "What can you actually take off our plate?",
        "answer": "SEO, paid search and social, and website design and build are the three we run most often as white-label fulfillment — see the specific pages below. Some agencies hand us one channel on one account; others route an entire service line through us permanently. We scope each engagement to what you need covered, not a fixed package.",
      },
      {
        "question": "How does pricing work compared to hiring in-house?",
        "answer": "You are paying for delivered work on a retainer or per-account basis, not a salary, benefits and ramp-up time for a role that might not stay full-time. That usually makes sense for overflow, a channel you are testing before committing to a hire, or accounts below the volume where a dedicated staff member pencils out. Once a channel is consistently full-time work across your book, hiring in-house can end up cheaper — we will tell you when you are near that line rather than let a good account become the reason to keep outsourcing what no longer needs it.",
      },
      {
        "question": "Can you jump onto an account that's already live with another vendor?",
        "answer": "Yes, and it is one of the more common ways this starts — a client is unhappy with their current fulfillment and the agency needs continuity without a visible gap. We ask for account access and existing reporting history so the transition does not reset anything the client would notice, and we flag anything in the current setup that looks broken before we touch it, so you know what you are inheriting.",
      },
    ],
    name: 'Marketing Agencies',
    headline: 'White-label fulfillment for agencies whose clients need more than they can staff',
    summary:
      "Take on a bigger retainer or a channel you don't run in-house without the hire. We deliver the work under your name — your reports, your client relationship, your margin.",
    icon: 'Handshake',
    stat: { value: '0', label: "Times your client sees our name on the work" },
    children: [
      {
        slug: 'white-label-seo',
        context: "SEO is the channel agencies most often need to fulfill white-label, because it is also the hardest to staff well: technical audits, content that actually ranks, and link work all require depth most generalist agencies cannot justify hiring for on a handful of accounts. The failure mode we see most is an agency selling SEO because clients ask for it, then running it as an afterthought — thin monthly blog posts and no technical work — which shows up in flat rankings within a couple of quarters and an account that churns. Fulfillment done properly means the account gets the same technical rigor and page architecture work we run on our own direct clients, just reported under your letterhead.",
        faqs: [
          {
            "question": "Do you use our existing SEO tools and reporting format, or your own?",
            "answer": "We can work inside your existing stack and reporting template if you have one, or provide a white-label dashboard and report format you rebrand as your own — whichever fits how you already run client communication. Either way, the cadence and the metrics reported are ones you approve, not a generic template you have to explain to the client.",
          },
          {
            "question": "How fast can you take over an SEO account that's underperforming?",
            "answer": "We can start the technical audit within days of getting access, but be honest with the client about timeline: undoing months of thin or misdirected work takes a few weeks to diagnose properly, and ranking movement from the fixes takes the same 90-day-plus horizon any SEO work does. What changes fastest is the account actually having a real strategy behind it, which is often visible in the first status call even before rankings move.",
          },
          {
            "question": "Can you handle SEO across multiple client accounts with different niches?",
            "answer": "That is most of what this fulfillment line is — agencies rarely have one client, and each account needs its own keyword research, technical fixes and content plan rather than a templated approach copied across niches. We scope and price per account for that reason, so a law firm client and a home services client are run as two distinct strategies, not one process with the industry name swapped.",
          },
        ],
        name: 'White-Label SEO',
        headline: 'SEO fulfillment your clients experience as your agency’s own work',
        summary: 'Technical audits, page architecture and content — run to the same standard as our direct accounts, reported under your name.',
        painPoints: [
          'SEO sold to clients but run as an afterthought with no technical work',
          'No in-house capacity to take on another SEO retainer without hiring',
          'Reporting that does not hold up when a client asks a technical question',
        ],
      },
      {
        slug: 'white-label-ppc',
        context: "Paid search and social are where a badly-fulfilled account shows up fastest, because the client can see the spend and the results in the same dashboard every day. Agencies that white-label PPC are usually protecting against two failure modes: an in-house generalist spreading a few thousand dollars a month across too many accounts to actually manage bids and negatives properly, or a client's budget growing past what the current setup can responsibly handle. Fulfillment here means someone is actually in the account daily — adjusting bids, pruning search terms, testing creative — not a platform on autopilot with a monthly glance.",
        faqs: [
          {
            "question": "Who is actually managing the ad spend day to day?",
            "answer": "A dedicated person on our side works the account daily — search terms, bids, budget pacing, creative testing — the same standard we hold for our own direct clients. You get visibility into everything through the reporting and dashboard access, and any strategy change goes through you first before it reaches the client.",
          },
          {
            "question": "Do you handle Google Ads, Meta, or both?",
            "answer": "Both, along with programmatic if an account needs display or connected-TV reach. Most white-label PPC accounts run one or two platforms rather than everything at once, and we scope to whichever mix the client's budget and goals actually call for rather than adding a channel because it is available.",
          },
          {
            "question": "What happens if a client wants to see the actual ad accounts?",
            "answer": "You control what a client sees. Most agencies keep the platform-level account access on their own login and share a white-label reporting dashboard instead, which is the setup we support by default. If a client specifically needs read access to the raw ad account, that can be arranged, but it is your call to make, not a default we set.",
          },
        ],
        name: 'White-Label PPC',
        headline: 'Paid search and social management your agency can put its name on',
        summary: 'Daily account management on Google, Meta and programmatic — bids, negatives and creative testing actually happening, not a dashboard on autopilot.',
        painPoints: [
          'Ad spend growing past what current staff can actively manage',
          'Accounts checked weekly instead of managed daily',
          'A client asking for a platform the agency has never run',
        ],
      },
      {
        slug: 'white-label-web-design',
        context: "Web design and build is usually the most project-shaped of the three — a defined scope with a launch date, rather than an ongoing retainer — which makes it a natural first thing agencies outsource, since it does not require a permanent hire to cover an intermittent need. The risk is the same everywhere in this industry: a site that looks fine in a handoff deck but is slow, breaks on mobile, or was never actually built to the brief, and the agency finds out at the same time the client does. Fulfillment here runs the build against the same specification and QA pass we use on our own sites, including a Core Web Vitals check before anything ships.",
        faqs: [
          {
            "question": "Do you work from our design files, or do we need to hand off less?",
            "answer": "We can build from finished Figma or Adobe XD files if your agency handles design in-house, or take on design and build together if the account needs both. Either way, revisions go through your project lead before the client sees them, so you stay the point of contact for every round of feedback.",
          },
          {
            "question": "What happens after launch — do you handle hosting and maintenance?",
            "answer": "That is scoped separately from the build. Some agencies want us to hand back a finished site for their own hosting and maintenance process; others want ongoing white-label maintenance included so the client never has a second vendor relationship to manage. We support either, and it is worth deciding upfront so the client's expectations match what actually happens after launch.",
          },
          {
            "question": "How do you handle a tight client deadline?",
            "answer": "Tell us the real date as early as possible — most timeline problems come from a deadline surfacing in week three of a four-week build rather than at kickoff. We scope builds against a realistic timeline and will say plainly if a date is not achievable rather than let it slip silently and become your problem to explain.",
          },
        ],
        name: 'White-Label Web Design',
        headline: 'Website builds your agency delivers, start to finish',
        summary: 'Design and development run to a real specification and a Core Web Vitals check before launch — not a template site with your client’s logo dropped in.',
        painPoints: [
          'Web projects taken on without in-house design or dev capacity',
          'Sites that pass a demo but fail Core Web Vitals or mobile QA',
          'No clear handoff plan for hosting and maintenance after launch',
        ],
      },
    ],
  },
];

export const industryBySlug = new Map(industries.map((i) => [i.slug, i]));

export const allIndustryPaths = industries.flatMap((industry) => [
  { industry: industry.slug },
  ...industry.children.map((child) => ({ industry: industry.slug, sub: child.slug })),
]);

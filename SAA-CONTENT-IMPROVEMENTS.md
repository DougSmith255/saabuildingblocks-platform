# SAA Content Improvements

> Competitive analysis against buildingbetteragents.com (BBA) and full audit of existing content.
> Created 2026-03-12. Updated 2026-03-12.

---

## Issue 1: Hub Pages for Categories Without Them

### Research Finding (2026-03-12)

URL structure (flat vs nested, subfolder depth) is **NOT a ranking factor**. Google's John Mueller: "I don't think any search engine would care either way." The SEO benefit of pillar/cluster architecture comes entirely from **internal linking**, not URL paths. Changing existing URLs is risky (temporary ranking dips, broken backlinks) with zero upside.

**Decision: Do NOT change any existing URLs. Build hub pages and link everything together.**

### What's Already Done

- **about-exp-realty** - Has main hub + 8 pillar pages + 68 children. Internal linking in place. NO ACTION NEEDED.
- **exp-realty-sponsor** - Has main hub + 2 pillar pages + 19 children. Internal linking in place. NO ACTION NEEDED.
- **brokerage-comparison** - Hub page created (WordPress post ID 11128, customUri: `best-real-estate-brokerage`). Links to all 67 comparison posts. Replaces the old Next.js static pages at `/best-real-estate-brokerage/`, `/online`, `/traditional`. CREATED 2026-03-12, needs deploy.

### Still Needed: 7 Category Hub Pages

These categories have blog posts but no hub page linking them together. Each needs a WordPress blog post that introduces the topic and links to all children.

| Category | Posts | Children Live At | Hub To Create |
|----------|-------|-----------------|---------------|
| marketing-mastery | 29 | `/blog/marketing-mastery/[slug]` | New WordPress post |
| agent-career-info | 22 | `/blog/agent-career-info/[slug]` | New WordPress post |
| winning-clients | 12 | `/blog/winning-clients/[slug]` | New WordPress post |
| become-an-agent | 12 | `/blog/become-an-agent/[slug]` | New WordPress post |
| real-estate-schools | 12 | `/blog/real-estate-schools/[slug]` | New WordPress post |
| industry-trends | 8 | `/blog/industry-trends/[slug]` | New WordPress post |
| fun-for-agents | 7 | `/blog/fun-for-agents/[slug]` | New WordPress post |

Each hub page should:
- Introduce the topic with useful overview content (not just a link list)
- Link to every child post in the category
- Include FAQ schema where appropriate
- Each child post should link back to the hub (can be done via a shared component or manually)

---

## Issue 2: Content Freshness

~~DONE (2026-03-12)~~ - Updated titles and content from "2025" to "2026".

---

## Issue 3: State Licensing Coverage Gap

SAA covers 11 states with paired posts (licensing guide + school review):
- California, Colorado, Florida, Georgia, Illinois, Indiana, Michigan, Missouri, Ohio, Oklahoma, Texas

BBA covers all 50 states + DC.

**Priority expansion:** Add the next highest-volume states: New York, North Carolina, Arizona, Tennessee, Virginia, New Jersey, Pennsylvania, Washington, Maryland, South Carolina (10 more states, 20 more posts).

---

## Issue 4: Missing Top-of-Funnel Content (Detailed Gap Map)

SAA has 63 general agent advice posts. A topic-by-topic comparison against BBA's content reveals 15 true gaps and 4 partial coverage areas where SAA has tangential posts but no dedicated article targeting the keyword.

### TRUE GAPS (No Coverage - 15 Topics)

These topics have zero SAA posts. Each represents a high-search-volume keyword cluster that BBA ranks for.

| # | Topic | Search Intent | Suggested Post Title |
|---|-------|---------------|---------------------|
| 1 | Morning routine / daily schedule | Agents searching for daily structure | "The Productive Real Estate Agent's Daily Schedule: Hour-by-Hour Guide" |
| 2 | Social media content calendar | Agents wanting a posting plan | "Real Estate Social Media Content Calendar: What to Post Every Day of the Week" |
| 3 | Facebook marketing strategies | Platform-specific guidance | "Facebook Marketing for Real Estate Agents: The Complete 2026 Guide" |
| 4 | Facebook groups for agents | Community/lead gen tactic | "How to Use Facebook Groups to Generate Real Estate Leads" |
| 5 | Email marketing beginner guide | Agents starting email outreach | "Email Marketing for Real Estate Agents: From Zero to First Campaign" |
| 6 | Pinterest for real estate | Untapped platform traffic | "Pinterest for Real Estate Agents: Drive Traffic with Visual Content" |
| 7 | Sphere of influence building | Relationship-based lead gen | "Building Your Sphere of Influence: The Real Estate Agent's Relationship Playbook" |
| 8 | Hyperlocal / community pages | Local SEO strategy | "Community Pages for Real Estate Agents: How to Dominate Your Local Market Online" |
| 9 | Comprehensive branding guide | Full brand identity strategy | "Real Estate Agent Branding Guide: Build a Brand That Attracts Clients" |
| 10 | Solo agent success guide | Independent agent survival | "Solo Real Estate Agent: How to Thrive Without a Team" |
| 11 | FSBO strategies | Working with for-sale-by-owner | "FSBO Leads for Real Estate Agents: Scripts, Strategies, and Conversion Tips" |
| 12 | Agent bio writing | Self-marketing essential | "How to Write a Real Estate Agent Bio That Actually Converts" |
| 13 | Podcasts for agents | Content consumption / creation | "Best Real Estate Podcasts for Agents (+ How to Start Your Own)" |
| 14 | Geographic farming | Territory-based prospecting | "Real Estate Farming: How to Own Your Neighborhood and Generate Consistent Leads" |
| 15 | Client referral strategies | Repeat/referral business | "Client Referral Strategies for Real Estate Agents: Turn Every Close into More Business" |

### PARTIAL COVERAGE (Tangential Posts Exist - 4 Topics)

SAA has related content but no dedicated post targeting the primary keyword. A new post would capture incremental search traffic.

| # | Topic | What SAA Has | Gap | Suggested Post Title |
|---|-------|-------------|-----|---------------------|
| 16 | Pop-by gift ideas | "15+ Great Ideas for Gifts to Wow Your Clients!" (client gifts, not pop-by specific) | No seasonal pop-by gift guide (spring, fall, holiday) | "Pop-By Gift Ideas for Real Estate Agents: Seasonal Ideas Your Clients Will Love" |
| 17 | Instagram comprehensive guide | "How to Use Real Estate Hashtags for Instagram" (hashtags only) | No full Instagram strategy post | "Instagram for Real Estate Agents: Complete Guide to Posts, Reels, and Stories" |
| 18 | Canva marketing tutorials | "How Canva Pro Access Works at eXp" (eXp perk description) + "Free Canva Business Card Templates" (templates) | No Canva design tutorial for marketing materials | "Canva for Real Estate Agents: Create Stunning Marketing Materials in Minutes" |
| 19 | Low-cost / no-budget marketing | "Free Leads for Realtors: 15 Strategies" (lead gen, not marketing broadly) | No dedicated budget-friendly marketing guide | "Zero-Budget Real Estate Marketing: 20 Free Ways to Get Your Name Out There" |

### ALREADY COVERED (No New Post Needed - 3 Topics)

| Topic | SAA Post(s) |
|-------|------------|
| New agent first month/first steps | "I Got My Real Estate License, Now What?" + "Starting in Real Estate" + "New Real Estate Agent Tips" + First 90 Days freebie |
| Listing presentation | "Your Ultimate Listing Appointment Checklist: Win More Listings" (at listing-checklist AND listing-presentation slugs) |
| How to get clients / lead generation | "Free Leads for Realtors: 15 Strategies" + "How to Find Buyers in Real Estate" + "Lead Generation for Real Estate Agents" |

### Content Production Priority

**Batch 1 - Highest Search Volume (write first):**
1. Morning routine (#1) - "real estate agent daily schedule" is ~8K+ monthly searches
2. Social media calendar (#2) - Agents constantly search for this
3. Email marketing (#5) - Foundational topic, high intent
4. Branding guide (#9) - Comprehensive cornerstone content
5. Sphere of influence (#7) - Every new agent searches for this

**Batch 2 - Platform-Specific (seasonal/ongoing traffic):**
6. Facebook marketing (#3) - Largest agent audience platform
7. Instagram guide (#17) - Second largest, partial coverage exists
8. Facebook groups (#4) - Growing tactic
9. Pinterest (#6) - Untapped, strong for listing traffic
10. Pop-by gifts (#16) - Seasonal traffic spikes (holiday, spring)

**Batch 3 - Tactical / Niche (targeted traffic):**
11. FSBO strategies (#11) - High-intent, money keyword
12. Geographic farming (#14) - Proven prospecting method
13. Client referrals (#15) - Every agent needs this
14. Agent bio writing (#12) - Quick, practical, high search
15. Solo agent guide (#10) - Large underserved audience

**Batch 4 - Supplementary:**
16. Canva tutorials (#18) - Practical, links to existing Canva Pro post
17. Community pages (#8) - Local SEO, lower priority
18. Low-cost marketing (#19) - Overlaps with existing content
19. Podcasts (#13) - Lower volume but good for authority

**Total new posts needed: 19** (15 true gaps + 4 partial coverage upgrades)

---

## What SAA Already Does Better Than BBA

| Feature | SAA | BBA |
|---------|-----|-----|
| Total blog posts | **317** | 129 |
| Average word count | **~2,100** | ~1,400 |
| Lead magnets | **9** (with CRM tagging, CAPTCHA, analytics) | 4 (basic Mailchimp) |
| Interactive tools | **3** (commission calc, rev share calc, booking) | 0 |
| Agent attraction pages | **Dynamic per-agent** | None |
| Brokerage comparisons | **67 pairwise posts** | 0 |
| Design quality | **Custom dark theme** | Generic WordPress/Elementor |
| Tech stack | **Next.js static + Cloudflare** | WordPress + Elementor |
| Video analytics | **Cloudflare Stream pipeline** | None |
| Agent portal | **Full SPA with tools** | None |

---

## Priority Order

1. ~~**Content freshness updates** (Issue 2) - DONE (2026-03-12)~~
2. **Create hub pages for 7 categories + brokerage comparison** (Issue 1) - 7 new pages (brokerage done)
3. **Write missing top-of-funnel content** (Issue 4) - 19 new posts
4. **Expand state coverage** (Issue 3) - 20 new posts

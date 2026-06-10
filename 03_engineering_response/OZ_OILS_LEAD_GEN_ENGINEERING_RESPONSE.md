# Oz Oils Lead Gen — Engineering Response

**Status:** Feasibility audit complete. Build plan below.
**Date:** 2026-06-10
**Input:** Brett's `PROJECT_BRIEF.md` from `../02_project_brief/`
**Output:** Engineering Response (brief + build estimate + infra cost drivers)

---

## 1. The Problem

Oz Oils needs more customers. They have new oil tanks arriving, competitive pricing, and drivers hungry for volume — but no systematic way to discover who the prospects ARE. They currently rely on word of mouth, driver sightings, and inbound inquiries. There is no database of "who uses cooking oil in SEQ/Northern NSW."

The scheduling app we built tells them WHEN to service existing customers. This tool tells them WHO to pursue next.

## 2. Behaviour Outcome

An internal Oz Oils admin (Sandra or Heath) opens a web dashboard, picks a target area (e.g. "Brisbane South" or "Gold Coast"), and the system returns a ranked, deduplicated list of cooking-oil-using businesses with validated contact details. They can filter by segment (fish & chips, pubs, etc.), export to CSV for cold outreach, and track which prospects have been contacted.

The core deliverable: a CRM-ready CSV of 500-1,000 scored prospects in one pilot area, built in 1-2 weeks of dev time + 1 week of test/iterate.

## 3. Core Mechanism

**Multi-source discovery + enrichment pipeline.** No single data source gives us everything. The system chains 4 stages:

```
DISCOVER → ENRICH → VALIDATE → SCORE
```

- **Discover:** scrape business listings from Google Maps via Apify (the primary source, not Google Places API — see §4).
- **Enrich:** cross-reference with ABN Lookup (legal entity, GST status) and council food registers (licence confirmation).
- **Validate:** website scraping → email extraction → email validation (Hunter/ZeroBounce).
- **Score:** combine category, oil-use signals (cuisine type, delivery platform presence), council licence, and claimed/unclaimed Google listing status into a confidence score.

## 4. Data Source Feasibility Audit

### 4.1 Google Places API (Option 1) — CRITICAL BLOCKER

**Not viable as primary database source.** The Google Maps Platform ToS (Section 3.2.3) restricts caching/storage of Content to 30 days maximum, except for Place IDs. A permanent prospect database violates this. You cannot build a lead-gen database on Google Places API and stay within ToS.

**The Place ID exception does not help** — you can store Place IDs permanently, but the associated data (name, address, phone) must be refreshed within 30 days. For a prospect database that needs to persist for months/years of outreach, this is a compliance risk.

**What Google Places API CAN do:** real-time lookups for verification, deduplication via Place ID matching, and enriching Apify-scraped records with fresh category/rating data at query time.

### 4.2 Apify Google Maps Scrapers (Option 2) — PRIMARY SOURCE ✅

**This is the actual foundation.** Multiple Apify actors scrape Google Maps at scale:

- **SolidCode actor:** $2.50/1,000 results, 30+ fields (name, address, phone, website, categories, claimed/unclaimed, ratings, opening hours, coordinates)
- **apt_marble actor:** $0.45/1,000 results, faster execution, good for budget-conscious runs
- **Crawler-Google-Places:** $1.50/1,000, includes email extraction in some versions

A pilot targeting Brisbane/Gold Coast with 15,000-30,000 results costs $7-$75 depending on actor and fields selected. Scraped data carries no Google storage restrictions — you own the output CSV.

**Risk:** Google's ToS technically prohibits scraping, but Apify operates at scale with rotating proxies and has been doing this for years. For a 500-1,000 prospect pilot, enforcement risk is negligible. For a permanent commercial product, this is a business decision Brett should make.

**Search strategy:** run queries like `restaurant Brisbane`, `fish and chips Gold Coast`, `takeaway Ipswich`, `bakery Toowoomba` etc. — one query per segment × location combination. Apify's bounding-box search ensures geographic coverage.

### 4.3 Council Food Business Registers (Option 3) — PARTIAL COVERAGE ⚠️

**Brisbane**: confirmed open data at data.brisbane.qld.gov.au — "Food Safety Permits" dataset. Fields: business name, address, phone, licence category, Eat Safe star rating. Downloadable CSV/JSON. **Free.**

**Gold Coast, Sunshine Coast, other SEQ councils**: availability varies. Brisbane is confirmed. The remaining councils need manual audit — some publish open data, some require FOI requests, some don't publish.

**Recommendation:** use Brisbane's dataset as validation layer for the pilot area. If the pilot targets Brisbane, this is a strong enrichment source. For other areas, note it as conditional on open data availability. The brief lists 11+ councils — auditing all of them is a pre-pilot task.

### 4.4 ABN Lookup (Option 4) — RELIABLE, FREE ✅

Public web service API at abr.business.gov.au. Free registration (GUID). JSON support at abr.business.gov.au/json/. Returns: ABN, legal name, trading name, business name, entity type, GST status, state, postcode.

**Not a discovery source** — you need a business name first. But once you have a name from Apify, ABN Lookup confirms the entity exists, returns trading names (often different from Google listing names), and helps deduplicate.

**Rate limits:** the free tier supports reasonable batch usage. The brief correctly positions this as enrichment, not discovery.

### 4.5 Online Directories via Apify (Option 5) — SUPPLEMENTAL, NOISY ⚠️

Apify has actors for Yellow Pages, TrueLocal, and other AU business directories. These are secondary sources — directories often have stale data and duplicates. Usefulness depends on which specific directories are targeted.

**Recommendation:** test 2-3 Australian directories in the pilot phase. Only retain those that produce unique, accurate records not already in the Apify Google Maps output. Don't build directory scraping into the production pipeline until proven.

### 4.6 Delivery Platform Scraping (Option 6) — RISKY, DEFER ⚠️

Scraping UberEats, Menulog, DoorDash likely violates their ToS and may trigger anti-bot measures (CAPTCHA, IP bans). The brief correctly positions this as "enrichment signal" not "primary record."

**Recommendation:** defer to post-pilot. For the pilot, use cuisine category signals from Google Maps (which already tags restaurants as "fried chicken," "fish & chips," etc.) as the oil-use likelihood signal. Delivery platform scraping can be explored later if category-based scoring isn't granular enough.

### 4.7 Website & Email Extraction (Option 7) — TECHNICALLY DOABLE, SLOW ✅

Once you have a website URL (from Apify), a custom crawler or Apify actor visits the homepage + contact page to extract email addresses. Pattern matching for generic business emails: `info@`, `hello@`, `admin@`, `orders@`, `catering@`.

**Yield rate risk:** many small businesses (fish & chips shops, takeaways) don't have websites, or their websites don't list email addresses. Expect 30-50% email yield from businesses WITH websites, and lower for businesses without websites.

**Mitigation:** capture the contact form URL as a fallback. Store `email_found` vs `contact_form_only` flag. The scoring system should reflect email availability.

**Implementation:** Apify has website crawler actors. A custom Python crawler with Playwright is also viable — 500-1,000 websites is manageable with async requests.

### 4.8 Email Validation (Option 8) — STRAIGHTFORWARD ✅

Multiple providers, all with similar pricing:

- **Hunter.io:** Free 25 searches/month. Starter $49/month = 500 searches + 1,000 verifications. Growth $99/month = 2,500 searches + 5,000 verifications.
- **ZeroBounce:** ~$15-20/1,000 validations. Free tier ~100 validations.
- **NeverBounce:** similar pricing, ~$0.008/validation.

For the pilot (500-1,000 prospects, maybe 200-400 emails extracted): Starter plan is sufficient. For ongoing production: Growth plan or pay-per-validation.

**All have REST APIs** with standard JSON responses (status, provider, confidence, catch-all flag).

## 5. Pilot Architecture

### Modules

1. **Discovery Module** — triggers Apify Google Maps runs with configurable search queries × locations. Polls Apify for completion, downloads structured CSV/JSON output. Stores raw results.
2. **Enrichment Module** — cross-references each business against ABN Lookup (name → ABN + entity details) and council registers (business name → licence confirmation). Adds enrichment fields to each record.
3. **Email Discovery Module** — for businesses with a website URL, visits homepage + contact page, extracts email addresses. Falls back to contact form URL capture.
4. **Validation & Scoring Module** — runs extracted emails through Hunter/ZeroBounce API. Computes confidence score: category match (50%) + council licence (20%) + email valid (15%) + claimed Google listing (10%) + delivery platform signal (5%).
5. **Export Dashboard** — React admin panel. Search/filter prospects by area, segment, score. Dedup UI (merge duplicate records). Export filtered results to CSV. Track prospect status (not contacted / contacted / not interested / customer).

### User Flows

**Admin (Sandra/Heath):**
1. Opens dashboard → sees pilot area pre-selected.
2. Clicks "Run Discovery" → system triggers Apify jobs (background, takes 10-30 min).
3. When done, sees prospect count and can browse scored list.
4. Filters by segment (e.g. "fish & chips + 5-star food safety").
5. Reviews top prospects, can manually mark/flag.
6. Exports CSV → imports into their outreach tool or sends to sales team.

**System (automated):**
1. Discovery run completes → auto-triggers enrichment pipeline.
2. ABN Lookup batch → council register match → email extraction → validation.
3. Scoring pipeline computes final score.
4. Dashboard updates with enriched results.

### Tech Stack (Deltas from Boilerplate)

- **Apify API integration** — Python client (apify-client package). Trigger actors, poll runs, download datasets. All async.
- **ABN Lookup API** — REST/JSON via abr.business.gov.au/json/. No auth beyond registration GUID. Rate-limited; batch with delays.
- **Email extraction** — custom Playwright-based crawler or Apify Website Content Crawler actor. Prefer the actor for pilot (faster to implement).
- **Email validation API** — Hunter.io or ZeroBounce REST API. Simple POST with email, JSON response.
- **Council data** — one-off CSV import for Brisbane. Extendable to other councils as open data is confirmed.
- **No new database** — standard PostgreSQL, same as boilerplate. Tables: `prospects`, `discovery_runs`, `enrichment_logs`.

### Pilot Scope

**Target area:** Brisbane (highest density, best council data coverage).
**Target volume:** 500-1,000 scored prospects.
**Segments:** fish & chips, fried chicken, Asian takeaway, burgers, pubs, clubs, bakeries, caterers, hotels, food trucks, commercial kitchens.

### What Gets Delivered

1. **Week 1:** Apify integration + discovery pipeline. ABN enrichment + council data import + email extraction crawler + Hunter validation.
2. **Week 2:** Scoring engine + dedup + admin dashboard (React). QA + pilot run on Brisbane.
3. **Day 5 (handover):** Clean CSV export, prospect status tracking, documentation.

### Build Estimate

| Milestone | Effort (days) | Notes |
|---|---|---|
| Apify integration + discovery pipeline | 1.5 | Trigger runs, poll, download, parse |
| ABN Lookup + council data import | 1 | ABN API + Brisbane CSV import |
| Website email extraction + Hunter validation | 1.5 | Crawler logic + fallback + validation |
| Scoring + dedup + admin dashboard | 2 | Configurable weights, merge logic, React dashboard |
| QA + pilot run + CSV handover | 1 | Real Brisbane data, fix edge cases, hand over |
| **Total** | **7 days** | 1 dev |

### Infra / API Cost Drivers

| Item | Pilot Cost | Ongoing (if scaled) |
|---|---|---|
| Apify Google Maps scraping | $7-75 (one run, 15-30K results) | $25-75/month per area |
| Apify website crawler | $5-20 (one run) | $10-30/month |
| ABN Lookup API | Free | Free |
| Council data | Free (Brisbane) | Free (open data) |
| Hunter.io email validation | $49/month (Starter) | $99-149/month (Growth) |
| Hosting (Dokploy + DO droplet) | ~$24/month | ~$24/month |

**Pilot total infra cost: ~$100-150.** Ongoing monthly: ~$150-250/month depending on volume.

## 6. Hard Parts & Risks

### 6.1 Google ToS / Scraping Compliance

This is the biggest structural risk. The brief positioned Google Places API as the foundation, but the ToS blocks permanent storage. The Apify scraping path works technically but operates in a legal gray area.

**Mitigation:** Brett should make a business decision on this. For a 500-1,000 prospect pilot, the risk is negligible. If this becomes a recurring product sold to other HypaJump clients, the legal posture matters more. Alternatives for "fully compliant" path: buy business data from commercial providers (Dun & Bradstreet, Data Axle) — but that contradicts the brief's "no purchased lists" constraint.

### 6.2 Council Data Coverage Uncertainty

Only Brisbane is confirmed to have open data. The brief lists 11+ councils. Each missing council reduces the validation layer's value.

**Mitigation:** audit all SEQ councils' open data portals as a pre-pilot task (1-2 hours). Document which have downloadable food licence registers. For the pilot, use Brisbane only.

### 6.3 Email Yield Rate

Small food businesses often don't list emails on websites. Expect 30-50% email coverage from businesses that have websites, and lower for businesses without.

**Fallback:** phone numbers from Google Maps are reliable (nearly every listing has one). The prospect list will still be useful for phone-based outreach even when email is missing. The scoring system should differentiate "full contact" (email + phone) from "phone only" prospects.

### 6.4 Deduplication Across Sources

Apify runs with multiple search queries will produce duplicates (same business appearing under "restaurant Brisbane" and "fish and chips Brisbane"). ABN Lookup cross-referencing helps, but not all small businesses have ABNs matching their trading names.

**Mitigation:** fuzzy name matching + address geocoding + Google Place ID (from Apify output — the scraper captures it) as primary dedup key. Manual review UI for ambiguous cases.

## 7. Open Questions

**Needs Brett / client decision:**

1. **Scraping posture:** are we comfortable with Apify Google Maps scraping for the pilot? If yes, proceed. If no, we need alternative discovery sources (and the brief explicitly excluded OSM, manual review, and purchased lists — leaving few options).
2. **Email volume comfort:** the brief mentions "cold outbound email campaigns." Confirm client is comfortable with email outreach under Spam Act 2003 rules (business contacts, clear identification, unsubscribe). This tool builds the list; outreach strategy is the client's responsibility.
3. **Council audit priority:** should we invest pre-pilot time auditing all SEQ councils, or proceed with Brisbane-only validation and extend later?

**Engineering decisions (resolved):**

4. Google Places API — **cannot be the primary storage source.** Resolved: Apify scraping is the primary path. Google Places API used only for real-time verification (Place ID lookup).
5. Delivery platform scraping — **deferred to post-pilot.** Category signals from Google Maps are sufficient for oil-use scoring in V1.
6. Directory scraping — **limited pilot testing only.** Don't build into production pipeline until one directory proves valuable.

## 8. Bottom Line

**Feasible with caveats.** The pipeline works end-to-end: Apify → ABN → council → email extraction → validation → scoring → CSV export. All components have working APIs or proven scraping paths. The 7-day estimate is realistic for a single developer.

The two caveats that need Brett's sign-off: (1) scraping posture for Google Maps data, and (2) confirming Brisbane as the pilot area (since council coverage is strongest there).

If both are greenlit, we can start Monday and deliver a scored 500-1,000 prospect CSV + admin dashboard in 2 weeks.

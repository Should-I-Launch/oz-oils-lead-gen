# Oz Oils Lead Gen

HypaJump internal tool for building targeted prospect lists of cooking-oil-using businesses across South East Queensland and Northern NSW. Built for Oz Oils first, designed for re-use.

## What this project is

Oz Oils Pty Ltd — a family-owned Australian company with 30+ years in used cooking oil collection — needs more customers to meet growing demand. They collect used oil from cafes, restaurants, takeaways, hotels, food trucks and factories, and they are expanding into fresh cooking oil sales (canola, vegetable, cottonseed) to lock in collection relationships.

This tool discovers, enriches and scores prospect businesses so Oz Oils (and eventually other HypaJump clients) can run outbound sales campaigns with clean, validated contact data.

## Pipeline (5 stages)

```
01_initial_engagement/   V1 handover transcript — lead-gen discussion extract   (Brett)
02_project_brief/        Data-source brief: 8 options, compliance, pilot scope  (Brett + agent)
03_engineering_response/ Engineering response + OpenSlide deck, no pricing       (Bintang)
04_commercial_proposal/  Client-facing proposal + $3-4k pilot commercial        (Brett + agent)
05_build/app/            FastAPI + React app for prospect discovery & export     (dev)
```

## Data sources (from brief)

1. Google Places API — baseline business locations, categories, coordinates
2. Apify (Google Maps + business discovery) — rapid prototyping, scheduled runs
3. Council food business registers — validation, coverage gaps
4. ABN Lookup — enrichment, entity validation
5. Online directories (via Apify) — secondary emails, contact pages
6. Delivery platforms (via Apify) — active restaurant signals
7. Website + email extraction — generic business emails, contact forms
8. Email validation (Hunter/Snov/NeverBounce/ZeroBounce) — deliverability

## Target profile

- **Area:** South East Queensland + Northern NSW (Brisbane, Gold Coast, Sunshine Coast, Toowoomba, Byron Bay, etc.)
- **Segments:** Fish & chips, fried chicken, Asian takeaway, burgers, pubs, clubs, bakeries, caterers, hotel kitchens, food trucks, commercial kitchens
- **Output fields:** business name, category, address, suburb, postcode, lat/lng, phone, website, email, contact form URL, source, confidence score, oil-use notes

## Pilot scope

- One dense area (Brisbane or Gold Coast)
- ~500-1,000 scored prospects
- Clean CSV export, CRM-ready
- 1-2 weeks build, 1 week test/iterate
- Bill Oz Oils $3-4k, HypaJump owns IP for re-sale

## Tech stack (stage 05)

FastAPI + Postgres backend, Vite + React SPA + shadcn/ui frontend, Docker Compose. Same conventions as `hypajump_template`.

## How context works

Uses **AGENTS.md per folder, cwd-only** — the agent loads only the `AGENTS.md` of the folder you are in. Work inside one stage at a time; pull other stages' context on demand. See root `AGENTS.md` for the routing table.

## Related

- `hypajump_template` — the app boilerplate seeded into `05_build/app/`
- Skills: `hypajump-project-initializer`, `hypajump-slide-maker`, `hypajump-slide-initializer`

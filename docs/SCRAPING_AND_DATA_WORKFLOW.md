# Scraping & Data Workflow

## Overview

Data enters the system through a manual-first pipeline: research → Google Sheets → quality review → JSON export → deploy.

No automated scraping runs in production. All data is human-reviewed before publishing.

---

## Pipeline Stages

### 1. Research & Collection

**Sources (manual)**:
- Google Maps searches for drone operators in Israeli cities
- Facebook groups (drone operators, aerial photography communities)
- CAA Israel (Civil Aviation Authority) licensed operator lists, when publicly available
- LinkedIn, Waze, local business directories
- Referrals from already-listed operators

**What to collect per business**:
- Business name (Hebrew and/or English)
- Phone number (primary contact)
- Website URL
- Services offered (map to service slugs)
- Cities of operation
- Brief description (original or manually written)
- Logo / image URL if available

---

### 2. Google Sheets (Staging)

The master spreadsheet is the single source of truth before data enters the codebase.

**Sheet columns** (map to schema fields):
| Column | Notes |
|---|---|
| `id` | Manually assigned slug |
| `name` | Business name |
| `description_he` | Hebrew description (write or translate) |
| `services` | Comma-separated service slugs |
| `cities` | Comma-separated city slugs |
| `phone` | Israeli format |
| `website` | Full URL |
| `email` | Optional |
| `logo_url` | Optional |
| `featured` | TRUE/FALSE |
| `sponsored` | TRUE/FALSE |
| `active` | TRUE/FALSE — default FALSE until reviewed |
| `quality_score` | 0–100 (see scoring below) |
| `notes` | Internal reviewer notes, not exported |

New entries default to `active: FALSE`. A reviewer sets to `TRUE` after passing quality check.

---

### 3. Quality Scoring

Each listing is scored 0–100 before publishing. Score affects display order within tiers.

| Criterion | Max points |
|---|---|
| Has phone number | 20 |
| Has website | 20 |
| Has Hebrew description (≥ 30 words) | 20 |
| Has logo/image | 15 |
| Covers ≥ 2 cities | 10 |
| Offers ≥ 2 services | 10 |
| Has email | 5 |

Listings scoring **< 40** should not be published (`active: FALSE`) until enriched.

---

### 4. Enrichment

Before activating low-quality entries:
- Write a Hebrew description if none exists (1–3 sentences: who they are, what they do, where)
- Find logo from website or LinkedIn
- Verify phone is active (manual spot-check)
- Confirm service + city coverage is accurate

---

### 5. Export to JSON

**Process**:
1. Filter sheet to `active = TRUE` rows only
2. Export as CSV or use Google Sheets API script
3. Convert to `data/listings.json` format (script in `scripts/sheet-to-json.ts`, to be built)
4. Validate against schema (required fields, slug uniqueness, valid service/city slugs)
5. Commit to repo → Vercel redeploys → pages regenerate

**Validation rules before commit**:
- No duplicate `id` / `slug` values
- All `services` values exist in `data/services.json`
- All `cities` values exist in `data/cities.json`
- `phone` matches Israeli format regex if present

---

## Update Cadence (MVP)

- **Initial launch**: batch import of 30–60 listings
- **Ongoing**: ad-hoc additions, weekly at most
- **No real-time sync** in MVP — each update requires a manual export + deploy

---

## Future Considerations (post-MVP)

- Automated Google Maps scraping with human review queue
- Google Sheets → GitHub Actions → auto-deploy on sheet change
- Business self-submission form (feeds into review queue, not auto-published)
- Duplicate detection based on phone number or website URL

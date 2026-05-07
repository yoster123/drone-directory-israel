# SEO Architecture

## URL Structure

| Page type | URL pattern | Example |
|---|---|---|
| Homepage | `/` | `/` |
| Service category | `/services/[service]` | `/services/aerial-photography` |
| City hub | `/cities/[city]` | `/cities/tel-aviv` |
| Service × city | `/services/[service]/[city]` | `/services/aerial-photography/tel-aviv` |
| Listing | `/listings/[slug]` | `/listings/sky-vision-tlv` |

All slugs are English, lowercase, hyphenated.

---

## Page Generation Rules

- All pages are **statically generated** at build time (`generateStaticParams`)
- Service × city pages are only generated if `active listings >= 3`
- Pages with `< 3 listings` that somehow exist get `<meta name="robots" content="noindex">`
- Listings with `active: false` are excluded from all counts and pages

---

## Title & Meta Strategy (Hebrew)

Each page type has a templated Hebrew title and description.

**Service page** (`/services/aerial-photography`):
- Title: `צילום רחפן מקצועי | מצאו צלמי רחפן מורשים בישראל`
- Description: lists top cities, calls to action

**City page** (`/cities/tel-aviv`):
- Title: `שירותי רחפן בתל אביב | ספקים מורשים`

**Service × city page** (`/services/aerial-photography/tel-aviv`):
- Title: `צילום רחפן בתל אביב | {N} ספקים מורשים`
- Description: mentions service, city, listing count

**Listing page** (`/listings/sky-vision-tlv`):
- Title: `{Business Name} | שירותי רחפן ב{city}`
- Description: pulled from listing description field

---

## Semantic Clustering

- Each **service** is a topic cluster hub (`/services/[service]`)
- City + service pages are the cluster spokes
- All spoke pages link back to their hub
- Hub pages link to top spokes (cities with the most listings)
- Homepage links to all service hubs and top cities

### Internal Linking Rules
- Listing page → links to its service pages and city pages
- Service × city page → links to sibling cities for the same service, and sibling services for the same city
- City hub → links to all service × city combinations for that city (only indexed ones)
- Service hub → links to all service × city combinations for that service (only indexed ones)

---

## Structured Data

- **Listing page**: `LocalBusiness` schema with name, telephone, url, address (city-level), serviceType
- **Service × city page**: `ItemList` schema listing top results
- **Homepage**: `WebSite` with `SearchAction` (for future search box in Google)

---

## Sitemap

- Auto-generated XML sitemap at `/sitemap.xml`
- Includes: homepage, service pages, city pages, indexed service × city pages, listing pages
- Excludes: noindex pages, inactive listings
- `lastmod` set to `updatedAt` for listing pages, build date for category pages

---

## Canonical Tags

- Every page has a self-referencing canonical
- No duplicate content: filtering/sorting does not produce separate URLs in MVP

---

## noindex Policy

| Condition | robots tag |
|---|---|
| Service × city page with < 3 active listings | `noindex, follow` |
| All other pages | `index, follow` |

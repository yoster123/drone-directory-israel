# Data Schema

All data is stored as JSON files under `data/`. Fields use English keys; content values are Hebrew where user-facing.

---

## Listing (`data/listings.json`)

```ts
{
  id: string                  // unique slug, e.g. "sky-vision-tlv"
  name: string                // business name (Hebrew or brand name)
  slug: string                // URL-safe identifier (English)
  description: string         // Hebrew, 1–3 sentences
  services: string[]          // service slugs, e.g. ["photography", "inspection"]
  cities: string[]            // city slugs, e.g. ["tel-aviv", "haifa"]
  phone: string | null        // Israeli format, e.g. "050-1234567"
  website: string | null      // full URL
  email: string | null
  logo: string | null         // path under /public/logos/ or external URL
  featured: boolean           // paid upgrade — higher placement
  sponsored: boolean          // paid — appears at top of relevant pages
  active: boolean             // false = hidden from all pages
  qualityScore: number        // 0–100, internal only (not shown to users)
  createdAt: string           // ISO date
  updatedAt: string           // ISO date
}
```

---

## Service (`data/services.json`)

```ts
{
  slug: string          // e.g. "aerial-photography"
  nameHe: string        // Hebrew display name, e.g. "צילום אווירי"
  descriptionHe: string // Hebrew, used for page meta and intro
  icon: string | null   // icon name or path
  order: number         // display order on homepage
}
```

---

## City (`data/cities.json`)

```ts
{
  slug: string          // e.g. "tel-aviv"
  nameHe: string        // Hebrew display name, e.g. "תל אביב"
  region: string        // e.g. "center", "north", "south"
  lat: number | null    // for future map view
  lng: number | null
}
```

---

## Relationships

- `listings.services` → array of `services.slug`
- `listings.cities` → array of `cities.slug`
- A listing appears on a service × city page if it has both that service slug and that city slug

---

## Derived / Computed (not stored)

- **Page eligibility**: a service × city combination page is generated only if `activeListings.length >= 3`
- **Featured order**: `sponsored` listings first, then `featured`, then rest — sorted by `qualityScore` desc within each tier
- **noindex flag**: set at build time if listing count for that page < 3

/**
 * import-listings.ts
 *
 * Reads all *.csv files from /data-import/, transforms scraped Google Maps rows
 * into the internal Listing type, deduplicates, scores, and writes
 * /src/data/generated-listings.ts.
 *
 * Run:  npm run import:scraped
 */

import fs from 'fs'
import path from 'path'

// ── Inline types (avoid path-alias issues in Node context) ───────────────────

type ClaimedStatus = 'claimed' | 'unclaimed' | 'pending'
type Region = 'north' | 'center' | 'south' | 'jerusalem'

interface Listing {
  id: string
  name: string
  slug: string
  categorySlug: string
  categoryLabelHe: string
  services: string[]
  citySlug: string
  cityLabelHe: string
  region: Region
  shortDescriptionHe: string
  longDescriptionHe: string
  phone: string | null
  whatsapp: string | null
  website: string | null
  email: string | null
  imageUrl: string | null
  claimedStatus: ClaimedStatus
  featured: boolean
  qualityScore: number
  sourceUrl: string | null
  lastUpdated: string
}

// ── Category normalization ────────────────────────────────────────────────────

// Order matters — first match wins. Put more specific patterns before generic ones.
const CATEGORY_RULES: Array<{ keywords: string[]; slug: string; labelHe: string }> = [
  {
    keywords: ['נדל"ן', 'נדלן', 'real estate', 'realestate', 'property'],
    slug: 'real-estate-photography',
    labelHe: 'צילום נדל"ן',
  },
  {
    keywords: ['fpv', 'מירוץ', 'freestyle', 'racing'],
    slug: 'fpv-filming',
    labelHe: 'צילום FPV',
  },
  {
    keywords: ['מיפוי', 'סקר', 'מדידה', 'survey', 'mapping', 'lidar', 'גיאו', 'topograph', 'photogramm'],
    slug: 'mapping-surveying',
    labelHe: 'מיפוי וסקר',
  },
  {
    keywords: ['חקלא', 'agri', 'ריסוס', 'השקיה', 'crop'],
    slug: 'agriculture',
    labelHe: 'חקלאות',
  },
  {
    keywords: ['בדיקה', 'בדק', 'inspection', 'תשתית', 'גשר', 'מבנה', 'קירוי'],
    slug: 'inspections',
    labelHe: 'בדיקות ובדק בית',
  },
  {
    keywords: ['אבטחה', 'ניטור', 'security', 'surveillance', 'שמירה'],
    slug: 'security',
    labelHe: 'אבטחה וניטור',
  },
  {
    keywords: ['בית ספר', 'הכשרה', 'קורס', 'לימוד', 'school', 'training', 'aviation', 'license', 'רישיון'],
    slug: 'training-schools',
    labelHe: 'בתי ספר והכשרה',
  },
  {
    keywords: ['חנות', 'store', 'shop', 'ציוד', 'מכירה', 'accessories', 'parts'],
    slug: 'drone-stores',
    labelHe: 'חנויות רחפנים',
  },
  {
    keywords: ['תיקון', 'שירות', 'repair', 'fix', 'maintenance', 'טכנאי'],
    slug: 'repairs',
    labelHe: 'תיקון ושירות',
  },
  {
    keywords: ['צילום', 'צלם', 'aerial', 'photo', 'video', 'film', 'אוויר', 'רחפן', 'drone'],
    slug: 'aerial-photography',
    labelHe: 'צילום אווירי',
  },
]

const FALLBACK_CATEGORY = { slug: 'aerial-photography', labelHe: 'צילום אווירי' }

function normalizeCategory(raw: string): { slug: string; labelHe: string } {
  const lower = raw.toLowerCase()
  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return { slug: rule.slug, labelHe: rule.labelHe }
    }
  }
  return FALLBACK_CATEGORY
}

// ── City normalization ────────────────────────────────────────────────────────

interface CityInfo {
  slug: string
  labelHe: string
  region: Region
}

const CITY_MAP: Array<{ aliases: string[]; info: CityInfo }> = [
  {
    aliases: ['תל אביב', 'תל-אביב', "ת\"א", 'ת.א', 'tel aviv', 'tel-aviv', 'telaviv'],
    info: { slug: 'tel-aviv', labelHe: 'תל אביב', region: 'center' },
  },
  {
    aliases: ['ירושלים', 'jerusalem', 'yerushalayim'],
    info: { slug: 'jerusalem', labelHe: 'ירושלים', region: 'jerusalem' },
  },
  {
    aliases: ['חיפה', 'haifa'],
    info: { slug: 'haifa', labelHe: 'חיפה', region: 'north' },
  },
  {
    aliases: ['באר שבע', 'באר-שבע', 'beer sheva', 'beer-sheva', 'beersheba'],
    info: { slug: 'beer-sheva', labelHe: 'באר שבע', region: 'south' },
  },
  {
    aliases: ['הרצליה', 'herzliya', 'herzelia'],
    info: { slug: 'herzliya', labelHe: 'הרצליה', region: 'center' },
  },
  {
    aliases: ['נתניה', 'netanya', 'netania'],
    info: { slug: 'netanya', labelHe: 'נתניה', region: 'center' },
  },
  {
    aliases: ['ראשון לציון', 'ראשון-לציון', 'ראשל"צ', 'rishon lezion', 'rishon-lezion', 'rishon le zion'],
    info: { slug: 'rishon-lezion', labelHe: 'ראשון לציון', region: 'center' },
  },
  {
    aliases: ['פתח תקווה', 'פתח-תקווה', 'פ"ת', 'petah tikva', 'petah-tikva', 'petach tikva'],
    info: { slug: 'petah-tikva', labelHe: 'פתח תקווה', region: 'center' },
  },
  {
    aliases: ['אשדוד', 'ashdod'],
    info: { slug: 'ashdod', labelHe: 'אשדוד', region: 'south' },
  },
  {
    aliases: ['אילת', 'eilat'],
    info: { slug: 'eilat', labelHe: 'אילת', region: 'south' },
  },
]

const FALLBACK_CITY: CityInfo = { slug: 'tel-aviv', labelHe: 'תל אביב', region: 'center' }

function normalizeCity(raw: string): CityInfo & { isGuessed: boolean } {
  const lower = raw.toLowerCase().trim()
  for (const entry of CITY_MAP) {
    if (entry.aliases.some((a) => lower.includes(a.toLowerCase()))) {
      return { ...entry.info, isGuessed: false }
    }
  }
  return { ...FALLBACK_CITY, isGuessed: true }
}

// ── Hebrew → Latin transliteration ───────────────────────────────────────────

const HE_TO_LATIN: Record<string, string> = {
  א: 'a', ב: 'v', ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch',
  ט: 't', י: 'y', כ: 'k', ך: 'k', ל: 'l', מ: 'm', ם: 'm', נ: 'n',
  ן: 'n', ס: 's', ע: 'a', פ: 'p', ף: 'f', צ: 'ts', ץ: 'ts', ק: 'k',
  ר: 'r', ש: 'sh', ת: 't',
}

function toSlug(name: string, citySlug: string): string {
  let latin = ''
  for (const char of name) {
    if (HE_TO_LATIN[char]) {
      latin += HE_TO_LATIN[char]
    } else if (/[a-zA-Z0-9]/.test(char)) {
      latin += char.toLowerCase()
    } else {
      latin += ' '
    }
  }
  const base = latin
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 40)
  return `${base}-${citySlug}`
}

// ── Deterministic ID ──────────────────────────────────────────────────────────

function stableId(key: string): string {
  let h = 5381
  for (let i = 0; i < key.length; i++) {
    h = Math.imul((h << 5) + h, 1) ^ key.charCodeAt(i)
  }
  return 'g-' + (Math.abs(h) >>> 0).toString(36).padStart(6, '0')
}

// ── Quality score ─────────────────────────────────────────────────────────────

function calcQualityScore(opts: {
  totalScore: number   // Google rating 0–5
  reviewsCount: number
  hasWebsite: boolean
  hasPhone: boolean
}): number {
  const ratingPart = Math.round((opts.totalScore / 5) * 50)
  const reviewPart = Math.min(Math.round((Math.log10(opts.reviewsCount + 1) / Math.log10(201)) * 30), 30)
  const websitePart = opts.hasWebsite ? 10 : 0
  const phonePart = opts.hasPhone ? 10 : 0
  return Math.min(ratingPart + reviewPart + websitePart + phonePart, 100)
}

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const nonEmpty = lines.filter((l) => l.trim() !== '' && !l.trim().startsWith('#'))
  if (nonEmpty.length < 2) return []
  const headers = parseCSVRow(nonEmpty[0])
  return nonEmpty.slice(1).map((line) => {
    const values = parseCSVRow(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? '').trim() })
    return row
  })
}

function parseCSVRow(line: string): string[] {
  const fields: string[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '"') {
      i++
      let field = ''
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') { field += '"'; i += 2 }
        else if (line[i] === '"') { i++; break }
        else { field += line[i++] }
      }
      fields.push(field)
      if (line[i] === ',') i++
    } else {
      const end = line.indexOf(',', i)
      if (end === -1) { fields.push(line.slice(i)); break }
      fields.push(line.slice(i, end))
      i = end + 1
    }
  }
  return fields
}

// ── Field resolver ────────────────────────────────────────────────────────────
// Handles column name variations across different scraper outputs.

function resolve(row: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    const val = row[key]?.trim()
    if (val) return val
  }
  return ''
}

// ── Phone normalization ───────────────────────────────────────────────────────

function normalizePhone(raw: string): string | null {
  if (!raw) return null
  // Strip everything except digits, +, leading zeroes
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.length < 9) return null
  // Normalize Israeli +972 prefix → 0 prefix
  if (digits.startsWith('+972')) return '0' + digits.slice(4)
  if (digits.startsWith('972')) return '0' + digits.slice(3)
  return digits
}

// ── Row transformer ───────────────────────────────────────────────────────────

interface TransformResult {
  listing: Listing
  cityGuessed: boolean
  categoryFallback: boolean
}

function transformRow(row: Record<string, string>, today: string): TransformResult {
  // Resolve fields from multiple possible column names (Apify, Outscraper, manual)
  const name = resolve(row, 'title', 'name', 'שם', 'business_name')
  const categoryRaw = resolve(row, 'categories/0', 'categoryName', 'category', 'categories', 'type', 'קטגוריה')
  const addressRaw = resolve(row, 'address', 'full_address', 'כתובת', 'location')
  const cityRaw = resolve(row, 'city', 'עיר') || addressRaw
  const phoneRaw = resolve(row, 'phone', 'phoneUnformatted', 'טלפון', 'phone_number')
  const websiteRaw = resolve(row, 'website', 'site', 'אתר', 'web', 'url_website')
  const descriptionRaw = resolve(row, 'description', 'about', 'תיאור', 'snippet', 'editorial_summary')
  const sourceUrlRaw = resolve(row, 'url', 'placeUrl', 'maps_url', 'google_maps_url', 'link')
  const totalScoreRaw = resolve(row, 'totalScore', 'rating', 'score', 'דירוג')
  const reviewsCountRaw = resolve(row, 'reviewsCount', 'reviews', 'reviewCount', 'user_ratings_total', 'ביקורות')

  const phone = normalizePhone(phoneRaw)
  const website = websiteRaw || null
  const totalScore = parseFloat(totalScoreRaw) || 0
  const reviewsCount = parseInt(reviewsCountRaw, 10) || 0
  const category = normalizeCategory(categoryRaw)
  const cityResult = normalizeCity(cityRaw)
  const slug = toSlug(name || 'business', cityResult.slug)
  const idKey = phone ?? website ?? (name + cityResult.slug)
  const id = stableId(idKey)
  const qualityScore = calcQualityScore({
    totalScore,
    reviewsCount,
    hasWebsite: !!website,
    hasPhone: !!phone,
  })

  const shortDesc = descriptionRaw
    ? descriptionRaw.slice(0, 160)
    : `${category.labelHe} בישראל.`
  const longDesc = descriptionRaw || shortDesc

  const listing: Listing = {
    id,
    name: name || 'עסק לא ידוע',
    slug,
    categorySlug: category.slug,
    categoryLabelHe: category.labelHe,
    services: [],
    citySlug: cityResult.slug,
    cityLabelHe: cityResult.labelHe,
    region: cityResult.region,
    shortDescriptionHe: shortDesc,
    longDescriptionHe: longDesc,
    phone,
    whatsapp: null,
    website,
    email: null,
    imageUrl: null,
    claimedStatus: 'unclaimed',
    featured: false,
    qualityScore,
    sourceUrl: sourceUrlRaw || null,
    lastUpdated: today,
  }

  return {
    listing,
    cityGuessed: cityResult.isGuessed,
    categoryFallback: categoryRaw === '' || !CATEGORY_RULES.some((r) =>
      r.keywords.some((kw) => categoryRaw.toLowerCase().includes(kw.toLowerCase()))
    ),
  }
}

// ── Deduplication ─────────────────────────────────────────────────────────────
// Two listings are duplicates if they share the same normalized phone
// or the same normalized website root.

function normalizeWebsite(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '').toLowerCase()
}

function deduplicate(listings: Listing[]): { listings: Listing[]; removed: number } {
  const seenPhones = new Set<string>()
  const seenSites = new Set<string>()
  const seenSlugs = new Map<string, number>()
  const result: Listing[] = []
  let removed = 0

  for (const listing of listings) {
    const phoneKey = listing.phone ?? null
    const siteKey = listing.website ? normalizeWebsite(listing.website) : null

    if ((phoneKey && seenPhones.has(phoneKey)) || (siteKey && seenSites.has(siteKey))) {
      removed++
      continue
    }

    if (phoneKey) seenPhones.add(phoneKey)
    if (siteKey) seenSites.add(siteKey)

    // Ensure unique slugs
    const slugBase = listing.slug
    const count = seenSlugs.get(slugBase) ?? 0
    seenSlugs.set(slugBase, count + 1)
    const finalSlug = count === 0 ? slugBase : `${slugBase}-${count + 1}`

    result.push({ ...listing, slug: finalSlug })
  }

  return { listings: result, removed }
}

// ── Code generation ───────────────────────────────────────────────────────────

function generateOutput(listings: Listing[], sourceFiles: string[]): string {
  const timestamp = new Date().toISOString()
  const fileList = sourceFiles.map((f) => `//   ${f}`).join('\n')
  const body = listings
    .map((l, i) => {
      const json = JSON.stringify(l, null, 2)
        .split('\n')
        .map((line, li) => (li === 0 ? '  ' + line : '  ' + line))
        .join('\n')
      return json + (i < listings.length - 1 ? ',' : '')
    })
    .join('\n')

  return [
    `// AUTO-GENERATED — do not edit manually`,
    `// Sources:`,
    fileList,
    `// Generated: ${timestamp}`,
    `// Run: npm run import:scraped`,
    ``,
    `import type { Listing } from '../types/listing'`,
    ``,
    `export const generatedListings: Listing[] = [`,
    body,
    `]`,
    ``,
  ].join('\n')
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const ROOT = process.cwd()
  const INPUT_DIR = path.join(ROOT, 'data-import')
  const OUTPUT = path.join(ROOT, 'src', 'data', 'generated-listings.ts')
  const TODAY = new Date().toISOString().slice(0, 10)

  const csvFiles = fs
    .readdirSync(INPUT_DIR)
    .filter((f) => f.endsWith('.csv') && f !== 'listings-template.csv')
    .sort()

  if (csvFiles.length === 0) {
    console.error(`❌  לא נמצאו קבצי CSV ב-${INPUT_DIR}`)
    console.error(`   שמרו את קובצי הסקריפינג כ-*.csv בתיקיית data-import/`)
    process.exit(1)
  }

  console.log(`📂  קבצי CSV שנמצאו: ${csvFiles.join(', ')}`)

  const allListings: Listing[] = []
  const warnings: string[] = []
  let totalRows = 0
  let skippedRows = 0

  for (const file of csvFiles) {
    const filePath = path.join(INPUT_DIR, file)
    const raw = fs.readFileSync(filePath, 'utf-8')
    const rows = parseCSV(raw)
    console.log(`   ${file}: ${rows.length} שורות`)
    totalRows += rows.length

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const name = resolve(row, 'title', 'name', 'שם', 'business_name')
      if (!name) {
        skippedRows++
        warnings.push(`${file} שורה ${i + 2}: דולגה — אין שם עסק`)
        continue
      }

      const { listing, cityGuessed, categoryFallback } = transformRow(row, TODAY)
      allListings.push(listing)

      if (cityGuessed) {
        warnings.push(`${file} שורה ${i + 2}: עיר לא זוהתה עבור "${name}" — שובץ לתל אביב`)
      }
      if (categoryFallback) {
        warnings.push(`${file} שורה ${i + 2}: קטגוריה לא זוהתה עבור "${name}" — שובץ לצילום אווירי`)
      }
    }
  }

  const { listings, removed } = deduplicate(allListings)

  if (warnings.length > 0) {
    console.log(`\n⚠️   אזהרות (${warnings.length}):`)
    warnings.forEach((w) => console.log(`   ${w}`))
  }

  const output = generateOutput(listings, csvFiles)
  fs.writeFileSync(OUTPUT, output, 'utf-8')

  console.log(`
📊  סיכום:
   קובצי CSV:       ${csvFiles.length}
   שורות סה"כ:     ${totalRows}
   דולגו:          ${skippedRows}
   כפולות הוסרו:   ${removed}
   עסקים יובאו:    ${listings.length}

✅  נכתב: ${OUTPUT}`)
}

main()

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

// ── Inline types ─────────────────────────────────────────────────────────────

type ClaimedStatus = 'claimed' | 'unclaimed' | 'pending'
type Region = 'north' | 'center' | 'south' | 'jerusalem'
type ServiceAreaType = 'local' | 'regional' | 'nationwide'

interface Listing {
  id: string
  name: string
  slug: string
  categorySlug: string
  categoryLabelHe: string
  services: string[]
  citySlug: string | null
  cityLabelHe: string
  region: Region
  serviceAreaType: ServiceAreaType
  serviceRegions: Region[]
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

// ── Region labels ─────────────────────────────────────────────────────────────

const REGION_LABELS_HE: Record<Region, string> = {
  north: 'צפון',
  center: 'מרכז',
  south: 'דרום',
  jerusalem: 'ירושלים',
}

// ── Category normalization — weighted scoring ──────────────────────────────────
// Score each category by summing keyword weights from category text + business name.
// Highest score wins. "שירות" intentionally absent — too generic in Hebrew.

const CATEGORY_WEIGHTS: Array<{
  slug: string
  labelHe: string
  keywords: Array<{ term: string; weight: number }>
}> = [
  {
    slug: 'real-estate-photography',
    labelHe: 'צילום נדל"ן',
    keywords: [
      { term: 'נדל"ן', weight: 10 }, { term: 'נדלן', weight: 10 },
      { term: 'real estate', weight: 10 }, { term: 'property', weight: 8 },
      { term: 'נכס', weight: 6 }, { term: 'דירות', weight: 5 },
      { term: 'קבלן', weight: 4 },
    ],
  },
  {
    slug: 'fpv-filming',
    labelHe: 'צילום FPV',
    keywords: [
      { term: 'fpv', weight: 10 }, { term: 'מירוץ', weight: 9 },
      { term: 'freestyle', weight: 10 }, { term: 'racing', weight: 10 },
    ],
  },
  {
    slug: 'mapping-surveying',
    labelHe: 'מיפוי וסקר',
    keywords: [
      { term: 'מיפוי', weight: 10 }, { term: 'מדידה', weight: 9 },
      { term: 'סקר קרקע', weight: 10 }, { term: 'survey', weight: 9 },
      { term: 'lidar', weight: 10 }, { term: 'gis', weight: 10 },
      { term: 'photogramm', weight: 10 }, { term: 'topograph', weight: 9 },
      { term: 'גיאו', weight: 8 }, { term: 'mapping', weight: 10 },
      { term: 'תלת ממד', weight: 6 }, { term: '3d', weight: 4 },
    ],
  },
  {
    slug: 'agriculture',
    labelHe: 'חקלאות',
    keywords: [
      { term: 'חקלא', weight: 10 }, { term: 'agri', weight: 10 },
      { term: 'ריסוס', weight: 10 }, { term: 'השקיה', weight: 9 },
      { term: 'crop', weight: 10 }, { term: 'יבול', weight: 8 },
      { term: 'שדה', weight: 5 }, { term: 'כרם', weight: 6 },
    ],
  },
  {
    slug: 'inspections',
    labelHe: 'בדיקות ובדק בית',
    keywords: [
      { term: 'בדיקה', weight: 8 }, { term: 'בדק', weight: 8 },
      { term: 'inspection', weight: 10 }, { term: 'תשתית', weight: 7 },
      { term: 'גשר', weight: 7 }, { term: 'קירוי', weight: 8 },
      { term: 'תרמי', weight: 8 }, { term: 'thermal', weight: 9 },
      { term: 'מגדל', weight: 5 }, { term: 'ארובה', weight: 7 },
    ],
  },
  {
    slug: 'security',
    labelHe: 'אבטחה וניטור',
    keywords: [
      { term: 'אבטחה', weight: 10 }, { term: 'ניטור', weight: 8 },
      { term: 'security', weight: 10 }, { term: 'surveillance', weight: 10 },
      { term: 'שמירה', weight: 8 }, { term: 'ריגול', weight: 9 },
      { term: 'spy', weight: 9 }, { term: 'מעקב', weight: 8 },
    ],
  },
  {
    slug: 'training-schools',
    labelHe: 'בתי ספר והכשרה',
    keywords: [
      { term: 'בית ספר', weight: 10 }, { term: 'הכשרה', weight: 9 },
      { term: 'קורס', weight: 8 }, { term: 'לימוד', weight: 7 },
      { term: 'school', weight: 9 }, { term: 'training', weight: 9 },
      { term: 'רישיון', weight: 7 }, { term: 'license', weight: 7 },
      { term: 'academy', weight: 8 }, { term: 'הכשר', weight: 8 },
    ],
  },
  {
    slug: 'drone-stores',
    labelHe: 'חנויות רחפנים',
    keywords: [
      { term: 'חנות', weight: 10 }, { term: 'store', weight: 9 },
      { term: 'shop', weight: 9 }, { term: 'מכירה', weight: 8 },
      { term: 'ציוד', weight: 7 }, { term: 'accessories', weight: 8 },
      { term: 'אלקטרוניקה', weight: 5 }, { term: 'דיוטי', weight: 8 },
      { term: 'duty', weight: 7 },
    ],
  },
  {
    slug: 'repairs',
    labelHe: 'תיקון ושירות',
    keywords: [
      { term: 'תיקון', weight: 10 }, { term: 'repair', weight: 10 },
      { term: 'fix', weight: 9 }, { term: 'maintenance', weight: 10 },
      { term: 'טכנאי', weight: 10 }, { term: 'מוסך', weight: 8 },
      // "שירות" intentionally absent — too generic
    ],
  },
  {
    slug: 'aerial-photography',
    labelHe: 'צילום אווירי',
    keywords: [
      { term: 'צילום אווירי', weight: 10 }, { term: 'צלם אווירי', weight: 10 },
      { term: 'צלם רחפן', weight: 9 }, { term: 'צילומי רחפן', weight: 9 },
      { term: 'aerial photo', weight: 10 }, { term: 'aerial film', weight: 10 },
      { term: 'drone photo', weight: 9 },
      { term: 'אווירי', weight: 7 }, { term: 'אוירי', weight: 7 },
      { term: 'אוויר', weight: 6 },
      { term: 'רחפן', weight: 5 }, { term: 'drone', weight: 5 },
      { term: 'צילום', weight: 3 }, { term: 'צלם', weight: 3 },
      { term: 'וידאו', weight: 2 }, { term: 'video', weight: 2 },
      { term: 'photo', weight: 2 },
    ],
  },
]

type Confidence = 'high' | 'medium' | 'low'

function normalizeCategory(
  categoryRaw: string,
  nameRaw: string,
): { slug: string; labelHe: string; confidence: Confidence; score: number } {
  const catLower = categoryRaw.toLowerCase()
  const nameLower = nameRaw.toLowerCase()

  let bestSlug = 'aerial-photography'
  let bestLabel = 'צילום אווירי'
  let bestScore = 0

  for (const cat of CATEGORY_WEIGHTS) {
    let score = 0
    for (const kw of cat.keywords) {
      const term = kw.term.toLowerCase()
      if (catLower.includes(term)) score += kw.weight
      // Name is a weaker signal than the Google Maps category string
      else if (nameLower.includes(term)) score += Math.round(kw.weight * 0.5)
    }
    if (score > bestScore) {
      bestScore = score
      bestSlug = cat.slug
      bestLabel = cat.labelHe
    }
  }

  const confidence: Confidence = bestScore >= 8 ? 'high' : bestScore >= 3 ? 'medium' : 'low'
  return { slug: bestSlug, labelHe: bestLabel, confidence, score: bestScore }
}

// ── City / location normalization ─────────────────────────────────────────────

interface KnownCity {
  slug: string
  labelHe: string
  region: Region
  aliases: string[]
}

const KNOWN_CITIES: KnownCity[] = [
  { slug: 'tel-aviv', labelHe: 'תל אביב', region: 'center',
    aliases: ['תל אביב', 'תל-אביב', "ת\"א", 'ת.א', 'tel aviv', 'tel-aviv', 'telaviv'] },
  { slug: 'jerusalem', labelHe: 'ירושלים', region: 'jerusalem',
    aliases: ['ירושלים', 'jerusalem', 'yerushalayim'] },
  { slug: 'haifa', labelHe: 'חיפה', region: 'north',
    aliases: ['חיפה', 'haifa'] },
  { slug: 'beer-sheva', labelHe: 'באר שבע', region: 'south',
    aliases: ['באר שבע', 'באר-שבע', 'beer sheva', 'beer-sheva', 'beersheba'] },
  { slug: 'herzliya', labelHe: 'הרצליה', region: 'center',
    aliases: ['הרצליה', 'herzliya', 'herzelia'] },
  { slug: 'netanya', labelHe: 'נתניה', region: 'center',
    aliases: ['נתניה', 'netanya', 'netania'] },
  { slug: 'rishon-lezion', labelHe: 'ראשון לציון', region: 'center',
    aliases: ['ראשון לציון', 'ראשון-לציון', 'ראשל"צ', 'rishon lezion', 'rishon-lezion', 'rishon le zion'] },
  { slug: 'petah-tikva', labelHe: 'פתח תקווה', region: 'center',
    aliases: ['פתח תקווה', 'פתח-תקווה', 'פ"ת', 'petah tikva', 'petah-tikva', 'petach tikva'] },
  { slug: 'ashdod', labelHe: 'אשדוד', region: 'south',
    aliases: ['אשדוד', 'ashdod'] },
  { slug: 'eilat', labelHe: 'אילת', region: 'south',
    aliases: ['אילת', 'eilat'] },
]

// Israeli cities not in the directory map — used for region inference only.
const EXTENDED_CITY_REGIONS: Array<{ name: string; region: Region }> = [
  // North
  { name: 'נהריה', region: 'north' }, { name: 'עכו', region: 'north' },
  { name: 'טבריה', region: 'north' }, { name: 'נצרת', region: 'north' },
  { name: 'כרמיאל', region: 'north' }, { name: 'עפולה', region: 'north' },
  { name: 'מגדל העמק', region: 'north' }, { name: 'בית שאן', region: 'north' },
  { name: 'קריית שמונה', region: 'north' }, { name: 'צפת', region: 'north' },
  { name: 'שפרעם', region: 'north' }, { name: 'נשר', region: 'north' },
  { name: 'קריית ים', region: 'north' }, { name: 'קריית ביאליק', region: 'north' },
  { name: 'קריית אתא', region: 'north' }, { name: 'קריית מוצקין', region: 'north' },
  { name: 'תירת כרמל', region: 'north' }, { name: 'עתלית', region: 'north' },
  { name: 'זכרון יעקב', region: 'north' }, { name: 'בנימינה', region: 'north' },
  { name: 'קיסריה', region: 'north' }, { name: 'חצור הגלילית', region: 'north' },
  { name: 'אום אל פחם', region: 'north' }, { name: 'ירכא', region: 'north' },
  // Center
  { name: 'חולון', region: 'center' }, { name: 'בת ים', region: 'center' },
  { name: 'גבעתיים', region: 'center' }, { name: 'רמת גן', region: 'center' },
  { name: 'בני ברק', region: 'center' }, { name: 'כפר סבא', region: 'center' },
  { name: 'רעננה', region: 'center' }, { name: 'הוד השרון', region: 'center' },
  { name: 'רמלה', region: 'center' }, { name: 'לוד', region: 'center' },
  { name: 'נס ציונה', region: 'center' }, { name: 'יבנה', region: 'center' },
  { name: 'רחובות', region: 'center' }, { name: 'מודיעין', region: 'center' },
  { name: 'קריית אונו', region: 'center' }, { name: 'אור יהודה', region: 'center' },
  { name: 'גבעת שמואל', region: 'center' }, { name: 'רמת השרון', region: 'center' },
  { name: 'כפר יונה', region: 'center' }, { name: 'גדרה', region: 'center' },
  { name: 'אזור', region: 'center' }, { name: 'טירה', region: 'center' },
  // Jerusalem district
  { name: 'בית שמש', region: 'jerusalem' }, { name: 'מעלה אדומים', region: 'jerusalem' },
  { name: 'ביתר עילית', region: 'jerusalem' }, { name: 'מבשרת ציון', region: 'jerusalem' },
  { name: 'גבעת זאב', region: 'jerusalem' },
  // South
  { name: 'קריית גת', region: 'south' }, { name: 'ערד', region: 'south' },
  { name: 'דימונה', region: 'south' }, { name: 'נתיבות', region: 'south' },
  { name: 'שדרות', region: 'south' }, { name: 'אופקים', region: 'south' },
  { name: 'קריית מלאכי', region: 'south' }, { name: 'רהט', region: 'south' },
  { name: 'אשקלון', region: 'south' }, { name: 'תל שבע', region: 'south' },
]

// Area/region keywords that appear in address text.
const AREA_KEYWORDS: Array<{ keyword: string; region: Region }> = [
  { keyword: 'גליל', region: 'north' }, { keyword: 'גולן', region: 'north' },
  { keyword: 'יזרעאל', region: 'north' }, { keyword: 'כרמל', region: 'north' },
  { keyword: 'כנרת', region: 'north' }, { keyword: 'עמק', region: 'north' },
  { keyword: 'נגב', region: 'south' }, { keyword: 'ערבה', region: 'south' },
  { keyword: 'ים המלח', region: 'south' }, { keyword: 'אילת', region: 'south' },
  { keyword: 'שרון', region: 'center' }, { keyword: 'גוש דן', region: 'center' },
  { keyword: 'שפלה', region: 'center' },
  { keyword: 'יהודה', region: 'jerusalem' }, { keyword: 'גוש עציון', region: 'jerusalem' },
]

type LocationStatus = 'matched' | 'region-only' | 'unknown'

interface LocationResult {
  citySlug: string | null
  cityLabelHe: string
  region: Region
  status: LocationStatus
  rawValue: string   // what we received, for logging
}

function normalizeLocation(cityRaw: string, streetRaw: string): LocationResult {
  const sources = [cityRaw, streetRaw].filter(Boolean)
  const combined = sources.join(' ')

  // 1 — Try exact match against our 10-city directory
  for (const src of sources) {
    const lower = src.toLowerCase().trim()
    for (const city of KNOWN_CITIES) {
      if (city.aliases.some((a) => lower === a.toLowerCase() || lower.startsWith(a.toLowerCase()))) {
        return {
          citySlug: city.slug,
          cityLabelHe: city.labelHe,
          region: city.region,
          status: 'matched',
          rawValue: cityRaw,
        }
      }
    }
  }

  // 2 — Extended city list: infer region but don't assign a directory citySlug
  const combinedLower = combined.toLowerCase()
  for (const entry of EXTENDED_CITY_REGIONS) {
    if (combinedLower.includes(entry.name.toLowerCase())) {
      return {
        citySlug: null,
        cityLabelHe: `אזור ${REGION_LABELS_HE[entry.region]}`,
        region: entry.region,
        status: 'region-only',
        rawValue: cityRaw || entry.name,
      }
    }
  }

  // 3 — Area/region keywords in address text
  for (const { keyword, region } of AREA_KEYWORDS) {
    if (combinedLower.includes(keyword.toLowerCase())) {
      return {
        citySlug: null,
        cityLabelHe: `אזור ${REGION_LABELS_HE[region]}`,
        region,
        status: 'region-only',
        rawValue: cityRaw,
      }
    }
  }

  // 4 — Unknown: no location data at all
  return {
    citySlug: null,
    cityLabelHe: 'ישראל',
    region: 'center',
    status: 'unknown',
    rawValue: cityRaw,
  }
}

// ── Service area inference ────────────────────────────────────────────────────

function inferServiceAreaType(name: string, description: string): ServiceAreaType {
  const text = (name + ' ' + description).toLowerCase()
  const nationwide = ['ארצי', 'כלל ישראל', 'לכל הארץ', 'nationwide', 'ברחבי ישראל', 'בכל הארץ']
  if (nationwide.some((t) => text.includes(t))) return 'nationwide'
  return 'local'
}

// ── Quality score ─────────────────────────────────────────────────────────────

function calcQualityScore(opts: {
  totalScore: number
  reviewsCount: number
  hasWebsite: boolean
  hasPhone: boolean
}): number {
  const ratingPart = Math.round((opts.totalScore / 5) * 50)
  const reviewPart = Math.min(
    Math.round((Math.log10(opts.reviewsCount + 1) / Math.log10(201)) * 30),
    30,
  )
  const websitePart = opts.hasWebsite ? 10 : 0
  const phonePart = opts.hasPhone ? 10 : 0
  return Math.min(ratingPart + reviewPart + websitePart + phonePart, 100)
}

// ── Deterministic ID ──────────────────────────────────────────────────────────

function stableId(key: string): string {
  let h = 5381
  for (let i = 0; i < key.length; i++) {
    h = Math.imul((h << 5) + h, 1) ^ key.charCodeAt(i)
  }
  return 'g-' + (Math.abs(h) >>> 0).toString(36).padStart(6, '0')
}

// ── Hebrew → Latin transliteration ───────────────────────────────────────────

const HE_TO_LATIN: Record<string, string> = {
  א: 'a', ב: 'v', ג: 'g', ד: 'd', ה: 'h', ו: 'v', ז: 'z', ח: 'ch',
  ט: 't', י: 'y', כ: 'k', ך: 'k', ל: 'l', מ: 'm', ם: 'm', נ: 'n',
  ן: 'n', ס: 's', ע: 'a', פ: 'p', ף: 'f', צ: 'ts', ץ: 'ts', ק: 'k',
  ר: 'r', ש: 'sh', ת: 't',
}

function toSlug(name: string, citySlug: string | null): string {
  let latin = ''
  for (const char of name) {
    if (HE_TO_LATIN[char]) latin += HE_TO_LATIN[char]
    else if (/[a-zA-Z0-9]/.test(char)) latin += char.toLowerCase()
    else latin += ' '
  }
  const base = latin.trim().replace(/\s+/g, '-').replace(/-+/g, '-')
    .replace(/[^a-z0-9-]/g, '').slice(0, 40)
  return citySlug ? `${base}-${citySlug}` : base
}

// ── Phone normalization ───────────────────────────────────────────────────────

function normalizePhone(raw: string): string | null {
  if (!raw) return null
  const digits = raw.replace(/[^\d+]/g, '')
  if (digits.length < 9) return null
  if (digits.startsWith('+972')) return '0' + digits.slice(4)
  if (digits.startsWith('972')) return '0' + digits.slice(3)
  return digits
}

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(raw: string): Record<string, string>[] {
  // Strip BOM that Excel/Windows adds to UTF-8 files
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
// Handles column name variations across Apify, Outscraper, and manual exports.

function resolve(row: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    const val = row[key]?.trim()
    if (val) return val
  }
  return ''
}

// ── Row transformer ───────────────────────────────────────────────────────────

interface TransformResult {
  listing: Listing
  categoryConfidence: Confidence
  categoryScore: number
  locationStatus: LocationStatus
  rawCity: string
}

function transformRow(row: Record<string, string>, today: string): TransformResult | null {
  const name = resolve(row, 'title', 'name', 'שם', 'business_name')
  if (!name) return null

  const categoryRaw = resolve(row, 'categories/0', 'categoryName', 'category', 'type', 'קטגוריה')
  const cityRaw = resolve(row, 'city', 'עיר')
  const streetRaw = resolve(row, 'street', 'address', 'full_address', 'כתובת')
  const phoneRaw = resolve(row, 'phone', 'phoneUnformatted', 'טלפון', 'phone_number')
  const websiteRaw = resolve(row, 'website', 'site', 'אתר', 'web', 'url_website')
  const descriptionRaw = resolve(row, 'description', 'about', 'תיאור', 'snippet')
  const sourceUrlRaw = resolve(row, 'url', 'placeUrl', 'maps_url', 'google_maps_url', 'link')
  const totalScoreRaw = resolve(row, 'totalScore', 'rating', 'score', 'דירוג')
  const reviewsCountRaw = resolve(row, 'reviewsCount', 'reviews', 'reviewCount', 'user_ratings_total')

  const phone = normalizePhone(phoneRaw)
  const website = websiteRaw || null
  const totalScore = parseFloat(totalScoreRaw) || 0
  const reviewsCount = parseInt(reviewsCountRaw, 10) || 0

  const category = normalizeCategory(categoryRaw, name)
  const location = normalizeLocation(cityRaw, streetRaw)
  const serviceAreaType = inferServiceAreaType(name, descriptionRaw)

  const slug = toSlug(name, location.citySlug)
  const idKey = phone ?? website ?? (name + location.citySlug)
  const id = stableId(idKey)
  const qualityScore = calcQualityScore({
    totalScore, reviewsCount, hasWebsite: !!website, hasPhone: !!phone,
  })

  const shortDesc = descriptionRaw
    ? descriptionRaw.slice(0, 160)
    : `${category.labelHe} בישראל.`
  const longDesc = descriptionRaw || shortDesc

  const listing: Listing = {
    id, name, slug,
    categorySlug: category.slug,
    categoryLabelHe: category.labelHe,
    services: [],
    citySlug: location.citySlug,
    cityLabelHe: location.cityLabelHe,
    region: location.region,
    serviceAreaType,
    serviceRegions: [location.region],
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
    categoryConfidence: category.confidence,
    categoryScore: category.score,
    locationStatus: location.status,
    rawCity: location.rawValue,
  }
}

// ── Deduplication ─────────────────────────────────────────────────────────────

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
    const phoneKey = listing.phone
    const siteKey = listing.website ? normalizeWebsite(listing.website) : null

    if ((phoneKey && seenPhones.has(phoneKey)) || (siteKey && seenSites.has(siteKey))) {
      removed++
      continue
    }

    if (phoneKey) seenPhones.add(phoneKey)
    if (siteKey) seenSites.add(siteKey)

    const slugBase = listing.slug
    const count = seenSlugs.get(slugBase) ?? 0
    seenSlugs.set(slugBase, count + 1)

    result.push({ ...listing, slug: count === 0 ? slugBase : `${slugBase}-${count + 1}` })
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
    process.exit(1)
  }

  console.log(`📂  קבצי CSV: ${csvFiles.join(', ')}`)

  const allListings: Listing[] = []
  const uncertainCategory: string[] = []
  const unknownCity: string[] = []
  const regionOnly: string[] = []
  let totalRows = 0
  let skippedRows = 0

  for (const file of csvFiles) {
    const raw = fs.readFileSync(path.join(INPUT_DIR, file), 'utf-8')
    const rows = parseCSV(raw)
    console.log(`   ${file}: ${rows.length} שורות`)
    totalRows += rows.length

    for (let i = 0; i < rows.length; i++) {
      const result = transformRow(rows[i], TODAY)
      if (!result) {
        skippedRows++
        continue
      }

      const { listing, categoryConfidence, categoryScore, locationStatus, rawCity } = result
      allListings.push(listing)

      if (categoryConfidence === 'low') {
        uncertainCategory.push(
          `  ${file} שורה ${i + 2}: "${listing.name}" (score: ${categoryScore}) → ${listing.categorySlug}`,
        )
      }

      if (locationStatus === 'unknown') {
        unknownCity.push(
          `  ${file} שורה ${i + 2}: "${listing.name}" — מיקום לא ידוע (raw: "${rawCity}")`,
        )
      } else if (locationStatus === 'region-only') {
        regionOnly.push(
          `  ${file} שורה ${i + 2}: "${listing.name}" — עיר לא בתמיכה: "${rawCity}" → ${REGION_LABELS_HE[listing.region]}`,
        )
      }
    }
  }

  const { listings, removed } = deduplicate(allListings)

  if (uncertainCategory.length > 0) {
    console.log(`\n⚠️   סיווג קטגוריה לא בטוח (${uncertainCategory.length}):`)
    uncertainCategory.forEach((w) => console.log(w))
  }

  if (regionOnly.length > 0) {
    console.log(`\n🏙️   עיר לא בתמיכה — אזור הוסק (${regionOnly.length}):`)
    regionOnly.forEach((w) => console.log(w))
  }

  if (unknownCity.length > 0) {
    console.log(`\n❓  מיקום לא ידוע לחלוטין (${unknownCity.length}):`)
    unknownCity.forEach((w) => console.log(w))
  }

  const output = generateOutput(listings, csvFiles)
  fs.writeFileSync(OUTPUT, output, 'utf-8')

  const cityDist: Record<string, number> = {}
  const catDist: Record<string, number> = {}
  listings.forEach((l) => {
    const city = l.citySlug ?? `[אזור ${REGION_LABELS_HE[l.region]}]`
    cityDist[city] = (cityDist[city] ?? 0) + 1
    catDist[l.categorySlug] = (catDist[l.categorySlug] ?? 0) + 1
  })

  console.log(`
📊  סיכום:
   קבצי CSV:          ${csvFiles.length}
   שורות סה"כ:        ${totalRows}
   דולגו (ללא שם):   ${skippedRows}
   כפולות הוסרו:      ${removed}
   עסקים יובאו:       ${listings.length}
   ─────────────────────────────────
   סיווג קטגוריה לא בטוח:   ${uncertainCategory.length}
   עיר לא בתמיכה (אזור הוסק): ${regionOnly.length}
   מיקום לא ידוע:          ${unknownCity.length}
   citySlug=null:           ${listings.filter((l) => l.citySlug === null).length}

🗂️  קטגוריות:
${Object.entries(catDist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `   ${k}: ${v}`).join('\n')}

🏙️  ערים/אזורים:
${Object.entries(cityDist).sort((a, b) => b[1] - a[1]).map(([k, v]) => `   ${k}: ${v}`).join('\n')}

✅  נכתב: ${OUTPUT}`)
}

main()

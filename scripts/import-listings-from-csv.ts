import fs from 'fs'
import path from 'path'

// ── Types (inline to avoid path-alias issues in Node context) ────────────────

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

// ── Valid slugs ──────────────────────────────────────────────────────────────

const VALID_CATEGORY_SLUGS = new Set([
  'aerial-photography',
  'real-estate-photography',
  'fpv-filming',
  'mapping-surveying',
  'agriculture',
  'inspections',
  'solar',
  'insurance',
  'security',
  'training-schools',
  'drone-stores',
  'repairs',
  'drone-technology',
])

const CATEGORY_LABELS: Record<string, string> = {
  'aerial-photography': 'צילום אווירי',
  'real-estate-photography': 'צילום נדל"ן',
  'fpv-filming': 'צילום FPV',
  'mapping-surveying': 'מיפוי וסקר',
  'agriculture': 'חקלאות',
  'inspections': 'בדיקות תשתיות ומבנים',
  'solar': 'אנרגיה סולרית',
  'insurance': 'ביטוח ותביעות',
  'security': 'אבטחה וניטור',
  'training-schools': 'בתי ספר והכשרה',
  'drone-stores': 'חנויות רחפנים',
  'repairs': 'תיקון ושירות',
  'drone-technology': 'טכנולוגיות רחפן ומערכות אוטונומיות',
}

const VALID_CITY_SLUGS = new Set([
  'tel-aviv',
  'jerusalem',
  'haifa',
  'beer-sheva',
  'herzliya',
  'netanya',
  'rishon-lezion',
  'petah-tikva',
  'ashdod',
  'eilat',
])

const CITY_LABELS: Record<string, string> = {
  'tel-aviv': 'תל אביב',
  'jerusalem': 'ירושלים',
  'haifa': 'חיפה',
  'beer-sheva': 'באר שבע',
  'herzliya': 'הרצליה',
  'netanya': 'נתניה',
  'rishon-lezion': 'ראשון לציון',
  'petah-tikva': 'פתח תקווה',
  'ashdod': 'אשדוד',
  'eilat': 'אילת',
}

const CITY_REGIONS: Record<string, Region> = {
  'tel-aviv': 'center',
  'jerusalem': 'jerusalem',
  'haifa': 'north',
  'beer-sheva': 'south',
  'herzliya': 'center',
  'netanya': 'center',
  'rishon-lezion': 'center',
  'petah-tikva': 'center',
  'ashdod': 'south',
  'eilat': 'south',
}

const VALID_CLAIMED_STATUSES = new Set<ClaimedStatus>(['claimed', 'unclaimed', 'pending'])

// ── CSV parser ────────────────────────────────────────────────────────────────

function parseCSV(raw: string): Record<string, string>[] {
  const lines = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const nonEmpty = lines.filter((l) => l.trim() !== '')
  if (nonEmpty.length < 2) return []

  const headers = parseCSVRow(nonEmpty[0])
  const rows: Record<string, string>[] = []

  for (let i = 1; i < nonEmpty.length; i++) {
    const line = nonEmpty[i].trim()
    if (line.startsWith('#') || line === '') continue
    const values = parseCSVRow(line)
    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h.trim()] = (values[idx] ?? '').trim()
    })
    rows.push(row)
  }

  return rows
}

function parseCSVRow(line: string): string[] {
  const fields: string[] = []
  let i = 0
  while (i < line.length) {
    if (line[i] === '"') {
      // Quoted field
      i++
      let field = ''
      while (i < line.length) {
        if (line[i] === '"' && line[i + 1] === '"') {
          field += '"'
          i += 2
        } else if (line[i] === '"') {
          i++
          break
        } else {
          field += line[i++]
        }
      }
      fields.push(field)
      if (line[i] === ',') i++
    } else {
      const end = line.indexOf(',', i)
      if (end === -1) {
        fields.push(line.slice(i))
        break
      }
      fields.push(line.slice(i, end))
      i = end + 1
    }
  }
  return fields
}

// ── Validation ────────────────────────────────────────────────────────────────

interface ValidationError {
  row: number
  field: string
  message: string
}

function validateRow(
  row: Record<string, string>,
  rowIndex: number,
  seenSlugs: Set<string>,
  seenIds: Set<string>,
): { listing: Listing | null; errors: ValidationError[]; warnings: string[] } {
  const errors: ValidationError[] = []
  const warnings: string[] = []

  const req = (field: string) => {
    if (!row[field]) errors.push({ row: rowIndex, field, message: `שדה חובה ריק` })
    return row[field] ?? ''
  }

  const id = req('id')
  const name = req('name')
  const slug = req('slug')
  const categorySlug = req('categorySlug')
  const citySlug = req('citySlug')
  const shortDescriptionHe = req('shortDescriptionHe')
  const longDescriptionHe = req('longDescriptionHe')
  const claimedStatusRaw = req('claimedStatus')
  const qualityScoreRaw = req('qualityScore')
  const lastUpdated = req('lastUpdated')

  // Duplicate checks
  if (slug && seenSlugs.has(slug)) {
    errors.push({ row: rowIndex, field: 'slug', message: `slug כפול: "${slug}"` })
  } else if (slug) {
    seenSlugs.add(slug)
  }
  if (id && seenIds.has(id)) {
    errors.push({ row: rowIndex, field: 'id', message: `id כפול: "${id}"` })
  } else if (id) {
    seenIds.add(id)
  }

  // categorySlug
  if (categorySlug && !VALID_CATEGORY_SLUGS.has(categorySlug)) {
    errors.push({ row: rowIndex, field: 'categorySlug', message: `קטגוריה לא תקינה: "${categorySlug}"` })
  }

  // citySlug
  if (citySlug && !VALID_CITY_SLUGS.has(citySlug)) {
    errors.push({ row: rowIndex, field: 'citySlug', message: `עיר לא תקינה: "${citySlug}"` })
  }

  // qualityScore 1–5
  const qualityScoreInput = parseInt(qualityScoreRaw, 10)
  if (isNaN(qualityScoreInput) || qualityScoreInput < 1 || qualityScoreInput > 5) {
    errors.push({ row: rowIndex, field: 'qualityScore', message: `חייב להיות מספר בין 1 ל-5, קיבלנו: "${qualityScoreRaw}"` })
  }

  // claimedStatus
  if (claimedStatusRaw && !VALID_CLAIMED_STATUSES.has(claimedStatusRaw as ClaimedStatus)) {
    errors.push({ row: rowIndex, field: 'claimedStatus', message: `ערך לא תקין: "${claimedStatusRaw}" (חייב להיות claimed/unclaimed/pending)` })
  }

  // featured
  const featuredRaw = (row['featured'] ?? '').toLowerCase()
  if (featuredRaw && featuredRaw !== 'true' && featuredRaw !== 'false') {
    warnings.push(`שורה ${rowIndex}: featured = "${row['featured']}" — ישמש כ-false`)
  }

  if (errors.length > 0) return { listing: null, errors, warnings }

  // Optional fields
  const phone = row['phone'] || null
  const whatsapp = row['whatsapp'] || null
  const website = row['website'] || null
  const email = row['email'] || null
  const imageUrl = row['imageUrl'] || null
  const sourceUrl = row['sourceUrl'] || null
  const servicesRaw = row['services'] ?? ''
  const services = servicesRaw
    ? servicesRaw.split('|').map((s) => s.trim()).filter(Boolean)
    : []

  const region: Region = CITY_REGIONS[citySlug] ?? 'center'
  const listing: Listing = {
    id,
    name,
    slug,
    categorySlug,
    categoryLabelHe: CATEGORY_LABELS[categorySlug] ?? categorySlug,
    services,
    citySlug: citySlug || null,
    cityLabelHe: CITY_LABELS[citySlug] ?? citySlug,
    region,
    serviceAreaType: 'local',
    serviceRegions: [region],
    shortDescriptionHe,
    longDescriptionHe,
    phone,
    whatsapp,
    website,
    email,
    imageUrl,
    claimedStatus: claimedStatusRaw as ClaimedStatus,
    featured: featuredRaw === 'true',
    qualityScore: qualityScoreInput * 20,
    sourceUrl,
    lastUpdated,
  }

  return { listing, errors: [], warnings }
}

// ── Code generation ───────────────────────────────────────────────────────────

function serializeListing(l: Listing): string {
  const json = JSON.stringify(l, null, 4)
  return json
    .split('\n')
    .map((line, i) => (i === 0 ? '  ' + line : '    ' + line))
    .join('\n')
}

function generateOutput(listings: Listing[], sourceFile: string): string {
  const timestamp = new Date().toISOString()
  const lines = [
    `// AUTO-GENERATED — do not edit manually`,
    `// Source: ${sourceFile}`,
    `// Generated: ${timestamp}`,
    `// Run: npm run import:listings`,
    ``,
    `import type { Listing } from '../types/listing'`,
    ``,
    `export const generatedListings: Listing[] = [`,
    ...listings.map((l, i) => serializeListing(l) + (i < listings.length - 1 ? ',' : '')),
    `]`,
    ``,
  ]
  return lines.join('\n')
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const ROOT = process.cwd()
  const INPUT = path.join(ROOT, 'data-import', 'listings.csv')
  const OUTPUT = path.join(ROOT, 'src', 'data', 'listings.generated.ts')

  if (!fs.existsSync(INPUT)) {
    console.error(`❌  קובץ הקלט לא נמצא: ${INPUT}`)
    console.error(`   צרו קובץ CSV ב-data-import/listings.csv (ראו listings-template.csv להדרכה)`)
    process.exit(1)
  }

  const raw = fs.readFileSync(INPUT, 'utf-8')
  const rows = parseCSV(raw)

  if (rows.length === 0) {
    console.error('❌  הקובץ ריק או מכיל רק כותרות')
    process.exit(1)
  }

  console.log(`📄  נמצאו ${rows.length} שורות בקובץ CSV`)

  const listings: Listing[] = []
  const allErrors: string[] = []
  const allWarnings: string[] = []
  const seenSlugs = new Set<string>()
  const seenIds = new Set<string>()

  rows.forEach((row, i) => {
    const { listing, errors, warnings } = validateRow(row, i + 2, seenSlugs, seenIds)
    warnings.forEach((w) => allWarnings.push(w))
    if (errors.length > 0) {
      errors.forEach((e) =>
        allErrors.push(`  שורה ${e.row}, ${e.field}: ${e.message}`)
      )
    } else if (listing) {
      listings.push(listing)
    }
  })

  if (allWarnings.length > 0) {
    console.log(`\n⚠️   אזהרות (${allWarnings.length}):`)
    allWarnings.forEach((w) => console.log(`  ${w}`))
  }

  if (allErrors.length > 0) {
    console.error(`\n❌  שגיאות אימות (${allErrors.length}):`)
    allErrors.forEach((e) => console.error(e))
    console.error(`\nהייבוא נכשל — תקנו את השגיאות ונסו שוב`)
    process.exit(1)
  }

  const output = generateOutput(listings, 'data-import/listings.csv')
  fs.writeFileSync(OUTPUT, output, 'utf-8')

  console.log(`\n✅  יובאו ${listings.length} עסקים בהצלחה`)
  console.log(`   → ${OUTPUT}`)
  console.log(`\nכעת תוכלו לייבא generatedListings ב-src/data/listings.ts`)
}

main()

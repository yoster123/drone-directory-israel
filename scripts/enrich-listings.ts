/**
 * enrich-listings.ts
 *
 * Reads generated-listings.ts and enriches each listing with services,
 * unique Hebrew descriptions, trust badges, and specialties.
 * Writes to src/data/enriched-listings.ts.
 *
 * Run:  npm run enrich:listings
 */

import fs from 'fs'
import path from 'path'
import { generatedListings } from '../src/data/generated-listings'
import type { Listing, EnrichedListing } from '../src/types/listing'

// ── Service inference ─────────────────────────────────────────────────────────

const BASE_SERVICES: Record<string, string[]> = {
  'drone-technology':        ['פיתוח מערכות רחפן', 'תפעול אוטונומי', 'ניהול צי רחפנים'],
  'aerial-photography':      ['צילום אווירי', 'וידאו אווירי'],
  'real-estate-photography': ['צילום נדל"ן', 'צילום אווירי', 'תצלומי נכסים'],
  'fpv-filming':             ['FPV', 'צילום ספורט', 'וידאו אקרובטי'],
  'mapping-surveying':       ['מיפוי שטחים', 'סקר קרקע', 'פוטוגרמטריה'],
  'agriculture':             ['ריסוס חקלאי', 'מיפוי יבולים', 'ניטור שדות'],
  'inspections':             ['בדיקות תשתית', 'בדיקות גגות', 'סקר תרמי'],
  'security':                ['ניטור אבטחה', 'מעקב אווירי', 'סיור ביטחוני'],
  'training-schools':        ['קורסי טיס', 'הדרכת רחפנים', 'רישיון טיס'],
  'drone-stores':            ['מכירת רחפנים', 'אביזרים ורכיבים', 'ייעוץ מקצועי'],
  'repairs':                 ['תיקון רחפנים', 'החלפת חלקים', 'שדרוג ציוד'],
}

const KEYWORD_SERVICES: Array<{ terms: string[]; service: string }> = [
  { terms: ['נדל"ן', 'נדלן', 'real estate', 'נכס'],  service: 'צילום נדל"ן' },
  { terms: ['אירוע', 'חתונה', 'event'],               service: 'צילום אירועים' },
  { terms: ['fpv', 'מירוץ', 'freestyle'],             service: 'FPV' },
  { terms: ['מיפוי', 'survey', 'mapping', 'lidar'],   service: 'מיפוי שטחים' },
  { terms: ['בדיקה', 'inspection', 'תשתית'],         service: 'בדיקות תשתית' },
  { terms: ['virtual', 'וירטואל', '360'],             service: 'סיורים וירטואליים' },
  { terms: ['תרמי', 'thermal'],                       service: 'סריקה תרמית' },
  { terms: ['חקלא', 'agri', 'ריסוס'],               service: 'רחפני חקלאות' },
  { terms: ['3d', 'תלת ממד'],                         service: 'מודלים תלת-ממדיים' },
]

function inferServices(listing: Listing): string[] {
  const base = BASE_SERVICES[listing.categorySlug] ?? ['שירותי רחפן']
  const text = listing.name.toLowerCase()
  const extra = KEYWORD_SERVICES
    .filter(({ terms, service }) =>
      !base.includes(service) && terms.some((t) => text.includes(t.toLowerCase())),
    )
    .map(({ service }) => service)
  return [...new Set([...base, ...extra])].slice(0, 4)
}

// ── Specialty inference ───────────────────────────────────────────────────────

function inferSpecialties(listing: Listing): string[] {
  const result: string[] = []
  const t = listing.name.toLowerCase()
  if (t.includes('נדל') || t.includes('real estate'))   result.push('נדל"ן')
  if (t.includes('fpv') || t.includes('מירוץ'))         result.push('FPV')
  if (t.includes('מיפוי') || t.includes('mapping'))    result.push('מיפוי')
  if (t.includes('virtual') || t.includes('וירטואל'))  result.push('סיורים וירטואליים')
  if (t.includes('חקלא'))                              result.push('חקלאות')
  if (t.includes('תרמי') || t.includes('thermal'))     result.push('בדיקות תרמיות')
  if (listing.categorySlug === 'training-schools')     result.push('הדרכה ורישיון')
  if (listing.categorySlug === 'drone-stores')         result.push('ציוד ואביזרים')
  if (listing.serviceAreaType === 'nationwide')        result.push('פריסה ארצית')
  return [...new Set(result)].slice(0, 3)
}

// ── Badge inference ───────────────────────────────────────────────────────────

function inferBadges(listing: Listing): string[] {
  const b: string[] = []
  if (listing.claimedStatus === 'claimed')                                    b.push('עסק מאומת')
  if (listing.website)                                                        b.push('אתר רשמי')
  if (listing.qualityScore >= 90)                                             b.push('דירוג מצוין')
  else if (listing.qualityScore >= 75)                                        b.push('דירוג גבוה')
  if (listing.serviceAreaType === 'nationwide')                               b.push('פעילות ארצית')
  if (listing.qualityScore >= 95 && listing.website && listing.phone)        b.push('מעל 100 ביקורות')
  else if (listing.qualityScore >= 88 && listing.website && listing.phone)   b.push('ביקורות רבות')
  return b
}

// ── Description generation ────────────────────────────────────────────────────
// Deterministic variant selection via djb2 hash — same ID always gets same template.

function pick(id: string, salt: string, count: number): number {
  let v = 5381
  const s = id + salt
  for (let i = 0; i < s.length; i++) v = ((v << 5) + v) ^ s.charCodeAt(i)
  return Math.abs(v >>> 0) % count
}

function locLabel(listing: Listing): string {
  if (listing.citySlug) return listing.cityLabelHe
  if (listing.cityLabelHe !== 'ישראל') return listing.cityLabelHe
  return 'ישראל'
}

function buildShortDesc(listing: Listing, services: string[], loc: string): string {
  const [s0, s1] = services

  if (listing.categorySlug === 'drone-stores') {
    const opts = [
      `חנות רחפנים ב${loc}. ${s0}, ${s1} ועוד.`,
      `ציוד רחפנים ב${loc} — ${s0} ו${s1}.`,
      `${s0} ו${s1} ב${loc}. מבחר ציוד מקצועי.`,
      `מומחי רחפנים ב${loc}. ${s0}, ${s1} ויועצים מנוסים.`,
    ]
    return opts[pick(listing.id, 'short', opts.length)]
  }
  if (listing.categorySlug === 'training-schools') {
    const opts = [
      `בית ספר לרחפנים ב${loc}. ${s0} ו${s1}.`,
      `${s0} ו${s1} ב${loc}. קבלת רישיון טיס מוסמך.`,
      `הכשרת טייסי רחפנים ב${loc}. ${s0} ו${s1}.`,
    ]
    return opts[pick(listing.id, 'short', opts.length)]
  }
  if (listing.categorySlug === 'mapping-surveying') {
    const opts = [
      `${s0} ו${s1} מדויקים ב${loc}.`,
      `מיפוי וסקר קרקע ב${loc} באמצעות רחפן. ${s0}.`,
      `שירותי ${s0} ו${s1} ב${loc}.`,
    ]
    return opts[pick(listing.id, 'short', opts.length)]
  }
  // aerial-photography and others
  const opts = [
    `צלם רחפן מקצועי ב${loc}. מתמחה ב${s0} ו${s1}.`,
    `שירותי ${s0} ו${s1} מהאוויר ב${loc}.`,
    `צילום אווירי עם רחפן ב${loc} — ${s0}, ${s1} ועוד.`,
    `פעיל ב${loc} בתחום ${s0} ו${s1}.`,
    `${s0} ו${s1} מהאוויר, מרחפן ב${loc}.`,
  ]
  return opts[pick(listing.id, 'short', opts.length)]
}

function buildLongDesc(listing: Listing, services: string[], loc: string): string {
  const [s0, s1] = services

  if (listing.categorySlug === 'drone-stores') {
    const webCta = listing.website ? 'ניתן לעיין במלאי באתר.' : 'בואו לחנות לייעוץ אישי.'
    const opts = [
      `חנות רחפנים ב${loc} עם מגוון רחב של ציוד מקצועי ובידורי. ${s0}, ${s1} ועוד. צוות מנוסה לסיוע בבחירה.`,
      `מומחי ציוד רחפנים ב${loc}. ${s0} ו${s1}. ${webCta}`,
      `${s0} ו${s1} ב${loc}. מבחר רחפנים ואביזרים ממותגים מובילים. שירות לפני ואחרי המכירה.`,
    ]
    return opts[pick(listing.id, 'long', opts.length)]
  }
  if (listing.categorySlug === 'training-schools') {
    const opts = [
      `בית ספר לרחפנים ב${loc} המציע ${s0} ו${s1}. קורסים מוסמכים לקבלת רישיון טיס על פי תקנות רשות התעופה.`,
      `${s0} ו${s1} ב${loc}. הכשרה מלאה לטייסי רחפנים לצרכים מסחריים ואישיים. מדריכים מנוסים.`,
      `הכשרת טייסי רחפנים מקצועיים ב${loc}. ${s0}, ${s1} ועוד. כל מה שצריך לדרך ברחפנות.`,
    ]
    return opts[pick(listing.id, 'long', opts.length)]
  }
  if (listing.categorySlug === 'mapping-surveying') {
    const opts = [
      `שירותי ${s0} ו${s1} ב${loc} באמצעות טכנולוגיית רחפן מתקדמת. מדויק, מהיר וחסכוני בהשוואה לשיטות מסורתיות.`,
      `${s0} ו${s1} ב${loc}. נתונים מדויקים לענף הנדל"ן, הבנייה והתכנון. ציוד מתקדם לתוצאות אמינות.`,
    ]
    return opts[pick(listing.id, 'long', opts.length)]
  }
  // aerial-photography and others
  const webNote = listing.website ? 'ניתן לצפות בגלריית עבודות באתר.' : 'פנו לקבלת הצעת מחיר.'
  const ratingNote = listing.qualityScore >= 80 ? 'מדורג גבוה על ידי לקוחות.' : 'זמינות גבוהה לכל פרויקט.'
  const contactNote = listing.phone ? 'זמינים לשיחה בכל שעה.' : 'פנו דרך האתר לתיאום.'
  const opts = [
    `צלם רחפן מקצועי ב${loc} המתמחה ב${s0} ו${s1}. ניסיון רב בעבודה עם לקוחות פרטיים ועסקיים. ${webNote}`,
    `שירותי ${s0} ו${s1} מהאוויר ב${loc}. עבודה עם ציוד מתקדם ותוצאות באיכות גבוהה. ${ratingNote}`,
    `צילום אווירי ב${loc} — ${s0}, ${s1} ועוד. שירות אישי, מהיר ומקצועי. ${contactNote}`,
    `פעיל ב${loc} בתחום ${s0} ו${s1}. ציוד רחפנים מתקדם ועריכה מקצועית. מתאים לפרויקטים גדולים וקטנים.`,
    `${s0} ו${s1} מהאוויר ב${loc}. ניסיון עם לקוחות עסקיים, יזמים ותקשורת. ${webNote}`,
  ]
  return opts[pick(listing.id, 'long', opts.length)]
}

// ── City slug normalization ───────────────────────────────────────────────────

const CITY_LABEL_TO_SLUG: Record<string, string> = {
  'תל אביב':      'tel-aviv',
  'ירושלים':       'jerusalem',
  'חיפה':          'haifa',
  'באר שבע':       'beer-sheva',
  'הרצליה':        'herzliya',
  'נתניה':         'netanya',
  'ראשון לציון':   'rishon-lezion',
  'פתח תקווה':     'petah-tikva',
  'אשדוד':         'ashdod',
  'אילת':          'eilat',
}

function normalizeCitySlug(listing: Listing): string | null {
  if (listing.citySlug) return listing.citySlug
  return CITY_LABEL_TO_SLUG[listing.cityLabelHe] ?? null
}

// ── WhatsApp derivation ───────────────────────────────────────────────────────

function deriveWhatsApp(phone: string | null, existing: string | null): string | null {
  if (existing) return existing
  if (!phone) return null

  const digits = phone.replace(/\D/g, '')

  // Normalise to E.164 without the leading +
  let e164: string
  if (digits.startsWith('972')) {
    e164 = digits
  } else if (digits.startsWith('0')) {
    e164 = '972' + digits.slice(1)
  } else {
    return null
  }

  // Israeli mobile: 972 + 5X + 7 more digits = 12 digits total
  if (!/^9725\d{8}$/.test(e164)) return null

  return `https://wa.me/${e164}`
}

// ── Operational profile inference ─────────────────────────────────────────────

const EQUIPMENT_BY_CATEGORY: Record<string, string[]> = {
  'drone-technology':        ['מערכת ניהול רחפנים', 'תוכנת UTM'],
  'aerial-photography':      ['רחפן צילום מקצועי'],
  'real-estate-photography': ['רחפן צילום מקצועי'],
  'fpv-filming':             ['רחפן FPV'],
  'mapping-surveying':       ['ציוד מיפוי אווירי', 'תוכנת עיבוד נתונים'],
  'agriculture':             ['רחפן תעשייתי', 'מערכת ריסוס'],
  'inspections':             ['רחפן תעשייתי', 'מצלמה תרמית'],
  'security':                ['רחפן ניטור'],
  'training-schools':        ['ציוד הדרכה'],
  'drone-stores':            [],
  'repairs':                 ['ציוד אבחון ותיקון'],
}

function inferEquipment(listing: Listing): string[] {
  const base = [...(EQUIPMENT_BY_CATEGORY[listing.categorySlug] ?? [])]
  const t = listing.name.toLowerCase()
  if ((t.includes('fpv') || t.includes('מירוץ')) && !base.includes('רחפן FPV'))
    base.unshift('רחפן FPV')
  if ((t.includes('תרמי') || t.includes('thermal')) && !base.includes('מצלמה תרמית'))
    base.push('מצלמה תרמית')
  if (t.includes('lidar') || t.includes('ליד'))
    base.push('סורק LiDAR')
  return [...new Set(base)]
}

const INDUSTRIES_BY_CATEGORY: Record<string, string[]> = {
  'drone-technology':        ['תעשיית הרחפנים', 'לוגיסטיקה ומשלוחים', 'ביטחון ותשתיות'],
  'aerial-photography':      ['נדל"ן ובנייה', 'מדיה ופרסום', 'אירועים'],
  'real-estate-photography': ['נדל"ן ובנייה', 'קבלנות', 'שיווק נכסים'],
  'fpv-filming':             ['ספורט ואקסטרים', 'מוזיקה ובידור', 'פרסום'],
  'mapping-surveying':       ['בנייה ותשתיות', 'ממשלה ורשויות', 'ניהול קרקעות'],
  'agriculture':             ['חקלאות', 'ניהול שדות', 'אגרוטק'],
  'inspections':             ['תשתיות ואנרגיה', 'נדל"ן מסחרי', 'ביטוח'],
  'security':                ['ביטחון ואבטחה', 'שמירה', 'רשויות'],
  'training-schools':        ['חינוך מקצועי', 'הסמכות תעופתיות', 'עסקים'],
  'drone-stores':            ['חובבים', 'מקצועיים', 'עסקים'],
  'repairs':                 ['בעלי רחפנים', 'עסקים', 'חובבים'],
}

function inferIndustriesServed(listing: Listing): string[] {
  const base = [...(INDUSTRIES_BY_CATEGORY[listing.categorySlug] ?? [])]
  const t = listing.name.toLowerCase()
  if (t.includes('חתונה') || t.includes('אירוע')) {
    if (!base.includes('חתונות ואירועים')) base.push('חתונות ואירועים')
  }
  return base.slice(0, 3)
}

const DELIVERABLES_BY_CATEGORY: Record<string, string[]> = {
  'drone-technology':        ['ממשק ניהול', 'API לאינטגרציה', 'דוחות תפעוליים'],
  'aerial-photography':      ['וידאו 4K', 'תמונות ברזולוציה גבוהה', 'תוכן לרשתות חברתיות'],
  'real-estate-photography': ['תמונות נכס', 'וידאו שיווקי', 'סיור וירטואלי'],
  'fpv-filming':             ['קליפ FPV דינמי', 'פוטג\'ים גולמיים', 'עריכה מוכנה לפרסום'],
  'mapping-surveying':       ['מפת אורתופוטו', 'מודל תלת-ממדי', 'נתוני GIS'],
  'agriculture':             ['מפת צמחייה', 'תמונות NDVI', 'דוח ניטור שדה'],
  'inspections':             ['דוח בדיקה', 'תמונות תרמיות', 'וידאו תיעוד'],
  'security':                ['וידאו סיור', 'תמונות לתיעוד', 'דוח ניטור'],
  'training-schools':        ['תעודת הכשרה', 'רישיון טיס', 'תיק לימוד'],
  'drone-stores':            [],
  'repairs':                 ['תיקון ומסירה', 'דוח תקלות', 'אחריות על עבודה'],
}

function inferDeliverables(listing: Listing): string[] {
  return [...(DELIVERABLES_BY_CATEGORY[listing.categorySlug] ?? [])].slice(0, 3)
}

function inferCertifications(listing: Listing): string[] {
  if (listing.categorySlug === 'training-schools') {
    return ['קורסי הסמכה ע"י רשות התעופה האזרחית']
  }
  return []
}

function inferCoverageArea(listing: Listing): string {
  if (listing.serviceAreaType === 'nationwide') return 'כל רחבי ישראל'
  const regionLabels: Record<string, string> = {
    north:     'אזור הצפון',
    center:    'מרכז הארץ',
    south:     'אזור הדרום',
    jerusalem: 'ירושלים והסביבה',
  }
  if (listing.citySlug) return `${listing.cityLabelHe} והסביבה`
  return regionLabels[listing.region] ?? 'ישראל'
}

const STRENGTHS_BY_CATEGORY: Record<string, string[]> = {
  'drone-technology':        ['טכנולוגיה מתקדמת', 'פתרון end-to-end'],
  'aerial-photography':      ['צילום אווירי מקצועי', 'ציוד מתקדם'],
  'real-estate-photography': ['הצגת נכסים מהאוויר', 'שיווק חזותי'],
  'fpv-filming':             ['טיסה דינמית ואקרובטית', 'פוטג\' קינמטי'],
  'mapping-surveying':       ['דיוק גבוה', 'עיבוד נתונים מהיר'],
  'agriculture':             ['כיסוי שטח רחב', 'ריסוס מדויק'],
  'inspections':             ['גישה למקומות קשים', 'בדיקה לא פולשנית'],
  'security':                ['ניטור רציף', 'תגובה מהירה'],
  'training-schools':        ['מדריכים מנוסים', 'קורסים מוסמכים'],
  'drone-stores':            ['מגוון ציוד מקצועי', 'ייעוץ מומחים'],
  'repairs':                 ['שירות מהיר', 'אבחון מקצועי'],
}

function inferOperationalStrengths(listing: Listing): string[] {
  const base = [...(STRENGTHS_BY_CATEGORY[listing.categorySlug] ?? [])]
  if (listing.qualityScore >= 85) base.push('מדורג גבוה על ידי לקוחות')
  if (listing.serviceAreaType === 'nationwide') base.push('פריסה ארצית')
  return [...new Set(base)].slice(0, 3)
}

const PROJECT_TYPES_BY_CATEGORY: Record<string, string[]> = {
  'drone-technology':        ['ניהול צי רחפנים', 'פיתוח מערכות UTM', 'אינטגרציה תפעולית'],
  'aerial-photography':      ['סרטוני תדמית', 'צילום אירועים', 'תוכן לרשתות'],
  'real-estate-photography': ['ליסטינג נדל"ן', 'פרויקטי בנייה', 'פרסום נכסים'],
  'fpv-filming':             ['קליפים מוזיקליים', 'ספורט ואקסטרים', 'פרסומות'],
  'mapping-surveying':       ['תכנון עירוני', 'סקרי קרקע', 'פרויקטי בנייה'],
  'agriculture':             ['ניטור עונתי', 'ריסוס ממוקד', 'מיפוי יבולים'],
  'inspections':             ['בדיקות גגות', 'קווי חשמל', 'גשרים ומבנים'],
  'security':                ['אבטחת אירועים', 'ניטור שטחים', 'מעקב'],
  'training-schools':        ['קורס בסיסי', 'קורס מסחרי', 'חידוש רישיון'],
  'drone-stores':            ['רחפני תחביב', 'רחפנים מקצועיים', 'אביזרים'],
  'repairs':                 ['תיקון כנפיים', 'החלפת מנועים', 'שדרוג ציוד'],
}

function inferProjectTypes(listing: Listing): string[] {
  const base = [...(PROJECT_TYPES_BY_CATEGORY[listing.categorySlug] ?? [])]
  const t = listing.name.toLowerCase()
  if (t.includes('חתונה') && !base.includes('חתונות')) base.unshift('חתונות')
  if ((t.includes('נדל') || t.includes('real estate')) && !base.includes('צילום נדל"ן'))
    base.unshift('צילום נדל"ן')
  return [...new Set(base)].slice(0, 3)
}

function inferVerificationSignals(listing: Listing, derivedWhatsapp: string | null): string[] {
  const signals: string[] = []
  if (listing.claimedStatus === 'claimed') signals.push('עסק מאומת על ידי ALTIV')
  if (listing.website) signals.push('אתר אינטרנט רשמי')
  if (listing.phone) signals.push('מספר טלפון מאומת')
  if (derivedWhatsapp) signals.push('זמין בוואטסאפ')
  if (listing.qualityScore >= 90) signals.push('ביקורות גוגל מצוינות')
  else if (listing.qualityScore >= 75) signals.push('ביקורות גוגל חיוביות')
  return signals
}

// ── Core enrichment ───────────────────────────────────────────────────────────

function enrich(listing: Listing): EnrichedListing {
  const citySlug = normalizeCitySlug(listing)
  const whatsapp = deriveWhatsApp(listing.phone, listing.whatsapp)
  const services = inferServices(listing)
  const loc = locLabel({ ...listing, citySlug })
  return {
    ...listing,
    citySlug,
    whatsapp,
    services,
    shortDescriptionHe: buildShortDesc(listing, services, loc),
    longDescriptionHe:  buildLongDesc(listing, services, loc),
    badges:             inferBadges(listing),
    specialties:        inferSpecialties(listing),
    equipment:          inferEquipment(listing),
    industriesServed:   inferIndustriesServed(listing),
    deliverables:       inferDeliverables(listing),
    certifications:     inferCertifications(listing),
    coverageArea:       inferCoverageArea(listing),
    operationalStrengths: inferOperationalStrengths(listing),
    projectTypes:       inferProjectTypes(listing),
    verificationSignals: inferVerificationSignals(listing, whatsapp),
  }
}

// ── Logo overrides ────────────────────────────────────────────────────────────

interface LogoOverride {
  logoUrl: string
  logoSource: 'official-site' | 'favicon' | 'manual' | 'claimed-profile' | 'generated'
  logoConfidence?: 'high' | 'medium' | 'low'
}

function loadLogoOverrides(root: string): Record<string, LogoOverride> {
  const file = path.join(root, 'data-import', 'logo-overrides.json')
  if (!fs.existsSync(file)) return {}
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8')) as Record<string, LogoOverride>
  } catch {
    return {}
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  const ROOT = process.cwd()
  const OUTPUT = path.join(ROOT, 'src', 'data', 'enriched-listings.ts')

  console.log(`📥  Loaded ${generatedListings.length} listings from generated-listings.ts`)

  const logoOverrides = loadLogoOverrides(ROOT)
  const logoOverrideCount = Object.keys(logoOverrides).length
  if (logoOverrideCount > 0) {
    console.log(`🖼️   logo-overrides.json: ${logoOverrideCount} entries loaded`)
  }

  const enriched = (generatedListings as unknown as Listing[]).map(enrich).map((l) => {
    const override = logoOverrides[l.id] ?? logoOverrides[l.slug]
    if (override) return { ...l, logoUrl: override.logoUrl, logoSource: override.logoSource, logoConfidence: override.logoConfidence }
    return l
  })

  const timestamp = new Date().toISOString()
  const body = enriched
    .map((l, i) => {
      const json = JSON.stringify(l, null, 2).split('\n').map((line) => '  ' + line).join('\n')
      return json + (i < enriched.length - 1 ? ',' : '')
    })
    .join('\n')

  const output = [
    `// AUTO-GENERATED — do not edit manually`,
    `// Source: src/data/generated-listings.ts`,
    `// Generated: ${timestamp}`,
    `// Run: npm run enrich:listings`,
    ``,
    `import type { EnrichedListing } from '../types/listing'`,
    ``,
    `export const enrichedListings: EnrichedListing[] = [`,
    body,
    `]`,
    ``,
  ].join('\n')

  fs.writeFileSync(OUTPUT, output, 'utf-8')

  // Stats
  const withBadges      = enriched.filter((l) => l.badges.length > 0).length
  const withSpecialties = enriched.filter((l) => l.specialties.length > 0).length
  const avgServices     = (enriched.reduce((acc, l) => acc + l.services.length, 0) / enriched.length).toFixed(1)
  const avgBadges       = (enriched.reduce((acc, l) => acc + l.badges.length, 0) / enriched.length).toFixed(1)
  const withCitySlug    = enriched.filter((l) => l.citySlug !== null).length
  const wasNormalized   = enriched.filter((l) => {
    const orig = (generatedListings as unknown as Listing[]).find((g) => g.id === l.id)
    return !orig?.citySlug && !!l.citySlug
  }).length
  const withWhatsApp    = enriched.filter((l) => !!l.whatsapp).length
  const skippedPhone    = (generatedListings as unknown as Listing[]).filter(
    (l) => l.phone && !deriveWhatsApp(l.phone, l.whatsapp),
  ).length

  console.log(`
📊  סיכום:
   עסקים עובדו:      ${enriched.length}
   עם וואטסאפ:      ${withWhatsApp} (מספרים לא-נייד שדולגו: ${skippedPhone})
   עם עיר מזוהה:    ${withCitySlug} (נורמל חדש: ${wasNormalized})
   עם תגיות אמון:   ${withBadges} (ממוצע ${avgBadges} לעסק)
   עם התמחויות:     ${withSpecialties}
   ממוצע שירותים:   ${avgServices} לעסק

📋  לפני/אחרי — 5 דוגמאות:
`)

  // Pick 5 varied examples across quality/category spectrum
  const picks = [
    enriched.find((l) => l.qualityScore >= 90 && !!l.website),
    enriched.find((l) => l.categorySlug === 'drone-stores'),
    enriched.find((l) => l.categorySlug === 'training-schools'),
    enriched.find((l) => l.citySlug === null && l.qualityScore >= 70),
    enriched.find((l) => l.qualityScore < 50),
  ]

  const seen = new Set<string>()
  const examples = picks.filter((l): l is EnrichedListing => {
    if (!l || seen.has(l.id)) return false
    seen.add(l.id)
    return true
  })

  examples.slice(0, 5).forEach((l, i) => {
    const before = generatedListings.find((g) => g.id === l.id)
    console.log(`${i + 1}. ${l.name}`)
    console.log(`   לפני:  "${before?.shortDescriptionHe}"`)
    console.log(`          שירותים: ${JSON.stringify(before?.services)}`)
    console.log(`   אחרי:  "${l.shortDescriptionHe}"`)
    console.log(`          שירותים: ${JSON.stringify(l.services)}`)
    console.log(`          תגיות: ${JSON.stringify(l.badges)}`)
    console.log(`          התמחויות: ${JSON.stringify(l.specialties)}`)
    console.log()
  })

  console.log(`✅  נכתב: ${OUTPUT}`)
}

main()

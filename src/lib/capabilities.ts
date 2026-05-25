// ── Multi-service classification utilities ────────────────────────────────────
//
// Architecture overview:
//   listing text  →  SignalRules  →  capabilities  →  secondaryCategorySlugs
//
// A "capability" is a machine-readable tag for a specific drone service skill
// (e.g. 'thermal-inspection'). It acts as an intermediate layer between raw
// text signals and category slugs, allowing one-to-one traceability.
//
// This module is shared by the enrichment script (Node) and the Next.js app.

export interface SignalRule {
  capability: string
  categorySlug: string
  terms: string[]  // lowercased; matched via String.includes against combined listing text
}

// capability slug → category slug
export const CAPABILITY_TO_CATEGORY: Record<string, string> = {
  'aerial-photo':         'aerial-photography',
  'real-estate-photo':    'real-estate-photography',
  'fpv-racing':           'fpv-filming',
  'gis-mapping':          'mapping-surveying',
  'agriculture-spraying': 'agriculture',
  'thermal-inspection':   'inspections',
  'solar-inspection':     'solar',
  'insurance-docs':       'insurance',
  'security-monitoring':  'security',
  'drone-training':       'training-schools',
  'repair-service':       'repairs',
  'drone-tech':           'drone-technology',
}

// Signal rules — ordered from most-specific to most-generic to reduce false positives.
// Terms are matched against: name + services + descriptions (all lowercased and joined).
export const SIGNAL_RULES: SignalRule[] = [
  {
    capability: 'drone-training',
    categorySlug: 'training-schools',
    terms: ['קורס', 'הכשרה', 'הדרכ', 'רישיון', 'training', 'school', 'academy', 'רת"א', 'רת\'\'א'],
  },
  {
    capability: 'gis-mapping',
    categorySlug: 'mapping-surveying',
    terms: ['gis', 'פוטוגרמטריה', 'photogrammetry', 'אורתופוטו', 'orthophoto', 'lidar', 'מדידה', 'mapic'],
  },
  {
    capability: 'agriculture-spraying',
    categorySlug: 'agriculture',
    terms: ['ריסוס', 'agras', 'ndvi', 'multispectral', 'חקלא', 'agri', 'agro', 'crop', 'יבול'],
  },
  {
    capability: 'fpv-racing',
    categorySlug: 'fpv-filming',
    terms: ['fpv', 'מירוץ', 'freestyle', 'racing', 'race drone'],
  },
  {
    capability: 'real-estate-photo',
    categorySlug: 'real-estate-photography',
    terms: ['נדל"ן', 'נדלן', 'real estate', 'ליסטינג', 'נכס'],
  },
  {
    capability: 'aerial-photo',
    categorySlug: 'aerial-photography',
    terms: ['צילומי אוויר', 'צילום אווירי', 'aerial photo', 'aerial film', 'צלם אווירי'],
  },
  {
    capability: 'thermal-inspection',
    categorySlug: 'inspections',
    terms: ['תרמי', 'thermal', 'בדיקת גגות', 'solar inspection', 'בדיקה תשתית'],
  },
  {
    capability: 'solar-inspection',
    categorySlug: 'solar',
    terms: ['solar panel', 'photovoltaic', 'פאנל סולרי', 'שדה סולרי'],
  },
  {
    capability: 'insurance-docs',
    categorySlug: 'insurance',
    terms: ['ביטוח', 'insurance claim', 'תביעת ביטוח', 'נזקי ביטוח'],
  },
  {
    capability: 'security-monitoring',
    categorySlug: 'security',
    terms: ['אבטחה', 'surveillance', 'שמירה', 'ניטור ביטחוני'],
  },
  {
    capability: 'repair-service',
    categorySlug: 'repairs',
    terms: ['מעבדה', 'תיקון', 'repair', 'dji repair', 'maintenance'],
  },
  {
    capability: 'drone-tech',
    categorySlug: 'drone-technology',
    terms: ['utm', 'autonomous', 'fleet management', 'אוטונומי', 'ניהול צי'],
  },
]

// Buyer-facing Hebrew display tags, one per capability
export const BUYER_INTENT_TAGS: Array<{ capability: string; tag: string }> = [
  { capability: 'aerial-photo',         tag: 'צילום אווירי' },
  { capability: 'real-estate-photo',    tag: 'צילום נדל"ן' },
  { capability: 'fpv-racing',           tag: 'צילום FPV' },
  { capability: 'gis-mapping',          tag: 'מיפוי וסקר' },
  { capability: 'agriculture-spraying', tag: 'שירותי חקלאות' },
  { capability: 'thermal-inspection',   tag: 'בדיקות תרמיות' },
  { capability: 'solar-inspection',     tag: 'בדיקת פאנלים סולריים' },
  { capability: 'insurance-docs',       tag: 'תיעוד לביטוח' },
  { capability: 'security-monitoring',  tag: 'אבטחה וניטור' },
  { capability: 'drone-training',       tag: 'הכשרת טייסים' },
  { capability: 'repair-service',       tag: 'תיקון רחפנים' },
  { capability: 'drone-tech',           tag: 'טכנולוגיות רחפן' },
]

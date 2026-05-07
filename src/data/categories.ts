import type { Category } from '@/src/types/listing'

export const categories: Category[] = [
  {
    slug: 'aerial-photography',
    labelHe: 'צילום אווירי',
    descriptionHe: 'צילום ווידאו מהאוויר לאירועים, שיווק ותוכן יצירתי',
    icon: 'camera',
    order: 1,
  },
  {
    slug: 'real-estate-photography',
    labelHe: 'צילום נדל"ן',
    descriptionHe: 'צילום נכסים, פרויקטים ושטחים לצורכי שיווק נדל"ן',
    icon: 'building',
    order: 2,
  },
  {
    slug: 'fpv-filming',
    labelHe: 'צילום FPV',
    descriptionHe: 'צילום דינמי ומרגש עם רחפני FPV לקליפים וספורט',
    icon: 'zap',
    order: 3,
  },
  {
    slug: 'mapping-surveying',
    labelHe: 'מיפוי וסקר',
    descriptionHe: 'מיפוי תלת-ממד, סקרי קרקע ומדידות מדויקות',
    icon: 'map',
    order: 4,
  },
  {
    slug: 'agriculture',
    labelHe: 'חקלאות',
    descriptionHe: 'ריסוס, ניטור יבולים ומיפוי שדות חקלאיים',
    icon: 'leaf',
    order: 5,
  },
  {
    slug: 'inspections',
    labelHe: 'בדיקות ובדק בית',
    descriptionHe: 'בדיקת גגות, מבנים, תשתיות ומתקנים תעשייתיים',
    icon: 'search',
    order: 6,
  },
  {
    slug: 'security',
    labelHe: 'אבטחה וניטור',
    descriptionHe: 'סיור, ניטור ואבטחת מתחמים ואירועים',
    icon: 'shield',
    order: 7,
  },
  {
    slug: 'training-schools',
    labelHe: 'בתי ספר והכשרה',
    descriptionHe: 'קורסי טייס, הכשרה מקצועית והסמכה רשמית',
    icon: 'graduation-cap',
    order: 8,
  },
  {
    slug: 'drone-stores',
    labelHe: 'חנויות רחפנים',
    descriptionHe: 'מכירת רחפנים, אביזרים וציוד נלווה',
    icon: 'shopping-cart',
    order: 9,
  },
  {
    slug: 'repairs',
    labelHe: 'תיקון ושירות',
    descriptionHe: 'תיקון רחפנים, החלפת חלקים ושדרוג מערכות',
    icon: 'wrench',
    order: 10,
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

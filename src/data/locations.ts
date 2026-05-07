import type { Location } from '@/src/types/listing'

export const locations: Location[] = [
  { slug: 'tel-aviv',      labelHe: 'תל אביב',      region: 'center',    lat: 32.0853,  lng: 34.7818 },
  { slug: 'jerusalem',     labelHe: 'ירושלים',       region: 'jerusalem', lat: 31.7683,  lng: 35.2137 },
  { slug: 'haifa',         labelHe: 'חיפה',          region: 'north',     lat: 32.7940,  lng: 34.9896 },
  { slug: 'beer-sheva',    labelHe: 'באר שבע',       region: 'south',     lat: 31.2530,  lng: 34.7915 },
  { slug: 'herzliya',      labelHe: 'הרצליה',        region: 'center',    lat: 32.1663,  lng: 34.8439 },
  { slug: 'netanya',       labelHe: 'נתניה',         region: 'center',    lat: 32.3215,  lng: 34.8532 },
  { slug: 'rishon-lezion', labelHe: 'ראשון לציון',   region: 'center',    lat: 31.9730,  lng: 34.7925 },
  { slug: 'petah-tikva',   labelHe: 'פתח תקווה',     region: 'center',    lat: 32.0869,  lng: 34.8878 },
  { slug: 'ashdod',        labelHe: 'אשדוד',         region: 'south',     lat: 31.8044,  lng: 34.6553 },
  { slug: 'eilat',         labelHe: 'אילת',          region: 'south',     lat: 29.5577,  lng: 34.9519 },
]

export function getLocationBySlug(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug)
}

export function getLocationsByRegion(region: Location['region']): Location[] {
  return locations.filter((l) => l.region === region)
}

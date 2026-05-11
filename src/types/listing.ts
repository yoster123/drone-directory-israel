export type ClaimedStatus = 'claimed' | 'unclaimed' | 'pending'

export type Region = 'north' | 'center' | 'south' | 'jerusalem'

export type ServiceAreaType = 'local' | 'regional' | 'nationwide'

export interface Category {
  slug: string
  labelHe: string
  descriptionHe: string
  emoji: string
  icon: string
  order: number
}

export interface Location {
  slug: string
  labelHe: string
  region: Region
  lat?: number
  lng?: number
}

export interface Listing {
  id: string
  name: string
  slug: string

  // Category
  categorySlug: string
  categoryLabelHe: string

  // Services offered (Hebrew display strings)
  services: string[]

  // Location
  citySlug: string | null    // null when specific city is unknown
  cityLabelHe: string        // city name, or regional label (e.g. "אזור צפון")
  region: Region

  // Service reach
  serviceAreaType: ServiceAreaType
  serviceRegions: Region[]

  // Content
  shortDescriptionHe: string
  longDescriptionHe: string

  // Contact
  phone: string | null
  whatsapp: string | null
  website: string | null
  email: string | null

  // Media
  imageUrl: string | null

  // Directory metadata
  claimedStatus: ClaimedStatus
  featured: boolean
  qualityScore: number       // 0–100, internal only

  // Data provenance
  sourceUrl: string | null   // where this listing was originally found
  lastUpdated: string        // ISO date string
}

export interface EnrichedListing extends Listing {
  badges: string[]
  specialties: string[]

  // Operational drone profile — heuristic-enriched, always present
  equipment: string[]           // drone hardware / gear used
  industriesServed: string[]    // client industries (real estate, agriculture, …)
  deliverables: string[]        // output formats provided
  certifications: string[]      // regulatory / professional certifications
  coverageArea: string          // human-readable geographic scope
  operationalStrengths: string[] // what makes this operator distinct operationally
  projectTypes: string[]        // types of projects they handle
  verificationSignals: string[] // observable trust signals from public data

  // Logo — populated by fetch-listing-logos.ts or logo-overrides.json
  logoUrl?: string | null
  logoSource?: 'official-site' | 'favicon' | 'manual' | 'claimed-profile' | 'generated'
  logoConfidence?: 'high' | 'medium' | 'low'
}

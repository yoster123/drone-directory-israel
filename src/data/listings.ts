import type { EnrichedListing } from '@/src/types/listing'
import { enrichedListings } from './enriched-listings'

export const listings: EnrichedListing[] = enrichedListings

export function getListingBySlug(slug: string): EnrichedListing | undefined {
  return listings.find((l) => l.slug === slug)
}

export function getListingsByCategory(categorySlug: string): EnrichedListing[] {
  return listings.filter((l) => l.categorySlug === categorySlug)
}

export function getListingsByCity(citySlug: string): EnrichedListing[] {
  return listings.filter((l) => l.citySlug === citySlug)
}

export function getListingsByCategoryAndCity(categorySlug: string, citySlug: string): EnrichedListing[] {
  return listings.filter((l) => l.categorySlug === categorySlug && l.citySlug === citySlug)
}

export function getFeaturedListings(): EnrichedListing[] {
  return listings
    .filter((l) => l.featured)
    .sort((a, b) => b.qualityScore - a.qualityScore)
}

export function getCitiesForCategory(categorySlug: string): string[] {
  const seen = new Set<string>()
  listings
    .filter((l) => l.categorySlug === categorySlug && l.citySlug !== null)
    .forEach((l) => seen.add(l.citySlug!))
  return Array.from(seen)
}

export function getCategoriesForCity(citySlug: string): string[] {
  const seen = new Set<string>()
  listings
    .filter((l) => l.citySlug === citySlug)
    .forEach((l) => seen.add(l.categorySlug))
  return Array.from(seen)
}

export function getSimilarListings(listing: EnrichedListing, limit = 3): EnrichedListing[] {
  return listings
    .filter((l) => l.categorySlug === listing.categorySlug && l.slug !== listing.slug)
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, limit)
}

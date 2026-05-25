import type { EnrichedListing } from '@/src/types/listing'
import { enrichedListings } from './enriched-listings'

export const listings: EnrichedListing[] = enrichedListings

export function getListingBySlug(slug: string): EnrichedListing | undefined {
  return listings.find((l) => l.slug === slug)
}

// A listing belongs to a category if it is the primary category OR if the
// category appears in secondaryCategorySlugs (set by enrich-listings.ts).
// No deduplication needed — each listing is stored once in enriched-listings.ts.
export function getListingsByCategory(categorySlug: string): EnrichedListing[] {
  return listings.filter(
    (l) =>
      l.categorySlug === categorySlug ||
      l.secondaryCategorySlugs?.includes(categorySlug) === true,
  )
}

export function getListingsByCity(citySlug: string): EnrichedListing[] {
  return listings.filter((l) => l.citySlug === citySlug)
}

// City filter on service pages: include cities where any matching listing lives,
// counting both primary and secondary category membership.
export function getListingsByCategoryAndCity(categorySlug: string, citySlug: string): EnrichedListing[] {
  return listings.filter(
    (l) =>
      (l.categorySlug === categorySlug ||
        l.secondaryCategorySlugs?.includes(categorySlug) === true) &&
      l.citySlug === citySlug,
  )
}

export function getFeaturedListings(limit = 6): EnrichedListing[] {
  const featured = listings
    .filter((l) => l.featured)
    .sort((a, b) => b.qualityScore - a.qualityScore)
  if (featured.length >= limit) return featured.slice(0, limit)
  // Fall back to highest quality score when no listings are manually featured
  return [...listings]
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, limit)
}

// Which cities have at least one listing (primary or secondary) for this category.
export function getCitiesForCategory(categorySlug: string): string[] {
  const seen = new Set<string>()
  listings
    .filter(
      (l) =>
        (l.categorySlug === categorySlug ||
          l.secondaryCategorySlugs?.includes(categorySlug) === true) &&
        l.citySlug !== null,
    )
    .forEach((l) => seen.add(l.citySlug!))
  return Array.from(seen)
}

// Which categories (primary + secondary) have at least one listing in this city.
export function getCategoriesForCity(citySlug: string): string[] {
  const seen = new Set<string>()
  listings
    .filter((l) => l.citySlug === citySlug)
    .forEach((l) => {
      seen.add(l.categorySlug)
      l.secondaryCategorySlugs?.forEach((s) => seen.add(s))
    })
  return Array.from(seen)
}

// Similar listings: same primary category, excluding self.
export function getSimilarListings(listing: EnrichedListing, limit = 3): EnrichedListing[] {
  return listings
    .filter((l) => l.categorySlug === listing.categorySlug && l.slug !== listing.slug)
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, limit)
}

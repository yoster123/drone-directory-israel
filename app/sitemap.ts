import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/src/lib/config'
import { categories } from '@/src/data/categories'
import { locations } from '@/src/data/locations'
import { listings, getCitiesForCategory } from '@/src/data/listings'

type SitemapEntry = MetadataRoute.Sitemap[number]

const NOW = new Date()

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: SitemapEntry[] = [
    { url: SITE_URL,                    lastModified: NOW, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/services`,      lastModified: NOW, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/add-listing`,   lastModified: NOW, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/about`,         lastModified: NOW, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/contact`,       lastModified: NOW, changeFrequency: 'monthly', priority: 0.3 },
  ]

  const categoryPages: SitemapEntry[] = categories.map((c) => ({
    url: `${SITE_URL}/services/${c.slug}`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  const categoryCityPages: SitemapEntry[] = []
  for (const category of categories) {
    for (const citySlug of getCitiesForCategory(category.slug)) {
      categoryCityPages.push({
        url: `${SITE_URL}/services/${category.slug}/${citySlug}`,
        lastModified: NOW,
        changeFrequency: 'weekly',
        priority: 0.75,
      })
    }
  }

  const cityPages: SitemapEntry[] = locations.map((loc) => ({
    url: `${SITE_URL}/cities/${loc.slug}`,
    lastModified: NOW,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const listingPages: SitemapEntry[] = listings.map((l) => ({
    url: `${SITE_URL}/listings/${l.slug}`,
    lastModified: new Date(l.lastUpdated),
    changeFrequency: 'monthly',
    priority: 0.65,
  }))

  return [
    ...staticPages,
    ...categoryPages,
    ...categoryCityPages,
    ...cityPages,
    ...listingPages,
  ]
}

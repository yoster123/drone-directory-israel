import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, getCategoryBySlug } from '@/src/data/categories'
import { locations, getLocationBySlug } from '@/src/data/locations'
import {
  getListingsByCategoryAndCity,
  getCitiesForCategory,
  getCategoriesForCity,
} from '@/src/data/listings'
import PageHeader from '@/src/components/PageHeader'
import ListingGrid from '@/src/components/ListingGrid'
import Breadcrumbs from '@/src/components/Breadcrumbs'
import CTABox from '@/src/components/CTABox'
import { SITE_URL } from '@/src/lib/config'

export async function generateStaticParams() {
  const params: { service: string; city: string }[] = []
  for (const category of categories) {
    for (const location of locations) {
      if (getListingsByCategoryAndCity(category.slug, location.slug).length > 0) {
        params.push({ service: category.slug, city: location.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>
}): Promise<Metadata> {
  const { service, city } = await params
  const category = getCategoryBySlug(service)
  const location = getLocationBySlug(city)
  if (!category || !location) return { title: 'לא נמצא | ALTIV' }

  const count = getListingsByCategoryAndCity(service, city).length

  return {
    title: `${category.labelHe} ב${location.labelHe} | ${count} ספקים | ALTIV`,
    description: `מצאו ספקי ${category.labelHe} מורשים ב${location.labelHe}. ${count} ספקים רשומים.`,
    alternates: {
      canonical: `${SITE_URL}/services/${service}/${city}`,
    },
    robots: count < 3 ? { index: false, follow: true } : undefined,
  }
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>
}) {
  const { service, city } = await params
  const category = getCategoryBySlug(service)
  const location = getLocationBySlug(city)
  if (!category || !location) notFound()

  const listings = getListingsByCategoryAndCity(service, city)
  const otherCities = getCitiesForCategory(service).filter((s) => s !== city)
  const otherCategories = getCategoriesForCity(city).filter((s) => s !== service)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: 'שירותים', href: '/services' },
          { label: category.labelHe, href: `/services/${service}` },
          { label: location.labelHe },
        ]}
      />

      <PageHeader
        badge={`${listings.length} ספקים`}
        title={`${category.labelHe} ב${location.labelHe}`}
        subtitle={`ספקי ${category.labelHe} מורשים ב${location.labelHe} ובאזורה`}
      />

      {listings.length < 3 && (
        <p className="mb-6 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-lg">
          עמוד זה עדיין בבנייה — מספר הספקים הרשומים מוגבל.
        </p>
      )}

      <ListingGrid
        listings={listings}
        emptyMessage={`אין ספקי ${category.labelHe} רשומים ב${location.labelHe} עדיין.`}
      />

      {otherCities.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-4">
            {category.labelHe} בערים נוספות
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCities.map((citySlug) => {
              const loc = getLocationBySlug(citySlug)
              if (!loc) return null
              return (
                <Link
                  key={citySlug}
                  href={`/services/${service}/${citySlug}`}
                  className="px-4 py-2 rounded-full bg-white border border-[#e0e0e0] text-sm text-[#1d1d1f] hover:border-[#0066cc] hover:text-[#0066cc] transition-colors"
                >
                  {category.labelHe} ב{loc.labelHe}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {otherCategories.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-4">
            שירותים נוספים ב{location.labelHe}
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((catSlug) => {
              const cat = getCategoryBySlug(catSlug)
              if (!cat) return null
              return (
                <Link
                  key={catSlug}
                  href={`/services/${catSlug}/${city}`}
                  className="px-4 py-2 rounded-full bg-white border border-[#e0e0e0] text-sm text-[#1d1d1f] hover:border-[#0066cc] hover:text-[#0066cc] transition-colors"
                >
                  {cat.labelHe} ב{location.labelHe}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <CTABox
        title="יש לכם עסק בתחום הרחפנים?"
        description="הוסיפו את הפרופיל שלכם ותופיעו בתוצאות החיפוש."
        primaryLabel="הוסיפו את העסק שלכם"
        primaryHref="/add-listing"
        secondaryLabel="דרשו פרופיל קיים"
        secondaryHref="/claim-listing"
      />
    </main>
  )
}

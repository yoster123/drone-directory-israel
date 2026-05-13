import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { locations, getLocationBySlug } from '@/src/data/locations'
import { getListingsByCity, getCategoriesForCity } from '@/src/data/listings'
import { getCategoryBySlug } from '@/src/data/categories'
import PageHeader from '@/src/components/PageHeader'
import ListingGrid from '@/src/components/ListingGrid'
import Breadcrumbs from '@/src/components/Breadcrumbs'
import CTABox from '@/src/components/CTABox'
import { SITE_URL } from '@/src/lib/config'

export async function generateStaticParams() {
  return locations.map((l) => ({ city: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const location = getLocationBySlug(city)
  if (!location) return { title: 'לא נמצא | ALTIV' }

  const count = getListingsByCity(city).length

  return {
    title: `שירותי רחפן ב${location.labelHe} | ${count} ספקים | ALTIV`,
    description: `מצאו ספקי שירותי רחפן מורשים ב${location.labelHe} — צילום אווירי, מיפוי, בדיקות ועוד.`,
    alternates: {
      canonical: `${SITE_URL}/cities/${city}`,
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city } = await params
  const location = getLocationBySlug(city)
  if (!location) notFound()

  const listings = getListingsByCity(city)
  const categorySlugs = getCategoriesForCity(city)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: location.labelHe },
        ]}
      />

      <PageHeader
        badge={`${listings.length} ספקים`}
        title={`שירותי רחפן ב${location.labelHe}`}
        subtitle={`ספקי שירותי רחפן מורשים ב${location.labelHe} ובאזורה`}
      />

      <ListingGrid
        listings={listings}
        emptyMessage={`אין ספקים רשומים עדיין ב${location.labelHe}.`}
      />

      {categorySlugs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-4">שירותים זמינים</h2>
          <div className="flex flex-wrap gap-2">
            {categorySlugs.map((catSlug) => {
              const category = getCategoryBySlug(catSlug)
              if (!category) return null
              return (
                <Link
                  key={catSlug}
                  href={`/services/${catSlug}/${city}`}
                  className="px-4 py-2 rounded-full bg-white border border-[#e0e0e0] text-sm text-[#1d1d1f] hover:border-[#0066cc] hover:text-[#0066cc] transition-colors"
                >
                  {category.labelHe} ב{location.labelHe}
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

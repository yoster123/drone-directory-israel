import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, getCategoryBySlug } from '@/src/data/categories'
import { getListingsByCategory, getCitiesForCategory } from '@/src/data/listings'
import { getLocationBySlug } from '@/src/data/locations'
import PageHeader from '@/src/components/PageHeader'
import ListingGrid from '@/src/components/ListingGrid'
import Breadcrumbs from '@/src/components/Breadcrumbs'
import CTABox from '@/src/components/CTABox'

export async function generateStaticParams() {
  return categories.map((c) => ({ service: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>
}): Promise<Metadata> {
  const { service } = await params
  const category = getCategoryBySlug(service)
  if (!category) return { title: 'לא נמצא | DroneDir' }

  const count = getListingsByCategory(service).length

  return {
    title: `${category.labelHe} בישראל | ${count} ספקים | DroneDir`,
    description: `מצאו ספקי ${category.labelHe} מורשים בישראל. ${category.descriptionHe}`,
  }
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>
}) {
  const { service } = await params
  const category = getCategoryBySlug(service)
  if (!category) notFound()

  const listings = getListingsByCategory(service)
  const citySlugs = getCitiesForCategory(service)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: 'שירותים', href: '/services' },
          { label: category.labelHe },
        ]}
      />

      <PageHeader
        badge={`${listings.length} ספקים`}
        title={`${category.labelHe} בישראל`}
        subtitle={category.descriptionHe}
      />

      <ListingGrid
        listings={listings}
        emptyMessage={`אין ספקים רשומים עדיין בקטגוריית ${category.labelHe}.`}
      />

      {citySlugs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">ערים פופולריות</h2>
          <div className="flex flex-wrap gap-2">
            {citySlugs.map((citySlug) => {
              const location = getLocationBySlug(citySlug)
              if (!location) return null
              return (
                <Link
                  key={citySlug}
                  href={`/services/${service}/${citySlug}`}
                  className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
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

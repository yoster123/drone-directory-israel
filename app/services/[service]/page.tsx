import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { categories, getCategoryBySlug } from '@/src/data/categories'
import { getListingsByCategory, getCitiesForCategory } from '@/src/data/listings'
import { getLocationBySlug } from '@/src/data/locations'
import CategoryIcon from '@/src/components/CategoryIcon'
import ListingGrid from '@/src/components/ListingGrid'
import Breadcrumbs from '@/src/components/Breadcrumbs'
import { SITE_URL } from '@/src/lib/config'

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
  if (!category) return { title: 'לא נמצא | ALTIV' }

  const count = getListingsByCategory(service).length

  return {
    title: `${category.labelHe} בישראל | ${count} ספקים | ALTIV`,
    description: `מצאו ספקי ${category.labelHe} מורשים בישראל. ${category.descriptionHe}`,
    alternates: {
      canonical: `${SITE_URL}/services/${service}`,
    },
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
    <main>

      {/* ── Category hero ────────────────────────────────────── */}
      <section className="relative bg-[#f5f5f7] px-6 pt-10 pb-16 overflow-hidden">
        {/* Radar accent — bottom-left */}
        <div className="absolute -bottom-24 -left-24 pointer-events-none opacity-[0.06]" aria-hidden="true">
          <svg width="480" height="480" viewBox="0 0 480 480" fill="none">
            <circle cx="0" cy="480" r="320" stroke="#1d1d1f" strokeWidth="1" />
            <circle cx="0" cy="480" r="220" stroke="#1d1d1f" strokeWidth="0.8" />
            <circle cx="0" cy="480" r="140" stroke="#1d1d1f" strokeWidth="0.7" />
            <circle cx="0" cy="480" r="72" stroke="#0066cc" strokeWidth="0.8" strokeOpacity="1.5" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { label: 'ראשי', href: '/' },
              { label: 'שירותים', href: '/services' },
              { label: category.labelHe },
            ]}
          />

          <div className="flex items-start justify-between gap-8 mt-6">
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-px bg-[#0066cc]" aria-hidden="true" />
                  <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0066cc] uppercase">
                    שירותי רחפן
                  </p>
                </div>
                <span className="text-[12px] font-medium text-[#7a7a7a] bg-white border border-[#e0e0e0] px-3 py-1 rounded-full">
                  {listings.length} ספקים
                </span>
              </div>

              <h1 className="text-[2.6rem] sm:text-[3.2rem] lg:text-[3.8rem] font-semibold text-[#1d1d1f] leading-[1.05] tracking-[-0.02em]">
                {category.labelHe}
                <span className="text-[#0066cc]"> בישראל</span>
              </h1>

              <p className="t-lead-airy text-[#7a7a7a] mt-5 max-w-xl">
                {category.descriptionHe}
              </p>

              <div className="flex gap-3 mt-8">
                <a
                  href="/add-listing"
                  className="px-5 py-2.5 bg-[#0066cc] text-white text-[14px] font-semibold rounded-full"
                >
                  הוסיפו את הפרופיל שלכם
                </a>
              </div>
            </div>

            {/* Large muted category icon */}
            <div className="hidden lg:flex shrink-0 flex-col items-center gap-4">
              <div className="w-28 h-28 rounded-[18px] border border-[#e0e0e0] bg-white flex items-center justify-center">
                <CategoryIcon slug={service} className="w-14 h-14 text-[#e0e0e0]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Listings ─────────────────────────────────────────── */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <ListingGrid
            listings={listings}
            emptyMessage={`אין ספקים רשומים עדיין בקטגוריית ${category.labelHe}.`}
          />
        </div>
      </section>

      {/* ── City filter ──────────────────────────────────────── */}
      {citySlugs.length > 0 && (
        <section className="bg-[#f5f5f7] px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-4 h-px bg-[#0066cc]" aria-hidden="true" />
              <h2 className="text-[11px] font-semibold tracking-[0.22em] text-[#0066cc] uppercase">
                ערים פופולריות
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {citySlugs.map((citySlug) => {
                const location = getLocationBySlug(citySlug)
                if (!location) return null
                return (
                  <Link
                    key={citySlug}
                    href={`/services/${service}/${citySlug}`}
                    className="px-4 py-2 rounded-full bg-white border border-[#e0e0e0] text-[14px] text-[#1d1d1f] hover:border-[#0066cc] hover:text-[#0066cc] transition-colors"
                  >
                    {category.labelHe} ב{location.labelHe}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="bg-[#272729] px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-[1.8rem] font-semibold text-white leading-tight mb-2">
                יש לכם עסק בתחום הרחפנים?
              </h2>
              <p className="text-[15px] text-white/55 leading-relaxed max-w-sm">
                הוסיפו את הפרופיל שלכם ותופיעו בתוצאות החיפוש.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <a
                href="/add-listing"
                className="px-6 py-3 bg-[#0066cc] text-white font-semibold text-[15px] rounded-full text-center"
              >
                הוסיפו את העסק שלכם
              </a>
              <a
                href="/claim-listing"
                className="px-6 py-3 border border-white/20 text-white font-semibold text-[15px] rounded-full text-center hover:bg-white/5 transition-colors"
              >
                דרשו פרופיל קיים
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

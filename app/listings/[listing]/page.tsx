import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { listings, getListingBySlug, getSimilarListings } from '@/src/data/listings'
import Breadcrumbs from '@/src/components/Breadcrumbs'
import ListingGrid from '@/src/components/ListingGrid'
import CTABox from '@/src/components/CTABox'
import { SITE_URL } from '@/src/lib/config'

export async function generateStaticParams() {
  return listings.map((l) => ({ listing: l.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ listing: string }>
}): Promise<Metadata> {
  const { listing: slug } = await params
  const listing = getListingBySlug(slug)
  if (!listing) return { title: 'לא נמצא | ALTIV' }

  return {
    title: `${listing.name} | ${listing.categoryLabelHe} ב${listing.cityLabelHe} | ALTIV`,
    description: listing.shortDescriptionHe,
    alternates: {
      canonical: `${SITE_URL}/listings/${slug}`,
    },
  }
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ listing: string }>
}) {
  const { listing: slug } = await params
  const listing = getListingBySlug(slug)
  if (!listing) notFound()

  const similar = getSimilarListings(listing)

  const CLAIMED_LABEL: Record<string, string> = {
    claimed: 'מאומת',
    unclaimed: 'לא נדרש',
    pending: 'בבדיקה',
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.name,
    description: listing.shortDescriptionHe,
    url: `${SITE_URL}/listings/${listing.slug}`,
    ...(listing.phone && {
      telephone: listing.phone.replace(/^0/, '+972'),
    }),
    ...(listing.website && { sameAs: [listing.website] }),
    address: {
      '@type': 'PostalAddress',
      addressLocality: listing.cityLabelHe,
      addressCountry: 'IL',
    },
    areaServed: {
      '@type': 'Country',
      name: 'Israel',
    },
    knowsAbout: listing.categoryLabelHe,
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { label: 'ראשי', href: '/' },
          { label: 'שירותים', href: '/services' },
          { label: listing.categoryLabelHe, href: `/services/${listing.categorySlug}` },
          { label: listing.name },
        ]}
      />

      {/* Title row */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {listing.featured && (
            <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
              מומלץ
            </span>
          )}
          {listing.claimedStatus === 'claimed' && (
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
              ✓ מאומת
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{listing.name}</h1>
        <p className="text-gray-500 mt-1">
          <Link href={`/services/${listing.categorySlug}`} className="hover:text-blue-600 transition-colors">
            {listing.categoryLabelHe}
          </Link>
          {' · '}
          {listing.citySlug ? (
            <Link href={`/cities/${listing.citySlug}`} className="hover:text-blue-600 transition-colors">
              {listing.cityLabelHe}
            </Link>
          ) : listing.cityLabelHe}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <p className="text-lg text-gray-700 font-medium leading-relaxed mb-8">
            {listing.shortDescriptionHe}
          </p>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">אודות</h2>
            <p className="text-gray-600 leading-relaxed">{listing.longDescriptionHe}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">שירותים</h2>
            <div className="flex flex-wrap gap-2">
              {listing.services.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </section>

          {listing.specialties.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">התמחויות</h2>
              <div className="flex flex-wrap gap-2">
                {listing.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </section>
          )}

          {listing.badges.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-3">אמינות ואיכות</h2>
              <div className="flex flex-wrap gap-2">
                {listing.badges.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200"
                  >
                    ✓ {badge}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-3">פרטים נוספים</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-gray-500 shrink-0">קטגוריה:</dt>
                <dd>
                  <Link href={`/services/${listing.categorySlug}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                    {listing.categoryLabelHe}
                  </Link>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-gray-500 shrink-0">עיר:</dt>
                <dd>
                  {listing.citySlug ? (
                    <Link href={`/cities/${listing.citySlug}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                      {listing.cityLabelHe}
                    </Link>
                  ) : (
                    <span className="text-gray-700">{listing.cityLabelHe}</span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-gray-500 shrink-0">עדכון אחרון:</dt>
                <dd className="text-gray-700">{listing.lastUpdated}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-gray-500 shrink-0">סטטוס:</dt>
                <dd className="text-gray-700">{CLAIMED_LABEL[listing.claimedStatus]}</dd>
              </div>
            </dl>
          </section>
        </div>

        {/* Sidebar — contact card */}
        <aside className="lg:w-76 shrink-0">
          <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-5">פרטי קשר</h2>
            <div className="flex flex-col gap-3">
              {listing.phone && (
                <a
                  href={`tel:${listing.phone.replace(/-/g, '')}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors"
                >
                  <span>📞</span>
                  <span dir="ltr">{listing.phone}</span>
                </a>
              )}
              {listing.whatsapp && (
                <a
                  href={listing.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-lg font-semibold transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>דברו עכשיו</span>
                </a>
              )}
              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <span>🌐</span>
                  <span>אתר האינטרנט</span>
                </a>
              )}
              {listing.email && (
                <a
                  href={`mailto:${listing.email}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <span>✉️</span>
                  <span className="truncate text-sm">{listing.email}</span>
                </a>
              )}
            </div>

            {listing.claimedStatus !== 'claimed' && (
              <p className="mt-5 text-xs text-gray-400 text-center">
                בעל העסק?{' '}
                <a href="/claim-listing" className="text-blue-600 hover:underline">
                  דרשו פרופיל זה
                </a>
              </p>
            )}
          </div>
        </aside>
      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            ספקים דומים ב{listing.categoryLabelHe}
          </h2>
          <ListingGrid listings={similar} />
        </section>
      )}

      <CTABox
        title="בעלי עסק בתחום הרחפנים?"
        description="הוסיפו את הפרופיל שלכם ותופיעו בתוצאות החיפוש."
        primaryLabel="הוסיפו את העסק שלכם"
        primaryHref="/add-listing"
        secondaryLabel="דרשו פרופיל קיים"
        secondaryHref="/claim-listing"
      />
    </main>
  )
}

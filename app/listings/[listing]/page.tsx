import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { listings, getListingBySlug, getSimilarListings } from '@/src/data/listings'
import Breadcrumbs from '@/src/components/Breadcrumbs'
import CategoryIcon from '@/src/components/CategoryIcon'
import ListingLogo from '@/src/components/ListingLogo'
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('he-IL', { year: 'numeric', month: 'long' })
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
    areaServed: { '@type': 'Country', name: 'Israel' },
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

      {/* Page header card */}
      <div className="rounded-xl bg-[#F8F9FB] border border-[#E2E8F0] px-6 py-7 mb-8 flex items-start gap-5">
        {listing.logoUrl ? (
          <ListingLogo
            name={listing.name}
            id={listing.id}
            logoUrl={listing.logoUrl}
            sizeClass="w-14 h-14"
            roundedClass="rounded-2xl"
            textSizeClass="text-base"
          />
        ) : (
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#1E5DFF] flex items-center justify-center text-white">
            <CategoryIcon slug={listing.categorySlug} className="w-7 h-7" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {(listing.featured || listing.claimedStatus === 'claimed') && (
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
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0A0E1A] leading-tight">
            {listing.name}
          </h1>
          <p className="text-[#64748B] mt-1.5 text-[15px]">
            <Link href={`/services/${listing.categorySlug}`} className="hover:text-[#1E5DFF] transition-colors">
              {listing.categoryLabelHe}
            </Link>
            {' · '}
            {listing.citySlug ? (
              <Link href={`/cities/${listing.citySlug}`} className="hover:text-[#1E5DFF] transition-colors">
                {listing.cityLabelHe}
              </Link>
            ) : listing.cityLabelHe}
          </p>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* Main content */}
        <div className="flex-1 min-w-0">

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">אודות</h2>
            <p className="text-[#64748B] leading-relaxed">{listing.longDescriptionHe}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">שירותים</h2>
            <div className="flex flex-wrap gap-2">
              {listing.services.map((service) => (
                <span
                  key={service}
                  className="px-3 py-1.5 bg-[#EEF3FF] text-[#1E5DFF] text-sm font-medium rounded-full"
                >
                  {service}
                </span>
              ))}
            </div>
          </section>

          {listing.equipment.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">ציוד ויכולות</h2>
              <div className="flex flex-wrap gap-2">
                {listing.equipment.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-[#F8F9FB] text-[#64748B] text-sm font-medium rounded-full border border-[#E2E8F0]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {listing.operationalStrengths.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">תחומי התמחות</h2>
              <div className="flex flex-wrap gap-2">
                {listing.operationalStrengths.map((strength) => (
                  <span
                    key={strength}
                    className="px-3 py-1.5 bg-[#EEF3FF] text-[#1E5DFF] text-sm font-medium rounded-full"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </section>
          )}

          {listing.deliverables.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">תוצרים אפשריים</h2>
              <div className="flex flex-wrap gap-2">
                {listing.deliverables.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 bg-[#F8F9FB] text-[#64748B] text-sm font-medium rounded-full border border-[#E2E8F0]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}

          {listing.industriesServed.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">תעשיות רלוונטיות</h2>
              <div className="flex flex-wrap gap-2">
                {listing.industriesServed.map((industry) => (
                  <span
                    key={industry}
                    className="px-3 py-1.5 bg-[#F8F9FB] text-[#64748B] text-sm font-medium rounded-full border border-[#E2E8F0]"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mb-8">
            <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">אזור פעילות</h2>
            <p className="text-[#64748B] text-sm">{listing.coverageArea}</p>
          </section>

          {(listing.verificationSignals.length > 0 || listing.certifications.length > 0) && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">אמון ואימות</h2>
              <div className="flex flex-wrap gap-2">
                {listing.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200"
                  >
                    ✓ {cert}
                  </span>
                ))}
                {listing.verificationSignals.map((signal) => (
                  <span
                    key={signal}
                    className="px-3 py-1.5 bg-[#F8F9FB] text-[#64748B] text-sm font-medium rounded-full border border-[#E2E8F0]"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold text-[#0A0E1A] mb-3">פרטים נוספים</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              <div className="flex gap-2">
                <dt className="font-medium text-[#64748B] shrink-0">קטגוריה:</dt>
                <dd>
                  <Link href={`/services/${listing.categorySlug}`} className="text-[#0A0E1A] hover:text-[#1E5DFF] transition-colors">
                    {listing.categoryLabelHe}
                  </Link>
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-[#64748B] shrink-0">עיר:</dt>
                <dd>
                  {listing.citySlug ? (
                    <Link href={`/cities/${listing.citySlug}`} className="text-[#0A0E1A] hover:text-[#1E5DFF] transition-colors">
                      {listing.cityLabelHe}
                    </Link>
                  ) : (
                    <span className="text-[#0A0E1A]">{listing.cityLabelHe}</span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-[#64748B] shrink-0">עודכן:</dt>
                <dd className="text-[#0A0E1A]">{formatDate(listing.lastUpdated)}</dd>
              </div>
            </dl>
          </section>

        </div>

        {/* Sidebar — contact card */}
        <aside className="lg:w-76 shrink-0">
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 sticky top-20">
            <h2 className="font-bold text-[#0A0E1A] text-lg mb-1">בקשת שירות מספק זה</h2>
            <p className="text-[13px] text-[#64748B] mb-5">פנו ישירות לספק לתיאום ומחיר</p>
            <div className="flex flex-col gap-3">

              {listing.phone && (
                <a
                  href={`tel:${listing.phone.replace(/-/g, '')}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#1E5DFF] hover:bg-[#1650e8] text-white rounded-lg font-bold transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.55 6.55l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
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
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-[#E2E8F0] hover:bg-[#F8F9FB] text-[#0A0E1A] rounded-lg font-medium transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                  <span>אתר האינטרנט ↗</span>
                </a>
              )}

              {listing.email && (
                <a
                  href={`mailto:${listing.email}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-[#E2E8F0] hover:bg-[#F8F9FB] text-[#0A0E1A] rounded-lg font-medium transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span className="truncate text-sm">{listing.email}</span>
                </a>
              )}

            </div>

            {listing.claimedStatus !== 'claimed' && (
              <div className="mt-5 pt-5 border-t border-[#E2E8F0] text-center">
                <p className="text-[13px] text-[#64748B] mb-1">בעל העסק?</p>
                <a
                  href="/claim-listing"
                  className="text-[13px] font-semibold text-[#1E5DFF] hover:text-[#1650e8] transition-colors"
                >
                  דרשו את הפרופיל שלכם ←
                </a>
              </div>
            )}
          </div>
        </aside>

      </div>

      {/* Similar listings */}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-[#0A0E1A] mb-6">
            ספקים דומים בתחום {listing.categoryLabelHe}
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

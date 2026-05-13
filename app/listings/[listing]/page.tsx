import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { listings, getListingBySlug, getSimilarListings } from '@/src/data/listings'
import Breadcrumbs from '@/src/components/Breadcrumbs'
import CategoryIcon from '@/src/components/CategoryIcon'
import ListingLogo from '@/src/components/ListingLogo'
import ListingGrid from '@/src/components/ListingGrid'
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
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Listing hero ─────────────────────────────────────── */}
      <section className="relative bg-[#f5f5f7] px-6 pt-10 pb-16 overflow-hidden">
        <div className="absolute -bottom-24 -right-24 pointer-events-none opacity-[0.06]" aria-hidden="true">
          <svg width="480" height="480" viewBox="0 0 480 480" fill="none">
            <circle cx="480" cy="480" r="320" stroke="#1d1d1f" strokeWidth="1" />
            <circle cx="480" cy="480" r="220" stroke="#1d1d1f" strokeWidth="0.8" />
            <circle cx="480" cy="480" r="140" stroke="#1d1d1f" strokeWidth="0.7" />
            <circle cx="480" cy="480" r="72" stroke="#0066cc" strokeWidth="0.8" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <Breadcrumbs
            items={[
              { label: 'ראשי', href: '/' },
              { label: 'שירותים', href: '/services' },
              { label: listing.categoryLabelHe, href: `/services/${listing.categorySlug}` },
              { label: listing.name },
            ]}
          />

          <div className="flex items-start gap-6 mt-6">
            <div className="shrink-0">
              {listing.logoUrl ? (
                <ListingLogo
                  name={listing.name}
                  id={listing.id}
                  logoUrl={listing.logoUrl}
                  sizeClass="w-20 h-20"
                  roundedClass="rounded-[18px]"
                  textSizeClass="text-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-[18px] bg-white border border-[#e0e0e0] flex items-center justify-center">
                  <CategoryIcon slug={listing.categorySlug} className="w-9 h-9 text-[#0066cc]" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 pt-1">
              {(listing.featured || listing.claimedStatus === 'claimed') && (
                <div className="flex flex-wrap items-center gap-2 mb-3">
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
              <h1 className="text-[2rem] sm:text-[2.4rem] font-semibold text-[#1d1d1f] leading-tight tracking-[-0.02em]">
                {listing.name}
              </h1>
              <p className="text-[#7a7a7a] mt-2 text-[15px]">
                <Link href={`/services/${listing.categorySlug}`} className="hover:text-[#0066cc] transition-colors">
                  {listing.categoryLabelHe}
                </Link>
                {' · '}
                {listing.citySlug ? (
                  <Link href={`/cities/${listing.citySlug}`} className="hover:text-[#0066cc] transition-colors">
                    {listing.cityLabelHe}
                  </Link>
                ) : listing.cityLabelHe}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two-column body ──────────────────────────────────── */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

            {/* Main content */}
            <div className="flex-1 min-w-0">

              <section className="mb-10">
                <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">אודות</h2>
                <p className="text-[#7a7a7a] leading-relaxed">{listing.longDescriptionHe}</p>
              </section>

              <section className="mb-10">
                <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">שירותים</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.services.map((service) => (
                    <span
                      key={service}
                      className="px-3 py-1.5 bg-[#e8f0fb] text-[#0066cc] text-sm font-medium rounded-full"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </section>

              {listing.equipment.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">ציוד ויכולות</h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.equipment.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-[#f5f5f7] text-[#7a7a7a] text-sm font-medium rounded-full border border-[#e0e0e0]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {listing.operationalStrengths.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">תחומי התמחות</h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.operationalStrengths.map((strength) => (
                      <span
                        key={strength}
                        className="px-3 py-1.5 bg-[#e8f0fb] text-[#0066cc] text-sm font-medium rounded-full"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {listing.deliverables.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">תוצרים אפשריים</h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.deliverables.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-[#f5f5f7] text-[#7a7a7a] text-sm font-medium rounded-full border border-[#e0e0e0]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {listing.industriesServed.length > 0 && (
                <section className="mb-10">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">תעשיות רלוונטיות</h2>
                  <div className="flex flex-wrap gap-2">
                    {listing.industriesServed.map((industry) => (
                      <span
                        key={industry}
                        className="px-3 py-1.5 bg-[#f5f5f7] text-[#7a7a7a] text-sm font-medium rounded-full border border-[#e0e0e0]"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section className="mb-10">
                <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">אזור פעילות</h2>
                <p className="text-[#7a7a7a] text-sm">{listing.coverageArea}</p>
              </section>

              {(listing.verificationSignals.length > 0 || listing.certifications.length > 0) && (
                <section className="mb-10">
                  <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">אמון ואימות</h2>
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
                        className="px-3 py-1.5 bg-[#f5f5f7] text-[#7a7a7a] text-sm font-medium rounded-full border border-[#e0e0e0]"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-[17px] font-semibold text-[#1d1d1f] mb-3">פרטים נוספים</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div className="flex gap-2">
                    <dt className="font-medium text-[#7a7a7a] shrink-0">קטגוריה:</dt>
                    <dd>
                      <Link href={`/services/${listing.categorySlug}`} className="text-[#1d1d1f] hover:text-[#0066cc] transition-colors">
                        {listing.categoryLabelHe}
                      </Link>
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-[#7a7a7a] shrink-0">עיר:</dt>
                    <dd>
                      {listing.citySlug ? (
                        <Link href={`/cities/${listing.citySlug}`} className="text-[#1d1d1f] hover:text-[#0066cc] transition-colors">
                          {listing.cityLabelHe}
                        </Link>
                      ) : (
                        <span className="text-[#1d1d1f]">{listing.cityLabelHe}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-medium text-[#7a7a7a] shrink-0">עודכן:</dt>
                    <dd className="text-[#1d1d1f]">{formatDate(listing.lastUpdated)}</dd>
                  </div>
                </dl>
              </section>

            </div>

            {/* Sidebar — contact card */}
            <aside className="lg:w-76 shrink-0">
              <div className="bg-white border border-[#e0e0e0] rounded-[18px] p-6 sticky top-16">
                <h2 className="font-semibold text-[#1d1d1f] text-[17px] mb-1">בקשת שירות מספק זה</h2>
                <p className="text-[13px] text-[#7a7a7a] mb-5">פנו ישירות לספק לתיאום ומחיר</p>
                <div className="flex flex-col gap-3">

                  {listing.phone && (
                    <a
                      href={`tel:${listing.phone.replace(/-/g, '')}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#0066cc] text-white rounded-full font-semibold"
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
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#25D366] text-white rounded-full font-semibold"
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
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-[#e0e0e0] text-[#1d1d1f] rounded-full font-medium hover:bg-[#f5f5f7] transition-colors"
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
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-[#e0e0e0] text-[#1d1d1f] rounded-full font-medium hover:bg-[#f5f5f7] transition-colors"
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
                  <div className="mt-5 pt-5 border-t border-[#e0e0e0] text-center">
                    <p className="text-[13px] text-[#7a7a7a] mb-1">בעל העסק?</p>
                    <a
                      href="/claim-listing"
                      className="text-[13px] font-semibold text-[#0066cc] hover:underline"
                    >
                      דרשו את הפרופיל שלכם ←
                    </a>
                  </div>
                )}
              </div>
            </aside>

          </div>
        </div>
      </section>

      {/* ── Similar listings ─────────────────────────────────── */}
      {similar.length > 0 && (
        <section className="bg-[#f5f5f7] px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <span className="w-4 h-px bg-[#0066cc]" aria-hidden="true" />
              <h2 className="text-[11px] font-semibold tracking-[0.22em] text-[#0066cc] uppercase">
                ספקים דומים בתחום {listing.categoryLabelHe}
              </h2>
            </div>
            <ListingGrid listings={similar} />
          </div>
        </section>
      )}

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="bg-[#272729] px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-[1.8rem] font-semibold text-white leading-tight mb-2">
                בעלי עסק בתחום הרחפנים?
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

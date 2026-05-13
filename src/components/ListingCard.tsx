import Link from 'next/link'
import type { EnrichedListing } from '@/src/types/listing'
import ListingLogo from '@/src/components/ListingLogo'

interface Props {
  listing: EnrichedListing
}

const REGION_LABELS: Record<string, string> = {
  north: 'צפון', center: 'מרכז', south: 'דרום', jerusalem: 'ירושלים',
}

const CATEGORY_OP_CHIP: Record<string, string> = {
  'mapping-surveying':       'מיפוי',
  'agriculture':             'חקלאות',
  'inspections':             'בדיקות תשתית',
  'security':                'אבטחה',
  'real-estate-photography': 'נדל"ן',
  'repairs':                 'תיקונים',
}

export default function ListingCard({ listing }: Props) {
  const locationLabel = listing.citySlug
    ? listing.cityLabelHe
    : listing.cityLabelHe || `אזור ${REGION_LABELS[listing.region] ?? listing.region}`
  const opChip = CATEGORY_OP_CHIP[listing.categorySlug] ?? null

  return (
    <article className="relative bg-white rounded-[18px] border border-[#e0e0e0] p-5 flex flex-col gap-3 cursor-pointer">

      <Link
        href={`/listings/${listing.slug}`}
        className="absolute inset-0 rounded-[18px]"
        aria-label={`${listing.name} — פרופיל מלא`}
      />

      <div className="relative z-10 flex items-start gap-3">
        <ListingLogo
          name={listing.name}
          id={listing.id}
          logoUrl={listing.logoUrl}
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[#1d1d1f] text-base leading-snug">
            {listing.name}
          </h3>
          <p className="text-[13px] text-[#7a7a7a] mt-0.5">
            {listing.categoryLabelHe} · {locationLabel}
          </p>
        </div>
        {listing.featured && (
          <span className="shrink-0 text-[11px] font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
            מומלץ
          </span>
        )}
      </div>

      <p className="relative z-10 text-sm text-[#7a7a7a] leading-relaxed line-clamp-2">
        {listing.shortDescriptionHe}
      </p>

      {(listing.badges.length > 0 || listing.specialties.length > 0 || opChip) && (
        <div className="relative z-10 flex flex-wrap gap-1.5">
          {listing.badges.map((badge) => (
            <span
              key={badge}
              className="text-[11px] text-green-700 bg-green-50 border border-green-100 px-2.5 py-0.5 rounded-full"
            >
              {badge}
            </span>
          ))}
          {listing.specialties.map((specialty) => (
            <span
              key={specialty}
              className="text-[11px] text-[#7a7a7a] border border-[#e0e0e0] px-2.5 py-0.5 rounded-full"
            >
              {specialty}
            </span>
          ))}
          {opChip && (
            <span className="text-[11px] text-[#0066cc] bg-[#e8f0fb] border border-[#c7d7f5] px-2.5 py-0.5 rounded-full">
              {opChip}
            </span>
          )}
        </div>
      )}

      <div className="relative z-10 flex items-center justify-between pt-3 mt-auto border-t border-[#e0e0e0]">
        <div className="flex flex-col gap-0.5">
          {listing.phone && (
            <a
              href={`tel:${listing.phone.replace(/-/g, '')}`}
              className="flex items-center gap-1.5 text-sm font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
              dir="ltr"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.6 3.4 2 2 0 0 1 3.57 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.54a16 16 0 0 0 6.55 6.55l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {listing.phone}
            </a>
          )}
          {listing.whatsapp && (
            <a
              href={listing.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] text-green-600 hover:text-green-700 transition-colors"
            >
              וואטסאפ ↗
            </a>
          )}
        </div>
        {listing.website ? (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors"
          >
            אתר האינטרנט ↗
          </a>
        ) : (
          <span className="text-[12px] text-[#0066cc] pointer-events-none select-none">
            לפרופיל ←
          </span>
        )}
      </div>

    </article>
  )
}

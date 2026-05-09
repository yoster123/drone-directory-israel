import Link from 'next/link'
import type { EnrichedListing } from '@/src/types/listing'

interface Props {
  listing: EnrichedListing
}

const REGION_LABELS: Record<string, string> = {
  north: 'צפון', center: 'מרכז', south: 'דרום', jerusalem: 'ירושלים',
}

export default function ListingCard({ listing }: Props) {
  const locationLabel = listing.citySlug
    ? listing.cityLabelHe
    : listing.cityLabelHe || `אזור ${REGION_LABELS[listing.region] ?? listing.region}`

  const chips = [
    ...listing.badges,
    ...listing.specialties,
    ...listing.services.slice(0, 2),
  ]

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:border-gray-300 transition-colors">

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href={`/listings/${listing.slug}`}>
            <h3 className="font-semibold text-black text-base leading-snug hover:text-blue-600 transition-colors">
              {listing.name}
            </h3>
          </Link>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {listing.categoryLabelHe} · {locationLabel}
          </p>
        </div>
        {listing.featured && (
          <span className="shrink-0 text-[11px] font-medium text-gray-400 border border-gray-200 px-2.5 py-1 rounded-full">
            מומלץ
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
        {listing.shortDescriptionHe}
      </p>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <span
              key={chip}
              className="text-[11px] text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full"
            >
              {chip}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
        <div className="flex flex-col gap-0.5">
          {listing.phone ? (
            <a
              href={`tel:${listing.phone.replace(/-/g, '')}`}
              className="text-sm font-medium text-black hover:text-blue-600 transition-colors"
              dir="ltr"
            >
              {listing.phone}
            </a>
          ) : null}
          {listing.whatsapp && (
            <a
              href={listing.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-green-600 hover:text-green-700 transition-colors"
            >
              וואטסאפ ↗
            </a>
          )}
        </div>
        {listing.website && (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors"
          >
            אתר האינטרנט ↗
          </a>
        )}
      </div>

    </article>
  )
}

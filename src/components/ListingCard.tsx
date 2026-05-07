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

  return (
    <article className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href={`/listings/${listing.slug}`}>
            <h3 className="font-bold text-gray-900 text-lg leading-snug hover:text-blue-600 transition-colors">
              {listing.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">
            {listing.categoryLabelHe} · {locationLabel}
          </p>
        </div>
        {listing.featured && (
          <span className="shrink-0 text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
            מומלץ
          </span>
        )}
      </div>

      {listing.badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {listing.badges.map((badge) => (
            <span
              key={badge}
              className="text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200"
            >
              ✓ {badge}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
        {listing.shortDescriptionHe}
      </p>

      {listing.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {listing.specialties.map((specialty) => (
            <span
              key={specialty}
              className="text-xs bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {listing.services.slice(0, 2).map((service) => (
          <span
            key={service}
            className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium"
          >
            {service}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 mt-auto border-t border-gray-100">
        {listing.phone ? (
          <a
            href={`tel:${listing.phone.replace(/-/g, '')}`}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            dir="ltr"
          >
            {listing.phone}
          </a>
        ) : (
          <span />
        )}
        {listing.website && (
          <a
            href={listing.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            אתר האינטרנט ↗
          </a>
        )}
      </div>
    </article>
  )
}

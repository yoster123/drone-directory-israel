import type { EnrichedListing } from '@/src/types/listing'
import ListingCard from '@/src/components/ListingCard'

interface Props {
  listings: EnrichedListing[]
  emptyMessage?: string
}

export default function ListingGrid({ listings, emptyMessage }: Props) {
  if (listings.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <svg
          width="40" height="40" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="mx-auto mb-4 text-gray-300" aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <p className="text-base">{emptyMessage ?? 'לא נמצאו ספקים עדיין.'}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}

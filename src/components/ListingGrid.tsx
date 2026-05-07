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
        <div className="text-4xl mb-4">🔍</div>
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

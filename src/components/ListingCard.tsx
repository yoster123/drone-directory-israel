import Link from 'next/link'
import type { EnrichedListing } from '@/src/types/listing'

interface Props {
  listing: EnrichedListing
}

const REGION_LABELS: Record<string, string> = {
  north: 'צפון', center: 'מרכז', south: 'דרום', jerusalem: 'ירושלים',
}

// One concise chip for categories whose operational use-case is non-obvious from the label alone
const CATEGORY_OP_CHIP: Record<string, string> = {
  'mapping-surveying':       'מיפוי',
  'agriculture':             'חקלאות',
  'inspections':             'בדיקות תשתית',
  'security':                'אבטחה',
  'real-estate-photography': 'נדל"ן',
  'repairs':                 'תיקונים',
}

const AVATAR_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-violet-100 text-violet-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
]

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2)
  return words[0][0] + words[1][0]
}

function avatarColor(id: string): string {
  let h = 5381
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h) ^ id.charCodeAt(i)
  return AVATAR_COLORS[(h >>> 0) % AVATAR_COLORS.length]
}

export default function ListingCard({ listing }: Props) {
  const locationLabel = listing.citySlug
    ? listing.cityLabelHe
    : listing.cityLabelHe || `אזור ${REGION_LABELS[listing.region] ?? listing.region}`
  const opChip = CATEGORY_OP_CHIP[listing.categorySlug] ?? null

  return (
    <article className="relative bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">

      {/* Full-card link overlay — behind all interactive elements */}
      <Link
        href={`/listings/${listing.slug}`}
        className="absolute inset-0 rounded-xl"
        aria-label={`${listing.name} — פרופיל מלא`}
      />

      {/* Header: avatar + name + featured badge */}
      <div className="relative z-10 flex items-start gap-3">
        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold select-none ${avatarColor(listing.id)}`}>
          {getInitials(listing.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-black text-base leading-snug">
            {listing.name}
          </h3>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {listing.categoryLabelHe} · {locationLabel}
          </p>
        </div>
        {listing.featured && (
          <span className="shrink-0 text-[11px] font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
            מומלץ
          </span>
        )}
      </div>

      {/* Description */}
      <p className="relative z-10 text-sm text-gray-600 leading-relaxed line-clamp-2">
        {listing.shortDescriptionHe}
      </p>

      {/* Chips: quality badges (green), specialties (gray outline), operational tag (blue) */}
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
              className="text-[11px] text-gray-500 border border-gray-200 px-2.5 py-0.5 rounded-full"
            >
              {specialty}
            </span>
          ))}
          {opChip && (
            <span className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
              {opChip}
            </span>
          )}
        </div>
      )}

      {/* Footer: phone + WhatsApp on left, website or profile CTA on right */}
      <div className="relative z-10 flex items-center justify-between pt-3 mt-auto border-t border-gray-100">
        <div className="flex flex-col gap-0.5">
          {listing.phone && (
            <a
              href={`tel:${listing.phone.replace(/-/g, '')}`}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors"
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
            className="text-[13px] text-gray-400 hover:text-gray-700 transition-colors"
          >
            אתר האינטרנט ↗
          </a>
        ) : (
          <span className="text-[12px] text-blue-500 pointer-events-none select-none">
            לפרופיל ←
          </span>
        )}
      </div>

    </article>
  )
}

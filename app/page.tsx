import type { Metadata } from 'next'
import Link from 'next/link'
import { categories } from '@/src/data/categories'
import { locations } from '@/src/data/locations'
import { getFeaturedListings } from '@/src/data/listings'
import SearchForm from '@/src/components/SearchForm'
import CategoryIcon from '@/src/components/CategoryIcon'

export const metadata: Metadata = {
  title: 'ALTIV — אינדקס שירותי הרחפן בישראל',
  description:
    'מצאו ספקים מקצועיים לצילום אווירי, מיפוי, בדיקות תשתית, FPV, חקלאות ופתרונות רחפן לעסקים.',
  openGraph: {
    title: 'ALTIV — אינדקס שירותי הרחפן בישראל',
    description: 'מצאו ספקים מקצועיים לצילום אווירי, מיפוי, בדיקות תשתית, FPV, חקלאות ופתרונות רחפן לעסקים.',
    locale: 'he_IL',
    type: 'website',
  },
}

const POPULAR_SEARCHES = [
  { label: 'צילום רחפן תל אביב', href: '/services/aerial-photography/tel-aviv' },
  { label: 'בדיקת גגות', href: '/services/inspections' },
  { label: 'מיפוי קרקע', href: '/services/mapping-surveying' },
  { label: 'קורס טייס רחפן', href: '/services/training-schools' },
]

const INDUSTRY_NAMES = ['IAI', 'Rafael', 'Elbit Systems', 'XTEND', 'Aeronautics', 'Airborne Technologies']

const METRICS = [
  { value: '36+', labelHe: 'ספקים פעילים', labelEn: 'Active Providers' },
  { value: '10', labelHe: 'קטגוריות שירות', labelEn: 'Service Categories' },
  { value: 'ארצי', labelHe: 'פריסה גיאוגרפית', labelEn: 'Nationwide Coverage' },
  { value: '100%', labelHe: 'קשר ישיר לספק', labelEn: 'Direct Contact' },
]

const REGION_LABELS: Record<string, string> = {
  north: 'צפון', center: 'מרכז', south: 'דרום', jerusalem: 'ירושלים',
}

export default function HomePage() {
  const featuredListings = getFeaturedListings(4)
  const sectorCategories = categories.slice(0, 8)

  return (
    <main>

      {/* ── Hero ── */}
      <section className="bg-white border-b border-[#E2E8F0] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-stretch min-h-[580px] gap-8 lg:gap-12">

            {/* ── Content — right side in RTL ── */}
            <div className="flex-1 flex flex-col justify-center py-16 lg:pl-8">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-5">
                Israeli Drone Ecosystem
              </p>
              <h1 className="text-[2.8rem] lg:text-[3.6rem] xl:text-[4.2rem] font-black text-[#0A0E1A] leading-[1.0] tracking-[-0.03em] mb-5">
                אינדקס שירותי<br />
                הרחפן{' '}
                <span className="text-[#1E5DFF]">בישראל</span>
              </h1>
              <p className="text-[15px] text-gray-500 leading-[1.7] mb-8 max-w-[400px]">
                מצאו ספקים מקצועיים לצילום אווירי, מיפוי, בדיקות תשתית,
                FPV, חקלאות ופתרונות רחפן לעסקים.
              </p>

              <SearchForm
                categories={categories}
                locations={locations}
                className="w-full max-w-[500px]"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 text-[12px] border border-[#E2E8F0] rounded-full text-[#64748B] bg-white shadow-sm hover:border-[#1E5DFF]/40 hover:text-[#1E5DFF] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Visual panel — left side in RTL ── */}
            <div className="hidden lg:flex lg:w-[44%] shrink-0 items-stretch py-8">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-[460px]">
                <svg
                  viewBox="0 0 500 520"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 w-full h-full"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0.15" y2="1">
                      <stop offset="0%" stopColor="#e0f2fe" />
                      <stop offset="55%" stopColor="#bae6fd" />
                      <stop offset="100%" stopColor="#7dd3fc" />
                    </linearGradient>
                    <pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse">
                      <circle cx="1.5" cy="1.5" r="1" fill="#0369a1" opacity="0.12" />
                    </pattern>
                    <linearGradient id="cityfade" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0a1628" stopOpacity="0" />
                      <stop offset="100%" stopColor="#0a1628" stopOpacity="1" />
                    </linearGradient>
                  </defs>

                  {/* Sky */}
                  <rect width="500" height="520" fill="url(#sky)" />
                  <rect width="500" height="520" fill="url(#dots)" />

                  {/* Atmospheric haze on horizon */}
                  <ellipse cx="250" cy="360" rx="340" ry="28" fill="#bae6fd" fillOpacity="0.35" />

                  {/* Radar rings centered on drone */}
                  <circle cx="250" cy="178" r="172" stroke="#0f172a" strokeWidth="0.5" strokeOpacity="0.07" fill="none" />
                  <circle cx="250" cy="178" r="122" stroke="#0f172a" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
                  <circle cx="250" cy="178" r="80" stroke="#0f172a" strokeWidth="0.7" strokeOpacity="0.15" fill="none" />
                  <circle cx="250" cy="178" r="47" stroke="#1d4ed8" strokeWidth="1" strokeOpacity="0.28" strokeDasharray="5 3" fill="none" />

                  {/* City base fill */}
                  <rect x="0" y="368" width="500" height="152" fill="#0a1628" />

                  {/* City buildings — tallest in center, shorter at edges */}
                  <rect x="14" y="320" width="26" height="200" fill="#0a1628" />
                  <rect x="44" y="305" width="23" height="215" fill="#0a1628" />
                  <rect x="72" y="312" width="28" height="208" fill="#0a1628" />
                  <rect x="106" y="290" width="20" height="230" fill="#0a1628" />
                  <rect x="131" y="276" width="26" height="244" fill="#0a1628" />
                  <rect x="163" y="262" width="28" height="258" fill="#0a1628" />
                  <rect x="198" y="268" width="20" height="252" fill="#0a1628" />
                  <rect x="223" y="258" width="24" height="262" fill="#0a1628" />
                  <rect x="252" y="262" width="20" height="258" fill="#0a1628" />
                  <rect x="276" y="270" width="26" height="250" fill="#0a1628" />
                  <rect x="308" y="278" width="23" height="242" fill="#0a1628" />
                  <rect x="337" y="265" width="28" height="255" fill="#0a1628" />
                  <rect x="370" y="278" width="20" height="242" fill="#0a1628" />
                  <rect x="395" y="292" width="26" height="228" fill="#0a1628" />
                  <rect x="426" y="306" width="23" height="214" fill="#0a1628" />
                  <rect x="454" y="318" width="28" height="202" fill="#0a1628" />

                  {/* Sea layer — darker at bottom */}
                  <rect x="0" y="438" width="500" height="82" fill="#061525" />

                  {/* Flight path incoming */}
                  <path d="M 42 42 Q 108 88 183 150" stroke="#1d4ed8" strokeWidth="1.5" strokeDasharray="6 4" strokeOpacity="0.5" fill="none" />

                  {/* Waypoint origin */}
                  <circle cx="42" cy="42" r="5" fill="#1d4ed8" fillOpacity="0.7" />
                  <circle cx="42" cy="42" r="12" stroke="#1d4ed8" strokeWidth="0.8" strokeOpacity="0.28" fill="none" />

                  {/* Drone arms */}
                  <line x1="243" y1="170" x2="222" y2="149" stroke="#0f172a" strokeWidth="2.5" />
                  <line x1="257" y1="170" x2="278" y2="149" stroke="#0f172a" strokeWidth="2.5" />
                  <line x1="243" y1="186" x2="222" y2="207" stroke="#0f172a" strokeWidth="2.5" />
                  <line x1="257" y1="186" x2="278" y2="207" stroke="#0f172a" strokeWidth="2.5" />

                  {/* Motor mounts */}
                  <circle cx="222" cy="149" r="14" fill="#0f172a" />
                  <circle cx="278" cy="149" r="14" fill="#0f172a" />
                  <circle cx="222" cy="207" r="14" fill="#0f172a" />
                  <circle cx="278" cy="207" r="14" fill="#0f172a" />

                  {/* Propeller arcs */}
                  <circle cx="222" cy="149" r="26" stroke="#0f172a" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
                  <circle cx="278" cy="149" r="26" stroke="#0f172a" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
                  <circle cx="222" cy="207" r="26" stroke="#0f172a" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
                  <circle cx="278" cy="207" r="26" stroke="#0f172a" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />

                  {/* Drone body */}
                  <rect x="236" y="164" width="28" height="28" rx="4.5" fill="#0f172a" />

                  {/* Camera gimbal */}
                  <circle cx="250" cy="179" r="8" fill="#1e3a5f" />
                  <circle cx="250" cy="179" r="4.5" fill="#1d4ed8" />
                  <circle cx="250" cy="179" r="2" fill="#60a5fa" />

                  {/* Targeting reticle */}
                  <circle cx="250" cy="178" r="33" stroke="#1d4ed8" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.4" fill="none" />

                  {/* Crosshairs */}
                  <line x1="231" y1="178" x2="215" y2="178" stroke="#1d4ed8" strokeWidth="0.9" strokeOpacity="0.5" />
                  <line x1="269" y1="178" x2="285" y2="178" stroke="#1d4ed8" strokeWidth="0.9" strokeOpacity="0.5" />
                  <line x1="250" y1="159" x2="250" y2="143" stroke="#1d4ed8" strokeWidth="0.9" strokeOpacity="0.5" />
                  <line x1="250" y1="197" x2="250" y2="213" stroke="#1d4ed8" strokeWidth="0.9" strokeOpacity="0.5" />

                  {/* Coordinate card */}
                  <rect x="14" y="468" width="170" height="38" rx="8" fill="white" fillOpacity="0.88" />
                  <text x="26" y="484" fill="#0f172a" fontSize="8.5" fontFamily="ui-monospace,monospace" fontWeight="bold">32.0853°N  34.7818°E</text>
                  <text x="26" y="498" fill="#64748b" fontSize="7.5" fontFamily="ui-monospace,monospace">ישראל · ALT 142m</text>
                  <circle cx="164" cy="484" r="3.5" fill="#22c55e" />
                  <text x="157" y="498" fill="#22c55e" fontSize="7" fontFamily="ui-monospace,monospace">LIVE</text>

                  {/* Corner data — top right */}
                  <text x="478" y="22" fill="#0c4a6e" fontSize="8" fontFamily="ui-monospace,monospace" textAnchor="end" opacity="0.6">UAS-IL</text>
                  <text x="478" y="34" fill="#0c4a6e" fontSize="7.5" fontFamily="ui-monospace,monospace" textAnchor="end" opacity="0.5">ALTIV v2.4</text>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Industry trust strip ── */}
      <section className="bg-white border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <p className="text-[11px] font-medium text-gray-300 whitespace-nowrap sm:ml-8">
              סומכים עלינו החברות המובילות בתעשייה
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-7 gap-y-2">
              {INDUSTRY_NAMES.map((name) => (
                <span key={name} className="text-[13px] font-semibold text-gray-300 hover:text-gray-400 transition-colors tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Sectors ── */}
      <section className="bg-[#F8F9FB] border-b border-[#E2E8F0] py-20 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-2">
                יכולות
              </p>
              <h2 className="text-2xl font-black text-[#0A0E1A] tracking-tight">תחומי שירות</h2>
              <p className="text-sm text-[#64748B] mt-1">כל פתרונות הרחפן לעסק שלך במקום אחד</p>
            </div>
            <Link
              href="/services"
              className="text-[13px] font-medium text-[#1E5DFF] hover:text-[#1650e8] transition-colors whitespace-nowrap"
            >
              כל הספקים ←
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sectorCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/services/${category.slug}`}
                className="group relative bg-white rounded-xl p-5 flex flex-col gap-0 border border-[#E2E8F0] hover:border-[#1E5DFF] hover:shadow-[0_4px_8px_0_rgba(30,93,255,0.08)] transition-all overflow-hidden shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]"
              >
                {/* Subtle technical underlay */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-[0.04]" aria-hidden="true">
                  <svg viewBox="0 0 160 160" className="absolute -top-8 -left-8 w-36 h-36">
                    <circle cx="80" cy="80" r="70" stroke="#0A0E1A" strokeWidth="0.8" fill="none" />
                    <circle cx="80" cy="80" r="48" stroke="#0A0E1A" strokeWidth="0.6" fill="none" strokeDasharray="3 2" />
                    <circle cx="80" cy="80" r="28" stroke="#0A0E1A" strokeWidth="0.5" fill="none" />
                    <line x1="10" y1="80" x2="150" y2="80" stroke="#0A0E1A" strokeWidth="0.4" />
                    <line x1="80" y1="10" x2="80" y2="150" stroke="#0A0E1A" strokeWidth="0.4" />
                  </svg>
                </div>

                {/* Card top row */}
                <div className="flex items-start justify-between mb-5 relative">
                  <div className="w-10 h-10 rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] flex items-center justify-center group-hover:border-[#1E5DFF]/30 group-hover:bg-[#EEF3FF] transition-colors">
                    <CategoryIcon
                      slug={category.slug}
                      className="w-5 h-5 text-[#64748B] group-hover:text-[#1E5DFF] transition-colors"
                    />
                  </div>
                  <div className="w-6 h-6 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] group-hover:border-[#1E5DFF] group-hover:text-[#1E5DFF] transition-colors">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                </div>

                {/* Title and description */}
                <h3 className="text-[14px] font-bold text-[#0A0E1A] mb-2 leading-snug group-hover:text-[#1E5DFF] transition-colors relative">
                  {category.labelHe}
                </h3>
                <p className="text-[12px] text-[#64748B] leading-relaxed transition-colors relative line-clamp-2">
                  {category.descriptionHe}
                </p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── Featured Providers ── */}
      <section className="bg-white border-b border-[#E2E8F0] py-20 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-2">
                ספקים נבחרים
              </p>
              <h2 className="text-2xl font-black text-[#0A0E1A] tracking-tight">ספקים מובילים</h2>
              <p className="text-sm text-[#64748B] mt-1">ספקים מורשים ומקצועיים ברחבי ישראל</p>
            </div>
            <Link
              href="/services"
              className="text-[13px] font-medium text-[#1E5DFF] hover:text-[#1650e8] transition-colors whitespace-nowrap"
            >
              כל הספקים ←
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {featuredListings.map((listing) => {
              const locationLabel = listing.citySlug
                ? listing.cityLabelHe
                : listing.cityLabelHe || `אזור ${REGION_LABELS[listing.region] ?? listing.region}`
              const initial = listing.name.charAt(0)

              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_2px_4px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.08)] transition-shadow p-6 flex flex-col gap-4"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                    <span className="text-2xl font-black text-[#1E5DFF] leading-none select-none">
                      {initial}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <h3 className="font-bold text-[#0A0E1A] text-[15px] leading-snug">
                      {listing.name}
                    </h3>
                    <p className="text-[12px] text-gray-400">
                      {listing.categoryLabelHe} · {locationLabel}
                    </p>
                    <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 mt-1">
                      {listing.shortDescriptionHe}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/listings/${listing.slug}`}
                    className="mt-auto block w-full text-center px-4 py-2.5 bg-[#1E5DFF] hover:bg-[#1650e8] text-white text-[13px] font-semibold rounded-lg transition-colors"
                  >
                    לצפייה בפרופיל
                  </Link>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── Metrics band ── */}
      <section className="relative bg-[#0a1628] py-20 px-6 overflow-hidden">
        {/* Radar background texture */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]" aria-hidden="true">
          <svg width="900" height="400" viewBox="0 0 900 400" fill="none">
            <circle cx="450" cy="200" r="310" stroke="#3b82f6" strokeWidth="1" />
            <circle cx="450" cy="200" r="230" stroke="#3b82f6" strokeWidth="0.8" />
            <circle cx="450" cy="200" r="155" stroke="#3b82f6" strokeWidth="0.7" />
            <circle cx="450" cy="200" r="85" stroke="#3b82f6" strokeWidth="0.6" />
            <line x1="140" y1="200" x2="760" y2="200" stroke="#3b82f6" strokeWidth="0.5" />
            <line x1="450" y1="0" x2="450" y2="400" stroke="#3b82f6" strokeWidth="0.5" />
            <line x1="231" y1="81" x2="669" y2="319" stroke="#3b82f6" strokeWidth="0.35" />
            <line x1="669" y1="81" x2="231" y2="319" stroke="#3b82f6" strokeWidth="0.35" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#162944]">
            {METRICS.map((m) => (
              <div key={m.labelEn} className="bg-[#0a1628] px-8 py-12">
                <p className="text-[3.2rem] font-black text-white tracking-[-0.04em] leading-none mb-3">
                  {m.value}
                </p>
                <p className="text-[14px] font-semibold text-white/80">{m.labelHe}</p>
                <p className="text-[11px] text-blue-400/55 mt-1">{m.labelEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Provider CTA ── */}
      <section className="bg-white border-t border-[#E2E8F0] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-5">
            לבעלי עסקים
          </p>
          <h2 className="text-3xl sm:text-[2.6rem] font-black text-[#0A0E1A] leading-[1.05] tracking-[-0.02em] mb-5 max-w-lg">
            הצטרפו לאינדקס<br />שירותי הרחפן
          </h2>
          <p className="text-[15px] text-[#64748B] leading-relaxed mb-8 max-w-sm">
            הרשמו את החברה שלכם ותגיעו ללקוחות מסחריים שמחפשים ספקים כמוכם.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/add-listing"
              className="px-6 py-3 bg-[#1E5DFF] hover:bg-[#1650e8] text-white font-semibold text-sm rounded-lg transition-colors text-center"
            >
              הוסיפו את החברה שלכם
            </a>
            <a
              href="/claim-listing"
              className="px-6 py-3 border border-[#E2E8F0] hover:border-[#0A0E1A]/20 text-[#0A0E1A] font-semibold text-sm rounded-lg transition-colors text-center"
            >
              דרשו פרופיל קיים
            </a>
          </div>
        </div>
      </section>

    </main>
  )
}

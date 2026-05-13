import type { Metadata } from 'next'
import Link from 'next/link'
import { categories } from '@/src/data/categories'
import { locations } from '@/src/data/locations'
import { getFeaturedListings, getListingsByCategory } from '@/src/data/listings'
import SearchForm from '@/src/components/SearchForm'
import CategoryIcon from '@/src/components/CategoryIcon'

export const metadata: Metadata = {
  title: 'ALTIV — פלטפורמת הרחפנים של ישראל',
  description:
    'מצא אנשי מקצוע, גלה שירותים, וקבל כלים לצמיחה בעולם הרחפנים. אינדקס ספקי הרחפן המקצועי של ישראל.',
  openGraph: {
    title: 'ALTIV — פלטפורמת הרחפנים של ישראל',
    description: 'מצא אנשי מקצוע, גלה שירותים, וקבל כלים לצמיחה בעולם הרחפנים.',
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-[#f5f5f7] overflow-hidden">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(29,29,31,0.12) 0.75px, transparent 0.75px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-stretch min-h-[700px] gap-0">

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center py-24 lg:pl-12 xl:pl-20">
              <div className="flex items-center gap-2 mb-8">
                <span className="w-6 h-px bg-[#0066cc]" aria-hidden="true" />
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0066cc] uppercase">
                  Israeli Drone Ecosystem
                </p>
              </div>

              <h1 className="text-[3rem] sm:text-[3.8rem] lg:text-[4.4rem] xl:text-[5rem] font-semibold text-[#1d1d1f] leading-[1.0] tracking-[-0.03em] mb-6">
                פלטפורמת הרחפנים<br />
                <span className="text-[#0066cc]">של ישראל</span>
              </h1>

              <p className="t-lead-airy text-[#7a7a7a] mb-10 max-w-[420px]">
                מצא אנשי מקצוע, גלה שירותים, וקבל כלים לצמיחה
                בעולם הרחפנים.
              </p>

              <SearchForm
                categories={categories}
                locations={locations}
                className="w-full max-w-[520px]"
              />

              <div className="mt-5 flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-1.5 text-[12px] border border-[#e0e0e0] rounded-full text-[#7a7a7a] bg-white/70 hover:text-[#0066cc] hover:border-[#0066cc]/30 transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Coordinate stamp */}
              <div className="mt-12 flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 border border-[#e0e0e0] rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
                  <span className="text-[11px] font-mono text-[#7a7a7a] tracking-tight">32.0853°N · 34.7818°E</span>
                </div>
                <span className="text-[11px] font-mono text-[#7a7a7a]/60">UAS-IL</span>
              </div>
            </div>

            {/* Illustration — right side in RTL, fills column */}
            <div className="hidden lg:block w-[46%] xl:w-[48%] shrink-0 relative">
              <svg
                viewBox="0 0 520 700"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="sky2" x1="0" y1="0" x2="0.1" y2="1">
                    <stop offset="0%" stopColor="#dbeafe" />
                    <stop offset="50%" stopColor="#bfdbfe" />
                    <stop offset="100%" stopColor="#93c5fd" />
                  </linearGradient>
                  <linearGradient id="groundfade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1d1d1f" stopOpacity="0" />
                    <stop offset="100%" stopColor="#1d1d1f" stopOpacity="1" />
                  </linearGradient>
                </defs>

                {/* Sky */}
                <rect width="520" height="700" fill="url(#sky2)" />

                {/* Subtle dot pattern on sky */}
                <pattern id="skydots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="0.8" fill="#0369a1" opacity="0.1" />
                </pattern>
                <rect width="520" height="700" fill="url(#skydots)" />

                {/* Radar rings — large, centered mid-sky */}
                <circle cx="260" cy="240" r="220" stroke="#1d1d1f" strokeWidth="0.5" strokeOpacity="0.06" fill="none" />
                <circle cx="260" cy="240" r="170" stroke="#1d1d1f" strokeWidth="0.5" strokeOpacity="0.08" fill="none" />
                <circle cx="260" cy="240" r="120" stroke="#1d1d1f" strokeWidth="0.7" strokeOpacity="0.1" fill="none" />
                <circle cx="260" cy="240" r="75" stroke="#0066cc" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
                <circle cx="260" cy="240" r="40" stroke="#0066cc" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="5 3" fill="none" />

                {/* Crosshair lines */}
                <line x1="0" y1="240" x2="520" y2="240" stroke="#1d1d1f" strokeWidth="0.4" strokeOpacity="0.06" />
                <line x1="260" y1="0" x2="260" y2="480" stroke="#1d1d1f" strokeWidth="0.4" strokeOpacity="0.06" />

                {/* Flight path */}
                <path d="M 50 60 Q 130 120 205 195" stroke="#0066cc" strokeWidth="1.5" strokeDasharray="7 4" strokeOpacity="0.45" fill="none" />
                <circle cx="50" cy="60" r="4" fill="#0066cc" fillOpacity="0.6" />
                <circle cx="50" cy="60" r="10" stroke="#0066cc" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />

                {/* Second flight path */}
                <path d="M 480 80 Q 400 140 310 200" stroke="#0066cc" strokeWidth="1" strokeDasharray="5 4" strokeOpacity="0.25" fill="none" />
                <circle cx="480" cy="80" r="3" fill="#0066cc" fillOpacity="0.4" />

                {/* Drone — center */}
                {/* Arms */}
                <line x1="252" y1="233" x2="228" y2="208" stroke="#1d1d1f" strokeWidth="2.5" />
                <line x1="268" y1="233" x2="292" y2="208" stroke="#1d1d1f" strokeWidth="2.5" />
                <line x1="252" y1="249" x2="228" y2="273" stroke="#1d1d1f" strokeWidth="2.5" />
                <line x1="268" y1="249" x2="292" y2="273" stroke="#1d1d1f" strokeWidth="2.5" />
                {/* Motors */}
                <circle cx="228" cy="208" r="15" fill="#1d1d1f" />
                <circle cx="292" cy="208" r="15" fill="#1d1d1f" />
                <circle cx="228" cy="273" r="15" fill="#1d1d1f" />
                <circle cx="292" cy="273" r="15" fill="#1d1d1f" />
                {/* Prop arcs */}
                <circle cx="228" cy="208" r="28" stroke="#1d1d1f" strokeWidth="0.8" strokeOpacity="0.18" fill="none" />
                <circle cx="292" cy="208" r="28" stroke="#1d1d1f" strokeWidth="0.8" strokeOpacity="0.18" fill="none" />
                <circle cx="228" cy="273" r="28" stroke="#1d1d1f" strokeWidth="0.8" strokeOpacity="0.18" fill="none" />
                <circle cx="292" cy="273" r="28" stroke="#1d1d1f" strokeWidth="0.8" strokeOpacity="0.18" fill="none" />
                {/* Body */}
                <rect x="244" y="226" width="32" height="32" rx="5" fill="#1d1d1f" />
                {/* Gimbal */}
                <circle cx="260" cy="242" r="8" fill="#2c2c2e" />
                <circle cx="260" cy="242" r="4.5" fill="#0066cc" />
                <circle cx="260" cy="242" r="2" fill="#2997ff" />

                {/* Targeting reticle */}
                <circle cx="260" cy="241" r="36" stroke="#0066cc" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.35" fill="none" />
                <line x1="238" y1="241" x2="218" y2="241" stroke="#0066cc" strokeWidth="0.9" strokeOpacity="0.4" />
                <line x1="282" y1="241" x2="302" y2="241" stroke="#0066cc" strokeWidth="0.9" strokeOpacity="0.4" />
                <line x1="260" y1="219" x2="260" y2="200" stroke="#0066cc" strokeWidth="0.9" strokeOpacity="0.4" />
                <line x1="260" y1="263" x2="260" y2="282" stroke="#0066cc" strokeWidth="0.9" strokeOpacity="0.4" />

                {/* City horizon */}
                <rect x="0" y="485" width="520" height="215" fill="#1d1d1f" />
                <rect x="0" y="530" width="520" height="170" fill="#111113" />

                {/* City silhouette buildings */}
                {[14,42,72,100,125,150,175,202,228,254,280,306,332,358,384,410,436,462,490].map((x, i) => {
                  const hs = [200,220,185,240,260,248,235,270,255,262,268,245,258,230,250,220,235,215,195]
                  return <rect key={i} x={x} y={700 - hs[i]} width={i % 3 === 0 ? 22 : 18} height={hs[i]} fill="#1d1d1f" />
                })}

                {/* Ground overlay fade */}
                <rect x="0" y="440" width="520" height="80" fill="url(#groundfade)" />

                {/* Coordinate card */}
                <rect x="18" y="580" width="180" height="40" rx="8" fill="white" fillOpacity="0.9" />
                <text x="30" y="596" fill="#1d1d1f" fontSize="8.5" fontFamily="ui-monospace,monospace" fontWeight="bold">32.0853°N  34.7818°E</text>
                <text x="30" y="612" fill="#7a7a7a" fontSize="7.5" fontFamily="ui-monospace,monospace">ישראל · ALT 142m</text>
                <circle cx="172" cy="596" r="3.5" fill="#22c55e" />
                <text x="165" y="612" fill="#22c55e" fontSize="7" fontFamily="ui-monospace,monospace">LIVE</text>

                {/* Corner label */}
                <text x="502" y="24" fill="#0c4a6e" fontSize="8" fontFamily="ui-monospace,monospace" textAnchor="end" opacity="0.55">UAS-IL</text>
                <text x="502" y="38" fill="#0c4a6e" fontSize="7.5" fontFamily="ui-monospace,monospace" textAnchor="end" opacity="0.4">ALTIV v2.4</text>

                {/* Altitude marker */}
                <line x1="490" y1="200" x2="510" y2="200" stroke="#0066cc" strokeWidth="0.8" strokeOpacity="0.4" />
                <line x1="490" y1="240" x2="510" y2="240" stroke="#0066cc" strokeWidth="0.8" strokeOpacity="0.4" />
                <line x1="500" y1="200" x2="500" y2="240" stroke="#0066cc" strokeWidth="0.6" strokeOpacity="0.3" />
                <text x="505" y="222" fill="#0066cc" fontSize="7" fontFamily="ui-monospace,monospace" textAnchor="start" opacity="0.5">142m</text>
              </svg>
            </div>

          </div>
        </div>
      </section>

      {/* ── Dual-audience ────────────────────────────────────── */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Customer card */}
            <Link
              href="/services"
              className="group relative flex flex-col gap-6 p-10 bg-white border border-[#e0e0e0] rounded-[18px] overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 160 160" fill="none" className="w-full h-full opacity-[0.04]">
                  <circle cx="160" cy="0" r="100" stroke="#0066cc" strokeWidth="1" />
                  <circle cx="160" cy="0" r="64" stroke="#0066cc" strokeWidth="0.8" />
                  <circle cx="160" cy="0" r="32" stroke="#0066cc" strokeWidth="0.6" />
                </svg>
              </div>
              <div className="w-14 h-14 rounded-[18px] bg-[#e8f0fb] flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066cc" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-[22px] font-semibold text-[#1d1d1f] mb-3 leading-tight group-hover:text-[#0066cc] transition-colors">
                  מחפשים שירותי רחפן?
                </h2>
                <p className="text-[#7a7a7a] leading-relaxed">
                  מצאו מפעילי רחפן מקצועיים לצילום, מיפוי, בדיקות, נדל״ן, חקלאות ועוד.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0066cc]">
                מצא שירות
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 5 5 12 12 19" />
                </svg>
              </span>
            </Link>

            {/* Pilot card */}
            <Link
              href="/pilots"
              className="group relative flex flex-col gap-6 p-10 bg-[#272729] rounded-[18px] overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <svg viewBox="0 0 520 280" fill="none" className="absolute bottom-0 left-0 w-full h-full opacity-[0.08]">
                  <circle cx="520" cy="280" r="240" stroke="#0066cc" strokeWidth="1" />
                  <circle cx="520" cy="280" r="160" stroke="#0066cc" strokeWidth="0.8" />
                  <circle cx="520" cy="280" r="90" stroke="#0066cc" strokeWidth="0.6" />
                </svg>
              </div>
              <div className="w-14 h-14 rounded-[18px] bg-white/10 flex items-center justify-center shrink-0 relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2997ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="2" />
                  <line x1="12" y1="10" x2="8.5" y2="6.5" /><line x1="12" y1="10" x2="15.5" y2="6.5" />
                  <line x1="12" y1="14" x2="8.5" y2="17.5" /><line x1="12" y1="14" x2="15.5" y2="17.5" />
                  <circle cx="8.5" cy="6.5" r="2" /><circle cx="15.5" cy="6.5" r="2" />
                  <circle cx="8.5" cy="17.5" r="2" /><circle cx="15.5" cy="17.5" r="2" />
                </svg>
              </div>
              <div className="flex-1 relative">
                <h2 className="text-[22px] font-semibold text-white mb-3 leading-tight">
                  לטייסי רחפנים ועסקים
                </h2>
                <p className="text-white/60 leading-relaxed">
                  כלים, מדריכים, חשיפה, לידים ומשאבים שיעזרו לכם לצמוח.
                </p>
              </div>
              <span className="relative inline-flex items-center gap-2 text-[14px] font-semibold text-[#2997ff] group-hover:text-white transition-colors">
                כניסה למרכז הטייסים
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 5 5 12 12 19" />
                </svg>
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* ── Industry trust ───────────────────────────────────── */}
      <section className="bg-white border-t border-[#e0e0e0]">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <p className="text-[11px] font-medium text-[#cccccc] whitespace-nowrap sm:ml-8">
              סומכים עלינו החברות המובילות בתעשייה
            </p>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-8 gap-y-2">
              {INDUSTRY_NAMES.map((name) => (
                <span key={name} className="text-[13px] font-semibold text-[#cccccc] tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Sectors ──────────────────────────────────── */}
      <section className="bg-[#f5f5f7] py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-[#0066cc]" aria-hidden="true" />
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0066cc] uppercase">יכולות</p>
              </div>
              <h2 className="text-[2.2rem] font-semibold text-[#1d1d1f] tracking-tight leading-tight">תחומי שירות</h2>
              <p className="t-tagline text-[#7a7a7a] mt-2">כל פתרונות הרחפן לעסק שלך במקום אחד</p>
            </div>
            <Link href="/services" className="text-[13px] font-medium text-[#0066cc] hover:underline whitespace-nowrap">
              כל הקטגוריות ←
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sectorCategories.map((category, idx) => {
              const count = getListingsByCategory(category.slug).length
              return (
                <Link
                  key={category.slug}
                  href={`/services/${category.slug}`}
                  className="group relative bg-white rounded-[18px] p-6 flex flex-col gap-4 border border-[#e0e0e0] overflow-hidden min-h-[196px]"
                >
                  {/* Faint index number */}
                  <span
                    className="absolute bottom-3 left-4 text-[64px] font-semibold text-[#1d1d1f]/[0.04] leading-none select-none pointer-events-none tabular-nums"
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="w-11 h-11 rounded-xl border border-[#e0e0e0] bg-[#f5f5f7] flex items-center justify-center group-hover:bg-[#e8f0fb] group-hover:border-[#0066cc]/20 transition-colors shrink-0">
                    <CategoryIcon
                      slug={category.slug}
                      className="w-5 h-5 text-[#7a7a7a] group-hover:text-[#0066cc] transition-colors"
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <h3 className="text-[14px] font-bold text-[#1d1d1f] leading-snug group-hover:text-[#0066cc] transition-colors line-clamp-2">
                      {category.labelHe}
                    </h3>
                    <p className="text-[12px] text-[#7a7a7a] leading-relaxed line-clamp-2">
                      {category.descriptionHe}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[11px] font-medium text-[#7a7a7a]">
                      {count} ספקים
                    </span>
                    <span className="w-5 h-5 rounded-full border border-[#e0e0e0] flex items-center justify-center text-[#7a7a7a] group-hover:border-[#0066cc] group-hover:text-[#0066cc] transition-colors">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── Featured Providers ─ dark tile ───────────────────── */}
      <section className="bg-[#272729] py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-[#2997ff]" aria-hidden="true" />
                <p className="text-[11px] font-semibold tracking-[0.22em] text-[#2997ff] uppercase">ספקים נבחרים</p>
              </div>
              <h2 className="text-[2.2rem] font-semibold text-white tracking-tight leading-tight">ספקים מובילים</h2>
              <p className="t-tagline text-white/50 mt-2">ספקים מורשים ומקצועיים ברחבי ישראל</p>
            </div>
            <Link href="/services" className="text-[13px] font-medium text-[#2997ff] hover:text-white transition-colors whitespace-nowrap">
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
                  className="bg-white/5 border border-white/10 rounded-[18px] p-6 flex flex-col gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <span className="text-xl font-semibold text-[#2997ff] leading-none select-none">
                      {initial}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    <h3 className="font-bold text-white text-[15px] leading-snug">
                      {listing.name}
                    </h3>
                    <p className="text-[12px] text-white/40">
                      {listing.categoryLabelHe} · {locationLabel}
                    </p>
                    <p className="text-[13px] text-white/55 leading-relaxed line-clamp-3 mt-1">
                      {listing.shortDescriptionHe}
                    </p>
                  </div>

                  <Link
                    href={`/listings/${listing.slug}`}
                    className="mt-auto block w-full text-center px-4 py-2.5 bg-[#0066cc] text-white text-[13px] font-semibold rounded-full"
                  >
                    לצפייה בפרופיל
                  </Link>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ── Metrics band ─ continuous dark ───────────────────── */}
      <section className="relative bg-[#2a2a2c] px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]" aria-hidden="true">
          <svg width="960" height="360" viewBox="0 0 960 360" fill="none">
            <circle cx="480" cy="180" r="320" stroke="#0066cc" strokeWidth="1" />
            <circle cx="480" cy="180" r="240" stroke="#0066cc" strokeWidth="0.8" />
            <circle cx="480" cy="180" r="160" stroke="#0066cc" strokeWidth="0.7" />
            <circle cx="480" cy="180" r="88" stroke="#0066cc" strokeWidth="0.6" />
            <line x1="160" y1="180" x2="800" y2="180" stroke="#0066cc" strokeWidth="0.5" />
            <line x1="480" y1="0" x2="480" y2="360" stroke="#0066cc" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {METRICS.map((m) => (
              <div key={m.labelEn} className="bg-[#2a2a2c] px-8 py-14">
                <p className="text-[3.4rem] font-semibold text-white tracking-[-0.04em] leading-none mb-3">
                  {m.value}
                </p>
                <p className="text-[14px] font-semibold text-white/80">{m.labelHe}</p>
                <p className="text-[11px] text-[#cccccc]/45 mt-1 tracking-wide">{m.labelEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Provider CTA ─────────────────────────────────────── */}
      <section className="bg-[#f5f5f7] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-5">
              <span className="w-5 h-px bg-[#0066cc]" aria-hidden="true" />
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0066cc] uppercase">לבעלי עסקים</p>
            </div>
            <h2 className="text-[2.6rem] sm:text-[3rem] font-semibold text-[#1d1d1f] leading-[1.05] tracking-[-0.02em] mb-5">
              הצטרפו לאינדקס<br />שירותי הרחפן
            </h2>
            <p className="text-[17px] text-[#7a7a7a] leading-relaxed mb-10 max-w-sm">
              הרשמו את החברה שלכם ותגיעו ללקוחות מסחריים שמחפשים ספקים כמוכם.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/add-listing" className="px-7 py-3.5 bg-[#0066cc] text-white font-semibold text-[15px] rounded-full text-center">
                הוסיפו את החברה שלכם
              </a>
              <a href="/claim-listing" className="px-7 py-3.5 border border-[#e0e0e0] text-[#1d1d1f] font-semibold text-[15px] rounded-full text-center">
                דרשו פרופיל קיים
              </a>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

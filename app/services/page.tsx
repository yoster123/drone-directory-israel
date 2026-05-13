import type { Metadata } from 'next'
import Link from 'next/link'
import { categories } from '@/src/data/categories'
import { getListingsByCategory } from '@/src/data/listings'
import CategoryIcon from '@/src/components/CategoryIcon'

export const metadata: Metadata = {
  title: 'כל שירותי הרחפן בישראל | ALTIV',
  description:
    'עיינו בכל קטגוריות שירותי הרחפן בישראל — צילום אווירי, מיפוי, בדיקות, חקלאות, FPV ועוד.',
}

export default function ServicesPage() {
  return (
    <main>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-[#f5f5f7] px-6 py-20 overflow-hidden">
        {/* Dot-grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(29,29,31,0.1) 0.75px, transparent 0.75px)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        {/* Radar corner accent */}
        <div className="absolute -top-32 -right-32 pointer-events-none opacity-[0.05]" aria-hidden="true">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
            <circle cx="400" cy="0" r="280" stroke="#1d1d1f" strokeWidth="1" />
            <circle cx="400" cy="0" r="190" stroke="#1d1d1f" strokeWidth="0.8" />
            <circle cx="400" cy="0" r="110" stroke="#1d1d1f" strokeWidth="0.7" />
            <circle cx="400" cy="0" r="55" stroke="#0066cc" strokeWidth="0.8" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-5 h-px bg-[#0066cc]" aria-hidden="true" />
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#0066cc] uppercase">
              אינדקס שירותים
            </p>
          </div>
          <h1 className="text-[2.6rem] sm:text-[3.2rem] font-semibold text-[#1d1d1f] tracking-tight leading-[1.05] mb-4">
            כל שירותי הרחפן
          </h1>
          <p className="t-lead-airy text-[#7a7a7a] max-w-lg">
            בחרו קטגוריה כדי לצפות בספקים הזמינים ברחבי ישראל
          </p>
        </div>
      </section>

      {/* ── Category grid ────────────────────────────────────── */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, idx) => {
              const count = getListingsByCategory(category.slug).length
              return (
                <Link
                  key={category.slug}
                  href={`/services/${category.slug}`}
                  className="group relative flex items-start gap-5 p-7 rounded-[18px] border border-[#e0e0e0] bg-white overflow-hidden"
                >
                  {/* Faint index number */}
                  <span
                    className="absolute bottom-3 left-5 text-[64px] font-semibold text-[#1d1d1f]/[0.035] leading-none select-none pointer-events-none tabular-nums"
                    aria-hidden="true"
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl border border-[#e0e0e0] bg-[#f5f5f7] flex items-center justify-center shrink-0 group-hover:bg-[#e8f0fb] group-hover:border-[#0066cc]/20 transition-colors mt-0.5">
                    <CategoryIcon
                      slug={category.slug}
                      className="w-6 h-6 text-[#7a7a7a] group-hover:text-[#0066cc] transition-colors"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col gap-2">
                    <h2 className="font-bold text-[#1d1d1f] text-[17px] leading-snug group-hover:text-[#0066cc] transition-colors">
                      {category.labelHe}
                    </h2>
                    <p className="text-[14px] text-[#7a7a7a] leading-relaxed line-clamp-2">
                      {category.descriptionHe}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[12px] font-medium text-[#7a7a7a]">
                        {count} ספקים
                      </span>
                      <span className="text-[13px] font-semibold text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity">
                        לצפייה ←
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ───────────────────────────────────────── */}
      <section className="bg-[#272729] px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <h2 className="text-[1.8rem] font-semibold text-white leading-tight mb-2">
                יש לכם עסק בתחום הרחפנים?
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

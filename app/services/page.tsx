import type { Metadata } from 'next'
import Link from 'next/link'
import { categories } from '@/src/data/categories'
import { getListingsByCategory } from '@/src/data/listings'
import PageHeader from '@/src/components/PageHeader'
import CategoryIcon from '@/src/components/CategoryIcon'

export const metadata: Metadata = {
  title: 'כל שירותי הרחפן בישראל | ALTIV',
  description:
    'עיינו בכל קטגוריות שירותי הרחפן בישראל — צילום אווירי, מיפוי, בדיקות, חקלאות, FPV ועוד.',
}

export default function ServicesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <PageHeader
        title="כל שירותי הרחפן"
        subtitle="בחרו קטגוריה כדי לצפות בספקים הזמינים ברחבי ישראל"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category) => {
          const count = getListingsByCategory(category.slug).length
          return (
            <Link
              key={category.slug}
              href={`/services/${category.slug}`}
              className="flex items-start gap-4 p-6 rounded-xl border border-[#E2E8F0] hover:border-[#1E5DFF] hover:bg-[#F8F9FB] transition-colors group shadow-[0_2px_4px_0_rgba(0,0,0,0.04)]"
            >
              <div className="w-10 h-10 rounded-xl border border-[#E2E8F0] bg-[#F8F9FB] flex items-center justify-center shrink-0 group-hover:border-[#1E5DFF]/30 group-hover:bg-[#EEF3FF] transition-colors">
                <CategoryIcon
                  slug={category.slug}
                  className="w-5 h-5 text-[#64748B] group-hover:text-[#1E5DFF] transition-colors"
                />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-[#0A0E1A] group-hover:text-[#1E5DFF] text-lg leading-snug transition-colors">
                  {category.labelHe}
                </h2>
                <p className="text-sm text-[#64748B] mt-1 leading-relaxed">
                  {category.descriptionHe}
                </p>
                <p className="text-xs text-[#64748B] mt-2 font-medium">{count} ספקים</p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

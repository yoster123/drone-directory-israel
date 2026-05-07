import type { Metadata } from 'next'
import Link from 'next/link'
import { categories } from '@/src/data/categories'
import { getListingsByCategory } from '@/src/data/listings'
import PageHeader from '@/src/components/PageHeader'

export const metadata: Metadata = {
  title: 'כל שירותי הרחפן בישראל | DroneDir',
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
              className="flex items-start gap-4 p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <span className="text-3xl shrink-0" role="img" aria-label={category.labelHe}>
                {category.emoji}
              </span>
              <div className="min-w-0">
                <h2 className="font-bold text-gray-900 group-hover:text-blue-700 text-lg leading-snug">
                  {category.labelHe}
                </h2>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {category.descriptionHe}
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium">{count} ספקים</p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

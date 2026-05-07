import type { Metadata } from 'next'
import Link from 'next/link'
import { categories } from '@/src/data/categories'
import { getFeaturedListings } from '@/src/data/listings'
import ListingCard from '@/src/components/ListingCard'

export const metadata: Metadata = {
  title: 'מצאו שירותי רחפן מקצועיים בישראל | DroneDir',
  description:
    'מדריך שירותי הרחפן המוביל בישראל — צילום אווירי, מיפוי, בדיקות תשתית, חקלאות חכמה, FPV, הכשרה ועוד.',
  openGraph: {
    title: 'מצאו שירותי רחפן מקצועיים בישראל | DroneDir',
    description: 'מדריך שירותי הרחפן המוביל בישראל',
    locale: 'he_IL',
    type: 'website',
  },
}

const POPULAR_SEARCHES = [
  { label: 'צילום רחפן בתל אביב', href: '/services/aerial-photography/tel-aviv' },
  { label: 'בדיקת גגות בחיפה', href: '/services/inspections/haifa' },
  { label: 'מיפוי קרקע', href: '/services/mapping-surveying' },
  { label: 'קורס טייס רחפן', href: '/services/training-schools' },
  { label: 'צילום נדל"ן בהרצליה', href: '/services/real-estate-photography/herzliya' },
  { label: 'ריסוס חקלאי בדרום', href: '/services/agriculture/beer-sheva' },
  { label: 'תיקון רחפן בתל אביב', href: '/services/repairs/tel-aviv' },
  { label: 'צילום FPV', href: '/services/fpv-filming' },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'חפשו לפי שירות ועיר',
    description: 'בחרו את סוג השירות שאתם צריכים ואת האזור בישראל שמתאים לכם.',
  },
  {
    step: '2',
    title: 'עיינו בפרופילים',
    description: 'קראו על הספקים, עיינו בשירותים ובפרטי הקשר שלהם.',
  },
  {
    step: '3',
    title: 'צרו קשר ישירות',
    description: 'פנו לספק ישירות בטלפון, וואטסאפ או דרך האתר שלו.',
  },
]

const STATS = [
  { value: '12+', label: 'ספקים רשומים' },
  { value: '10', label: 'קטגוריות שירות' },
  { value: '10', label: 'ערים ואזורים' },
  { value: '100%', label: 'ספקים מורשים' },
]

export default function HomePage() {
  const featuredListings = getFeaturedListings()

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-slate-900 to-blue-900 text-white py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            מצאו שירותי רחפן מקצועיים בישראל
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            חפשו צלמי רחפן, מפעילי FPV, שירותי מיפוי, בדיקות תשתית, חקלאות חכמה,
            בתי ספר לרחפנים, חנויות ושירותי תיקון ברחבי ישראל.
          </p>

          {/* Search bar — UI only */}
          <div className="mt-9 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="מה אתם מחפשים? (למשל: צילום אווירי)"
                className="flex-1 px-4 py-3.5 rounded-lg text-gray-900 text-base placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                readOnly
              />
              <select
                className="sm:w-40 px-4 py-3.5 rounded-lg text-gray-700 bg-white focus:outline-none text-base"
                disabled
              >
                <option>כל הארץ</option>
                <option>תל אביב</option>
                <option>חיפה</option>
                <option>ירושלים</option>
                <option>באר שבע</option>
              </select>
              <button
                type="button"
                disabled
                className="px-7 py-3.5 bg-blue-500 rounded-lg font-bold text-base opacity-75 cursor-not-allowed"
              >
                חיפוש במדריך
              </button>
            </div>
            <p className="mt-2.5 text-sm text-blue-300">חיפוש חי יופעל בקרוב</p>
          </div>

          <div className="mt-6">
            <a
              href="#categories"
              className="inline-block px-6 py-2.5 border border-white/30 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              בקשת הצעת מחיר
            </a>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            גלו לפי קטגוריה
          </h2>
          <p className="text-gray-500 text-center mb-10">
            בחרו את סוג שירות הרחפן שאתם צריכים
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/services/${category.slug}`}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-center group"
              >
                <span className="text-3xl" role="img" aria-label={category.labelHe}>
                  {category.emoji}
                </span>
                <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-700 leading-snug">
                  {category.labelHe}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Providers ── */}
      <section id="featured" className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">ספקים מומלצים</h2>
              <p className="text-gray-500 mt-1">ספקים מורשים ומאומתים ברחבי ישראל</p>
            </div>
            <Link
              href="/services"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              כל הספקים ←
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Searches ── */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            חיפושים פופולריים
          </h2>
          <p className="text-gray-500 text-center mb-8">שילובים נפוצים של שירות ומיקום</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            איך זה עובד?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats / Trust ── */}
      <section className="py-14 px-4 sm:px-6 bg-blue-700 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-4xl font-extrabold">{stat.value}</div>
                <div className="text-blue-200 mt-1 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Provider CTA ── */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-5">🚁</div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">יש לכם עסק בתחום הרחפנים?</h2>
          <p className="text-slate-300 text-lg mb-8 leading-relaxed">
            הוסיפו או דרשו את הפרופיל שלכם.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/add-listing"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-base transition-colors"
            >
              הוסיפו את העסק שלכם
            </a>
            <a
              href="/claim-listing"
              className="px-8 py-3.5 border border-white/30 hover:bg-white/10 rounded-lg font-semibold text-base transition-colors"
            >
              דרשו פרופיל קיים
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}

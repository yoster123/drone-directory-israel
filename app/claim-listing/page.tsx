import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'דרשו את הפרופיל שלכם | ALTIV',
  description: 'מצאתם את העסק שלכם במדריך? דרשו את הפרופיל כדי לנהל ולעדכן אותו.',
}

const BENEFITS = [
  'סימון "מאומת" בפרופיל',
  'עדכון פרטי קשר, שירותים ותיאור',
  'עדיפות בדירוג תוצאות (בתכנון)',
  'גישה לסטטיסטיקות צפיות (בתכנון)',
  'אפשרויות פרסום מועדפות (בתכנון)',
]

export default function ClaimListingPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">דרשו את הפרופיל שלכם</h1>
      <p className="text-gray-500 text-lg mb-10">
        מצאתם את העסק שלכם ב-ALTIV? אמתו את הפרופיל ותקבלו שליטה מלאה עליו.
      </p>

      {/* Benefits */}
      <section className="mb-10 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h2 className="text-base font-bold text-gray-900 mb-4">מה מקבלים כשדורשים פרופיל?</h2>
        <ul className="space-y-2">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-blue-600 font-bold">✓</span>
              {b}
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">איך דורשים פרופיל?</h2>
        <ol className="space-y-5">
          {[
            { n: '1', t: 'מצאו את הפרופיל', d: 'חפשו את שם העסק שלכם במדריך ועברו לדף הפרופיל.' },
            { n: '2', t: 'מלאו את הטופס', d: 'הכניסו את שם העסק, פרטי הקשר שלכם והסבר קצר לאימות.' },
            { n: '3', t: 'סקירה', d: 'הצוות שלנו מאמת בעלות ומעדכן את הפרופיל תוך 5 ימי עסקים.' },
          ].map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {step.n}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{step.t}</p>
                <p className="text-gray-600 text-sm mt-0.5">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Form */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5">טופס דרישת פרופיל</h2>

        <div className="mb-5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          דרישת פרופיל עצמית תהיה זמינה בקרוב. בינתיים שלחו פנייה ל{' '}
          <a href="mailto:claim@altiv.co.il" className="underline font-medium">
            claim@altiv.co.il
          </a>
        </div>

        <form className="space-y-4" aria-label="טופס דרישת פרופיל">
          <div>
            <label htmlFor="claim-listing" className="block text-sm font-medium text-gray-700 mb-1">
              שם העסק / קישור לפרופיל
            </label>
            <input
              id="claim-listing"
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="שם העסק שלכם כפי שמופיע במדריך"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="claim-name" className="block text-sm font-medium text-gray-700 mb-1">
                שם איש הקשר
              </label>
              <input
                id="claim-name"
                type="text"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="שם מלא"
              />
            </div>
            <div>
              <label htmlFor="claim-email" className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <input
                id="claim-email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>
          </div>
          <div>
            <label htmlFor="claim-proof" className="block text-sm font-medium text-gray-700 mb-1">
              הוכחת בעלות (תיאור)
            </label>
            <textarea
              id="claim-proof"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="תארו את הקשר שלכם לעסק — למשל: אני המייסד, אני המנהל, הטלפון הרשום שלי הוא..."
            />
          </div>
          <button
            type="button"
            disabled
            className="px-6 py-3 bg-gray-200 text-gray-400 rounded-lg font-bold cursor-not-allowed text-base"
            aria-disabled="true"
          >
            שליחה — בקרוב
          </button>
        </form>
      </section>

      <p className="mt-8 text-sm text-gray-500">
        העסק שלכם עדיין לא רשום?{' '}
        <Link href="/add-listing" className="text-blue-600 hover:underline font-medium">
          הוסיפו אותו כאן
        </Link>
      </p>
    </main>
  )
}

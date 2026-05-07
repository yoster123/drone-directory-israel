import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'צור קשר | DroneDir',
  description: 'צרו קשר עם צוות DroneDir — שאלות, הצעות, דיווחים או בקשות.',
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">צור קשר</h1>
      <p className="text-gray-500 text-lg mb-10">שאלות, הצעות, דיווחים או כל נושא אחר.</p>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Contact details */}
        <aside className="lg:w-64 shrink-0">
          <h2 className="text-base font-bold text-gray-900 mb-4">פרטי קשר</h2>
          <ul className="space-y-4 text-sm text-gray-600">
            <li>
              <p className="font-medium text-gray-800">אימייל</p>
              <a
                href="mailto:contact@dronedir.co.il"
                className="text-blue-600 hover:underline"
              >
                contact@dronedir.co.il
              </a>
            </li>
            <li>
              <p className="font-medium text-gray-800">זמן מענה</p>
              <p>עד 3 ימי עסקים</p>
            </li>
            <li>
              <p className="font-medium text-gray-800">שפה</p>
              <p>עברית ואנגלית</p>
            </li>
          </ul>
        </aside>

        {/* Form */}
        <div className="flex-1">
          <div className="mb-5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
            טופס הפנייה יהיה זמין בקרוב. בינתיים ניתן לפנות ישירות לאימייל.
          </div>

          <form className="space-y-4" aria-label="טופס יצירת קשר">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                שם מלא
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="ישראל ישראלי"
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                אימייל
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="email@example.com"
                dir="ltr"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-sm font-medium text-gray-700 mb-1">
                נושא
              </label>
              <select
                id="contact-subject"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">בחרו נושא</option>
                <option>שאלה כללית</option>
                <option>דיווח על ספק</option>
                <option>בקשת הוספת עסק</option>
                <option>תקלה באתר</option>
                <option>שיתוף פעולה</option>
              </select>
            </div>
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                הודעה
              </label>
              <textarea
                id="contact-message"
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="כתבו את פנייתכם כאן..."
              />
            </div>
            <div>
              <button
                type="button"
                disabled
                className="px-6 py-3 bg-gray-200 text-gray-400 rounded-lg font-bold cursor-not-allowed text-base"
                aria-disabled="true"
              >
                שליחה — בקרוב
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

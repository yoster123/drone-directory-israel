import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'הוסיפו את העסק שלכם | ALTIV',
  description: 'בעלי עסק בתחום הרחפנים? הוסיפו את העסק שלכם למדריך ALTIV.',
}

const STEPS = [
  {
    n: '1',
    title: 'מלאו את הטופס',
    description: 'שם העסק, קטגוריה, עיר, פרטי קשר ותיאור קצר.',
  },
  {
    n: '2',
    title: 'סקירה ידנית',
    description: 'הצוות שלנו בודק את הפרטים ומוודא שהעסק עומד בסף האיכות.',
  },
  {
    n: '3',
    title: 'פרסום',
    description: 'העסק מתפרסם במדריך ומופיע בדפי חיפוש רלוונטיים.',
  },
]

const REQUIREMENTS = [
  'מספר טלפון פעיל',
  'תחום שירות ברור',
  'אזור פעילות בישראל',
  'רישיון תעופה בתוקף (אם רלוונטי)',
  'תיאור קצר של השירות',
]

export default function AddListingPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">הוסיפו את העסק שלכם</h1>
      <p className="text-gray-500 text-lg mb-10">
        בעלי עסק בתחום הרחפנים? הגיעו ללקוחות שמחפשים בדיוק את השירות שלכם.
      </p>

      {/* Process steps */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-5">איך זה עובד?</h2>
        <ol className="space-y-5">
          {STEPS.map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {step.n}
              </span>
              <div>
                <p className="font-semibold text-gray-900">{step.title}</p>
                <p className="text-gray-600 text-sm mt-0.5">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Requirements */}
      <section className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h2 className="text-base font-bold text-gray-900 mb-3">מה נדרש כדי להתפרסם?</h2>
        <ul className="space-y-2">
          {REQUIREMENTS.map((r) => (
            <li key={r} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-600 font-bold">✓</span>
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Form */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-5">טופס הגשה</h2>

        <div className="mb-5 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          הגשה עצמית תהיה זמינה בקרוב. בינתיים שלחו פרטים ל-{' '}
          <a href="mailto:listings@altiv.co.il" className="underline font-medium">
            listings@altiv.co.il
          </a>
        </div>

        <form className="space-y-4" aria-label="טופס הוספת עסק">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="add-name" className="block text-sm font-medium text-gray-700 mb-1">
                שם העסק
              </label>
              <input
                id="add-name"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="שם העסק שלכם"
              />
            </div>
            <div>
              <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-1">
                טלפון
              </label>
              <input
                id="add-phone"
                type="tel"
                autoComplete="tel"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="050-0000000"
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="add-category" className="block text-sm font-medium text-gray-700 mb-1">
                קטגוריה ראשית
              </label>
              <select
                id="add-category"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">בחרו קטגוריה</option>
                <option>צילום אווירי</option>
                <option>{'צילום נדל"ן'}</option>
                <option>צילום FPV</option>
                <option>מיפוי וסקר</option>
                <option>חקלאות</option>
                <option>בדיקות ובדק בית</option>
                <option>אבטחה וניטור</option>
                <option>בתי ספר והכשרה</option>
                <option>חנויות רחפנים</option>
                <option>תיקון ושירות</option>
              </select>
            </div>
            <div>
              <label htmlFor="add-city" className="block text-sm font-medium text-gray-700 mb-1">
                עיר פעילות ראשית
              </label>
              <input
                id="add-city"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="תל אביב"
              />
            </div>
          </div>
          <div>
            <label htmlFor="add-website" className="block text-sm font-medium text-gray-700 mb-1">
              אתר אינטרנט (אופציונלי)
            </label>
            <input
              id="add-website"
              type="url"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="https://www.example.co.il"
              dir="ltr"
            />
          </div>
          <div>
            <label htmlFor="add-description" className="block text-sm font-medium text-gray-700 mb-1">
              תיאור קצר
            </label>
            <textarea
              id="add-description"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="ספרו בקצרה מה השירות שאתם מציעים..."
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
    </main>
  )
}

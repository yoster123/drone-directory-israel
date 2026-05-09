import type { Metadata } from 'next'
import Link from 'next/link'
import AddListingForm from '@/src/components/AddListingForm'

export const metadata: Metadata = {
  title: 'הוסיפו את העסק שלכם | ALTIV',
  description: 'הצטרפו לפלטפורמת הרחפנים של ישראל. קבלו חשיפה ללקוחות מסחריים שמחפשים בדיוק את השירות שלכם.',
}

const VALUE_PROPS = [
  {
    title: 'חשיפה ללקוחות חדשים',
    body: 'אלפי לקוחות מסחריים ופרטיים מחפשים ספקי רחפן. הפרופיל שלכם יופיע בדפי חיפוש רלוונטיים.',
  },
  {
    title: 'דף עסקי מקצועי',
    body: 'דף ייעודי עם שירותים, פרטי קשר, אזור פעילות וסימון מאומת.',
  },
  {
    title: 'קשר ישיר ללקוחות',
    body: 'לקוחות פונים אליכם ישירות. ללא עמלות ועמידים.',
  },
  {
    title: 'SEO מקומי',
    body: 'הפרופיל מאונדקס ב-Google עם schema.org — שם, קטגוריה, טלפון, מיקום.',
  },
]

const REQUIREMENTS = [
  'מספר טלפון פעיל',
  'תחום שירות ברור',
  'אזור פעילות בישראל',
  'תיאור שירות קצר',
]

export default function AddListingPage() {
  return (
    <main>

      {/* Page header */}
      <section className="bg-white border-b border-gray-100 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-blue-600 uppercase mb-3">
            הצטרפות לפלטפורמה
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0a1628] tracking-tight mb-3">
            הצטרפו לפלטפורמת הרחפנים של ישראל
          </h1>
          <p className="text-[15px] text-gray-500 leading-relaxed max-w-xl">
            קבלו חשיפה ללקוחות מסחריים, מוסדיים ופרטיים שמחפשים ספקי שירותי רחפן בישראל.
          </p>
        </div>
      </section>

      {/* Form + side */}
      <section className="py-14 px-6 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

            {/* Form card — right in RTL */}
            <div className="w-full lg:flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-lg font-black text-[#0a1628] mb-6">טופס הגשה</h2>
              <AddListingForm />
            </div>

            {/* Side panel — left in RTL */}
            <div className="w-full lg:w-72 shrink-0 space-y-5">

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#0a1628] mb-4">למה להצטרף ל-ALTIV?</h3>
                <ul className="space-y-4">
                  {VALUE_PROPS.map((p) => (
                    <li key={p.title}>
                      <p className="text-[13px] font-semibold text-[#0a1628]">{p.title}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{p.body}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#0a1628] mb-3">דרישות בסיסיות</h3>
                <ul className="space-y-2">
                  {REQUIREMENTS.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-[12px] text-gray-600">
                      <svg
                        width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-[12px] text-gray-400 text-center">
                העסק כבר רשום?{' '}
                <Link href="/claim-listing" className="text-blue-600 hover:text-blue-700 font-medium">
                  דרשו את הפרופיל שלכם
                </Link>
              </p>

            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

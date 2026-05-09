import type { Metadata } from 'next'
import Link from 'next/link'
import ClaimListingForm from '@/src/components/ClaimListingForm'

export const metadata: Metadata = {
  title: 'דרשו את הפרופיל שלכם | ALTIV',
  description: 'מצאתם את העסק שלכם ב-ALTIV? דרשו בעלות על הפרופיל וקבלו שליטה מלאה עליו.',
}

const CLAIM_BENEFITS = [
  { title: 'סימון מאומת', body: 'הפרופיל שלכם יקבל תג "מאומת" שמגביר אמון אצל לקוחות.' },
  { title: 'עדכון פרטים', body: 'עדכנו שירותים, פרטי קשר, אזור פעילות ותיאור בכל עת.' },
  { title: 'עדיפות בחיפוש', body: 'פרופילים מאומתים מקבלים עדיפות בדירוג תוצאות החיפוש.' },
  { title: 'גישה לסטטיסטיקות', body: 'ראו כמה לקוחות צפו בפרופיל שלכם ומאיפה הגיעו.' },
]

export default function ClaimListingPage() {
  return (
    <main>

      {/* Page header */}
      <section className="bg-white border-b border-gray-100 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-blue-600 uppercase mb-3">
            דרישת פרופיל
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0a1628] tracking-tight mb-3">
            דרשו בעלות על הפרופיל שלכם
          </h1>
          <p className="text-[15px] text-gray-500 leading-relaxed max-w-xl">
            מצאתם את העסק שלכם ב-ALTIV? אמתו את הפרופיל ותקבלו שליטה מלאה עליו.
          </p>
        </div>
      </section>

      {/* Form + side */}
      <section className="py-14 px-6 bg-[#f8fafc]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">

            {/* Form card — right in RTL */}
            <div className="w-full lg:flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-lg font-black text-[#0a1628] mb-6">טופס דרישת פרופיל</h2>
              <ClaimListingForm />
            </div>

            {/* Side panel — left in RTL */}
            <div className="w-full lg:w-72 shrink-0 space-y-5">

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-sm font-bold text-[#0a1628] mb-4">מה מקבלים כשדורשים פרופיל?</h3>
                <ul className="space-y-4">
                  {CLAIM_BENEFITS.map((b) => (
                    <li key={b.title}>
                      <p className="text-[13px] font-semibold text-[#0a1628]">{b.title}</p>
                      <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{b.body}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0a1628] rounded-2xl p-6">
                <p className="text-[13px] font-semibold text-white mb-1">העסק עדיין לא רשום?</p>
                <p className="text-[12px] text-[#4a6a8a] mb-4 leading-relaxed">
                  הוסיפו אותו ישירות — התהליך פשוט ולוקח פחות מ-2 דקות.
                </p>
                <Link
                  href="/add-listing"
                  className="block text-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl transition-colors"
                >
                  הוסיפו את העסק שלכם
                </Link>
              </div>

              <p className="text-[12px] text-gray-400 text-center">
                שאלות? פנו אלינו:{' '}
                <a href="mailto:claim@altiv.co.il" className="text-blue-600 hover:text-blue-700">
                  claim@altiv.co.il
                </a>
              </p>

            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

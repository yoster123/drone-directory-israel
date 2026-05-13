import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'אודות ALTIV | מדריך שירותי הרחפן של ישראל',
  description:
    'ALTIV הוא מדריך שירותי הרחפן המוביל בישראל — פלטפורמה שמחברת בין לקוחות לספקים מורשים.',
}

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] mb-4">אודות ALTIV</h1>
      <p className="text-xl text-gray-500 mb-12 leading-relaxed">
        המדריך הראשון בישראל לאיתור ספקי שירותי רחפן מורשים.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1d1d1f] mb-3">מה זה ALTIV?</h2>
        <p className="text-gray-600 leading-relaxed">
          ALTIV הוא מדריך עסקי ממוקד לתחום הרחפנים בישראל. אנו מרכזים ספקים מורשים ממגוון
          תחומים — צילום אווירי, מיפוי וסקר, בדיקות תשתית, חקלאות חכמה, FPV, הכשרה, חנויות
          ותיקונים — ומאפשרים ללקוחות פרטיים ועסקיים למצוא את הספק הנכון לצרכיהם במהירות.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1d1d1f] mb-3">למה בנינו את זה?</h2>
        <p className="text-gray-600 leading-relaxed mb-3">
          שוק הרחפנים בישראל גדל בקצב מהיר, אך המידע עליו פזור. לקוחות שמחפשים ספק אמין נאלצים
          לדפדף בין קבוצות פייסבוק, פרסומות ממומנות ועמודים גנריים — ללא יכולת להשוות,
          לבדוק רישיון או לקרוא על ניסיון.
        </p>
        <p className="text-gray-600 leading-relaxed">
          ALTIV נוצר כדי לפתור בדיוק את הבעיה הזו: מקום אחד, מרוכז, עם ספקים שעברו
          סינון בסיסי ובעלי פרטי קשר ישירים.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-[#1d1d1f] mb-3">איך זה עובד?</h2>
        <ol className="space-y-4">
          {[
            { n: '1', t: 'איסוף ספקים', d: 'הצוות שלנו אוסף ובודק ספקים מרחבי ישראל ממקורות שונים.' },
            { n: '2', t: 'סינון איכות', d: 'כל ספק עובר בדיקה בסיסית של פרטי קשר, שירותים ומורשה.' },
            { n: '3', t: 'פרסום', d: 'ספקים שעומדים בסף האיכות מתפרסמים במדריך עם פרטים ברורים.' },
            { n: '4', t: 'קשר ישיר', d: 'לקוחות פונים לספקים ישירות — ללא מתווך, ללא עמלה.' },
          ].map((step) => (
            <li key={step.n} className="flex gap-4">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {step.n}
              </span>
              <div>
                <p className="font-semibold text-[#1d1d1f]">{step.t}</p>
                <p className="text-gray-600 text-sm mt-0.5">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-[#1d1d1f] mb-3">הערכים שלנו</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex gap-2"><span className="text-blue-600 font-bold">שקיפות</span> — פרטי קשר גלויים, ללא הסתרת מידע.</li>
          <li className="flex gap-2"><span className="text-blue-600 font-bold">איכות</span> — ספקים עוברים סקירה לפני פרסום.</li>
          <li className="flex gap-2"><span className="text-blue-600 font-bold">נגישות</span> — מידע בעברית, פשוט וברור.</li>
          <li className="flex gap-2"><span className="text-blue-600 font-bold">עצמאות</span> — אנו לא מייצגים ספקים ספציפיים.</li>
        </ul>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/services"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors text-center"
        >
          חפשו ספקים
        </Link>
        <Link
          href="/contact"
          className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors text-center"
        >
          צרו קשר
        </Link>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'תנאי שימוש | ALTIV',
  description: 'תנאי השימוש של ALTIV — מדריך שירותי הרחפן של ישראל.',
}

const LAST_UPDATED = '1 במאי 2026'

export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-[#1d1d1f] mb-2">תנאי שימוש</h1>
      <p className="text-sm text-gray-400 mb-10">עדכון אחרון: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">1. קבלת התנאים</h2>
          <p>
            השימוש באתר ALTIV מהווה הסכמה לתנאי שימוש אלה. אם אינכם מסכימים לתנאים,
            אנא הפסיקו את השימוש באתר.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">2. תיאור השירות</h2>
          <p>
            ALTIV הוא מדריך עסקי המרכז ספקי שירותי רחפן בישראל. האתר משמש לצורכי
            איתור מידע בלבד ואינו מהווה המלצה, אחריות או ייצוג של אף ספק.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">3. דיוק המידע</h2>
          <p>
            אנו עושים מאמצים לשמור על מידע עדכני ומדויק, אך אין אנו ערבים לנכונות, שלמות
            או עדכניות המידע המוצג. יש לאמת פרטים ישירות מול הספקים.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">4. אחריות</h2>
          <p className="mb-2">
            ALTIV אינו אחראי לכל נזק שנגרם כתוצאה מ:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>שימוש במידע המוצג באתר.</li>
            <li>עסקאות בין משתמשים לספקים.</li>
            <li>איכות השירות שהספקים מספקים.</li>
            <li>אי-זמינות האתר.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">5. ספקים רשומים</h2>
          <p>
            ספקים המבקשים להתפרסם מצהירים שהמידע שמסרו מדויק ועדכני. אנו שומרים לעצמנו
            את הזכות להסיר רישומים שאינם עומדים בסטנדרטים שלנו.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">6. קניין רוחני</h2>
          <p>
            כל תוכן מקורי באתר (מלל, עיצוב, קוד) שייך ל-ALTIV. אין להעתיק, להפיץ
            או לעשות שימוש מסחרי בתוכן ללא אישור מפורש.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">7. שינויים בתנאים</h2>
          <p>
            אנו שומרים לעצמנו את הזכות לשנות תנאים אלה בכל עת. המשך שימוש באתר לאחר
            שינוי התנאים מהווה הסכמה לתנאים המעודכנים.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[#1d1d1f] mb-2">8. יצירת קשר</h2>
          <p>
            לשאלות בנוגע לתנאי השימוש:{' '}
            <a href="mailto:legal@altiv.co.il" className="text-blue-600 hover:underline">
              legal@altiv.co.il
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'מדיניות פרטיות | DroneDir',
  description: 'מדיניות הפרטיות של DroneDir — כיצד אנו מטפלים במידע.',
}

const LAST_UPDATED = '1 במאי 2026'

export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">מדיניות פרטיות</h1>
      <p className="text-sm text-gray-400 mb-10">עדכון אחרון: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. כללי</h2>
          <p>
            DroneDir (&quot;אנחנו&quot;, &quot;האתר&quot;) מכבד את פרטיות המשתמשים. מסמך זה מסביר
            אילו נתונים נאספים, כיצד הם מאוחסנים ואיך הם מוגנים.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. מידע שנאסף</h2>
          <p className="mb-2">
            בשלב ה-MVP, האתר אינו דורש הרשמה ואינו אוסף מידע אישי מיוזמה. המידע הבא עשוי
            להיאסף:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>נתוני גישה אנונימיים (עמודים שנצפו, זמן שהייה) דרך כלי אנליטיקה.</li>
            <li>כתובת IP לצורכי אבטחה ומניעת שימוש לרעה.</li>
            <li>מידע שתמסרו מרצון דרך טופס יצירת קשר (כשיהיה זמין).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. מידע על עסקים</h2>
          <p>
            פרטי הספקים המופיעים במדריך (שם, טלפון, אתר) הם מידע עסקי ציבורי שנאסף ממקורות
            פתוחים. ספקים הרשומים מרצונם מסכימים לפרסום פרטיהם.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. שימוש במידע</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>שיפור חוויית המשתמש ותפעול האתר.</li>
            <li>מענה לפניות ישירות.</li>
            <li>אנו לא מוכרים מידע אישי לצדדים שלישיים.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. קובצי Cookie</h2>
          <p>
            האתר עשוי להשתמש ב-Cookie בסיסיים לצורכי פונקציונליות. אין שימוש ב-Cookie לצורכי
            פרסום ממוקד.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. זכויות המשתמש</h2>
          <p>
            ניתן לפנות אלינו לבקשת מחיקת מידע, עדכון פרטים או כל שאלה אחרת בנושא פרטיות
            דרך כתובת האימייל:{' '}
            <a href="mailto:privacy@dronedir.co.il" className="text-blue-600 hover:underline">
              privacy@dronedir.co.il
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. שינויים במדיניות</h2>
          <p>
            אנו שומרים לעצמנו את הזכות לעדכן מדיניות זו. שינויים מהותיים יפורסמו בעמוד זה
            עם תאריך עדכון חדש.
          </p>
        </section>
      </div>
    </main>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'מרכז טייסי רחפנים — ALTIV',
  description:
    'כלים, מדריכים, חשיפה והזדמנויות עסקיות לטייסי רחפנים מקצועיים בישראל. הצטרפו לקהילת הטייסים של אלטיב.',
  openGraph: {
    title: 'מרכז טייסי רחפנים — ALTIV',
    description: 'כלים, מדריכים, חשיפה והזדמנויות עסקיות לטייסי רחפנים מקצועיים בישראל.',
    locale: 'he_IL',
    type: 'website',
  },
}

const VALUE_CARDS = [
  {
    title: 'קבלו יותר חשיפה',
    description: 'הציגו את השירותים שלכם לאלפי לקוחות פוטנציאליים שמחפשים טייסי רחפן מקצועיים בישראל.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: 'השתמשו בכלים מקצועיים',
    description: 'כלי עבודה שנבנו במיוחד לטייסים: מחשבון תמחור, מחולל הצעות מחיר, צ׳קליסט לפני טיסה ועוד.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    title: 'למדו איך לצמוח',
    description: 'מדריכים מקצועיים, מאמרים וסרטוני הדרכה שיעזרו לכם לשפר את העסק, לתמחר נכון ולהגיע ללקוחות.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 10v6" />
        <path d="M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    ),
  },
  {
    title: 'מצאו הזדמנויות ושיתופי פעולה',
    description: 'לוח עבודות ייעודי לתעשיית הרחפנים — פרויקטים, שיתופי פעולה ולקוחות שמחפשים אתכם.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
]

const TOOLS = [
  {
    title: 'מחשבון תמחור שירותי רחפן',
    description: 'חשבו בדיוק כמה לגבות עבור כל טיסה — לפי שעה, פרויקט וסוג שירות.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="6" x2="16" y2="6" />
        <line x1="8" y1="10" x2="10" y2="10" /><line x1="12" y1="10" x2="14" y2="10" /><line x1="16" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="10" y2="14" /><line x1="12" y1="14" x2="14" y2="14" /><line x1="16" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="10" y2="18" /><line x1="12" y1="18" x2="14" y2="18" /><line x1="16" y1="18" x2="16" y2="18" />
      </svg>
    ),
  },
  {
    title: 'מחולל הצעות מחיר',
    description: 'צרו הצעות מחיר מקצועיות ומותאמות אישית בדקות ספורות.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: 'צ׳קליסט לפני טיסה',
    description: 'וודאו שאתם מוכנים לכל משימה — בטיחות, ציוד ורגולציה.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    title: 'מרכז רגולציה ישראלי',
    description: 'כל מה שצריך לדעת על רגולציה, רישוי וחוקי הטסת רחפנים בישראל.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'מחולל תוכן שיווקי',
    description: 'תוכן שיווקי מותאם אישית לעסק שלכם — לרשתות חברתיות, אתרים ולקוחות.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: 'לוח עבודות ושיתופי פעולה',
    description: 'מצאו הזדמנויות עסקיות, שותפים ופרויקטים בתעשיית הרחפנים.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
]

const GUIDES = [
  {
    category: 'תמחור',
    categoryColor: 'bg-[#EEF3FF] text-[#1E5DFF]',
    title: 'איך לתמחר שירותי רחפן',
    description: 'מדריך מקיף לתמחור שירותי צילום, מיפוי, בדיקות ועוד — כולל נוסחאות ודוגמאות מהשטח.',
    readTime: '8 דק׳',
  },
  {
    category: 'שיווק',
    categoryColor: 'bg-[#F0FDF4] text-[#16a34a]',
    title: 'איך להשיג לקוחות ראשונים',
    description: 'אסטרטגיות שיווק יעילות לטייסים חדשים — מאיפה מתחילים ואיך בונים בסיס לקוחות.',
    readTime: '6 דק׳',
  },
  {
    category: 'רגולציה',
    categoryColor: 'bg-[#FFF7ED] text-[#c2410c]',
    title: 'רגולציה ורישוי בישראל',
    description: 'כל מה שצריך לדעת על הטסה חוקית בישראל — רישיונות, אזורים אסורים ודרישות ביטוח.',
    readTime: '10 דק׳',
  },
  {
    category: 'עסקים',
    categoryColor: 'bg-[#F8F9FB] text-[#64748B] border border-[#E2E8F0]',
    title: 'בניית תיק עבודות מנצח',
    description: 'איך לבנות פורטפוליו שמביא לקוחות — צילומים, סרטונים, לקוחות עבר ועוד.',
    readTime: '5 דק׳',
  },
]

export default function PilotsPage() {
  return (
    <main>

      {/* ── Hero ── */}
      <section className="relative bg-[#0A0E1A] overflow-hidden">
        {/* Radar texture */}
        <div className="absolute inset-0 flex items-center justify-end pointer-events-none opacity-[0.06]" aria-hidden="true">
          <svg width="700" height="500" viewBox="0 0 700 500" fill="none" className="-ml-20">
            <circle cx="600" cy="250" r="380" stroke="#1E5DFF" strokeWidth="1" />
            <circle cx="600" cy="250" r="260" stroke="#1E5DFF" strokeWidth="0.9" />
            <circle cx="600" cy="250" r="160" stroke="#1E5DFF" strokeWidth="0.8" />
            <circle cx="600" cy="250" r="80" stroke="#1E5DFF" strokeWidth="0.7" strokeDasharray="5 3" />
            <line x1="200" y1="250" x2="700" y2="250" stroke="#1E5DFF" strokeWidth="0.5" />
            <line x1="600" y1="0" x2="600" y2="500" stroke="#1E5DFF" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <span className="inline-block mb-5 px-3 py-1.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#60a5fa] bg-white/5 border border-white/10 rounded-full">
            מרכז טייסים
          </span>
          <h1 className="text-[2.4rem] sm:text-[3rem] lg:text-[3.8rem] font-black text-white leading-[1.05] tracking-[-0.03em] mb-5 max-w-3xl">
            המרכז המקצועי<br />
            לטייסי רחפנים{' '}
            <span className="text-[#1E5DFF]">בישראל</span>
          </h1>
          <p className="text-[16px] text-white/60 leading-relaxed mb-10 max-w-xl">
            כלים, ידע, חשיפה והזדמנויות עסקיות במקום אחד. הכל שצריך
            לנהל ולצמח את עסק הרחפנים שלכם.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/add-listing"
              className="px-7 py-3.5 bg-[#1E5DFF] hover:bg-[#1650e8] text-white text-[14px] font-bold rounded-xl transition-colors text-center"
            >
              הוסף את העסק שלך
            </Link>
            <a
              href="#tools"
              className="px-7 py-3.5 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white text-[14px] font-semibold rounded-xl transition-colors text-center"
            >
              גלה כלים
            </a>
          </div>
        </div>
      </section>

      {/* ── Value props ── */}
      <section className="bg-[#F8F9FB] border-b border-[#E2E8F0] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-2">
              למה אלטיב
            </p>
            <h2 className="text-2xl font-black text-[#0A0E1A] tracking-tight">
              הכל במקום אחד לטייסים מקצועיים
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUE_CARDS.map((card) => (
              <div
                key={card.title}
                className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] flex items-center justify-center text-[#1E5DFF] shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#0A0E1A] mb-1.5 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools grid ── */}
      <section id="tools" className="bg-white border-b border-[#E2E8F0] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-2">
                ארגז הכלים
              </p>
              <h2 className="text-2xl font-black text-[#0A0E1A] tracking-tight">כלים מקצועיים</h2>
              <p className="text-sm text-[#64748B] mt-1">כל הכלים שצריך לנהל ולצמח את עסק הרחפנים</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {TOOLS.map((tool) => (
              <div
                key={tool.title}
                className="group relative bg-white rounded-xl p-6 border border-[#E2E8F0] hover:border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex gap-4 items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] border border-[#E2E8F0] flex items-center justify-center text-[#64748B] shrink-0">
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-[14px] font-bold text-[#0A0E1A] leading-snug">
                      {tool.title}
                    </h3>
                    <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 bg-[#F8F9FB] border border-[#E2E8F0] text-[#64748B] rounded-full whitespace-nowrap">
                      בקרוב
                    </span>
                  </div>
                  <p className="text-[12px] text-[#64748B] leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning / Guides ── */}
      <section className="bg-[#F8F9FB] border-b border-[#E2E8F0] py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-2">
                ידע ומדריכים
              </p>
              <h2 className="text-2xl font-black text-[#0A0E1A] tracking-tight">למדו איך לצמוח</h2>
              <p className="text-sm text-[#64748B] mt-1">מדריכים פרקטיים שנכתבו לטייסים ולעסקים</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GUIDES.map((guide) => (
              <div
                key={guide.title}
                className="bg-white rounded-xl p-6 border border-[#E2E8F0] shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col gap-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${guide.categoryColor}`}>
                    {guide.category}
                  </span>
                  <span className="text-[11px] text-[#64748B]">{guide.readTime} קריאה</span>
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-[#0A0E1A] mb-1.5 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-[13px] text-[#64748B] leading-relaxed">
                    {guide.description}
                  </p>
                </div>
                <div className="mt-auto pt-2 border-t border-[#E2E8F0]">
                  <span className="text-[12px] font-medium text-[#64748B] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E2E8F0] inline-block" />
                    בקרוב
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative bg-[#0A0E1A] py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]" aria-hidden="true">
          <svg width="900" height="400" viewBox="0 0 900 400" fill="none">
            <circle cx="450" cy="200" r="310" stroke="#3b82f6" strokeWidth="1" />
            <circle cx="450" cy="200" r="230" stroke="#3b82f6" strokeWidth="0.8" />
            <circle cx="450" cy="200" r="155" stroke="#3b82f6" strokeWidth="0.7" />
            <circle cx="450" cy="200" r="85" stroke="#3b82f6" strokeWidth="0.6" />
            <line x1="140" y1="200" x2="760" y2="200" stroke="#3b82f6" strokeWidth="0.5" />
            <line x1="450" y1="0" x2="450" y2="400" stroke="#3b82f6" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[0.22em] text-[#1E5DFF] uppercase mb-5">
            הצטרפו לאלטיב
          </p>
          <h2 className="text-3xl sm:text-[2.6rem] font-black text-white leading-[1.05] tracking-[-0.02em] mb-5">
            רוצים להופיע באלטיב?
          </h2>
          <p className="text-[15px] text-white/60 leading-relaxed mb-10 max-w-md mx-auto">
            צרו פרופיל מקצועי וקבלו חשיפה בפני לקוחות שמחפשים שירותי
            רחפן בישראל.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/add-listing"
              className="px-7 py-3.5 bg-[#1E5DFF] hover:bg-[#1650e8] text-white font-bold text-[14px] rounded-xl transition-colors"
            >
              צור פרופיל עסקי
            </Link>
            <Link
              href="/contact"
              className="px-7 py-3.5 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-semibold text-[14px] rounded-xl transition-colors"
            >
              דברו איתנו
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}

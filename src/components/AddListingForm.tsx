'use client'

import { useState } from 'react'
import { categories } from '@/src/data/categories'
import { locations } from '@/src/data/locations'

type State = 'idle' | 'submitting' | 'success' | 'error'

const INPUT =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[15px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-colors'

const LABEL = 'block text-sm font-semibold text-gray-700 mb-1.5'

export default function AddListingForm() {
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('submitting')
    setErrorMsg('')

    const formId = process.env.NEXT_PUBLIC_FORMSPREE_ADD_LISTING_ID
    const data = Object.fromEntries(new FormData(e.currentTarget))

    try {
      if (!formId) {
        await new Promise((r) => setTimeout(r, 700))
        setState('success')
        return
      }

      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        setState('success')
      } else {
        const json = await res.json().catch(() => ({}))
        setErrorMsg(json?.errors?.[0]?.message ?? 'שגיאה בשליחה. נסו שנית.')
        setState('error')
      }
    } catch {
      setErrorMsg('שגיאת חיבור. בדקו את החיבור לאינטרנט ונסו שנית.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="flex flex-col items-center text-center py-14 px-6">
        <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-[#0a1628] mb-2">הגשתכם התקבלה</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs">
          ניצור קשר בקרוב לאישור ופרסום הפרופיל שלכם. תהליך הסקירה לוקח עד 5 ימי עסקים.
        </p>
        <button
          onClick={() => setState('idle')}
          className="text-[13px] text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          שלחו הגשה נוספת
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5" aria-label="טופס הוספת עסק">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="add-name" className={LABEL}>שם העסק <span className="text-red-400">*</span></label>
          <input id="add-name" name="שם העסק" type="text" required className={INPUT} placeholder="שם העסק שלכם" />
        </div>
        <div>
          <label htmlFor="add-phone" className={LABEL}>טלפון <span className="text-red-400">*</span></label>
          <input id="add-phone" name="טלפון" type="tel" required autoComplete="tel" className={INPUT} placeholder="050-0000000" dir="ltr" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="add-category" className={LABEL}>קטגוריה ראשית <span className="text-red-400">*</span></label>
          <select id="add-category" name="קטגוריה" required className={INPUT}>
            <option value="">בחרו קטגוריה</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.labelHe}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="add-city" className={LABEL}>עיר פעילות ראשית <span className="text-red-400">*</span></label>
          <select id="add-city" name="עיר" required className={INPUT}>
            <option value="">בחרו עיר</option>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>{l.labelHe}</option>
            ))}
            <option value="other">אחר</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="add-website" className={LABEL}>אתר אינטרנט</label>
        <input id="add-website" name="אתר" type="url" className={INPUT} placeholder="https://www.example.co.il" dir="ltr" />
      </div>

      <div>
        <label htmlFor="add-description" className={LABEL}>תיאור קצר של השירות <span className="text-red-400">*</span></label>
        <textarea
          id="add-description"
          name="תיאור"
          rows={4}
          required
          minLength={30}
          className={INPUT + ' resize-none'}
          placeholder="ספרו בקצרה מה השירות שאתם מציעים, לאיזה לקוחות ובאיזה אזורים..."
        />
        <p className="text-[12px] text-gray-400 mt-1">לפחות 30 תווים</p>
      </div>

      <div className="pt-1">
        <p className="text-sm font-semibold text-gray-700 mb-3">קישורים נוספים (אופציונלי)</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="add-logo" className={LABEL}>קישור ללוגו</label>
            <input id="add-logo" name="קישור ללוגו" type="url" className={INPUT} placeholder="https://example.com/logo.png" dir="ltr" />
          </div>
          <div>
            <label htmlFor="add-portfolio" className={LABEL}>תיק עבודות</label>
            <input id="add-portfolio" name="תיק עבודות" type="url" className={INPUT} placeholder="https://example.com/portfolio" dir="ltr" />
          </div>
          <div>
            <label htmlFor="add-instagram" className={LABEL}>אינסטגרם</label>
            <input id="add-instagram" name="אינסטגרם" type="url" className={INPUT} placeholder="https://instagram.com/yourhandle" dir="ltr" />
          </div>
          <div>
            <label htmlFor="add-youtube" className={LABEL}>יוטיוב</label>
            <input id="add-youtube" name="יוטיוב" type="url" className={INPUT} placeholder="https://youtube.com/@yourchannel" dir="ltr" />
          </div>
        </div>
      </div>

      {state === 'error' && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[15px] rounded-xl transition-colors"
      >
        {state === 'submitting' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            שולח...
          </span>
        ) : 'שלחו את ההגשה'}
      </button>

      <p className="text-[12px] text-gray-400 text-center">
        שדות המסומנים ב-<span className="text-red-400">*</span> הם חובה.
        הגשתכם תיסקר ותאושר בתוך 5 ימי עסקים.
      </p>

    </form>
  )
}

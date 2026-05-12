'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/services',  label: 'מצא שירותי רחפן' },
  { href: '/pilots',    label: 'לטייסי רחפנים',   pilot: true },
  { href: '/guides',    label: 'מדריכים' },
  { href: '/pricing',   label: 'מחירים' },
  { href: '/contact',   label: 'צור קשר' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/altiv-logo.svg" alt="ALTIV" className="h-16 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="ניווט ראשי">
          {NAV.map((item) =>
            item.pilot ? (
              <Link
                key={item.href}
                href={item.href}
                className="mx-2 text-[13px] font-semibold text-[#1E5DFF] bg-[#EEF3FF] border border-[#C7D7FF] px-3 py-1.5 rounded-lg hover:bg-[#dde8ff] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-[13px] font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? 'text-[#0A0E1A] bg-[#F8F9FB]'
                    : 'text-[#64748B] hover:text-[#0A0E1A] hover:bg-[#F8F9FB]'
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/add-listing"
            className="hidden sm:block shrink-0 px-4 py-2.5 bg-[#1E5DFF] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1650e8] transition-colors"
          >
            הוסף את החברה שלך
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-[#F8F9FB] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
            aria-expanded={open}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0E1A" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden bg-white border-t border-[#E2E8F0] px-6 py-4 flex flex-col" aria-label="ניווט נייד">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`py-3.5 text-[14px] font-medium border-b border-[#F8F9FB] last:border-0 transition-colors ${
                item.pilot
                  ? 'text-[#1E5DFF] font-semibold'
                  : 'text-[#64748B] hover:text-[#0A0E1A]'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/add-listing"
            onClick={() => setOpen(false)}
            className="mt-4 px-4 py-3 bg-[#1E5DFF] text-white text-[13px] font-semibold rounded-lg text-center hover:bg-[#1650e8] transition-colors"
          >
            הוסף את החברה שלך
          </Link>
        </nav>
      )}
    </header>
  )
}

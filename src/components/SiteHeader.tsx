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
    <header className="sticky top-0 z-10 bg-black">
      <div className="max-w-7xl mx-auto px-6 h-11 flex items-center justify-between">

        <Link href="/" className="flex items-center shrink-0" onClick={() => setOpen(false)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/altiv-logo-white.png" alt="ALTIV" className="h-6 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="ניווט ראשי">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-[12px] tracking-[-0.12px] transition-colors ${
                item.pilot
                  ? 'text-[#2997ff] hover:text-white'
                  : pathname === item.href
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/add-listing"
            className="hidden sm:block shrink-0 px-4 py-1.5 bg-[#0066cc] text-white text-[12px] font-medium rounded-full tracking-[-0.12px]"
          >
            הוסף את החברה שלך
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'סגור תפריט' : 'פתח תפריט'}
            aria-expanded={open}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
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
        <nav className="md:hidden bg-black border-t border-white/10 px-6 py-4 flex flex-col" aria-label="ניווט נייד">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`py-3.5 text-[14px] border-b border-white/10 last:border-0 ${
                item.pilot ? 'text-[#2997ff]' : 'text-white/70'
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/add-listing"
            onClick={() => setOpen(false)}
            className="mt-4 px-4 py-3 bg-[#0066cc] text-white text-[13px] font-medium rounded-full text-center"
          >
            הוסף את החברה שלך
          </Link>
        </nav>
      )}
    </header>
  )
}

import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        <Link href="/" className="flex items-center shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/altiv-logo.svg"
            alt="ALTIV"
            className="h-16 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link href="/services" className="text-[13px] font-medium text-[#64748B] hover:text-[#0A0E1A] transition-colors">
            אינדקס
          </Link>
          <Link href="/about" className="text-[13px] font-medium text-[#64748B] hover:text-[#0A0E1A] transition-colors">
            אודות
          </Link>
          <Link href="/add-listing" className="text-[13px] font-medium text-[#64748B] hover:text-[#0A0E1A] transition-colors">
            הוספת חברה
          </Link>
          <Link href="/blog" className="text-[13px] font-medium text-[#64748B] hover:text-[#0A0E1A] transition-colors">
            בלוג
          </Link>
          <Link href="/contact" className="text-[13px] font-medium text-[#64748B] hover:text-[#0A0E1A] transition-colors">
            צור קשר
          </Link>
        </nav>

        <Link
          href="/add-listing"
          className="shrink-0 px-4 py-2.5 bg-[#1E5DFF] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1650e8] transition-colors"
        >
          הוסף את החברה שלך
        </Link>

      </div>
    </header>
  )
}

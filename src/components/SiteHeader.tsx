import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100">
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
          <Link href="/services" className="text-[13px] font-medium text-gray-500 hover:text-black transition-colors">
            אינדקס
          </Link>
          <Link href="/about" className="text-[13px] font-medium text-gray-500 hover:text-black transition-colors">
            אודות
          </Link>
          <Link href="/add-listing" className="text-[13px] font-medium text-gray-500 hover:text-black transition-colors">
            הוספת חברה
          </Link>
          <Link href="/blog" className="text-[13px] font-medium text-gray-500 hover:text-black transition-colors">
            בלוג
          </Link>
          <Link href="/contact" className="text-[13px] font-medium text-gray-500 hover:text-black transition-colors">
            צור קשר
          </Link>
        </nav>

        <Link
          href="/add-listing"
          className="shrink-0 px-4 py-2.5 bg-blue-600 text-white text-[13px] font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          הוסף את החברה שלך
        </Link>

      </div>
    </header>
  )
}

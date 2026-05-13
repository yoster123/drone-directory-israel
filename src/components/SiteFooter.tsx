import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-[#f5f5f7] py-14 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row items-start justify-between gap-10 mb-10">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/altiv-logo.svg" alt="ALTIV" className="h-6 w-auto mb-3" />
            <p className="text-[14px] text-[#7a7a7a] max-w-xs leading-relaxed">
              פלטפורמת הרחפנים המובילה בישראל
            </p>
          </div>

          <div className="flex gap-12 sm:gap-16">
            <nav aria-label="שירותים">
              <p className="text-[14px] font-semibold text-[#1d1d1f] mb-2">שירותים</p>
              <Link href="/services" className="block text-[17px] text-[#1d1d1f] hover:underline leading-[2.41]">מצא שירותי רחפן</Link>
              <Link href="/pilots" className="block text-[17px] text-[#1d1d1f] hover:underline leading-[2.41]">לטייסי רחפנים</Link>
              <Link href="/add-listing" className="block text-[17px] text-[#1d1d1f] hover:underline leading-[2.41]">הוספת חברה</Link>
            </nav>

            <nav aria-label="חברה">
              <p className="text-[14px] font-semibold text-[#1d1d1f] mb-2">חברה</p>
              <Link href="/about" className="block text-[17px] text-[#1d1d1f] hover:underline leading-[2.41]">אודות</Link>
              <Link href="/contact" className="block text-[17px] text-[#1d1d1f] hover:underline leading-[2.41]">צור קשר</Link>
              <Link href="/privacy" className="block text-[17px] text-[#1d1d1f] hover:underline leading-[2.41]">פרטיות</Link>
              <Link href="/terms" className="block text-[17px] text-[#1d1d1f] hover:underline leading-[2.41]">תנאי שימוש</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-[#e0e0e0] pt-6">
          <p className="text-[12px] text-[#6e6e73]">© 2026 ALTIV. כל הזכויות שמורות.</p>
        </div>

      </div>
    </footer>
  )
}

import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-[#0A0E1A] py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">
          <div>
            <p className="font-bold text-white text-lg mb-2">ALTIV</p>
            <p className="text-[#64748B] text-sm max-w-xs leading-relaxed">
              אינדקס שירותי הרחפן המקצועי של ישראל
            </p>
          </div>
          <div className="flex gap-12">
            <nav className="flex flex-col gap-3" aria-label="Footer navigation primary">
              <Link href="/services" className="text-[#64748B] hover:text-white transition-colors text-sm">אינדקס</Link>
              <Link href="/about" className="text-[#64748B] hover:text-white transition-colors text-sm">אודות</Link>
              <Link href="/blog" className="text-[#64748B] hover:text-white transition-colors text-sm">בלוג</Link>
            </nav>
            <nav className="flex flex-col gap-3" aria-label="Footer navigation secondary">
              <Link href="/add-listing" className="text-[#64748B] hover:text-white transition-colors text-sm">הוספת חברה</Link>
              <Link href="/contact" className="text-[#64748B] hover:text-white transition-colors text-sm">צור קשר</Link>
              <Link href="/privacy" className="text-[#64748B] hover:text-white transition-colors text-sm">פרטיות</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#64748B] text-sm">© 2026 ALTIV. כל הזכויות שמורות.</p>
          <Link href="/terms" className="text-[#64748B] hover:text-white text-sm transition-colors">תנאי שימוש</Link>
        </div>

      </div>
    </footer>
  )
}

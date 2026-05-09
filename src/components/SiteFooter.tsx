import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-semibold text-black">ALTIV</p>
        <nav className="flex gap-6" aria-label="Footer navigation">
          <Link href="/about" className="text-gray-400 hover:text-black transition-colors">אודות</Link>
          <Link href="/contact" className="text-gray-400 hover:text-black transition-colors">צור קשר</Link>
          <Link href="/privacy" className="text-gray-400 hover:text-black transition-colors">פרטיות</Link>
          <Link href="/terms" className="text-gray-400 hover:text-black transition-colors">תנאים</Link>
        </nav>
        <p className="text-gray-400">© 2026 ALTIV</p>
      </div>
    </footer>
  )
}

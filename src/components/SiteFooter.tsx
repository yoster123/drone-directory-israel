import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-10 px-4 sm:px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="font-bold text-white">DroneDir — מדריך שירותי הרחפן של ישראל</p>
        <nav className="flex gap-6" aria-label="Footer navigation">
          <Link href="/about" className="hover:text-white transition-colors">אודות</Link>
          <Link href="/contact" className="hover:text-white transition-colors">צור קשר</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">פרטיות</Link>
          <Link href="/terms" className="hover:text-white transition-colors">תנאים</Link>
        </nav>
        <p>© 2026 DroneDir</p>
      </div>
    </footer>
  )
}

import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-700 tracking-tight">
          DroneDir 🚁
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/services" className="text-gray-600 hover:text-blue-600 transition-colors">
            שירותים
          </Link>
          <Link
            href="/for-providers"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            לבעלי עסקים
          </Link>
        </nav>
      </div>
    </header>
  )
}

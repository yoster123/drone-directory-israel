import type { Metadata } from 'next'
import { Heebo } from 'next/font/google'
import SiteHeader from '@/src/components/SiteHeader'
import SiteFooter from '@/src/components/SiteFooter'
import './globals.css'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-heebo',
})

export const metadata: Metadata = {
  title: 'ALTIV — מדריך שירותי הרחפן של ישראל',
  description:
    'מצאו ספקי שירותי רחפן מורשים בישראל — צילום אווירי, מיפוי, בדיקות, חקלאות, FPV ועוד.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}

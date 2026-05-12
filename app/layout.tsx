import type { Metadata } from 'next'
import { Assistant, Inter } from 'next/font/google'
import SiteHeader from '@/src/components/SiteHeader'
import SiteFooter from '@/src/components/SiteFooter'
import { SITE_URL } from '@/src/lib/config'
import './globals.css'

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-assistant',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'ALTIV — מדריך שירותי הרחפן של ישראל',
  description:
    'מצאו ספקי שירותי רחפן מורשים בישראל — צילום אווירי, מיפוי, בדיקות, חקלאות, FPV ועוד.',
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}

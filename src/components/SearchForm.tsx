'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import type { Category, Location } from '@/src/types/listing'

interface Props {
  categories: Category[]
  locations: Location[]
  className?: string
}

export default function SearchForm({ categories, locations, className }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [service, setService] = useState('')
  const [city, setCity] = useState('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    let href = '/services'
    if (service && city) href = `/services/${service}/${city}`
    else if (service) href = `/services/${service}`
    else if (city) href = `/cities/${city}`

    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className ?? 'w-full'}
      role="search"
      aria-label="חיפוש שירותי רחפן"
    >
      <div className="flex flex-col sm:flex-row items-stretch rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">

        <label htmlFor="search-service" className="sr-only">בחרו שירות</label>
        <select
          id="search-service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          disabled={isPending}
          className="flex-1 px-5 py-4 bg-transparent text-[#0A0E1A] text-[15px] focus:outline-none focus:bg-[#F8F9FB]/60 disabled:opacity-60 border-b sm:border-b-0 border-[#E2E8F0] cursor-pointer appearance-none"
        >
          <option value="">בחרו שירות</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>{c.labelHe}</option>
          ))}
        </select>

        <span className="hidden sm:block w-px bg-gray-100 self-stretch" aria-hidden="true" />

        <label htmlFor="search-city" className="sr-only">בחרו עיר</label>
        <select
          id="search-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isPending}
          className="sm:w-44 px-5 py-4 bg-transparent text-[#64748B] text-[15px] focus:outline-none focus:bg-[#F8F9FB]/60 disabled:opacity-60 border-b sm:border-b-0 border-[#E2E8F0] cursor-pointer appearance-none"
        >
          <option value="">כל הארץ</option>
          {locations.map((l) => (
            <option key={l.slug} value={l.slug}>{l.labelHe}</option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="px-8 py-4 bg-[#1E5DFF] hover:bg-[#1650e8] text-white font-bold text-[15px] transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isPending ? 'טוען...' : 'חפש ספקים'}
        </button>

      </div>
    </form>
  )
}

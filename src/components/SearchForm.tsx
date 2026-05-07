'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import type { Category, Location } from '@/src/types/listing'

interface Props {
  categories: Category[]
  locations: Location[]
}

export default function SearchForm({ categories, locations }: Props) {
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
      className="mt-9 max-w-2xl mx-auto"
      role="search"
      aria-label="חיפוש שירותי רחפן"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="search-service" className="sr-only">
          בחרו שירות
        </label>
        <select
          id="search-service"
          value={service}
          onChange={(e) => setService(e.target.value)}
          disabled={isPending}
          className="flex-1 px-4 py-3.5 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-base disabled:opacity-60"
        >
          <option value="">כל השירותים</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.labelHe}
            </option>
          ))}
        </select>

        <label htmlFor="search-city" className="sr-only">
          בחרו עיר
        </label>
        <select
          id="search-city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isPending}
          className="sm:w-44 px-4 py-3.5 rounded-lg text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-base disabled:opacity-60"
        >
          <option value="">כל הארץ</option>
          {locations.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.labelHe}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={isPending}
          aria-busy={isPending}
          className="px-7 py-3.5 bg-blue-500 hover:bg-blue-400 rounded-lg font-bold text-base transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? 'טוען...' : 'חיפוש במדריך'}
        </button>
      </div>
    </form>
  )
}

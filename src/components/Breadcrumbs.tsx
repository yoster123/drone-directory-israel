import Link from 'next/link'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <nav aria-label="breadcrumb" className="mb-6">
      <ol className="flex items-center flex-wrap gap-1.5 text-sm text-[#7a7a7a]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-[#e0e0e0] select-none">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-[#0066cc] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#1d1d1f] font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

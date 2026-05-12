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
      <ol className="flex items-center flex-wrap gap-1.5 text-sm text-[#64748B]">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-[#E2E8F0] select-none">/</span>}
            {item.href ? (
              <Link href={item.href} className="hover:text-[#1E5DFF] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#0A0E1A] font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

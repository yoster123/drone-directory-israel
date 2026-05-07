interface Props {
  badge?: string
  title: string
  subtitle?: string
}

export default function PageHeader({ badge, title, subtitle }: Props) {
  return (
    <div className="mb-8">
      {badge && (
        <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-3">
          {badge}
        </span>
      )}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-gray-500 text-base leading-relaxed max-w-2xl">{subtitle}</p>
      )}
    </div>
  )
}

interface Props {
  title: string
  description?: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
}

export default function CTABox({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: Props) {
  return (
    <section className="mt-16 py-12 px-6 bg-slate-900 text-white rounded-2xl text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">{title}</h2>
      {description && (
        <p className="text-slate-300 mb-6 text-sm sm:text-base leading-relaxed">{description}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={primaryHref}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-colors"
        >
          {primaryLabel}
        </a>
        {secondaryLabel && secondaryHref && (
          <a
            href={secondaryHref}
            className="px-6 py-3 border border-white/30 hover:bg-white/10 rounded-lg font-semibold transition-colors"
          >
            {secondaryLabel}
          </a>
        )}
      </div>
    </section>
  )
}

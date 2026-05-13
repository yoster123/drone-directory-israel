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
    <section className="mt-16 py-12 px-6 bg-[#272729] text-white rounded-[18px] text-center">
      <h2 className="text-xl sm:text-2xl font-bold mb-2">{title}</h2>
      {description && (
        <p className="text-[#cccccc] mb-6 text-sm sm:text-base leading-relaxed">{description}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <a
          href={primaryHref}
          className="px-6 py-3 bg-[#0066cc] rounded-full font-semibold transition-colors"
        >
          {primaryLabel}
        </a>
        {secondaryLabel && secondaryHref && (
          <a
            href={secondaryHref}
            className="px-6 py-3 border border-white/20 hover:bg-white/10 rounded-full font-semibold transition-colors"
          >
            {secondaryLabel}
          </a>
        )}
      </div>
    </section>
  )
}

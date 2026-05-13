'use client'

import Image from 'next/image'
import { useState } from 'react'

const AVATAR_COLORS = [
  'bg-[#e8f0fb] text-[#0066cc]',
  'bg-[#f5f5f7] text-[#7a7a7a]',
  'bg-[#e8f0fb] text-[#0066cc]',
  'bg-[#f5f5f7] text-[#7a7a7a]',
  'bg-[#e8f0fb] text-[#0066cc]',
  'bg-[#f5f5f7] text-[#7a7a7a]',
]

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) return words[0].slice(0, 2)
  return words[0][0] + words[1][0]
}

function avatarColor(id: string): string {
  let h = 5381
  for (let i = 0; i < id.length; i++) h = ((h << 5) + h) ^ id.charCodeAt(i)
  return AVATAR_COLORS[(h >>> 0) % AVATAR_COLORS.length]
}

interface Props {
  name: string
  id: string
  logoUrl?: string | null
  sizeClass?: string
  roundedClass?: string
  textSizeClass?: string
}

export default function ListingLogo({
  name,
  id,
  logoUrl,
  sizeClass = 'w-10 h-10',
  roundedClass = 'rounded-xl',
  textSizeClass = 'text-sm',
}: Props) {
  const [imgFailed, setImgFailed] = useState(false)

  if (logoUrl && !imgFailed) {
    return (
      <div className={`shrink-0 ${sizeClass} ${roundedClass} relative overflow-hidden bg-white border border-[#e0e0e0]`}>
        <Image
          src={logoUrl}
          alt={`לוגו ${name}`}
          fill
          sizes="56px"
          className="object-contain p-1"
          onError={() => setImgFailed(true)}
        />
      </div>
    )
  }

  return (
    <div className={`shrink-0 ${sizeClass} ${roundedClass} flex items-center justify-center ${textSizeClass} font-bold select-none ${avatarColor(id)}`}>
      {getInitials(name)}
    </div>
  )
}

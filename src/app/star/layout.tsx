'use client'

import StarBg from '@/components/StarBg'

export default function StarLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StarBg ignoreWeight={600} ignoreHeight={500}>
      {children}
    </StarBg>
  )
}

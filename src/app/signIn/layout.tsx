'use client'

import StarBg from '@/components/StarBg'

export default function SignIn({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <StarBg ignoreWeight={420} ignoreHeight={432}>
      {children}
    </StarBg>
  )
}

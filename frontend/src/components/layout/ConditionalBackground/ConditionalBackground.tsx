'use client'

import { usePathname } from 'next/navigation'
import ThreeBackground from '@/components/animations/ThreeBackground'
import PageBackground from '@/components/animations/PageBackground'

export const ConditionalBackground: React.FC = () => {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return isHomePage ? <ThreeBackground /> : <PageBackground />
}

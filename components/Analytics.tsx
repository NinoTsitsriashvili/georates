'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLanguage } from './LanguageProvider'
import { trackPageView } from '@/lib/analytics'

/**
 * Analytics component that tracks page views automatically
 */
export default function Analytics() {
  const pathname = usePathname()
  const { locale } = useLanguage()

  useEffect(() => {
    // Track page view when pathname or language changes
    if (pathname) {
      const title = typeof document !== 'undefined' ? document.title : undefined
      trackPageView(pathname, title, locale)
    }
  }, [pathname, locale])

  // This component doesn't render anything
  return null
}


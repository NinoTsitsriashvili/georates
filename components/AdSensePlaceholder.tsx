'use client'

import { useEffect } from 'react'

interface AdSensePlaceholderProps {
  position: 'header' | 'sidebar' | 'footer'
}

export default function AdSensePlaceholder({ position }: AdSensePlaceholderProps) {
  useEffect(() => {
    // Initialize AdSense ads
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }
  }, [])

  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID

  // Placeholder dimensions based on position
  const dimensions: Record<string, { width: string; height: string }> = {
    header: { width: '728', height: '90' },
    sidebar: { width: '300', height: '250' },
    footer: { width: '728', height: '90' },
  }

  const { width, height } = dimensions[position] || { width: '300', height: '250' }

  if (!adSenseId) {
    // Show placeholder during development
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm"
        style={{ width: `${width}px`, height: `${height}px`, minHeight: `${height}px` }}
      >
        <div className="text-center p-4">
          <div className="mb-2">📢</div>
          <div>AdSense Placeholder</div>
          <div className="text-xs mt-1">{position}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: `${width}px`, height: `${height}px` }}
        data-ad-client={adSenseId}
        data-ad-slot={`${position}-slot`}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}


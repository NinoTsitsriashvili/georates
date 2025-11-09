'use client'

import { ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  id?: string
}

export default function Section({ children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`py-6 sm:py-8 lg:py-12 ${className}`}>
      <div className="container mx-auto px-3 sm:px-4">
        {children}
      </div>
    </section>
  )
}


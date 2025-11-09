'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageProvider'
import Link from 'next/link'
import type { PetrolPrice } from '@/lib/db'

export default function PetrolPricesCard() {
  const { t } = useLanguage()
  const [prices, setPrices] = useState<PetrolPrice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    try {
      const res = await fetch('/api/petrol-prices')
      const data = await res.json()
      setPrices(data.prices || [])
    } catch (error) {
      console.error('Error fetching prices:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFuelTypeName = (type: string) => {
    const names: Record<string, string> = {
      regular: t('petrolPrices.regular'),
      premium: t('petrolPrices.premium'),
      super: t('petrolPrices.super'),
      diesel: t('petrolPrices.diesel'),
    }
    return names[type] || type
  }

  const groupedPrices = prices.reduce((acc, price) => {
    if (!acc[price.company_name]) {
      acc[price.company_name] = []
    }
    acc[price.company_name].push(price)
    return acc
  }, {} as Record<string, PetrolPrice[]>)

  if (loading) {
    return (
      <div className="bg-[var(--color-card-bg)] rounded-card shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-light dark:bg-neutral-dark rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-neutral-light dark:bg-neutral-dark rounded-card"></div>
            <div className="h-24 bg-neutral-light dark:bg-neutral-dark rounded-card"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-card-bg)] rounded-card shadow-card p-6 transition-all duration-base hover:shadow-card-hover h-full" id="petrol">
      <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        {t('petrolPrices.title')}
      </h2>

      <div className="space-y-4 mb-6">
        {Object.entries(groupedPrices).map(([company, companyPrices]) => (
          <div
            key={company}
            className="border border-[var(--color-border)] rounded-card p-5 bg-[var(--color-accent-bg)] transition-all duration-base hover:shadow-card"
          >
            <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-4">
              {company}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {companyPrices.map((price) => (
                <div key={`${company}-${price.fuel_type}`} className="text-center">
                  <div className="text-[12px] text-[var(--color-text-secondary)] mb-2">
                    {getFuelTypeName(price.fuel_type)}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {price.price.toFixed(2)}
                  </div>
                  <div className="text-[12px] text-[var(--color-text-secondary)]">
                    {t('petrolPrices.perLiter')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {prices.length === 0 && (
        <div className="text-center text-[var(--color-text-secondary)] py-12 text-[15px]">
          {t('common.loading')}
        </div>
      )}

      {prices.length > 0 && (
        <div className="flex justify-center mt-6">
          <Link
            href="/petrol"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-hover shadow-card hover:shadow-card-hover text-[15px]"
          >
            {t('petrolPrices.viewAllDetails')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  )
}

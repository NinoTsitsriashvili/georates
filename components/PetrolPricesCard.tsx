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

  // Group prices by company
  const groupedPrices = prices.reduce((acc, price) => {
    if (!acc[price.company_name]) {
      acc[price.company_name] = []
    }
    acc[price.company_name].push(price)
    return acc
  }, {} as Record<string, PetrolPrice[]>)

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-20 sm:h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 h-full" id="petrol">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
        {t('petrolPrices.title')}
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {Object.entries(groupedPrices).map(([company, companyPrices]) => (
          <div
            key={company}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/30"
          >
            <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white mb-4">
              {company}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {companyPrices.map((price) => (
                <div key={`${company}-${price.fuel_type}`} className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {getFuelTypeName(price.fuel_type)}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {price.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {t('petrolPrices.perLiter')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* View All Details Button */}
      <div className="flex justify-center mt-6 sm:mt-8">
        <Link
          href="/petrol"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg"
        >
          {t('petrolPrices.viewAllDetails')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {prices.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
          {t('common.loading')}
        </div>
      )}
    </div>
  )
}


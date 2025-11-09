'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import Link from 'next/link'
import Header from '@/components/Header'
import type { PetrolPrice } from '@/lib/db'

export default function PetrolPricesPage() {
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

  // Group prices by fuel type for comparison
  const pricesByType = prices.reduce((acc, price) => {
    if (!acc[price.fuel_type]) {
      acc[price.fuel_type] = []
    }
    acc[price.fuel_type].push(price)
    return acc
  }, {} as Record<string, PetrolPrice[]>)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6 sm:py-8 lg:py-10">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('nav.petrolPrices')}
        </Link>

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('petrolPrices.title')} - {t('petrolPrices.viewAllDetails')}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {t('petrolPrices.title')} {t('common.lastUpdate')}
          </p>
        </div>

        {/* Prices by Company */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('petrolPrices.title')} {t('petrolPrices.company')}
          </h2>
          
          <div className="space-y-5 sm:space-y-6">
            {Object.entries(groupedPrices).map(([company, companyPrices]) => (
              <div
                key={company}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/30"
              >
                <h3 className="font-semibold text-xl sm:text-2xl text-gray-900 dark:text-white mb-5">
                  {company}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                  {companyPrices.map((price) => (
                    <div key={`${company}-${price.fuel_type}`} className="text-center bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-2">
                        {getFuelTypeName(price.fuel_type)}
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                        {price.price.toFixed(2)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                        {t('petrolPrices.perLiter')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Comparison by Fuel Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {t('petrolPrices.price')} {t('petrolPrices.company')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {Object.entries(pricesByType).map(([fuelType, typePrices]) => {
              const sortedPrices = [...typePrices].sort((a, b) => a.price - b.price)
              const minPrice = sortedPrices[0]?.price || 0
              const maxPrice = sortedPrices[sortedPrices.length - 1]?.price || 0
              
              return (
                <div key={fuelType} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/30">
                  <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white mb-4 text-center">
                    {getFuelTypeName(fuelType)}
                  </h3>
                  
                  <div className="space-y-3">
                    {sortedPrices.map((price) => (
                      <div key={`${price.company_name}-${fuelType}`} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {price.company_name}
                        </span>
                        <span className="text-base font-bold text-primary-600 dark:text-primary-400">
                          {price.price.toFixed(2)} GEL
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  {sortedPrices.length > 1 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{t('petrolPrices.price')}:</span>
                        <span>{minPrice.toFixed(2)} - {maxPrice.toFixed(2)} GEL</span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageProvider'
import Link from 'next/link'
import type { ExchangeRate } from '@/lib/db'

interface RateWithChange extends ExchangeRate {
  previous_rate?: number
}

export default function ExchangeRatesCard() {
  const { t } = useLanguage()
  const [rates, setRates] = useState<RateWithChange[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRates(true) // Initial load
    // Refresh rates every 30 seconds to catch database updates quickly
    const interval = setInterval(() => fetchRates(false), 30 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchRates = async (isInitialLoad: boolean = false) => {
    try {
      // Add cache-busting parameter to ensure fresh data
      // Use timestamp to bypass browser cache
      const res = await fetch(`/api/exchange-rates?t=${Date.now()}`, {
        cache: 'no-store', // Disable caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      })
      const data = await res.json()
      
      console.log('[ExchangeRatesCard] Fetched rates:', data)
      
      if (data.success && data.rates) {
        // Log debug info if available
        if (data.debug) {
          console.log('[ExchangeRatesCard] Debug info:', data.debug)
        }
        
        // Log each rate with its previous_rate for debugging
        data.rates.forEach((rate: any) => {
          if (rate._debug) {
            console.log(`[ExchangeRatesCard] ${rate.currency_code}:`, {
              today: rate.official_rate,
              yesterday: rate._debug.yesterdayRate,
              previous_rate: rate.previous_rate,
              change: rate._debug.change,
              changePercent: rate._debug.changePercent,
            })
          }
        })
        
        setRates(data.rates)
      } else {
        // Use fallback rates if API fails
        setRates(getFallbackRates())
      }
    } catch (error) {
      console.error('Error fetching rates:', error)
      // Use fallback rates on error
      setRates(getFallbackRates())
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      }
    }
  }

  // Fallback rates function
  const getFallbackRates = (): RateWithChange[] => {
    const today = new Date().toISOString().split('T')[0]
    return [
      {
        currency_code: 'USD',
        buy_rate: 2.65,
        sell_rate: 2.63,
        official_rate: 2.64,
        date: today,
        previous_rate: 2.62,
      },
      {
        currency_code: 'EUR',
        buy_rate: 2.88,
        sell_rate: 2.86,
        official_rate: 2.87,
        date: today,
        previous_rate: 2.89,
      },
      {
        currency_code: 'RUB',
        buy_rate: 0.029,
        sell_rate: 0.028,
        official_rate: 0.0285,
        date: today,
        previous_rate: 0.0283,
      },
    ]
  }

  // Calculate change indicator
  // Compares today's official_rate with yesterday's official_rate
  // Formula: ((today - yesterday) / yesterday) * 100
  // Positive = rate increased (GEL got weaker, need more GEL to buy foreign currency)
  // Negative = rate decreased (GEL got stronger, need less GEL to buy foreign currency)
  const getChangeIndicator = (rate: RateWithChange) => {
    if (!rate.previous_rate) return null
    
    // Calculate absolute change (today - yesterday)
    const change = rate.official_rate - rate.previous_rate
    // Calculate percentage change: ((change / yesterday) * 100)
    const changePercent = ((change / rate.previous_rate) * 100).toFixed(2)
    const isPositive = change > 0
    const isNegative = change < 0
    
    if (change === 0) {
      return (
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
          <span className="text-xs">—</span>
          <span className="text-xs">0.00%</span>
        </div>
      )
    }
    
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        <span className="text-xs font-semibold">{Math.abs(parseFloat(changePercent))}%</span>
      </div>
    )
  }

  const getCurrencyName = (code: string) => {
    const names: Record<string, string> = {
      USD: t('exchangeRates.usd'),
      EUR: t('exchangeRates.eur'),
      RUB: t('exchangeRates.rub'),
      GBP: t('exchangeRates.gbp'),
    }
    return names[code] || code
  }

  // Add a manual refresh button for testing
  const handleManualRefresh = () => {
    console.log('[ExchangeRatesCard] Manual refresh triggered')
    fetchRates(false)
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6">
            <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div className="h-40 sm:h-48 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show message if no rates
  if (!loading && rates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6" id="exchange-rates">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
          {t('exchangeRates.title')}
        </h2>
        <div className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
          {t('common.loading')}...
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8" id="exchange-rates">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('exchangeRates.title')}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
            {t('exchangeRates.baseCurrency')} GEL (Georgian Lari)
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Refresh rates"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Currency Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {rates.slice(0, 3).map((rate) => (
          <div
            key={rate.currency_code}
            className="p-5 sm:p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-left w-full bg-white dark:bg-gray-800/50"
          >
            {/* Currency Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {rate.currency_code}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  {getCurrencyName(rate.currency_code)}
                </div>
              </div>
              {getChangeIndicator(rate)}
            </div>
            
            {/* Main Rate */}
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                {rate.official_rate.toFixed(4)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                GEL per 1 {rate.currency_code}
              </div>
            </div>

            {/* Buy/Sell Rates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('exchangeRates.buy')}</div>
                <div className="text-base font-semibold text-green-600 dark:text-green-400">
                  {rate.buy_rate.toFixed(4)}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('exchangeRates.sell')}</div>
                <div className="text-base font-semibold text-red-600 dark:text-red-400">
                  {rate.sell_rate.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Details Button */}
      <div className="flex justify-center mt-6 sm:mt-8">
        <Link
          href="/rates"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors text-sm sm:text-base shadow-md hover:shadow-lg"
        >
          {t('exchangeRates.viewAllDetails')}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

    </div>
  )
}


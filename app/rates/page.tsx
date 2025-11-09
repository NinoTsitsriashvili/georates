'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import Link from 'next/link'
import Header from '@/components/Header'
import type { ExchangeRate } from '@/lib/db'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RateWithChange extends ExchangeRate {
  previous_rate?: number
}

export default function AllRatesPage() {
  const { t } = useLanguage()
  const [rates, setRates] = useState<RateWithChange[]>([])
  const [history, setHistory] = useState<Record<string, { date: string; rate: number }[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRates()
  }, [])

  useEffect(() => {
    if (rates.length > 0) {
      fetchAllHistory()
    }
  }, [rates])

  const fetchRates = async () => {
    try {
      const res = await fetch('/api/exchange-rates')
      const data = await res.json()
      if (data.success && data.rates) {
        setRates(data.rates)
      }
    } catch (error) {
      console.error('Error fetching rates:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllHistory = async () => {
    try {
      const promises = rates.map(rate =>
        fetch(`/api/exchange-rates/history?currency=${rate.currency_code}&days=90`)
          .then(res => res.json())
          .then(data => ({
            currency: rate.currency_code,
            history: data.history || [],
          }))
      )
      
      const results = await Promise.all(promises)
      const historyMap: Record<string, { date: string; rate: number }[]> = {}
      
      results.forEach(({ currency, history }) => {
        historyMap[currency] = history
      })
      
      setHistory(historyMap)
    } catch (error) {
      console.error('Error fetching history:', error)
    }
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

  const getChangeIndicator = (rate: RateWithChange) => {
    if (!rate.previous_rate) return null
    
    const change = rate.official_rate - rate.previous_rate
    const changePercent = ((change / rate.previous_rate) * 100).toFixed(2)
    const isPositive = change > 0
    
    if (change === 0) {
      return (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <span className="text-sm">—</span>
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

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
      
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('nav.exchangeRates')}
        </Link>

        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('exchangeRates.title')} - {t('exchangeRates.viewAllDetails') || 'All Details'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('exchangeRates.baseCurrency')} GEL (Georgian Lari)
          </p>
        </div>

        {/* All Rates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {rates.map((rate) => {
            const currencyHistory = history[rate.currency_code] || []
            
            return (
              <div
                key={rate.currency_code}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 sm:p-6"
              >
                {/* Currency Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {rate.currency_code}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getCurrencyName(rate.currency_code)}
                    </p>
                  </div>
                  {getChangeIndicator(rate)}
                </div>

                {/* Current Rate */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
                    {rate.official_rate.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    GEL per 1 {rate.currency_code}
                  </div>
                </div>

                {/* Buy/Sell Rates */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('exchangeRates.buy')}
                    </div>
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {rate.buy_rate.toFixed(4)}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {t('exchangeRates.sell')}
                    </div>
                    <div className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {rate.sell_rate.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                {currencyHistory.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Min (90d)</div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">
                          {Math.min(...currencyHistory.map(h => h.rate)).toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-500 dark:text-gray-400">Max (90d)</div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">
                          {Math.max(...currencyHistory.map(h => h.rate)).toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Combined Chart */}
        {Object.keys(history).length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('exchangeRates.trend')} - 90 {t('common.days') || 'days'}
            </h2>
            <div className="h-96">
              <Line
                data={{
                  labels: history[rates[0]?.currency_code]?.map(h => 
                    new Date(h.date).toLocaleDateString()
                  ) || [],
                  datasets: rates.map((rate, index) => {
                    const colors = [
                      'rgb(20, 184, 166)',   // teal
                      'rgb(59, 130, 246)',   // blue
                      'rgb(168, 85, 247)',   // purple
                    ]
                    const currencyHistory = history[rate.currency_code] || []
                    return {
                      label: `${rate.currency_code} - ${getCurrencyName(rate.currency_code)}`,
                      data: currencyHistory.map(h => h.rate),
                      borderColor: colors[index % colors.length],
                      backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
                      fill: false,
                      tension: 0.4,
                    }
                  }),
                }}
                options={chartOptions}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


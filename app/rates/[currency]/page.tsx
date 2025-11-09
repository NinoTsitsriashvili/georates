'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

export default function CurrencyDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const currency = (params?.currency as string)?.toUpperCase() || 'USD'
  
  const [rate, setRate] = useState<RateWithChange | null>(null)
  const [history, setHistory] = useState<{ date: string; rate: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRate()
    fetchHistory()
  }, [currency])

  const fetchRate = async () => {
    try {
      const res = await fetch('/api/exchange-rates')
      const data = await res.json()
      if (data.success && data.rates) {
        const currencyRate = data.rates.find((r: RateWithChange) => r.currency_code === currency)
        setRate(currencyRate || null)
      }
    } catch (error) {
      console.error('Error fetching rate:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/exchange-rates/history?currency=${currency}&days=90`)
      const data = await res.json()
      if (data.success) {
        setHistory(data.history || [])
      }
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
          <span className="text-lg">—</span>
          <span className="text-sm">0.00%</span>
        </div>
      )
    }
    
    return (
      <div className={`flex items-center gap-2 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
        {isPositive ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
        <span className="text-lg font-semibold">{Math.abs(parseFloat(changePercent))}%</span>
      </div>
    )
  }

  const chartData = {
    labels: history.map(h => new Date(h.date).toLocaleDateString()),
    datasets: [
      {
        label: `${currency} ${t('exchangeRates.trend')}`,
        data: history.map(h => h.rate),
        borderColor: 'rgb(20, 184, 166)',
        backgroundColor: 'rgba(20, 184, 166, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
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

  if (!rate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {t('common.error')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Currency not found
            </p>
            <Link
              href="/"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              ← {t('nav.exchangeRates')}
            </Link>
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

        {/* Currency Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {currency} - {getCurrencyName(currency)}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('exchangeRates.baseCurrency')} GEL (Georgian Lari)
              </p>
            </div>
            {getChangeIndicator(rate)}
          </div>

          {/* Current Rate */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('exchangeRates.official') || 'Official Rate'}
              </div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {rate.official_rate.toFixed(4)} GEL
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('exchangeRates.buy')}
              </div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {rate.buy_rate.toFixed(4)} GEL
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {t('exchangeRates.sell')}
              </div>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {rate.sell_rate.toFixed(4)} GEL
              </div>
            </div>
          </div>

          {/* Statistics */}
          {history.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">30 {t('common.days') || 'days'} {t('exchangeRates.trend') || 'Trend'}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {history.length >= 30 ? (
                    history.slice(-30)[0].rate < history[history.length - 1].rate ? '↑' : '↓'
                  ) : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">7 {t('common.days') || 'days'} {t('exchangeRates.trend') || 'Trend'}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {history.length >= 7 ? (
                    history.slice(-7)[0].rate < history[history.length - 1].rate ? '↑' : '↓'
                  ) : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Min (90 {t('common.days') || 'days'})</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.min(...history.map(h => h.rate)).toFixed(4)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Max (90 {t('common.days') || 'days'})</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {Math.max(...history.map(h => h.rate)).toFixed(4)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chart */}
        {history.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('exchangeRates.trend')} - 90 {t('common.days') || 'days'}
            </h2>
            <div className="h-96">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}


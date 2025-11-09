'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageProvider'
import Link from 'next/link'
import type { ExchangeRate } from '@/lib/db'

interface RateWithChange extends ExchangeRate {
  previous_rate?: number
  change?: number
  change_percent?: string
  is_positive?: boolean
  is_negative?: boolean
  is_neutral?: boolean
  has_yesterday_data?: boolean
  calculated_at?: string
}

export default function ExchangeRatesCard() {
  const { t } = useLanguage()
  const [rates, setRates] = useState<RateWithChange[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRates(true)
    const interval = setInterval(() => {
      fetchRates(false)
    }, 10 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchRates = async (isInitialLoad: boolean = false) => {
    try {
      const res = await fetch(`/api/exchange-rates?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      })
      const data = await res.json()
      
      if (data.success && data.rates) {
        setRates(data.rates)
      } else {
        setRates(getFallbackRates())
      }
    } catch (error) {
      console.error('Error fetching rates:', error)
      setRates(getFallbackRates())
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      }
    }
  }

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

  const getChangeIndicator = (rate: RateWithChange) => {
    if (!rate.has_yesterday_data) {
      return (
        <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
          <span className="text-[12px]">—</span>
          <span className="text-[12px]">N/A</span>
        </div>
      )
    }
    
    const changePercent = rate.change_percent || '0.00'
    const isPositive = rate.is_positive || false
    const isNegative = rate.is_negative || false
    const isNeutral = rate.is_neutral || false
    
    if (isNeutral) {
      return (
        <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
          <span className="text-[12px]">—</span>
          <span className="text-[12px]">0.00%</span>
        </div>
      )
    }
    
    const colorClass = isPositive ? 'text-success' : 'text-danger'
    const icon = isPositive ? (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ) : (
      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    )
    
    return (
      <div className={`flex items-center gap-1 ${colorClass}`}>
        {icon}
        <span className="text-[12px] font-semibold">{Math.abs(parseFloat(changePercent))}%</span>
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

  if (loading) {
    return (
      <div className="bg-[var(--color-card-bg)] rounded-card shadow-card p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-light dark:bg-neutral-dark rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-neutral-light dark:bg-neutral-dark rounded-card"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!loading && rates.length === 0) {
    return (
      <div className="bg-[var(--color-card-bg)] rounded-card shadow-card p-6" id="exchange-rates">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
          {t('exchangeRates.title')}
        </h2>
        <div className="text-center text-[var(--color-text-secondary)] py-12 text-[15px]">
          {t('common.loading')}...
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-[var(--color-card-bg)] rounded-card shadow-card p-6 transition-all duration-base hover:shadow-card-hover" 
      id="exchange-rates"
    >
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
            {t('exchangeRates.title')}
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)]">
            {t('exchangeRates.baseCurrency')} GEL (Georgian Lari)
          </p>
        </div>
        <button
          onClick={() => fetchRates(false)}
          className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-light)] rounded-lg transition-all duration-base"
          title="Refresh rates"
          aria-label="Refresh rates"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Currency Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {rates.slice(0, 3).map((rate) => (
          <div
            key={rate.currency_code}
            className="bg-[var(--color-accent-bg)] rounded-card p-5 border border-[var(--color-border)] transition-all duration-hover hover:shadow-card-hover hover:-translate-y-0.5"
          >
            {/* Currency Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">
                  {rate.currency_code}
                </div>
                <div className="text-[12px] text-[var(--color-text-secondary)]">
                  {getCurrencyName(rate.currency_code)}
                </div>
              </div>
              {getChangeIndicator(rate)}
            </div>
            
            {/* Main Rate */}
            <div className="mb-4 pb-4 border-b border-[var(--color-border)]">
              <div className="text-4xl font-bold text-primary mb-1">
                {rate.official_rate.toFixed(4)}
              </div>
              <div className="text-[12px] text-[var(--color-text-secondary)]">
                ₾ per 1 {rate.currency_code}
              </div>
            </div>

            {/* Buy/Sell Rates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--color-card-bg)] rounded-lg p-3">
                <div className="text-[12px] text-[var(--color-text-secondary)] mb-1">
                  {t('exchangeRates.buy')}
                </div>
                <div className="text-[15px] font-semibold text-success">
                  {rate.buy_rate.toFixed(4)}
                </div>
              </div>
              <div className="bg-[var(--color-card-bg)] rounded-lg p-3">
                <div className="text-[12px] text-[var(--color-text-secondary)] mb-1">
                  {t('exchangeRates.sell')}
                </div>
                <div className="text-[15px] font-semibold text-danger">
                  {rate.sell_rate.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Details Button */}
      <div className="flex justify-center">
        <Link
          href="/rates"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-hover shadow-card hover:shadow-card-hover text-[15px]"
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

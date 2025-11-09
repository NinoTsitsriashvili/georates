'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from '@/components/LanguageProvider'
import { useTheme } from '@/components/ThemeProvider'
import Header from '@/components/Header'
import ExchangeRatesCard from '@/components/ExchangeRatesCard'
import PetrolPricesCard from '@/components/PetrolPricesCard'
import ElectricityCard from '@/components/ElectricityCard'
import AdSensePlaceholder from '@/components/AdSensePlaceholder'

export default function Home() {
  const { locale, t } = useLanguage()
  const { theme } = useTheme()
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [lastUpdateRelative, setLastUpdateRelative] = useState<string>('')

  const formatRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString(locale)
  }

  useEffect(() => {
    const fetchLastUpdate = () => {
      fetch('/api/last-update')
        .then(res => res.json())
        .then(data => {
          if (data.lastUpdate) {
            const updateDate = new Date(data.lastUpdate)
            setLastUpdate(updateDate)
            setLastUpdateRelative(formatRelativeTime(updateDate))
          }
        })
        .catch(console.error)
    }

    fetchLastUpdate()
    const interval = setInterval(fetchLastUpdate, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [locale])

  return (
    <div className="min-h-screen bg-[var(--color-accent-bg)] transition-colors duration-base flex flex-col">
      {/* Header */}
      <Header />
      
      {/* AdSense Header */}
      <div className="w-full bg-[var(--color-card-bg)] border-b border-[var(--color-border)]">
        <div className="container mx-auto px-6 py-3 max-w-7xl hidden sm:block">
          <AdSensePlaceholder position="header" />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="w-full py-12 lg:py-16">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[var(--color-text-primary)] mb-6 tracking-wide">
                {t('common.title')}
              </h1>
              <p className="text-2xl text-[var(--color-text-secondary)] mb-6 max-w-3xl mx-auto">
                {t('common.subtitle')}
              </p>
              {lastUpdate && (
                <div className="text-[15px] text-[var(--color-text-secondary)]">
                  <p className="font-medium">
                    {t('common.lastUpdate')}: {lastUpdate.toLocaleString(locale)}
                  </p>
                  <p className="text-[12px] mt-1">
                    {lastUpdateRelative}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Exchange Rates Section */}
        <section id="exchange-rates" className="w-full py-8 lg:py-10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Exchange Rates Card - Main Content */}
              <div className="lg:col-span-8">
                <ExchangeRatesCard />
              </div>

              {/* Sidebar Ad */}
              <div className="lg:col-span-4 hidden lg:block">
                <div className="sticky top-24">
                  <AdSensePlaceholder position="sidebar" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Petrol Prices and Electricity Section */}
        <section className="w-full py-8 lg:py-10">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PetrolPricesCard />
              <ElectricityCard />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[var(--color-card-bg)] border-t border-[var(--color-border)] mt-auto">
        <div className="container mx-auto px-6 max-w-7xl py-8">
          <div className="mb-6 hidden sm:block">
            <AdSensePlaceholder position="footer" />
          </div>
          <div className="text-center text-[var(--color-text-secondary)]">
            <p className="text-[15px] font-medium mb-2">
              &copy; {new Date().getFullYear()} GeoRates. {t('common.title')}
            </p>
            <p className="text-[12px]">
              {t('common.lastUpdate')}: {lastUpdate ? (
                <>
                  {lastUpdate.toLocaleString(locale)}
                  {lastUpdateRelative && <span className="ml-2">({lastUpdateRelative})</span>}
                </>
              ) : 'N/A'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useLanguage } from './LanguageProvider'
import type { ElectricityTariff } from '@/lib/db'

export default function ElectricityCard() {
  const { t } = useLanguage()
  const [tariffs, setTariffs] = useState<ElectricityTariff[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTariffs()
  }, [])

  const fetchTariffs = async () => {
    try {
      const res = await fetch('/api/electricity-tariffs')
      const data = await res.json()
      setTariffs(data.tariffs || [])
    } catch (error) {
      console.error('Error fetching tariffs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTariffTypeName = (type: string) => {
    const names: Record<string, string> = {
      residential: t('electricity.residential'),
      commercial: t('electricity.commercial'),
    }
    return names[type] || type
  }

  const groupedTariffs = tariffs.reduce((acc, tariff) => {
    if (!acc[tariff.region]) {
      acc[tariff.region] = []
    }
    acc[tariff.region].push(tariff)
    return acc
  }, {} as Record<string, ElectricityTariff[]>)

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
    <div className="bg-[var(--color-card-bg)] rounded-card shadow-card p-6 transition-all duration-base hover:shadow-card-hover h-full" id="electricity">
      <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        {t('electricity.title')}
      </h2>

      <div className="space-y-4">
        {Object.entries(groupedTariffs).map(([region, regionTariffs]) => (
          <div
            key={region}
            className="border border-[var(--color-border)] rounded-card p-5 bg-[var(--color-accent-bg)] transition-all duration-base hover:shadow-card"
          >
            <h3 className="font-semibold text-lg text-[var(--color-text-primary)] mb-4">
              {region}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {regionTariffs.map((tariff) => (
                <div key={`${region}-${tariff.tariff_type}`} className="text-center">
                  <div className="text-[12px] text-[var(--color-text-secondary)] mb-2">
                    {getTariffTypeName(tariff.tariff_type)}
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {tariff.price_per_kwh.toFixed(4)}
                  </div>
                  <div className="text-[12px] text-[var(--color-text-secondary)]">
                    {t('electricity.perKwh')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tariffs.length === 0 && (
        <div className="text-center text-[var(--color-text-secondary)] py-12 text-[15px]">
          {t('common.loading')}
        </div>
      )}
    </div>
  )
}

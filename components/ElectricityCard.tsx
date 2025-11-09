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

  // Group tariffs by region
  const groupedTariffs = tariffs.reduce((acc, tariff) => {
    if (!acc[tariff.region]) {
      acc[tariff.region] = []
    }
    acc[tariff.region].push(tariff)
    return acc
  }, {} as Record<string, ElectricityTariff[]>)

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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 h-full" id="electricity">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8">
        {t('electricity.title')}
      </h2>

      <div className="space-y-4 sm:space-y-5">
        {Object.entries(groupedTariffs).map(([region, regionTariffs]) => (
          <div
            key={region}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-5 bg-gray-50 dark:bg-gray-700/30"
          >
            <h3 className="font-semibold text-lg sm:text-xl text-gray-900 dark:text-white mb-4">
              {region}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {regionTariffs.map((tariff) => (
                <div key={`${region}-${tariff.tariff_type}`} className="text-center">
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {getTariffTypeName(tariff.tariff_type)}
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {tariff.price_per_kwh.toFixed(4)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {t('electricity.perKwh')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {tariffs.length === 0 && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-6 sm:py-8 text-sm sm:text-base">
          {t('common.loading')}
        </div>
      )}
    </div>
  )
}


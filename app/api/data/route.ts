import { NextResponse } from 'next/server'
import { getLatestExchangeRates, getLatestPetrolPrices, getLatestElectricityTariffs } from '@/lib/db'

/**
 * JSON API endpoint for third-party embedding
 * Returns all data in a single response
 */
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  try {
    const [rates, prices, tariffs] = await Promise.all([
      getLatestExchangeRates(),
      getLatestPetrolPrices(),
      getLatestElectricityTariffs(),
    ])

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        exchangeRates: rates,
        petrolPrices: prices,
        electricityTariffs: tariffs,
      },
    })
  } catch (error: any) {
    console.error('Error fetching all data:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to fetch data',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}


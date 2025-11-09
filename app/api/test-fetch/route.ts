import { NextResponse } from 'next/server'
import { fetchExchangeRates } from '@/lib/fetch-data'

export const dynamic = 'force-dynamic'

/**
 * Test endpoint to see what fetchExchangeRates actually returns
 */
export async function GET() {
  try {
    console.log('🧪 Testing fetchExchangeRates...')
    const rates = await fetchExchangeRates()
    
    return NextResponse.json({
      success: true,
      rates,
      count: rates.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}


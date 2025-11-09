import { NextRequest, NextResponse } from 'next/server'
import { getExchangeRateHistory } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const currency = searchParams.get('currency') || 'USD'
    const days = parseInt(searchParams.get('days') || '30')

    const history = await getExchangeRateHistory(currency, days)
    
    // Format for chart
    const formattedHistory = history.map(rate => ({
      date: rate.date,
      rate: rate.official_rate,
    }))

    return NextResponse.json({ history: formattedHistory, success: true })
  } catch (error: any) {
    console.error('Error fetching exchange rate history:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch history', success: false },
      { status: 500 }
    )
  }
}


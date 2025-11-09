import { NextRequest, NextResponse } from 'next/server'
import { fetchHistoricalExchangeRates } from '@/lib/fetch-data'

export const dynamic = 'force-dynamic'

/**
 * Fetch and store historical exchange rates (last 7 days)
 * POST /api/refresh/historical
 * Requires authorization header
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin secret for authorization
    const authHeader = request.headers.get('authorization')
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminSecret) {
      return NextResponse.json(
        { error: 'Admin secret not configured', success: false },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const days = body.days || 7

    console.log(`📅 Starting historical data fetch for last ${days} days...`)
    const result = await fetchHistoricalExchangeRates(days)
    console.log('Historical data fetch completed:', result)

    return NextResponse.json({
      success: true,
      message: `Historical data fetch completed`,
      timestamp: new Date().toISOString(),
      ...result,
    })
  } catch (error: any) {
    console.error('Error fetching historical data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch historical data', success: false },
      { status: 500 }
    )
  }
}


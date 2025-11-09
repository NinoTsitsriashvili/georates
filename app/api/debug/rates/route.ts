import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Debug endpoint to see what rates are in the database
 * Visit: /api/debug/rates
 */
export async function GET() {
  try {
    const supabase = getSupabase()
    
    // Get all recent rates
    const { data: allRates, error: allError } = await supabase
      .from('exchange_rates')
      .select('*')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20)

    if (allError) throw allError

    // Get latest date
    const { data: latestDateData } = await supabase
      .from('exchange_rates')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    const latestDate = latestDateData?.date

    // Get today's rates
    const todayRates = allRates?.filter(r => r.date === latestDate) || []

    // Get yesterday's date
    let yesterdayDate = null
    if (latestDate) {
      const latestDateObj = new Date(latestDate)
      const yesterdayDateObj = new Date(latestDateObj)
      yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1)
      yesterdayDate = yesterdayDateObj.toISOString().split('T')[0]
    }

    // Get yesterday's rates
    const yesterdayRates = allRates?.filter(r => r.date === yesterdayDate) || []

    // Group by currency
    const todayByCurrency = new Map()
    const yesterdayByCurrency = new Map()

    todayRates.forEach(rate => {
      if (!todayByCurrency.has(rate.currency_code)) {
        todayByCurrency.set(rate.currency_code, rate)
      }
    })

    yesterdayRates.forEach(rate => {
      if (!yesterdayByCurrency.has(rate.currency_code)) {
        yesterdayByCurrency.set(rate.currency_code, rate)
      }
    })

    // Calculate changes
    const changes: any[] = []
    todayByCurrency.forEach((todayRate, currency) => {
      const yesterdayRate = yesterdayByCurrency.get(currency)
      if (yesterdayRate) {
        const change = todayRate.official_rate - yesterdayRate.official_rate
        const changePercent = ((change / yesterdayRate.official_rate) * 100).toFixed(2)
        changes.push({
          currency,
          today: todayRate.official_rate,
          yesterday: yesterdayRate.official_rate,
          change,
          changePercent: `${change > 0 ? '+' : ''}${changePercent}%`,
        })
      } else {
        changes.push({
          currency,
          today: todayRate.official_rate,
          yesterday: 'N/A',
          change: 'N/A',
          changePercent: 'N/A',
        })
      }
    })

    return NextResponse.json({
      success: true,
      latestDate,
      yesterdayDate,
      todayRates: Array.from(todayByCurrency.values()),
      yesterdayRates: Array.from(yesterdayByCurrency.values()),
      changes,
      allRecentRates: allRates,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}


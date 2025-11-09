import { NextResponse } from 'next/server'
import { fetchExchangeRates } from '@/lib/fetch-data'

export const dynamic = 'force-dynamic'
// No revalidate - always fetch fresh data from database
// This ensures manual database changes are reflected immediately

// Fallback exchange rates (GEL per 1 unit of foreign currency)
function getFallbackRates() {
  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  
  // Add some variation to show change
  return [
    {
      currency_code: 'USD',
      buy_rate: 2.65,
      sell_rate: 2.63,
      official_rate: 2.64,
      date: today,
      previous_rate: 2.62, // Slightly higher yesterday
    },
    {
      currency_code: 'EUR',
      buy_rate: 2.88,
      sell_rate: 2.86,
      official_rate: 2.87,
      date: today,
      previous_rate: 2.89, // Slightly lower yesterday
    },
    {
      currency_code: 'RUB',
      buy_rate: 0.029,
      sell_rate: 0.028,
      official_rate: 0.0285,
      date: today,
      previous_rate: 0.0283, // Slightly higher yesterday
    },
  ]
}

export async function GET() {
  try {
    // Try to get rates from database first
    let rates: any[] = []
    let yesterdayRates: any[] = []
    let fromDatabase = false
    
    try {
      // Dynamically import to avoid error if Supabase is not configured
      const db = await import('@/lib/db')
      const [dbRates, dbYesterdayRates] = await Promise.all([
        db.getLatestExchangeRates(),
        db.getYesterdayExchangeRates(),
      ])
      
      rates = dbRates
      yesterdayRates = dbYesterdayRates
      fromDatabase = true
      
      // Create a map of yesterday's rates for quick lookup (using official_rate for comparison)
      const yesterdayMap = new Map(
        yesterdayRates.map((rate: any) => [rate.currency_code, rate.official_rate])
      )
      
      // Add previous_rate to each current rate
      // If yesterday's rate exists, use it; otherwise use today's rate (no change)
      const ratesWithChange = rates.map((rate: any) => {
        const yesterdayRate = yesterdayMap.get(rate.currency_code)
        const previousRate = yesterdayRate !== undefined ? yesterdayRate : rate.official_rate
        const change = rate.official_rate - previousRate
        const changePercent = previousRate !== rate.official_rate 
          ? ((change / previousRate) * 100).toFixed(2)
          : '0.00'
        
        return {
          ...rate,
          previous_rate: previousRate,
          // Debug info (can be removed later)
          _debug: {
            hasYesterday: yesterdayRate !== undefined,
            yesterdayRate,
            change,
            changePercent,
          },
        }
      })
      
      // If we have rates from database, return them
      if (rates && rates.length > 0) {
        return NextResponse.json({ 
          rates: ratesWithChange, 
          success: true, 
          fallback: false,
          source: 'database',
          debug: {
            todayCount: rates.length,
            yesterdayCount: yesterdayRates.length,
            yesterdayMap: Object.fromEntries(yesterdayMap),
          },
        })
      }
    } catch (error: any) {
      console.warn('Database not available, fetching from API:', error.message)
      // Continue to fetch from API
    }
    
    // If no database or no rates in database, fetch fresh from API
    console.log('Fetching rates from API...')
    const apiRates = await fetchExchangeRates()
    
    if (apiRates && apiRates.length > 0) {
      // Add previous_rate (use current rate as fallback)
      const ratesWithChange = apiRates.map((rate: any) => ({
        ...rate,
        previous_rate: rate.official_rate, // No history available, use current rate
      }))
      
      return NextResponse.json({ 
        rates: ratesWithChange, 
        success: true, 
        fallback: false,
        source: 'api'
      })
    }
    
    // If API also fails, use fallback
    console.log('Using fallback rates')
    return NextResponse.json({ 
      rates: getFallbackRates(), 
      success: true, 
      fallback: true,
      source: 'fallback'
    })
  } catch (error: any) {
    console.error('Error fetching exchange rates:', error)
    // Return fallback data instead of error
    return NextResponse.json({ 
      rates: getFallbackRates(), 
      success: true, 
      fallback: true,
      source: 'fallback',
      error: error.message 
    })
  }
}


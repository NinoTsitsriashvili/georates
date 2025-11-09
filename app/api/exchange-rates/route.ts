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
      
      console.log('[exchange-rates API] Today rates:', rates.length, 'Yesterday rates:', yesterdayRates.length)
      console.log('[exchange-rates API] Today currencies:', rates.map((r: any) => r.currency_code))
      console.log('[exchange-rates API] Yesterday currencies:', yesterdayRates.map((r: any) => r.currency_code))
      
      // Create a map of yesterday's rates for quick lookup (using official_rate for comparison)
      const yesterdayMap = new Map(
        yesterdayRates.map((rate: any) => [rate.currency_code, rate.official_rate])
      )
      
      console.log('[exchange-rates API] Yesterday map:', Object.fromEntries(yesterdayMap))
      
      // Calculate ALL dynamic values server-side from database
      // This ensures database changes are immediately reflected
      const ratesWithChange = rates.map((rate: any) => {
        const yesterdayRate = yesterdayMap.get(rate.currency_code)
        const previousRate = yesterdayRate !== undefined ? yesterdayRate : rate.official_rate
        
        // Calculate change (always from database values)
        const change = rate.official_rate - previousRate
        
        // Calculate percentage change (always from database values)
        const changePercent = previousRate !== rate.official_rate 
          ? ((change / previousRate) * 100).toFixed(2)
          : '0.00'
        
        // Calculate change direction
        const isPositive = change > 0
        const isNegative = change < 0
        const isNeutral = change === 0
        
        // Return ALL values pre-calculated from database
        return {
          ...rate,
          // Database values
          buy_rate: rate.buy_rate,
          sell_rate: rate.sell_rate,
          official_rate: rate.official_rate,
          date: rate.date,
          currency_code: rate.currency_code,
          // Calculated values (from database)
          previous_rate: previousRate,
          change: change,
          change_percent: changePercent,
          is_positive: isPositive,
          is_negative: isNegative,
          is_neutral: isNeutral,
          // Metadata
          has_yesterday_data: yesterdayRate !== undefined,
          calculated_at: new Date().toISOString(),
        }
      })
      
      // If we have rates from database, return them with NO CACHING
      if (rates && rates.length > 0) {
        return NextResponse.json({ 
          rates: ratesWithChange, 
          success: true, 
          fallback: false,
          source: 'database',
          timestamp: new Date().toISOString(),
          debug: {
            todayCount: rates.length,
            yesterdayCount: yesterdayRates.length,
            yesterdayMap: Object.fromEntries(yesterdayMap),
          },
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache',
            'Expires': '0',
            'X-Content-Type-Options': 'nosniff',
          }
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


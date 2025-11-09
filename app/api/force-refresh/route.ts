import { NextResponse } from 'next/server'
import { fetchExchangeRates } from '@/lib/fetch-data'

export const dynamic = 'force-dynamic'

/**
 * Force refresh endpoint - fetches rates immediately
 * Works with or without database connection
 */
export async function GET() {
  try {
    console.log('Force refreshing exchange rates...')
    
    // Fetch fresh rates from API (no database required)
    const rates = await fetchExchangeRates()
    console.log('Fetched rates:', rates)
    
    // Try to save to database if available
    let savedRates: any[] = []
    let databaseAvailable = false
    
    try {
      // Dynamically import to avoid error if Supabase is not configured
      const { insertExchangeRate } = await import('@/lib/db')
      
      for (const rate of rates) {
        try {
          await insertExchangeRate(rate)
          savedRates.push(rate)
          console.log(`Saved ${rate.currency_code}: ${rate.official_rate}`)
          databaseAvailable = true
        } catch (error: any) {
          console.warn(`Could not save ${rate.currency_code} to database:`, error.message)
        }
      }
    } catch (error: any) {
      console.warn('Database not available, returning fetched rates only:', error.message)
      // If database is not configured, just return the fetched rates
      savedRates = rates
    }
    
    return NextResponse.json({
      success: true,
      message: databaseAvailable 
        ? 'Rates refreshed and saved to database' 
        : 'Rates fetched (database not configured)',
      fetched: rates.length,
      saved: savedRates.length,
      databaseAvailable,
      rates: rates, // Always return the fetched rates
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Force refresh error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}


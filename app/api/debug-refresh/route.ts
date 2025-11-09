import { NextRequest, NextResponse } from 'next/server'
import { fetchExchangeRates } from '@/lib/fetch-data'
import { insertExchangeRate, getLatestExchangeRates } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Debug endpoint to test the full flow: fetch -> save -> read
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const adminSecret = process.env.ADMIN_SECRET

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const debug: any = {
      step1_fetch: null,
      step2_save: [],
      step3_read: null,
    }

    // Step 1: Fetch rates from API
    console.log('🔍 [DEBUG] Step 1: Fetching rates from API...')
    const fetchedRates = await fetchExchangeRates()
    debug.step1_fetch = fetchedRates
    console.log('🔍 [DEBUG] Fetched rates:', JSON.stringify(fetchedRates, null, 2))

    // Step 2: Save each rate
    console.log('🔍 [DEBUG] Step 2: Saving rates to database...')
    for (const rate of fetchedRates) {
      try {
        console.log(`🔍 [DEBUG] Saving ${rate.currency_code}:`, rate)
        await insertExchangeRate(rate)
        debug.step2_save.push({ currency: rate.currency_code, success: true, data: rate })
      } catch (error: any) {
        console.error(`🔍 [DEBUG] Error saving ${rate.currency_code}:`, error)
        debug.step2_save.push({ currency: rate.currency_code, success: false, error: error.message })
      }
    }

    // Step 3: Read back from database
    console.log('🔍 [DEBUG] Step 3: Reading rates from database...')
    const dbRates = await getLatestExchangeRates()
    debug.step3_read = dbRates
    console.log('🔍 [DEBUG] Database rates:', JSON.stringify(dbRates, null, 2))

    return NextResponse.json({
      success: true,
      debug,
      comparison: {
        fetched: fetchedRates.map(r => ({ currency: r.currency_code, rate: r.official_rate })),
        saved: dbRates.map(r => ({ currency: r.currency_code, rate: r.official_rate })),
        match: fetchedRates.every(fr => {
          const dbRate = dbRates.find(dr => dr.currency_code === fr.currency_code)
          return dbRate && Math.abs(dbRate.official_rate - fr.official_rate) < 0.0001
        }),
      },
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}


/**
 * Script to create yesterday's mock exchange rates data
 * This takes today's rates and creates yesterday's rates with variations
 * Run with: npm run create:yesterday
 */

import { config } from 'dotenv'
import { getSupabase } from '../lib/db'

config({ path: '.env.local' })

async function createYesterdayData() {
  try {
    console.log('🚀 Creating yesterday\'s mock exchange rates data...\n')
    
    const supabase = getSupabase()
    
    // Step 1: Get today's latest rates
    const { data: latestDateData, error: dateError } = await supabase
      .from('exchange_rates')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (dateError) throw dateError
    
    if (!latestDateData || !latestDateData.date) {
      console.error('❌ No exchange rates found in database. Please run the cron job first to create today\'s rates.')
      process.exit(1)
    }

    const todayDate = latestDateData.date
    const todayDateObj = new Date(todayDate)
    const yesterdayDateObj = new Date(todayDateObj)
    yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1)
    const yesterdayDate = yesterdayDateObj.toISOString().split('T')[0]

    console.log(`📅 Today's date: ${todayDate}`)
    console.log(`📅 Yesterday's date: ${yesterdayDate}\n`)

    // Step 2: Get today's rates
    const { data: todayRates, error: ratesError } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('date', todayDate)
      .order('created_at', { ascending: false })

    if (ratesError) throw ratesError

    if (!todayRates || todayRates.length === 0) {
      console.error('❌ No rates found for today. Please run the cron job first.')
      process.exit(1)
    }

    // Get unique currencies (latest for each)
    const uniqueRates = new Map<string, any>()
    for (const rate of todayRates) {
      if (!uniqueRates.has(rate.currency_code)) {
        uniqueRates.set(rate.currency_code, rate)
      }
    }

    console.log(`📊 Found ${uniqueRates.size} currencies for today:\n`)

    // Step 3: Create yesterday's rates with variations
    const variations: Record<string, number> = {
      USD: 0.98,  // 2% lower (today will show +2% increase)
      EUR: 1.015, // 1.5% higher (today will show -1.5% decrease)
      RUB: 0.99,  // 1% lower (today will show +1% increase)
    }

    const defaultVariation = 0.995 // 0.5% lower default

    let created = 0
    for (const [currency, todayRate] of uniqueRates) {
      const variation = variations[currency] || defaultVariation
      
      const yesterdayRate = {
        currency_code: currency,
        buy_rate: parseFloat((todayRate.buy_rate * variation).toFixed(4)),
        sell_rate: parseFloat((todayRate.sell_rate * variation).toFixed(4)),
        official_rate: parseFloat((todayRate.official_rate * variation).toFixed(4)),
        date: yesterdayDate,
      }

      // Insert with upsert (will update if exists)
      const { error: insertError } = await supabase
        .from('exchange_rates')
        .upsert(yesterdayRate, { onConflict: 'currency_code,date' })

      if (insertError) {
        console.error(`❌ Error creating ${currency}:`, insertError.message)
      } else {
        const change = todayRate.official_rate - yesterdayRate.official_rate
        const changePercent = ((change / yesterdayRate.official_rate) * 100).toFixed(2)
        console.log(`✅ ${currency}:`)
        console.log(`   Yesterday: ${yesterdayRate.official_rate} GEL`)
        console.log(`   Today:     ${todayRate.official_rate} GEL`)
        console.log(`   Change:    ${change > 0 ? '+' : ''}${changePercent}%\n`)
        created++
      }
    }

    console.log(`\n🎉 Successfully created ${created} yesterday's rates!`)
    console.log(`\n💡 You can now test the percentage change on your website.`)
    console.log(`   Refresh the page to see the changes reflected.\n`)

  } catch (error: any) {
    console.error('❌ Error creating yesterday\'s data:', error.message)
    if (error.message?.includes('Missing Supabase')) {
      console.error('\n💡 Make sure your .env.local file has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY set.')
    }
    process.exit(1)
  }
}

createYesterdayData()


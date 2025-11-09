/**
 * Test script to verify data fetching and database insertion works
 * Run with: npm run test:refresh
 */

// IMPORTANT: Load environment variables BEFORE importing any modules that use them
import { config } from 'dotenv'
config({ path: '.env.local' })

// Now import modules that depend on environment variables
import { refreshAllData } from '../lib/fetch-data'
import { getLatestExchangeRates } from '../lib/db'

async function main() {
  console.log('🧪 Testing data refresh and database insertion...\n')
  
  try {
    // Step 1: Check current database state
    console.log('📊 Step 1: Checking current database state...')
    const beforeRates = await getLatestExchangeRates()
    console.log(`   Found ${beforeRates.length} rates in database before refresh`)
    if (beforeRates.length > 0) {
      console.log(`   Latest rates:`, beforeRates.map(r => `${r.currency_code}: ${r.official_rate}`).join(', '))
    }
    
    // Step 2: Fetch and save new data
    console.log('\n🔄 Step 2: Fetching and saving new data...')
    const result = await refreshAllData()
    console.log(`   ✅ Refresh completed:`)
    console.log(`   - Exchange Rates: ${result.exchangeRates} records`)
    console.log(`   - Petrol Prices: ${result.petrolPrices} records`)
    console.log(`   - Electricity Tariffs: ${result.electricityTariffs} records`)
    
    if (result.errors.length > 0) {
      console.log(`   ⚠️ Errors:`, result.errors)
    }
    
    // Step 3: Verify data was saved
    console.log('\n✅ Step 3: Verifying data was saved...')
    const afterRates = await getLatestExchangeRates()
    console.log(`   Found ${afterRates.length} rates in database after refresh`)
    if (afterRates.length > 0) {
      console.log(`   Latest rates:`, afterRates.map(r => `${r.currency_code}: ${r.official_rate} (date: ${r.date})`).join(', '))
      console.log(`   ✅ Data successfully saved to database!`)
    } else {
      console.log(`   ⚠️ No rates found in database. Check Supabase connection.`)
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Test failed:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()


/**
 * Standalone script to fetch and update data
 * Can be run via cron job or scheduled task
 */

import { config } from 'dotenv'
import { refreshAllData } from '../lib/fetch-data'

config({ path: '.env.local' })

async function main() {
  const startTime = Date.now()
  console.log('🚀 Starting data refresh...', new Date().toISOString())
  
  try {
    const result = await refreshAllData()
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    console.log('✅ Data refresh completed in', duration, 'seconds')
    console.log(`- Exchange Rates: ${result.exchangeRates} records`)
    console.log(`- Petrol Prices: ${result.petrolPrices} records`)
    console.log(`- Electricity Tariffs: ${result.electricityTariffs} records`)
    
    if (result.errors.length > 0) {
      console.warn('⚠️ Errors encountered:')
      result.errors.forEach(err => console.warn(`  - ${err}`))
    }
    
    process.exit(0)
  } catch (error: any) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error('❌ Fatal error during data refresh after', duration, 'seconds:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()


/**
 * Script to fetch and store historical exchange rates (last 7 days)
 * Run with: npm run data:historical
 */

import { config } from 'dotenv'
import { fetchHistoricalExchangeRates } from '../lib/fetch-data'

config({ path: '.env.local' })

async function main() {
  const startTime = Date.now()
  console.log('🚀 Starting historical data fetch...', new Date().toISOString())
  
  try {
    const result = await fetchHistoricalExchangeRates(7)
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    
    console.log('\n✅ Historical data fetch completed in', duration, 'seconds')
    console.log(`- Total rates fetched: ${result.totalFetched}`)
    
    if (result.errors.length > 0) {
      console.warn('\n⚠️ Errors encountered:')
      result.errors.forEach(err => console.warn(`  - ${err}`))
    }
    
    console.log('\n💡 Historical data has been saved to the database.')
    console.log('   You can now view historical charts and trends on your website.\n')
    
    process.exit(0)
  } catch (error: any) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.error('❌ Fatal error during historical data fetch after', duration, 'seconds:', error.message)
    console.error(error.stack)
    process.exit(1)
  }
}

main()


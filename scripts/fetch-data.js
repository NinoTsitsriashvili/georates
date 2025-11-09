/**
 * Standalone script to fetch and update data
 * Can be run via cron job or scheduled task
 */

require('dotenv').config({ path: '.env.local' })

const { refreshAllData } = require('../lib/fetch-data')

async function main() {
  console.log('Starting data refresh...', new Date().toISOString())
  
  try {
    const result = await refreshAllData()
    
    console.log('Data refresh completed:')
    console.log(`- Exchange Rates: ${result.exchangeRates} records`)
    console.log(`- Petrol Prices: ${result.petrolPrices} records`)
    console.log(`- Electricity Tariffs: ${result.electricityTariffs} records`)
    
    if (result.errors.length > 0) {
      console.error('Errors encountered:')
      result.errors.forEach(err => console.error(`  - ${err}`))
    }
    
    process.exit(0)
  } catch (error) {
    console.error('Fatal error during data refresh:', error)
    process.exit(1)
  }
}

main()


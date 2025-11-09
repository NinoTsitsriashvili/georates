/**
 * Cron job script for automated data fetching
 * Run this every 24 hours using a cron service
 * 
 * Example cron expression: 0 2 * * * (runs daily at 2 AM)
 */

const cron = require('node-cron')
const { refreshAllData } = require('../lib/fetch-data')

// Schedule to run daily at 2 AM UTC
cron.schedule('0 2 * * *', async () => {
  console.log('Running scheduled data refresh...', new Date().toISOString())
  
  try {
    const result = await refreshAllData()
    console.log('Scheduled refresh completed:', result)
  } catch (error) {
    console.error('Error in scheduled refresh:', error)
  }
})

console.log('Cron job scheduler started. Waiting for scheduled time...')


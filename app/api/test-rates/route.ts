import { NextResponse } from 'next/server'
import axios from 'axios'

export const dynamic = 'force-dynamic'

/**
 * Test endpoint to debug exchange rate fetching
 * This tests the API directly without database connection
 */
export async function GET() {
  try {
    console.log('Testing exchange rate fetch...')
    const currencies = ['USD', 'EUR', 'RUB']
    const rates: any[] = []
    const testResults: any = {
      timestamp: new Date().toISOString(),
      methods: [],
      rates: [],
    }

    // Test Method 1: National Bank of Georgia API
    testResults.methods.push('Testing NBG API...')
    const nbgEndpoints = [
      'https://nbg.gov.ge/api/currencies/currencies.json',
      'https://nbg.gov.ge/api/currencies',
      'https://nbg.gov.ge/api/currencies/currencies',
    ]

    for (const endpoint of nbgEndpoints) {
      try {
        const response = await axios.get(endpoint, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0',
          },
        })

        testResults.methods.push({
          endpoint,
          status: 'success',
          dataType: typeof response.data,
          dataPreview: Array.isArray(response.data) 
            ? `Array with ${response.data.length} items` 
            : typeof response.data === 'object' 
            ? `Object with keys: ${Object.keys(response.data).slice(0, 5).join(', ')}`
            : String(response.data).substring(0, 100),
        })

        if (response.data) {
          const data = response.data
          
          if (Array.isArray(data)) {
            for (const currency of currencies) {
              const rateData = data.find((r: any) => 
                (r.code === currency || r.currency === currency || r.currencyCode === currency) &&
                (r.rate || r.value || r.rateFormated)
              )
              
              if (rateData) {
                const officialRate = parseFloat(rateData.rate || rateData.value || rateData.rateFormated || 0)
                if (officialRate > 0) {
                  rates.push({
                    currency_code: currency,
                    official_rate: officialRate,
                    source: 'NBG API',
                    raw_data: rateData,
                  })
                }
              }
            }
          } else if (typeof data === 'object') {
            for (const currency of currencies) {
              const rateData = data[currency] || data[currency.toLowerCase()]
              if (rateData) {
                const officialRate = parseFloat(rateData.rate || rateData.value || rateData || 0)
                if (officialRate > 0) {
                  rates.push({
                    currency_code: currency,
                    official_rate: officialRate,
                    source: 'NBG API',
                    raw_data: rateData,
                  })
                }
              }
            }
          }

          if (rates.length >= 3) {
            break
          }
        }
      } catch (error: any) {
        testResults.methods.push({
          endpoint,
          status: 'error',
          error: error.message,
        })
      }
    }

    // Test Method 2: Bank of Georgia API
    if (rates.length < 3) {
      testResults.methods.push('Testing BOG API...')
      const bogBaseUrls = [
        'https://businessmanager.bog.ge',
        'https://api.bog.ge',
      ]

      for (const baseUrl of bogBaseUrls) {
        for (const currency of currencies) {
          if (rates.find(r => r.currency_code === currency)) continue
          
          const url = `${baseUrl}/api/rates/nbg/${currency}`
          try {
            const response = await axios.get(url, {
              timeout: 8000,
              headers: {
                'Accept': 'application/json',
              },
            })

            testResults.methods.push({
              url,
              status: 'success',
              dataType: typeof response.data,
              data: response.data,
            })

            let officialRate: number = 0
            
            if (typeof response.data === 'number') {
              officialRate = response.data
            } else if (response.data && typeof response.data === 'object') {
              officialRate = response.data.rate || response.data.value || response.data.amount || 0
            } else if (typeof response.data === 'string') {
              officialRate = parseFloat(response.data) || 0
            }

            if (officialRate > 0) {
              rates.push({
                currency_code: currency,
                official_rate: officialRate,
                source: 'BOG API',
                raw_data: response.data,
              })
            }
          } catch (error: any) {
            testResults.methods.push({
              url,
              status: 'error',
              error: error.message,
            })
          }
        }
      }
    }

    // Test Method 3: exchangerate-api.com
    if (rates.length < 3) {
      testResults.methods.push('Testing exchangerate-api.com...')
      try {
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
          },
        })

        if (response.data && response.data.rates) {
          const usdRates = response.data.rates
          const gelRate = usdRates['GEL']
          
          if (gelRate && gelRate > 0) {
            if (!rates.find(r => r.currency_code === 'USD')) {
              rates.push({
                currency_code: 'USD',
                official_rate: gelRate,
                source: 'exchangerate-api.com',
              })
            }

            const eurToUsd = usdRates['EUR']
            if (eurToUsd && eurToUsd > 0 && !rates.find(r => r.currency_code === 'EUR')) {
              rates.push({
                currency_code: 'EUR',
                official_rate: eurToUsd * gelRate,
                source: 'exchangerate-api.com',
              })
            }

            const rubToUsd = usdRates['RUB']
            if (rubToUsd && rubToUsd > 0 && !rates.find(r => r.currency_code === 'RUB')) {
              rates.push({
                currency_code: 'RUB',
                official_rate: rubToUsd * gelRate,
                source: 'exchangerate-api.com',
              })
            }
          }

          testResults.methods.push({
            endpoint: 'exchangerate-api.com',
            status: 'success',
            gelRate,
          })
        }
      } catch (error: any) {
        testResults.methods.push({
          endpoint: 'exchangerate-api.com',
          status: 'error',
          error: error.message,
        })
      }
    }

    testResults.rates = rates
    
    return NextResponse.json({
      success: true,
      rates,
      count: rates.length,
      testResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Test fetch error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}


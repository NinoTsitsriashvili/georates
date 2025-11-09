import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertExchangeRate, insertPetrolPrice, insertElectricityTariff, insertRefreshLog } from './db'
import type { ExchangeRate, PetrolPrice, ElectricityTariff } from './db'

// National Bank of Georgia API endpoint
const NBG_API_URL = 'https://nbg.gov.ge/en/monetary-policy/currency'

/**
 * Fetch exchange rates from National Bank of Georgia API
 * NBG publishes official rates by ~17:00 local time each business day
 * Rates are in GEL (1 foreign currency = X GEL)
 */
export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const currencies = ['USD', 'EUR', 'RUB']
    const rates: ExchangeRate[] = []

    console.log('🚀 Starting exchange rate fetch from NBG...')

    // Method 1: Try Bank of Georgia API wrapper for NBG rates (most reliable)
    // This uses: GET api/rates/nbg/{currency}
    // Returns: GEL per 1 foreign currency (e.g., 1 USD = 2.7241 GEL)
    try {
      console.log('📡 Trying Bank of Georgia API (NBG rates wrapper)...')
      
      const bogApiBase = 'https://api.bog.ge'
      let successCount = 0
      
      for (const currency of currencies) {
        try {
          const url = `${bogApiBase}/api/rates/nbg/${currency}`
          console.log(`  Fetching ${currency} from: ${url}`)
          
          const response = await axios.get(url, {
            timeout: 5000,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'GeoRates/1.0',
            },
          })

          console.log(`  ${currency} response:`, response.data)

          let officialRate: number = 0
          
          // Handle different response formats
          if (typeof response.data === 'number') {
            officialRate = response.data
          } else if (response.data && typeof response.data === 'object') {
            // Try common field names
            officialRate = parseFloat(
              response.data.rate ||
              response.data.value ||
              response.data.amount ||
              response.data.curOfficialRate ||
              response.data.Rate ||
              response.data.Value ||
              0
            )
          } else if (typeof response.data === 'string') {
            officialRate = parseFloat(response.data) || 0
          }

          if (officialRate > 0 && officialRate < 1000) { // Sanity check
            // Rate is already: 1 foreign currency = X GEL
            // Calculate buy/sell rates with small spread (0.5% each way)
            const buyRate = officialRate * 1.005  // Bank buys foreign currency (slightly higher)
            const sellRate = officialRate * 0.995 // Bank sells foreign currency (slightly lower)
            
            rates.push({
              currency_code: currency,
              buy_rate: parseFloat(buyRate.toFixed(4)),
              sell_rate: parseFloat(sellRate.toFixed(4)),
              official_rate: parseFloat(officialRate.toFixed(4)),
              date: today,
            })
            
            console.log(`  ✅ ${currency}: ${officialRate} GEL per 1 ${currency}`)
            successCount++
          } else {
            console.warn(`  ⚠️ Invalid rate for ${currency}: ${officialRate}`)
          }
        } catch (error: any) {
          console.warn(`  ❌ Failed to fetch ${currency}:`, error.message)
          continue
        }
      }

      if (successCount === currencies.length) {
        console.log(`✅ Successfully fetched all ${successCount} rates from BOG API (NBG wrapper)`)
        return rates
      } else if (successCount > 0) {
        console.warn(`⚠️ Only fetched ${successCount}/${currencies.length} rates from BOG API`)
      }
    } catch (error: any) {
      console.warn('❌ BOG API (NBG wrapper) failed:', error.message)
    }

    // Method 2: Try direct NBG API endpoints
    try {
      console.log('📡 Trying direct NBG API endpoints...')
      
      // Try multiple NBG API endpoint formats
      const nbgEndpoints = [
        'https://nbg.gov.ge/api/currencies/currencies.json',
        'https://nbg.gov.ge/api/currencies',
        'https://nbg.gov.ge/api/exchange-rates',
      ]

      for (const endpoint of nbgEndpoints) {
        try {
          console.log(`  Trying: ${endpoint}`)
          const response = await axios.get(endpoint, {
            timeout: 5000,
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'GeoRates/1.0',
            },
          })

          console.log(`  Response structure:`, typeof response.data, Array.isArray(response.data) ? 'array' : 'object')
          
          if (response.data) {
            const data = response.data
            
            // Handle array format
            if (Array.isArray(data)) {
              console.log(`  Found array with ${data.length} items`)
              
              for (const currency of currencies) {
                const rateData = data.find((r: any) => {
                  const code = r.code || r.currency || r.currencyCode || r.CurrencyCode || r.isoCode
                  return code && code.toUpperCase() === currency.toUpperCase()
                })
                
                if (rateData) {
                  const officialRate = parseFloat(
                    rateData.rate || rateData.Rate || rateData.value || rateData.Value ||
                    rateData.rateFormated || rateData.rateFormatted || rateData.amount || 0
                  )
                  
                  if (officialRate > 0 && officialRate < 1000) {
                    // Check if we already have this currency
                    const existing = rates.find(r => r.currency_code === currency)
                    if (!existing) {
                      rates.push({
                        currency_code: currency,
                        buy_rate: parseFloat((officialRate * 1.005).toFixed(4)),
                        sell_rate: parseFloat((officialRate * 0.995).toFixed(4)),
                        official_rate: parseFloat(officialRate.toFixed(4)),
                        date: today,
                      })
                      console.log(`  ✅ ${currency}: ${officialRate} GEL`)
                    }
                  }
                }
              }
            } 
            // Handle object format
            else if (typeof data === 'object' && !Array.isArray(data)) {
              console.log('  NBG API returned object format')
              
              for (const currency of currencies) {
                // Check if we already have this currency
                const existing = rates.find(r => r.currency_code === currency)
                if (existing) continue
                
                // Try different key formats
                const rateData = 
                  data[currency] || 
                  data[currency.toLowerCase()] || 
                  data[currency.toUpperCase()] ||
                  data[`cur${currency}`] ||
                  data[`Cur${currency}`]
                
                if (rateData) {
                  const officialRate = parseFloat(
                    typeof rateData === 'number' ? rateData :
                    rateData.rate || rateData.value || rateData || 0
                  )
                  
                  if (officialRate > 0 && officialRate < 1000) {
                    rates.push({
                      currency_code: currency,
                      buy_rate: parseFloat((officialRate * 1.005).toFixed(4)),
                      sell_rate: parseFloat((officialRate * 0.995).toFixed(4)),
                      official_rate: parseFloat(officialRate.toFixed(4)),
                      date: today,
                    })
                    console.log(`  ✅ ${currency}: ${officialRate} GEL`)
                  }
                }
              }
            }

            // If we got all rates, return early
            if (rates.length >= currencies.length) {
              console.log(`✅ Successfully fetched all rates from NBG API`)
              return rates
            }
          }
        } catch (error: any) {
          console.warn(`  ❌ Endpoint ${endpoint} failed:`, error.message)
          if (error.response) {
            console.warn(`  Response status: ${error.response.status}`)
          }
          continue // Try next endpoint
        }
      }
    } catch (error: any) {
      console.warn('❌ Direct NBG API failed:', error.message)
    }

    // Method 3: Try exchangerate-api.com as fallback (USD base, need to convert)
    // This is less accurate as it's not GEL-based, but better than nothing
    if (rates.length < currencies.length) {
      try {
        console.log('📡 Trying exchangerate-api.com as fallback...')
        
        const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
          },
        })

        if (response.data && response.data.rates) {
          const usdRates = response.data.rates
          const gelRate = usdRates['GEL'] // This is: 1 USD = X GEL
          
          if (gelRate && gelRate > 0) {
            // Fill missing currencies
            for (const currency of currencies) {
              const existing = rates.find(r => r.currency_code === currency)
              if (existing) continue
              
              if (currency === 'USD') {
                rates.push({
                  currency_code: 'USD',
                  buy_rate: parseFloat((gelRate * 1.005).toFixed(4)),
                  sell_rate: parseFloat((gelRate * 0.995).toFixed(4)),
                  official_rate: parseFloat(gelRate.toFixed(4)),
                  date: today,
                })
                console.log(`  ✅ USD (fallback): ${gelRate} GEL`)
              } else if (currency === 'EUR') {
                const eurToUsd = usdRates['EUR'] // 1 EUR = X USD
                if (eurToUsd && eurToUsd > 0) {
                  const eurToGel = gelRate / eurToUsd // Convert: 1 EUR = (1 USD in GEL) / (1 EUR in USD)
                  rates.push({
                    currency_code: 'EUR',
                    buy_rate: parseFloat((eurToGel * 1.005).toFixed(4)),
                    sell_rate: parseFloat((eurToGel * 0.995).toFixed(4)),
                    official_rate: parseFloat(eurToGel.toFixed(4)),
                    date: today,
                  })
                  console.log(`  ✅ EUR (fallback): ${eurToGel} GEL`)
                }
              } else if (currency === 'RUB') {
                const rubToUsd = usdRates['RUB'] // 1 RUB = X USD
                if (rubToUsd && rubToUsd > 0) {
                  const rubToGel = gelRate / rubToUsd // Convert: 1 RUB = (1 USD in GEL) / (1 RUB in USD)
                  rates.push({
                    currency_code: 'RUB',
                    buy_rate: parseFloat((rubToGel * 1.005).toFixed(4)),
                    sell_rate: parseFloat((rubToGel * 0.995).toFixed(4)),
                    official_rate: parseFloat(rubToGel.toFixed(4)),
                    date: today,
                  })
                  console.log(`  ✅ RUB (fallback): ${rubToGel} GEL`)
                }
              }
            }

            if (rates.length >= currencies.length) {
              console.log(`✅ Successfully fetched rates from exchangerate-api.com (fallback)`)
              return rates
            }
          }
        }
      } catch (error: any) {
        console.warn('❌ exchangerate-api.com failed:', error.message)
      }
    }

    // Final check: If we have some rates but not all, fill missing with fallback
    if (rates.length > 0 && rates.length < currencies.length) {
      console.warn(`⚠️ Only fetched ${rates.length}/${currencies.length} rates. Filling missing with fallback.`)
      const fallbackRates = getFallbackExchangeRates()
      const existingCurrencies = new Set(rates.map(r => r.currency_code))
      
      for (const fallbackRate of fallbackRates) {
        if (!existingCurrencies.has(fallbackRate.currency_code)) {
          rates.push(fallbackRate)
          console.warn(`  ⚠️ Using fallback for ${fallbackRate.currency_code}`)
        }
      }
    }

    // Last resort: If no rates at all, use fallback
    if (rates.length === 0) {
      console.error('❌ All API methods failed, using fallback rates')
      return getFallbackExchangeRates()
    }

    console.log(`✅ Final rates (${rates.length} currencies):`, rates.map(r => `${r.currency_code}: ${r.official_rate}`).join(', '))
    return rates
  } catch (error: any) {
    console.error('Error fetching exchange rates:', error.message)
    return getFallbackExchangeRates()
  }
}

function getFallbackExchangeRates(): ExchangeRate[] {
  const today = new Date().toISOString().split('T')[0]
  return [
    {
      currency_code: 'USD',
      buy_rate: 2.65,
      sell_rate: 2.63,
      official_rate: 2.64,
      date: today,
    },
    {
      currency_code: 'EUR',
      buy_rate: 2.88,
      sell_rate: 2.86,
      official_rate: 2.87,
      date: today,
    },
    {
      currency_code: 'RUB',
      buy_rate: 0.029,
      sell_rate: 0.028,
      official_rate: 0.0285,
      date: today,
    },
    {
      currency_code: 'GBP',
      buy_rate: 3.35,
      sell_rate: 3.33,
      official_rate: 3.34,
      date: today,
    },
  ]
}

/**
 * Fetch petrol prices from Georgian fuel companies
 */
export async function fetchPetrolPrices(): Promise<PetrolPrice[]> {
  const prices: PetrolPrice[] = []
  const today = new Date().toISOString().split('T')[0]

  const companies = [
    { name: 'Gulf', url: 'https://gulf.ge' },
    { name: 'Wissol', url: 'https://wissol.ge' },
    { name: 'Socar', url: 'https://socar.ge' },
  ]

  for (const company of companies) {
    try {
      const response = await axios.get(company.url, {
        timeout: 5000, // Reduced from 10s to 5s
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })

      const $ = cheerio.load(response.data)

      // Try to find price elements - adjust selectors based on actual website structure
      const regularPrice = parseFloat(
        $('.price-regular, .fuel-price-regular, [data-fuel="regular"]').first().text().replace(/[^\d.]/g, '') || '0'
      )
      const premiumPrice = parseFloat(
        $('.price-premium, .fuel-price-premium, [data-fuel="premium"]').first().text().replace(/[^\d.]/g, '') || '0'
      )
      const superPrice = parseFloat(
        $('.price-super, .fuel-price-super, [data-fuel="super"]').first().text().replace(/[^\d.]/g, '') || '0'
      )
      const dieselPrice = parseFloat(
        $('.price-diesel, .fuel-price-diesel, [data-fuel="diesel"]').first().text().replace(/[^\d.]/g, '') || '0'
      )

      if (regularPrice > 0) {
        prices.push({
          company_name: company.name,
          fuel_type: 'regular',
          price: regularPrice,
          date: today,
        })
      }

      if (premiumPrice > 0) {
        prices.push({
          company_name: company.name,
          fuel_type: 'premium',
          price: premiumPrice,
          date: today,
        })
      }

      if (superPrice > 0) {
        prices.push({
          company_name: company.name,
          fuel_type: 'super',
          price: superPrice,
          date: today,
        })
      }

      if (dieselPrice > 0) {
        prices.push({
          company_name: company.name,
          fuel_type: 'diesel',
          price: dieselPrice,
          date: today,
        })
      }
    } catch (error) {
      console.error(`Error fetching prices from ${company.name}:`, error)
    }
  }

  // Fallback: Use mock data if scraping fails
  if (prices.length === 0) {
    console.warn('Petrol scraping returned no data, using fallback prices')
    return getFallbackPetrolPrices()
  }

  return prices
}

function getFallbackPetrolPrices(): PetrolPrice[] {
  const today = new Date().toISOString().split('T')[0]
  return [
    { company_name: 'Gulf', fuel_type: 'regular', price: 2.85, date: today },
    { company_name: 'Gulf', fuel_type: 'premium', price: 3.05, date: today },
    { company_name: 'Gulf', fuel_type: 'super', price: 3.15, date: today },
    { company_name: 'Gulf', fuel_type: 'diesel', price: 2.95, date: today },
    { company_name: 'Wissol', fuel_type: 'regular', price: 2.87, date: today },
    { company_name: 'Wissol', fuel_type: 'premium', price: 3.07, date: today },
    { company_name: 'Wissol', fuel_type: 'super', price: 3.17, date: today },
    { company_name: 'Wissol', fuel_type: 'diesel', price: 2.97, date: today },
    { company_name: 'Socar', fuel_type: 'regular', price: 2.86, date: today },
    { company_name: 'Socar', fuel_type: 'premium', price: 3.06, date: today },
    { company_name: 'Socar', fuel_type: 'super', price: 3.16, date: today },
    { company_name: 'Socar', fuel_type: 'diesel', price: 2.96, date: today },
  ]
}

/**
 * Fetch electricity tariffs (static data - adjust based on actual source)
 */
export async function fetchElectricityTariffs(): Promise<ElectricityTariff[]> {
  const today = new Date().toISOString().split('T')[0]

  // Electricity tariffs are typically static and published by the government
  // Adjust these values based on actual Georgian electricity tariff structure
  const tariffs: ElectricityTariff[] = [
    {
      region: 'Tbilisi',
      tariff_type: 'residential',
      price_per_kwh: 0.12,
      date: today,
    },
    {
      region: 'Tbilisi',
      tariff_type: 'commercial',
      price_per_kwh: 0.15,
      date: today,
    },
    {
      region: 'Batumi',
      tariff_type: 'residential',
      price_per_kwh: 0.11,
      date: today,
    },
    {
      region: 'Batumi',
      tariff_type: 'commercial',
      price_per_kwh: 0.14,
      date: today,
    },
    {
      region: 'Kutaisi',
      tariff_type: 'residential',
      price_per_kwh: 0.11,
      date: today,
    },
    {
      region: 'Kutaisi',
      tariff_type: 'commercial',
      price_per_kwh: 0.14,
      date: today,
    },
    {
      region: 'Other Regions',
      tariff_type: 'residential',
      price_per_kwh: 0.10,
      date: today,
    },
    {
      region: 'Other Regions',
      tariff_type: 'commercial',
      price_per_kwh: 0.13,
      date: today,
    },
  ]

  return tariffs
}

/**
 * Refresh all data and save to database
 */
export async function refreshAllData(): Promise<{
  exchangeRates: number
  petrolPrices: number
  electricityTariffs: number
  errors: string[]
}> {
  const errors: string[] = []
  let exchangeRatesCount = 0
  let petrolPricesCount = 0
  let electricityTariffsCount = 0

  // Fetch and save exchange rates
  try {
    const rates = await fetchExchangeRates()
    for (const rate of rates) {
      await insertExchangeRate(rate)
      exchangeRatesCount++
    }
    await insertRefreshLog({
      data_type: 'exchange_rates',
      status: 'success',
      records_updated: exchangeRatesCount,
    })
  } catch (error: any) {
    const errorMsg = `Exchange rates: ${error.message}`
    errors.push(errorMsg)
    await insertRefreshLog({
      data_type: 'exchange_rates',
      status: 'error',
      records_updated: 0,
      error_message: errorMsg,
    })
  }

  // Fetch and save petrol prices
  try {
    const prices = await fetchPetrolPrices()
    for (const price of prices) {
      await insertPetrolPrice(price)
      petrolPricesCount++
    }
    await insertRefreshLog({
      data_type: 'petrol_prices',
      status: 'success',
      records_updated: petrolPricesCount,
    })
  } catch (error: any) {
    const errorMsg = `Petrol prices: ${error.message}`
    errors.push(errorMsg)
    await insertRefreshLog({
      data_type: 'petrol_prices',
      status: 'error',
      records_updated: 0,
      error_message: errorMsg,
    })
  }

  // Fetch and save electricity tariffs
  try {
    const tariffs = await fetchElectricityTariffs()
    for (const tariff of tariffs) {
      await insertElectricityTariff(tariff)
      electricityTariffsCount++
    }
    await insertRefreshLog({
      data_type: 'electricity_tariffs',
      status: 'success',
      records_updated: electricityTariffsCount,
    })
  } catch (error: any) {
    const errorMsg = `Electricity tariffs: ${error.message}`
    errors.push(errorMsg)
    await insertRefreshLog({
      data_type: 'electricity_tariffs',
      status: 'error',
      records_updated: 0,
      error_message: errorMsg,
    })
  }

  return {
    exchangeRates: exchangeRatesCount,
    petrolPrices: petrolPricesCount,
    electricityTariffs: electricityTariffsCount,
    errors,
  }
}


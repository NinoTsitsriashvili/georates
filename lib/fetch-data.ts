import axios from 'axios'
import * as cheerio from 'cheerio'
import { insertExchangeRate, insertPetrolPrice, insertElectricityTariff, insertRefreshLog } from './db'
import type { ExchangeRate, PetrolPrice, ElectricityTariff } from './db'

// National Bank of Georgia API endpoint
const NBG_API_URL = 'https://nbg.gov.ge/en/monetary-policy/currency'

/**
 * Fetch exchange rates from National Bank of Georgia API
 * Using multiple sources for reliability
 */
export async function fetchExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const today = new Date().toISOString().split('T')[0]
    const currencies = ['USD', 'EUR', 'RUB']
    const rates: ExchangeRate[] = []

    console.log('Starting exchange rate fetch...')

    // Method 1: Try National Bank of Georgia official API
    try {
      console.log('Trying National Bank of Georgia API...')
      
      // NBG API endpoint - primary endpoint
      const nbgEndpoint = 'https://nbg.gov.ge/api/currencies/currencies.json'
      
      try {
        const response = await axios.get(nbgEndpoint, {
          timeout: 5000, // Reduced from 10s to 5s
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          },
        })

        console.log('NBG API response:', JSON.stringify(response.data).substring(0, 500))

        if (response.data) {
          const data = response.data
          
          // Handle array format (most common for NBG API)
          if (Array.isArray(data)) {
            console.log(`NBG API returned array with ${data.length} items`)
            
            for (const currency of currencies) {
              // Try multiple field name variations
              const rateData = data.find((r: any) => {
                const codeMatch = 
                  r.code === currency || 
                  r.currency === currency || 
                  r.currencyCode === currency ||
                  r.CurrencyCode === currency ||
                  r.isoCode === currency ||
                  (r.code && r.code.toUpperCase() === currency) ||
                  (r.currency && r.currency.toUpperCase() === currency)
                
                return codeMatch
              })
              
              if (rateData) {
                console.log(`Found rate data for ${currency}:`, rateData)
                
                // Try multiple rate field variations
                // NBG API typically returns rate as: 1 foreign currency = X GEL
                const officialRate = parseFloat(
                  rateData.rate || 
                  rateData.Rate || 
                  rateData.value || 
                  rateData.Value ||
                  rateData.rateFormated || 
                  rateData.rateFormatted ||
                  rateData.amount ||
                  rateData.curOfficialRate ||
                  0
                )
                
                if (officialRate > 0) {
                  // The rate from NBG is already: 1 USD = X GEL (GEL base)
                  // So we use it directly
                  rates.push({
                    currency_code: currency,
                    buy_rate: officialRate * 1.005,
                    sell_rate: officialRate * 0.995,
                    official_rate: officialRate,
                    date: today,
                  })
                  console.log(`✓ Found ${currency} rate: ${officialRate} GEL per 1 ${currency}`)
                } else {
                  console.warn(`Rate for ${currency} is 0 or invalid:`, rateData)
                }
              } else {
                console.warn(`No rate data found for ${currency} in NBG API response`)
              }
            }
          } 
          // Handle object format
          else if (typeof data === 'object' && !Array.isArray(data)) {
            console.log('NBG API returned object format')
            
            for (const currency of currencies) {
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
                
                if (officialRate > 0) {
                  rates.push({
                    currency_code: currency,
                    buy_rate: officialRate * 1.005,
                    sell_rate: officialRate * 0.995,
                    official_rate: officialRate,
                    date: today,
                  })
                  console.log(`✓ Found ${currency} rate: ${officialRate} GEL per 1 ${currency}`)
                }
              }
            }
          }

          if (rates.length >= 3) {
            console.log('✓ Successfully fetched all rates from NBG API:', rates)
            return rates
          } else {
            console.warn(`Only found ${rates.length} rates, expected 3`)
          }
        }
      } catch (error: any) {
        console.warn(`NBG endpoint failed:`, error.message)
        if (error.response) {
          console.warn(`Response status: ${error.response.status}`)
          console.warn(`Response data:`, error.response.data)
        }
      }
    } catch (error: any) {
      console.warn('NBG API failed:', error.message)
    }

    // Method 2: Try Bank of Georgia API (may require auth)
    try {
      console.log('Trying Bank of Georgia API...')
      
      const bogBaseUrls = [
        'https://businessmanager.bog.ge',
        'https://api.bog.ge',
      ]

      for (const baseUrl of bogBaseUrls) {
        try {
          for (const currency of currencies) {
            const url = `${baseUrl}/api/rates/nbg/${currency}`
            try {
              const response = await axios.get(url, {
                timeout: 3000, // Reduced from 8s to 3s
                headers: {
                  'Accept': 'application/json',
                },
              })

              console.log(`BOG API response for ${currency}:`, response.data)

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
                  buy_rate: officialRate * 1.005,
                  sell_rate: officialRate * 0.995,
                  official_rate: officialRate,
                  date: today,
                })
                console.log(`Found ${currency} rate from BOG: ${officialRate}`)
              }
            } catch (error: any) {
              console.warn(`BOG API failed for ${currency}:`, error.message)
              continue
            }
          }

          if (rates.length >= 3) {
            console.log('Successfully fetched rates from BOG API:', rates)
            return rates
          }
        } catch (error: any) {
          console.warn(`BOG base URL ${baseUrl} failed:`, error.message)
          continue
        }
      }
    } catch (error: any) {
      console.warn('BOG API failed:', error.message)
    }

    // Method 3: Try exchangerate-api.com as fallback
    try {
      console.log('Trying exchangerate-api.com as fallback...')
      
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD', {
        timeout: 5000, // Reduced from 10s to 5s
        headers: {
          'Accept': 'application/json',
        },
      })

      if (response.data && response.data.rates) {
        const usdRates = response.data.rates
        const gelRate = usdRates['GEL']
        
        if (gelRate && gelRate > 0) {
          // USD rate
          rates.push({
            currency_code: 'USD',
            buy_rate: gelRate * 1.005,
            sell_rate: gelRate * 0.995,
            official_rate: gelRate,
            date: today,
          })

          // EUR rate
          const eurToUsd = usdRates['EUR']
          if (eurToUsd && eurToUsd > 0) {
            const eurToGel = eurToUsd * gelRate
            rates.push({
              currency_code: 'EUR',
              buy_rate: eurToGel * 1.005,
              sell_rate: eurToGel * 0.995,
              official_rate: eurToGel,
              date: today,
            })
          }

          // RUB rate
          const rubToUsd = usdRates['RUB']
          if (rubToUsd && rubToUsd > 0) {
            const rubToGel = rubToUsd * gelRate
            rates.push({
              currency_code: 'RUB',
              buy_rate: rubToGel * 1.005,
              sell_rate: rubToGel * 0.995,
              official_rate: rubToGel,
              date: today,
            })
          }

          if (rates.length >= 3) {
            console.log('Successfully fetched rates from exchangerate-api.com:', rates)
            return rates
          }
        }
      }
    } catch (error: any) {
      console.warn('exchangerate-api.com failed:', error.message)
    }

    // Fallback: Use mock data if all APIs fail
    if (rates.length === 0) {
      console.warn('All API methods failed, using fallback rates')
      return getFallbackExchangeRates()
    }

    // If we got some but not all rates, fill missing ones with fallback
    const fallbackRates = getFallbackExchangeRates()
    const existingCurrencies = new Set(rates.map(r => r.currency_code))
    
    for (const fallbackRate of fallbackRates) {
      if (!existingCurrencies.has(fallbackRate.currency_code)) {
        rates.push(fallbackRate)
      }
    }

    console.log('Final rates:', rates)
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


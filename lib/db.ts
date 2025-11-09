import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY

// Lazy initialization - only create client when needed
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in your .env.local file.')
  }
  
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseKey)
  }
  
  return supabaseInstance
}

// Export a getter function instead of direct client
export function getSupabase(): SupabaseClient {
  return getSupabaseClient()
}

// For backward compatibility, export supabase but make it lazy
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseClient()[prop as keyof SupabaseClient]
  }
})

// Database types
export interface ExchangeRate {
  id?: number
  currency_code: string
  buy_rate: number
  sell_rate: number
  official_rate: number
  date: string
  created_at?: string
}

export interface PetrolPrice {
  id?: number
  company_name: string
  fuel_type: string
  price: number
  date: string
  created_at?: string
}

export interface ElectricityTariff {
  id?: number
  region: string
  tariff_type: string
  price_per_kwh: number
  date: string
  created_at?: string
}

export interface RefreshLog {
  id?: number
  data_type: string
  status: 'success' | 'error'
  records_updated: number
  error_message?: string
  created_at?: string
}

// Exchange Rates functions
export async function getLatestExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const client = getSupabaseClient()
    
    // Get the latest date first
    const { data: latestDateData, error: dateError } = await client
      .from('exchange_rates')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (dateError && dateError.code !== 'PGRST116') throw dateError
    
    if (!latestDateData || !latestDateData.date) {
      return []
    }

    const latestDate = latestDateData.date

    // Get all rates for the latest date, ordered by created_at DESC to get the most recent
    const { data, error } = await client
      .from('exchange_rates')
      .select('*')
      .eq('date', latestDate)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get the latest rate for each currency (first occurrence since we ordered by created_at DESC)
    const latestRates: ExchangeRate[] = []
    const seen = new Set<string>()

    for (const rate of data || []) {
      if (!seen.has(rate.currency_code)) {
        latestRates.push(rate)
        seen.add(rate.currency_code)
      }
    }

    // Sort by currency code for consistent ordering
    latestRates.sort((a, b) => a.currency_code.localeCompare(b.currency_code))

    return latestRates
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      return []
    }
    throw error
  }
}

export async function getYesterdayExchangeRates(): Promise<ExchangeRate[]> {
  try {
    const client = getSupabaseClient()
    
    // First, get the latest date in the database
    const { data: latestDateData, error: dateError } = await client
      .from('exchange_rates')
      .select('date')
      .order('date', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (dateError && dateError.code !== 'PGRST116') throw dateError
    
    if (!latestDateData || !latestDateData.date) {
      return []
    }

    const latestDate = latestDateData.date
    
    // Get the previous date (yesterday relative to the latest date)
    // Handle date as string (YYYY-MM-DD format from database)
    let previousDate: string
    if (typeof latestDate === 'string') {
      const latestDateObj = new Date(latestDate + 'T00:00:00') // Add time to avoid timezone issues
      const previousDateObj = new Date(latestDateObj)
      previousDateObj.setDate(previousDateObj.getDate() - 1)
      previousDate = previousDateObj.toISOString().split('T')[0]
    } else {
      // If it's already a Date object
      const previousDateObj = new Date(latestDate)
      previousDateObj.setDate(previousDateObj.getDate() - 1)
      previousDate = previousDateObj.toISOString().split('T')[0]
    }
    
    console.log('[getYesterdayExchangeRates] Latest date:', latestDate, 'Type:', typeof latestDate)
    console.log('[getYesterdayExchangeRates] Previous date:', previousDate)
    
    // Also try to get all dates to see what's available
    const { data: allDates } = await client
      .from('exchange_rates')
      .select('date')
      .order('date', { ascending: false })
    
    console.log('[getYesterdayExchangeRates] All available dates:', allDates?.map((d: any) => d.date).filter((v: any, i: number, a: any[]) => a.indexOf(v) === i))
    
    // Get all rates for the previous date
    const { data, error } = await client
      .from('exchange_rates')
      .select('*')
      .eq('date', previousDate)
      .order('created_at', { ascending: false })
    
    console.log('[getYesterdayExchangeRates] Found', data?.length || 0, 'rates for date', previousDate)
    
    // If no data found, try a different approach - get all rates and filter manually
    // This handles cases where Supabase date comparison might not work as expected
    if (!data || data.length === 0) {
      console.log('[getYesterdayExchangeRates] No rates found with .eq(), trying manual filter...')
      const { data: allRates, error: allRatesError } = await client
        .from('exchange_rates')
        .select('*')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
      
      if (allRatesError) {
        console.error('[getYesterdayExchangeRates] Error fetching all rates:', allRatesError)
      } else {
        console.log('[getYesterdayExchangeRates] All rates dates:', allRates?.map((r: any) => ({ 
          date: r.date, 
          dateType: typeof r.date,
          dateStr: typeof r.date === 'string' ? r.date : r.date?.toISOString()?.split('T')[0],
          currency: r.currency_code 
        })))
        
        // Filter manually by comparing date strings
        // Handle both string dates and Date objects
        const filtered = allRates?.filter((rate: any) => {
          let rateDateStr: string
          if (typeof rate.date === 'string') {
            // If it's already a string, use it directly (might be 'YYYY-MM-DD' or ISO string)
            rateDateStr = rate.date.split('T')[0] // Take only date part if it's ISO
          } else if (rate.date instanceof Date) {
            rateDateStr = rate.date.toISOString().split('T')[0]
          } else {
            // Fallback: try to convert
            rateDateStr = new Date(rate.date).toISOString().split('T')[0]
          }
          
          const matches = rateDateStr === previousDate
          if (matches) {
            console.log('[getYesterdayExchangeRates] Match found:', rate.currency_code, rateDateStr, '===', previousDate)
          }
          return matches
        })
        
        console.log('[getYesterdayExchangeRates] Manually filtered:', filtered?.length || 0, 'rates')
        
        if (filtered && filtered.length > 0) {
          // Use the filtered data
          const previousRates: ExchangeRate[] = []
          const seen = new Set<string>()
          
          for (const rate of filtered) {
            if (!seen.has(rate.currency_code)) {
              previousRates.push(rate)
              seen.add(rate.currency_code)
            }
          }
          
          previousRates.sort((a, b) => a.currency_code.localeCompare(b.currency_code))
          console.log('[getYesterdayExchangeRates] Returning', previousRates.length, 'manually filtered rates')
          return previousRates
        }
      }
    }

    if (error) throw error

    // Get the latest rate for each currency for the previous date
    const previousRates: ExchangeRate[] = []
    const seen = new Set<string>()

    for (const rate of data || []) {
      if (!seen.has(rate.currency_code)) {
        previousRates.push(rate)
        seen.add(rate.currency_code)
      }
    }

    // Sort by currency code for consistent ordering
    previousRates.sort((a, b) => a.currency_code.localeCompare(b.currency_code))
    
    console.log('[getYesterdayExchangeRates] Returning', previousRates.length, 'unique rates')

    return previousRates
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      return []
    }
    throw error
  }
}

export async function getExchangeRateHistory(
  currencyCode: string,
  days: number = 30
): Promise<ExchangeRate[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('exchange_rates')
      .select('*')
      .eq('currency_code', currencyCode)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      return []
    }
    throw error
  }
}

export async function insertExchangeRate(rate: ExchangeRate): Promise<void> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('exchange_rates')
      .upsert(rate, { onConflict: 'currency_code,date' })

    if (error) throw error
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      console.warn('Cannot save to database: Supabase not configured')
      return
    }
    throw error
  }
}

// Petrol Prices functions
export async function getLatestPetrolPrices(): Promise<PetrolPrice[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('petrol_prices')
      .select('*')
      .order('date', { ascending: false })
      .order('company_name', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      return []
    }
    throw error
  }
}

export async function insertPetrolPrice(price: PetrolPrice): Promise<void> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('petrol_prices')
      .upsert(price, { onConflict: 'company_name,fuel_type,date' })

    if (error) throw error
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      console.warn('Cannot save to database: Supabase not configured')
      return
    }
    throw error
  }
}

// Electricity Tariffs functions
export async function getLatestElectricityTariffs(): Promise<ElectricityTariff[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('electricity_tariffs')
      .select('*')
      .order('date', { ascending: false })
      .order('region', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      return []
    }
    throw error
  }
}

export async function insertElectricityTariff(tariff: ElectricityTariff): Promise<void> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('electricity_tariffs')
      .upsert(tariff, { onConflict: 'region,tariff_type,date' })

    if (error) throw error
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      console.warn('Cannot save to database: Supabase not configured')
      return
    }
    throw error
  }
}

// Refresh Logs functions
export async function insertRefreshLog(log: RefreshLog): Promise<void> {
  try {
    const client = getSupabaseClient()
    const { error } = await client
      .from('refresh_logs')
      .insert(log)

    if (error) throw error
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      console.warn('Cannot save refresh log: Supabase not configured')
      return
    }
    throw error
  }
}

export async function getRecentRefreshLogs(limit: number = 10): Promise<RefreshLog[]> {
  try {
    const client = getSupabaseClient()
    const { data, error } = await client
      .from('refresh_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error: any) {
    if (error.message?.includes('Missing Supabase')) {
      return []
    }
    throw error
  }
}


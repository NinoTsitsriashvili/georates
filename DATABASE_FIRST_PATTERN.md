# Database-First Pattern for Dynamic Values

## Principle
**ALL dynamic values must come from the database and be calculated server-side. No client-side calculations or caching.**

## Pattern for Exchange Rates (Example)

### 1. API Route (`app/api/exchange-rates/route.ts`)

```typescript
// ✅ DO: Calculate everything server-side from database
const ratesWithChange = rates.map((rate: any) => {
  const yesterdayRate = yesterdayMap.get(rate.currency_code)
  const previousRate = yesterdayRate !== undefined ? yesterdayRate : rate.official_rate
  
  // Calculate ALL values from database
  const change = rate.official_rate - previousRate
  const changePercent = ((change / previousRate) * 100).toFixed(2)
  const isPositive = change > 0
  const isNegative = change < 0
  
  return {
    ...rate,
    // Database values
    buy_rate: rate.buy_rate,
    official_rate: rate.official_rate,
    // Calculated values (from database)
    previous_rate: previousRate,
    change: change,
    change_percent: changePercent,
    is_positive: isPositive,
    is_negative: isNegative,
    // Metadata
    calculated_at: new Date().toISOString(),
  }
})

// ✅ DO: Return with NO CACHING headers
return NextResponse.json({ 
  rates: ratesWithChange,
  timestamp: new Date().toISOString(),
}, {
  headers: {
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  }
})
```

### 2. Component (`components/ExchangeRatesCard.tsx`)

```typescript
// ✅ DO: Use pre-calculated values from API
const getChangeIndicator = (rate: RateWithChange) => {
  // All values come from database via API
  const changePercent = rate.change_percent || '0.00'
  const isPositive = rate.is_positive || false
  
  return (
    <div className={isPositive ? 'text-green-600' : 'text-red-600'}>
      {changePercent}%
    </div>
  )
}

// ❌ DON'T: Calculate on client-side
// const change = rate.official_rate - rate.previous_rate  // ❌ NO!
```

### 3. Auto-Refresh

```typescript
// ✅ DO: Auto-refresh every 10 seconds
useEffect(() => {
  fetchRates(true)
  const interval = setInterval(() => fetchRates(false), 10 * 1000)
  return () => clearInterval(interval)
}, [])

// ✅ DO: Add cache-busting to fetch
const res = await fetch(`/api/exchange-rates?t=${Date.now()}`, {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
})
```

## Rules for Future Dynamic Values

1. **Always calculate server-side** - Never calculate on client
2. **Always query fresh from database** - No caching in API routes
3. **Always send pre-calculated values** - Include all derived values in API response
4. **Always disable caching** - Use proper cache headers
5. **Always auto-refresh** - Update every 10-30 seconds
6. **Always add timestamp** - Include `calculated_at` or `timestamp` in response

## Example: Adding a New Dynamic Value

### Step 1: Add to Database Query
```typescript
// In lib/db.ts
export async function getLatestRates() {
  // Query database
  const { data } = await supabase.from('rates').select('*')
  return data
}
```

### Step 2: Calculate Server-Side
```typescript
// In app/api/rates/route.ts
const rates = await getLatestRates()
const enrichedRates = rates.map(rate => ({
  ...rate,
  // Calculate new value from database
  new_calculated_value: rate.value * 1.1,
  calculated_at: new Date().toISOString(),
}))
```

### Step 3: Use in Component
```typescript
// In component
<div>{rate.new_calculated_value}</div>  // ✅ Pre-calculated
```

## Benefits

- ✅ Database changes reflect immediately (within 10 seconds)
- ✅ No stale data or caching issues
- ✅ Single source of truth (database)
- ✅ Easy to debug (all values in API response)
- ✅ Consistent pattern for all features


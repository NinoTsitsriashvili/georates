# How to Update Database with Real Exchange Rates

## Method 1: Using API Endpoint (Easiest - Recommended)

### Step 1: Visit the API endpoint
Go to: `https://georates.vercel.app/api/refresh`

Or use curl:
```bash
curl -X POST https://georates.vercel.app/api/refresh \
  -H "Authorization: Bearer GeoRates2024Secure!"
```

### Step 2: Check the response
You should see:
```json
{
  "success": true,
  "message": "Data refresh completed",
  "exchangeRates": 3,
  "petrolPrices": 12,
  "electricityTariffs": 8
}
```

## Method 2: Using GitHub Actions (Automatic)

### Step 1: Go to GitHub Actions
Visit: https://github.com/NinoTsitsriashvili/georates/actions

### Step 2: Run workflow manually
1. Click "Daily Data Refresh"
2. Click "Run workflow" button
3. Click "Run workflow" again
4. Wait 1-2 minutes for it to complete

### Step 3: Check the logs
Click on the running workflow to see the logs and verify it succeeded.

## Method 3: Run Locally (If you have .env.local)

### Step 1: Make sure .env.local exists
```bash
cd georates
# Check if .env.local has Supabase credentials
cat .env.local
```

### Step 2: Run the fetch script
```bash
npm run data:fetch
```

### Step 3: Check the output
You should see:
```
🚀 Starting data refresh...
✅ Data refresh completed in X.XX seconds
- Exchange Rates: 3 records
- Petrol Prices: 12 records
- Electricity Tariffs: 8 records
```

## What Gets Updated

The script will:
1. **Fetch real exchange rates** from:
   - National Bank of Georgia API
   - Bank of Georgia API (fallback)
   - exchangerate-api.com (fallback)

2. **Fetch petrol prices** by scraping:
   - Gulf Georgia
   - Wissol
   - Socar

3. **Save electricity tariffs** (static data)

4. **Save everything to Supabase** with today's date

## Verify the Update

### Check in Supabase
Run this SQL in Supabase SQL Editor:
```sql
SELECT 
  currency_code,
  date,
  official_rate,
  buy_rate,
  sell_rate,
  created_at
FROM exchange_rates
ORDER BY date DESC, currency_code
LIMIT 10;
```

### Check on Website
1. Visit: https://georates.vercel.app
2. The rates should show real data from today
3. Refresh the page if needed

## Schedule Automatic Updates

The cron job is already set up to run daily at 2:00 AM UTC (6:00 AM Georgia time).

To verify it's working:
1. Go to: https://github.com/NinoTsitsriashvili/georates/actions
2. Check "Daily Data Refresh" workflow
3. It should show recent successful runs


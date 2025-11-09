# 🔧 Fix Exchange Rates - Manual Update Guide

## Problem
The database has old/wrong exchange rates that aren't updating via the API refresh.

## Root Cause
1. Old code with wrong conversion formula was deployed
2. Database has stale data from old calculations
3. Upsert may not be updating existing records properly

## Solution

### Option 1: Manual SQL Update (FASTEST - Recommended)

Run this SQL in your Supabase SQL Editor to manually update today's rates:

```sql
-- Delete all today's rates
DELETE FROM exchange_rates WHERE date = CURRENT_DATE;

-- Insert correct rates for today
INSERT INTO exchange_rates (currency_code, buy_rate, sell_rate, official_rate, date) VALUES
  ('USD', 2.7235, 2.6965, 2.71, CURRENT_DATE),
  ('EUR', 3.1486, 3.1173, 3.1329, CURRENT_DATE),
  ('RUB', 0.0336, 0.0333, 0.0335, CURRENT_DATE)
ON CONFLICT (currency_code, date) 
DO UPDATE SET
  buy_rate = EXCLUDED.buy_rate,
  sell_rate = EXCLUDED.sell_rate,
  official_rate = EXCLUDED.official_rate,
  created_at = CURRENT_TIMESTAMP;

-- Verify
SELECT currency_code, official_rate, buy_rate, sell_rate, date, created_at 
FROM exchange_rates 
WHERE date = CURRENT_DATE 
ORDER BY currency_code;
```

### Option 2: Wait for Vercel Deployment

1. Check Vercel dashboard: https://vercel.com/dashboard
2. Find your project → Deployments tab
3. Wait for latest deployment to finish (should show commit `601eeaf`)
4. Once deployed, trigger refresh:
   ```bash
   curl -X POST https://georates.vercel.app/api/refresh \
     -H "Authorization: Bearer GeoRates2024Secure!"
   ```

### Option 3: Force Update via Admin Panel

1. Go to: https://georates.vercel.app/admin
2. Login with your admin password
3. Click "Refresh Data" button
4. Wait for completion
5. Check homepage to verify rates updated

## Expected Correct Rates

- **USD**: 2.71 GEL (buy: 2.7235, sell: 2.6965)
- **EUR**: 3.13 GEL (buy: 3.1486, sell: 3.1173)  
- **RUB**: 0.0335 GEL (buy: 0.0336, sell: 0.0333)

## Verification

After updating, check:
1. API: `https://georates.vercel.app/api/exchange-rates`
2. Homepage: `https://georates.vercel.app`
3. Database: Run SQL query in Supabase to verify values

## What Was Fixed

1. ✅ Exchange rate conversion formula (gelRate / foreignRate, not multiply)
2. ✅ Added cleanup step to delete old records before insert
3. ✅ Improved error handling and logging
4. ✅ Simplified upsert logic

The code is correct now - the issue is that Vercel needs to deploy the latest version, or you can manually update the database using Option 1 above.


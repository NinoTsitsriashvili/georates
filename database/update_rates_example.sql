-- How to Update Exchange Rates in Supabase
-- Run these in Supabase SQL Editor

-- Method 1: Update a specific rate by currency and date
UPDATE exchange_rates
SET 
  buy_rate = 2.70,
  sell_rate = 2.68,
  official_rate = 2.69
WHERE currency_code = 'USD' 
  AND date = '2025-11-09';

-- Method 2: Update all rates for a specific date
UPDATE exchange_rates
SET 
  buy_rate = buy_rate * 1.01,  -- Increase by 1%
  sell_rate = sell_rate * 1.01,
  official_rate = official_rate * 1.01
WHERE date = '2025-11-09';

-- Method 3: Update a specific currency across all dates (be careful!)
UPDATE exchange_rates
SET 
  official_rate = 2.65
WHERE currency_code = 'USD';

-- Method 4: Update yesterday's rates to test percentage changes
-- First, see what today's rates are:
SELECT currency_code, date, official_rate 
FROM exchange_rates 
WHERE date = '2025-11-09'
ORDER BY currency_code;

-- Then update yesterday's rates (2025-11-08) to be different:
UPDATE exchange_rates
SET 
  buy_rate = 2.60,      -- Lower than today
  sell_rate = 2.58,
  official_rate = 2.59  -- This will show +3.87% increase
WHERE currency_code = 'USD' 
  AND date = '2025-11-08';

UPDATE exchange_rates
SET 
  buy_rate = 2.90,      -- Higher than today
  sell_rate = 2.88,
  official_rate = 2.89  -- This will show -0.69% decrease
WHERE currency_code = 'EUR' 
  AND date = '2025-11-08';

UPDATE exchange_rates
SET 
  buy_rate = 0.028,     -- Lower than today
  sell_rate = 0.027,
  official_rate = 0.0275  -- This will show an increase
WHERE currency_code = 'RUB' 
  AND date = '2025-11-08';

-- Verify the changes
SELECT 
  currency_code,
  date,
  official_rate,
  buy_rate,
  sell_rate
FROM exchange_rates
WHERE date IN ('2025-11-08', '2025-11-09')
ORDER BY date DESC, currency_code;


-- Create Yesterday's Mock Exchange Rates Data
-- This script takes today's rates and creates yesterday's rates with slight variations
-- Run this in your Supabase SQL Editor

-- First, let's see what today's rates are
-- Then create yesterday's rates based on them

-- Step 1: Get today's date and yesterday's date
DO $$
DECLARE
  today_date DATE;
  yesterday_date DATE;
  today_rate RECORD;
BEGIN
  -- Get the latest date from exchange_rates
  SELECT MAX(date) INTO today_date FROM exchange_rates;
  
  -- Calculate yesterday (previous day)
  yesterday_date := today_date - INTERVAL '1 day';
  
  -- If no data exists, use current date
  IF today_date IS NULL THEN
    today_date := CURRENT_DATE;
    yesterday_date := CURRENT_DATE - INTERVAL '1 day';
  END IF;
  
  RAISE NOTICE 'Today date: %', today_date;
  RAISE NOTICE 'Yesterday date: %', yesterday_date;
  
  -- Step 2: For each currency in today's rates, create yesterday's rate with variation
  FOR today_rate IN 
    SELECT DISTINCT ON (currency_code)
      currency_code,
      buy_rate,
      sell_rate,
      official_rate
    FROM exchange_rates
    WHERE date = today_date
    ORDER BY currency_code, created_at DESC
  LOOP
    -- Insert yesterday's rate with slight variation (±1-2%)
    -- USD: slightly lower yesterday (so today shows increase)
    -- EUR: slightly higher yesterday (so today shows decrease)
    -- RUB: slightly lower yesterday (so today shows increase)
    
    INSERT INTO exchange_rates (
      currency_code,
      buy_rate,
      sell_rate,
      official_rate,
      date
    ) VALUES (
      today_rate.currency_code,
      CASE 
        WHEN today_rate.currency_code = 'USD' THEN today_rate.buy_rate * 0.98  -- 2% lower
        WHEN today_rate.currency_code = 'EUR' THEN today_rate.buy_rate * 1.015 -- 1.5% higher
        WHEN today_rate.currency_code = 'RUB' THEN today_rate.buy_rate * 0.99   -- 1% lower
        ELSE today_rate.buy_rate * 0.995 -- 0.5% lower default
      END,
      CASE 
        WHEN today_rate.currency_code = 'USD' THEN today_rate.sell_rate * 0.98
        WHEN today_rate.currency_code = 'EUR' THEN today_rate.sell_rate * 1.015
        WHEN today_rate.currency_code = 'RUB' THEN today_rate.sell_rate * 0.99
        ELSE today_rate.sell_rate * 0.995
      END,
      CASE 
        WHEN today_rate.currency_code = 'USD' THEN today_rate.official_rate * 0.98
        WHEN today_rate.currency_code = 'EUR' THEN today_rate.official_rate * 1.015
        WHEN today_rate.currency_code = 'RUB' THEN today_rate.official_rate * 0.99
        ELSE today_rate.official_rate * 0.995
      END,
      yesterday_date
    )
    ON CONFLICT (currency_code, date) 
    DO UPDATE SET
      buy_rate = EXCLUDED.buy_rate,
      sell_rate = EXCLUDED.sell_rate,
      official_rate = EXCLUDED.official_rate,
      created_at = CURRENT_TIMESTAMP;
    
    RAISE NOTICE 'Created yesterday rate for %: % (today was %)', 
      today_rate.currency_code, 
      CASE 
        WHEN today_rate.currency_code = 'USD' THEN today_rate.official_rate * 0.98
        WHEN today_rate.currency_code = 'EUR' THEN today_rate.official_rate * 1.015
        WHEN today_rate.currency_code = 'RUB' THEN today_rate.official_rate * 0.99
        ELSE today_rate.official_rate * 0.995
      END,
      today_rate.official_rate;
  END LOOP;
  
  RAISE NOTICE '✅ Successfully created yesterday''s mock data!';
END $$;

-- Verify the data was created
SELECT 
  currency_code,
  date,
  official_rate,
  buy_rate,
  sell_rate,
  created_at
FROM exchange_rates
WHERE date >= (SELECT MAX(date) - INTERVAL '1 day' FROM exchange_rates)
ORDER BY date DESC, currency_code;


-- Check what dates are actually in your database
-- Run this in Supabase SQL Editor to see all dates and rates

SELECT 
  currency_code,
  date,
  official_rate,
  created_at,
  TO_CHAR(date, 'YYYY-MM-DD') as date_string
FROM exchange_rates
ORDER BY date DESC, currency_code;

-- Check if you have data for two different dates
SELECT 
  date,
  COUNT(*) as rate_count,
  STRING_AGG(DISTINCT currency_code, ', ') as currencies
FROM exchange_rates
GROUP BY date
ORDER BY date DESC;

-- Check the date difference between latest and previous
WITH date_ranks AS (
  SELECT 
    date,
    ROW_NUMBER() OVER (ORDER BY date DESC) as rn
  FROM (
    SELECT DISTINCT date 
    FROM exchange_rates
  ) dates
)
SELECT 
  (SELECT date FROM date_ranks WHERE rn = 1) as latest_date,
  (SELECT date FROM date_ranks WHERE rn = 2) as previous_date,
  (SELECT date FROM date_ranks WHERE rn = 1) - (SELECT date FROM date_ranks WHERE rn = 2) as date_difference;


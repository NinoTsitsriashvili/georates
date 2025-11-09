-- GeoRates Database Schema
-- Run this in your Supabase SQL editor or PostgreSQL database

-- Exchange Rates Table
CREATE TABLE IF NOT EXISTS exchange_rates (
  id SERIAL PRIMARY KEY,
  currency_code VARCHAR(3) NOT NULL,
  buy_rate DECIMAL(10, 4) NOT NULL,
  sell_rate DECIMAL(10, 4) NOT NULL,
  official_rate DECIMAL(10, 4) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(currency_code, date)
);

CREATE INDEX idx_exchange_rates_date ON exchange_rates(date);
CREATE INDEX idx_exchange_rates_currency ON exchange_rates(currency_code);

-- Petrol Prices Table
CREATE TABLE IF NOT EXISTS petrol_prices (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  fuel_type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(company_name, fuel_type, date)
);

CREATE INDEX idx_petrol_prices_date ON petrol_prices(date);
CREATE INDEX idx_petrol_prices_company ON petrol_prices(company_name);

-- Electricity Tariffs Table
CREATE TABLE IF NOT EXISTS electricity_tariffs (
  id SERIAL PRIMARY KEY,
  region VARCHAR(100) NOT NULL,
  tariff_type VARCHAR(50) NOT NULL,
  price_per_kwh DECIMAL(10, 4) NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(region, tariff_type, date)
);

CREATE INDEX idx_electricity_tariffs_date ON electricity_tariffs(date);
CREATE INDEX idx_electricity_tariffs_region ON electricity_tariffs(region);

-- Data Refresh Logs Table
CREATE TABLE IF NOT EXISTS refresh_logs (
  id SERIAL PRIMARY KEY,
  data_type VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL,
  records_updated INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_logs_created_at ON refresh_logs(created_at);
CREATE INDEX idx_refresh_logs_data_type ON refresh_logs(data_type);

-- Function to get latest exchange rates
CREATE OR REPLACE FUNCTION get_latest_exchange_rates()
RETURNS TABLE (
  currency_code VARCHAR(3),
  buy_rate DECIMAL(10, 4),
  sell_rate DECIMAL(10, 4),
  official_rate DECIMAL(10, 4),
  date DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT ON (er.currency_code)
    er.currency_code,
    er.buy_rate,
    er.sell_rate,
    er.official_rate,
    er.date
  FROM exchange_rates er
  ORDER BY er.currency_code, er.date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get exchange rate history
CREATE OR REPLACE FUNCTION get_exchange_rate_history(
  p_currency_code VARCHAR(3),
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  buy_rate DECIMAL(10, 4),
  sell_rate DECIMAL(10, 4),
  official_rate DECIMAL(10, 4)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    er.date,
    er.buy_rate,
    er.sell_rate,
    er.official_rate
  FROM exchange_rates er
  WHERE er.currency_code = p_currency_code
    AND er.date >= CURRENT_DATE - INTERVAL '1 day' * p_days
  ORDER BY er.date ASC;
END;
$$ LANGUAGE plpgsql;


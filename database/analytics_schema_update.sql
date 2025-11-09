-- Add new columns to analytics_events table for enhanced tracking
-- Run this in Supabase SQL Editor

ALTER TABLE analytics_events 
ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS device_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS device_brand VARCHAR(100),
ADD COLUMN IF NOT EXISTS os_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS os_version VARCHAR(50),
ADD COLUMN IF NOT EXISTS browser_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS browser_version VARCHAR(50);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_country ON analytics_events(country);
CREATE INDEX IF NOT EXISTS idx_analytics_events_device_type ON analytics_events(device_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_os_name ON analytics_events(os_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Function to get visitor locations
CREATE OR REPLACE FUNCTION get_visitor_locations(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  country VARCHAR(100),
  city VARCHAR(100),
  visitor_count BIGINT,
  page_views BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(ae.country, 'Unknown') as country,
    COALESCE(ae.city, 'Unknown') as city,
    COUNT(DISTINCT ae.session_id) as visitor_count,
    COUNT(*) as page_views
  FROM analytics_events ae
  WHERE ae.event_type = 'page_view'
    AND ae.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
  GROUP BY ae.country, ae.city
  ORDER BY visitor_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get device statistics
CREATE OR REPLACE FUNCTION get_device_stats(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  device_type VARCHAR(50),
  device_count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_devices BIGINT;
BEGIN
  SELECT COUNT(DISTINCT session_id) INTO total_devices
  FROM analytics_events
  WHERE event_type = 'page_view'
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days;
  
  RETURN QUERY
  SELECT
    COALESCE(ae.device_type, 'Unknown') as device_type,
    COUNT(DISTINCT ae.session_id) as device_count,
    CASE 
      WHEN total_devices > 0 THEN ROUND((COUNT(DISTINCT ae.session_id)::NUMERIC / total_devices::NUMERIC) * 100, 2)
      ELSE 0
    END as percentage
  FROM analytics_events ae
  WHERE ae.event_type = 'page_view'
    AND ae.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
  GROUP BY ae.device_type
  ORDER BY device_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get OS statistics
CREATE OR REPLACE FUNCTION get_os_stats(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  os_name VARCHAR(100),
  os_version VARCHAR(50),
  device_count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_devices BIGINT;
BEGIN
  SELECT COUNT(DISTINCT session_id) INTO total_devices
  FROM analytics_events
  WHERE event_type = 'page_view'
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days;
  
  RETURN QUERY
  SELECT
    COALESCE(ae.os_name, 'Unknown') as os_name,
    COALESCE(ae.os_version, '') as os_version,
    COUNT(DISTINCT ae.session_id) as device_count,
    CASE 
      WHEN total_devices > 0 THEN ROUND((COUNT(DISTINCT ae.session_id)::NUMERIC / total_devices::NUMERIC) * 100, 2)
      ELSE 0
    END as percentage
  FROM analytics_events ae
  WHERE ae.event_type = 'page_view'
    AND ae.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
  GROUP BY ae.os_name, ae.os_version
  ORDER BY device_count DESC;
END;
$$ LANGUAGE plpgsql;


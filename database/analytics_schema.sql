-- Analytics Events Schema
-- Run this in Supabase SQL Editor after the main schema

-- Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  language VARCHAR(10),
  referrer VARCHAR(1000),
  user_agent TEXT,
  screen_width INTEGER,
  screen_height INTEGER,
  session_id VARCHAR(100),
  user_id VARCHAR(100),
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast queries
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_page ON analytics_events(page_path);
CREATE INDEX idx_analytics_events_language ON analytics_events(language);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_session ON analytics_events(session_id);

-- Page Views Summary Table (for faster analytics queries)
CREATE TABLE IF NOT EXISTS analytics_page_views (
  id BIGSERIAL PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  view_count INTEGER DEFAULT 1,
  unique_visitors INTEGER DEFAULT 1,
  last_viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_path)
);

-- Language Usage Summary
CREATE TABLE IF NOT EXISTS analytics_language_usage (
  id BIGSERIAL PRIMARY KEY,
  language VARCHAR(10) NOT NULL,
  usage_count INTEGER DEFAULT 1,
  unique_sessions INTEGER DEFAULT 1,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(language)
);

-- Daily Stats Table
CREATE TABLE IF NOT EXISTS analytics_daily_stats (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  pages_viewed INTEGER DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0,
  top_language VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_daily_stats_date ON analytics_daily_stats(date);

-- Function to get page views
CREATE OR REPLACE FUNCTION get_page_views(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  page_path VARCHAR(500),
  view_count BIGINT,
  unique_visitors BIGINT,
  last_viewed TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.page_path,
    COUNT(*) as view_count,
    COUNT(DISTINCT ae.session_id) as unique_visitors,
    MAX(ae.created_at) as last_viewed
  FROM analytics_events ae
  WHERE ae.event_type = 'page_view'
    AND ae.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
  GROUP BY ae.page_path
  ORDER BY view_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get language statistics
CREATE OR REPLACE FUNCTION get_language_stats(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  language VARCHAR(10),
  usage_count BIGINT,
  unique_sessions BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_usage BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_usage
  FROM analytics_events
  WHERE event_type = 'page_view'
    AND created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days;
  
  RETURN QUERY
  SELECT
    ae.language,
    COUNT(*) as usage_count,
    COUNT(DISTINCT ae.session_id) as unique_sessions,
    CASE 
      WHEN total_usage > 0 THEN ROUND((COUNT(*)::NUMERIC / total_usage::NUMERIC) * 100, 2)
      ELSE 0
    END as percentage
  FROM analytics_events ae
  WHERE ae.event_type = 'page_view'
    AND ae.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
    AND ae.language IS NOT NULL
  GROUP BY ae.language
  ORDER BY usage_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get daily stats
CREATE OR REPLACE FUNCTION get_daily_stats(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  date DATE,
  total_views BIGINT,
  unique_visitors BIGINT,
  pages_viewed BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    DATE(ae.created_at) as date,
    COUNT(*) as total_views,
    COUNT(DISTINCT ae.session_id) as unique_visitors,
    COUNT(DISTINCT ae.page_path) as pages_viewed
  FROM analytics_events ae
  WHERE ae.event_type = 'page_view'
    AND ae.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days
  GROUP BY DATE(ae.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql;


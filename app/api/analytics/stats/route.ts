import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Get analytics statistics
 * GET /api/analytics/stats?days=30&type=page_views|language|daily
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const type = searchParams.get('type') || 'page_views'
    
    const supabase = getSupabase()
    
    if (type === 'page_views') {
      // Get page views using the function
      const { data, error } = await supabase.rpc('get_page_views', { p_days: days })
      
      if (error) throw error
      
      return NextResponse.json({
        success: true,
        type: 'page_views',
        days,
        data: data || [],
      })
    }
    
    if (type === 'language') {
      // Get language statistics
      const { data, error } = await supabase.rpc('get_language_stats', { p_days: days })
      
      if (error) throw error
      
      return NextResponse.json({
        success: true,
        type: 'language',
        days,
        data: data || [],
      })
    }
    
    if (type === 'daily') {
      // Get daily statistics
      const { data, error } = await supabase.rpc('get_daily_stats', { p_days: days })
      
      if (error) throw error
      
      return NextResponse.json({
        success: true,
        type: 'daily',
        days,
        data: data || [],
      })
    }
    
    if (type === 'overview') {
      // Get overview statistics
      const { data: events, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: false })
        .eq('event_type', 'page_view')
        .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      
      if (eventsError) throw eventsError
      
      const totalViews = events?.length || 0
      const uniqueSessions = new Set(events?.map(e => e.session_id).filter(Boolean)).size
      const uniquePages = new Set(events?.map(e => e.page_path)).size
      
      // Get language breakdown
      const languageCounts: Record<string, number> = {}
      events?.forEach(event => {
        if (event.language) {
          languageCounts[event.language] = (languageCounts[event.language] || 0) + 1
        }
      })
      
      const topLanguage = Object.entries(languageCounts)
        .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
      
      return NextResponse.json({
        success: true,
        type: 'overview',
        days,
        data: {
          totalViews,
          uniqueVisitors: uniqueSessions,
          uniquePages,
          topLanguage,
          languageBreakdown: languageCounts,
        },
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid type. Use: page_views, language, daily, or overview' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics', details: error.message },
      { status: 500 }
    )
  }
}


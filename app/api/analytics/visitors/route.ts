import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Get detailed visitor information
 * GET /api/analytics/visitors?days=30&limit=100
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const limit = parseInt(searchParams.get('limit') || '100')
    
    const supabase = getSupabase()
    
    // Get recent page views with all details
    const { data, error } = await supabase
      .from('analytics_events')
      .select('*')
      .eq('event_type', 'page_view')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    
    // Group by session to show unique visitors
    const visitorsMap = new Map()
    
    data?.forEach((event: any) => {
      const sessionId = event.session_id || 'unknown'
      
      if (!visitorsMap.has(sessionId)) {
        visitorsMap.set(sessionId, {
          session_id: sessionId,
          first_visit: event.created_at,
          last_visit: event.created_at,
          page_views: 1,
          pages: [event.page_path],
          country: event.country || 'Unknown',
          city: event.city || 'Unknown',
          device_type: event.device_type || 'Unknown',
          device_brand: event.device_brand || null,
          os_name: event.os_name || 'Unknown',
          os_version: event.os_version || '',
          browser_name: event.browser_name || 'Unknown',
          browser_version: event.browser_version || '',
          language: event.language || 'Unknown',
          screen_width: event.screen_width,
          screen_height: event.screen_height,
        })
      } else {
        const visitor = visitorsMap.get(sessionId)
        visitor.page_views++
        visitor.last_visit = event.created_at
        if (!visitor.pages.includes(event.page_path)) {
          visitor.pages.push(event.page_path)
        }
      }
    })
    
    const visitors = Array.from(visitorsMap.values())
      .sort((a, b) => new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime())
    
    return NextResponse.json({
      success: true,
      days,
      total: visitors.length,
      visitors,
    })
  } catch (error: any) {
    console.error('Error fetching visitors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch visitors', details: error.message },
      { status: 500 }
    )
  }
}


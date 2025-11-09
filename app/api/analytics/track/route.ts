import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Track analytics events
 * POST /api/analytics/track
 */
export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    
    // Validate required fields
    if (!event.event_type || !event.page_path) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, page_path' },
        { status: 400 }
      )
    }
    
    // Get Supabase client
    const supabase = getSupabase()
    
    // Insert event into database
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: event.event_type,
        page_path: event.page_path,
        page_title: event.page_title || null,
        language: event.language || null,
        referrer: event.referrer || null,
        user_agent: event.user_agent || null,
        screen_width: event.screen_width || null,
        screen_height: event.screen_height || null,
        session_id: event.session_id || null,
        user_id: event.user_id || null,
        metadata: event.metadata || null,
      })
    
    if (error) {
      console.error('Error tracking event:', error)
      return NextResponse.json(
        { error: 'Failed to track event', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in analytics track:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}


import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Test analytics connection
 * GET /api/analytics/test
 */
export async function GET() {
  try {
    const supabase = getSupabase()
    
    // Test if analytics_events table exists
    const { data, error } = await supabase
      .from('analytics_events')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Table does not exist or connection failed',
        details: error.message,
        hint: 'Run database/analytics_schema.sql in Supabase SQL Editor',
      }, { status: 500 })
    }
    
    return NextResponse.json({
      success: true,
      message: 'Analytics table exists and is accessible',
      tableExists: true,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Connection error',
      details: error.message,
    }, { status: 500 })
  }
}


import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every minute

export async function GET() {
  try {
    // Try to get from database if available
    try {
      const db = await import('@/lib/db')
      const client = db.getSupabase()
      
      // Get the most recent successful refresh (any data type)
      const { data, error } = await client
        .from('refresh_logs')
        .select('created_at, data_type, status')
        .eq('status', 'success')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      // If no successful refresh found, try to get any refresh
      if (!data) {
        const { data: anyData } = await client
          .from('refresh_logs')
          .select('created_at')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        
        return NextResponse.json({
          lastUpdate: anyData?.created_at || null,
          success: true,
          source: 'database',
        })
      }

      return NextResponse.json({
        lastUpdate: data.created_at,
        success: true,
        source: 'database',
        dataType: data.data_type,
      })
    } catch (error: any) {
      // If Supabase is not configured, return current time
      if (error.message?.includes('Missing Supabase')) {
        return NextResponse.json({
          lastUpdate: new Date().toISOString(),
          success: true,
          source: 'current_time',
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Error fetching last update:', error)
    // Return current time as fallback
    return NextResponse.json({
      lastUpdate: new Date().toISOString(),
      success: true,
      source: 'fallback',
    })
  }
}


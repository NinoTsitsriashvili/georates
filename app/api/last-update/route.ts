import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // Revalidate every minute

export async function GET() {
  try {
    // Try to get from database if available
    try {
      const db = await import('@/lib/db')
      const client = db.getSupabase()
      
      const { data, error } = await client
        .from('refresh_logs')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      return NextResponse.json({
        lastUpdate: data?.created_at || null,
        success: true,
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


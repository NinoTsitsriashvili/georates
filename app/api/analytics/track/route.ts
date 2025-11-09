import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/db'
import { parseUserAgent } from '@/lib/user-agent-parser'

export const dynamic = 'force-dynamic'

/**
 * Get IP address from request
 */
function getIpAddress(request: NextRequest): string | null {
  // Try various headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  if (realIp) {
    return realIp
  }
  if (cfConnectingIp) {
    return cfConnectingIp
  }
  
  return null
}

/**
 * Get location from IP (using free ip-api.com)
 */
async function getLocationFromIp(ip: string): Promise<{ country?: string; city?: string }> {
  try {
    // Skip private/local IPs
    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('127.') || ip === '::1') {
      return {}
    }
    
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`, {
      headers: { 'Accept': 'application/json' },
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.status === 'success') {
        return {
          country: data.country || null,
          city: data.city || null,
        }
      }
    }
  } catch (error) {
    console.warn('Failed to get location from IP:', error)
  }
  
  return {}
}

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
    
    // Get IP address
    const ipAddress = getIpAddress(request)
    
    // Get location from IP (async, don't block)
    let location: { country?: string | null; city?: string | null } = { country: null, city: null }
    if (ipAddress) {
      location = await getLocationFromIp(ipAddress).catch(() => ({ country: null, city: null }))
    }
    
    // Parse user agent
    const parsedUA = parseUserAgent(event.user_agent)
    
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
        ip_address: ipAddress || null,
        country: location.country || null,
        city: location.city || null,
        device_type: parsedUA.deviceType || null,
        device_brand: parsedUA.deviceBrand || null,
        os_name: parsedUA.osName || null,
        os_version: parsedUA.osVersion || null,
        browser_name: parsedUA.browserName || null,
        browser_version: parsedUA.browserVersion || null,
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


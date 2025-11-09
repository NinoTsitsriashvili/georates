import { NextRequest, NextResponse } from 'next/server'
import { refreshAllData } from '@/lib/fetch-data'

export const dynamic = 'force-dynamic'

/**
 * Refresh endpoint - works for both POST (manual) and GET (cron)
 * For cron jobs: Vercel automatically calls this endpoint
 * For manual: Requires authorization header
 */
export async function GET(request: NextRequest) {
  // Check if this is a Vercel cron job
  // Vercel automatically adds 'x-vercel-cron' header
  // If CRON_SECRET is set, Vercel sends it in the header
  const vercelCronHeader = request.headers.get('x-vercel-cron')
  const cronSecret = process.env.CRON_SECRET
  const adminSecret = process.env.ADMIN_SECRET
  
  // Check for manual authorization (for GitHub Actions or manual calls)
  const authHeader = request.headers.get('authorization')

  // Allow if:
  // 1. It's a Vercel cron job (has x-vercel-cron header)
  //    - If CRON_SECRET is set, verify it matches
  //    - If not set, just check header presence
  // 2. It's authorized via Bearer token (GitHub Actions or manual)
  const isVercelCron = vercelCronHeader !== null && (
    !cronSecret || vercelCronHeader === cronSecret
  )
  const isAuthorized = authHeader === `Bearer ${adminSecret}`

  if (!isVercelCron && !isAuthorized) {
    return NextResponse.json(
      { error: 'Unauthorized', success: false },
      { status: 401 }
    )
  }

  try {
    console.log('Starting data refresh...', new Date().toISOString())
    const result = await refreshAllData()
    console.log('Data refresh completed:', result)

    return NextResponse.json({
      success: true,
      message: 'Data refreshed successfully',
      timestamp: new Date().toISOString(),
      ...result,
    })
  } catch (error: any) {
    console.error('Error refreshing data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to refresh data', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin secret for manual refresh
    const authHeader = request.headers.get('authorization')
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminSecret) {
      return NextResponse.json(
        { error: 'Admin secret not configured', success: false },
        { status: 500 }
      )
    }

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized', success: false },
        { status: 401 }
      )
    }

    console.log('Manual data refresh triggered...', new Date().toISOString())
    const result = await refreshAllData()
    console.log('Manual data refresh completed:', result)

    return NextResponse.json({
      success: true,
      message: 'Data refreshed successfully',
      timestamp: new Date().toISOString(),
      ...result,
    })
  } catch (error: any) {
    console.error('Error refreshing data:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to refresh data', success: false },
      { status: 500 }
    )
  }
}


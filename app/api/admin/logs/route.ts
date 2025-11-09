import { NextResponse } from 'next/server'
import { getRecentRefreshLogs } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const logs = await getRecentRefreshLogs(50)
    return NextResponse.json({ logs, success: true })
  } catch (error: any) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch logs', success: false },
      { status: 500 }
    )
  }
}


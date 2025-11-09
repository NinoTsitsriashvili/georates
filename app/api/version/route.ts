import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Version endpoint to check if latest code is deployed
 */
export async function GET() {
  return NextResponse.json({
    version: '2.0.0-fixed-conversion',
    timestamp: new Date().toISOString(),
    fixes: [
      'Fixed exchange rate conversion formula (divide not multiply)',
      'Added cleanup before insert to ensure fresh data',
      'Improved error handling and logging',
    ],
  })
}


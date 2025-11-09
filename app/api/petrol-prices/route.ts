import { NextResponse } from 'next/server'
import { getLatestPetrolPrices } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const prices = await getLatestPetrolPrices()
    return NextResponse.json({ prices, success: true })
  } catch (error: any) {
    console.error('Error fetching petrol prices:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch petrol prices', success: false },
      { status: 500 }
    )
  }
}


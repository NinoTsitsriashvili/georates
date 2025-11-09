import { NextResponse } from 'next/server'
import { getLatestElectricityTariffs } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const tariffs = await getLatestElectricityTariffs()
    return NextResponse.json({ tariffs, success: true })
  } catch (error: any) {
    console.error('Error fetching electricity tariffs:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch electricity tariffs', success: false },
      { status: 500 }
    )
  }
}


import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Debug environment variables (safe - only shows if variables exist, not their values)
 * GET /api/debug/env
 */
export async function GET() {
  const envCheck = {
    SUPABASE_URL: {
      exists: !!process.env.SUPABASE_URL,
      length: process.env.SUPABASE_URL?.length || 0,
      startsWith: process.env.SUPABASE_URL?.substring(0, 20) || 'missing',
    },
    SUPABASE_ANON_KEY: {
      exists: !!process.env.SUPABASE_ANON_KEY,
      length: process.env.SUPABASE_ANON_KEY?.length || 0,
      startsWith: process.env.SUPABASE_ANON_KEY?.substring(0, 20) || 'missing',
    },
    SUPABASE_SERVICE_ROLE_KEY: {
      exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
      startsWith: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) || 'missing',
    },
    ADMIN_SECRET: {
      exists: !!process.env.ADMIN_SECRET,
      length: process.env.ADMIN_SECRET?.length || 0,
    },
    // Show all env vars that start with SUPABASE
    allSupabaseVars: Object.keys(process.env)
      .filter(key => key.includes('SUPABASE'))
      .map(key => ({
        name: key,
        exists: true,
        length: process.env[key]?.length || 0,
      })),
  }

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
    envCheck,
  })
}


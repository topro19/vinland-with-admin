import { NextRequest, NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const session = await encrypt({
    id: 'demo-client-admin',
    name: 'Demo Client',
    email: 'demo@dewestplaat.nl',
    role: 'SUPER_ADMIN',
    provider: 'demo'
  })

  const redirectTo = request.nextUrl.searchParams.get('redirect') === 'editor' ? '/?edit_mode=true' : '/admin'
  const response = NextResponse.redirect(new URL(redirectTo, request.url))

  response.cookies.set('admin_session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 hours
  })

  return response
}

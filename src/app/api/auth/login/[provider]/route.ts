import { NextRequest, NextResponse } from 'next/server'
import {
  OAuthProvider,
  generateOAuthState,
  getAuthorizationUrl,
  isProviderConfigured,
} from '@/lib/oauth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params

  if (provider !== 'google' && provider !== 'github') {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 })
  }

  const oauthProvider = provider as OAuthProvider

  if (!isProviderConfigured(oauthProvider)) {
    const errorUrl = new URL('/admin/login', request.url)
    errorUrl.searchParams.set('error', 'provider_not_configured')
    errorUrl.searchParams.set('provider', oauthProvider)
    return NextResponse.redirect(errorUrl)
  }

  const state = generateOAuthState()
  const authUrl = getAuthorizationUrl(oauthProvider, state, request.url)

  const response = NextResponse.redirect(authUrl)

  // Store anti-CSRF state in a secure, HTTP-only cookie
  response.cookies.set('oauth_state', `${oauthProvider}:${state}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  })

  return response
}

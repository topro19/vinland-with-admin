import { NextRequest, NextResponse } from 'next/server'
import {
  OAuthProvider,
  exchangeCodeForTokens,
  getUserProfile,
  isEmailAuthorized,
} from '@/lib/oauth'
import { encrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params
  const searchParams = request.nextUrl.searchParams

  const errorParam = searchParams.get('error')
  if (errorParam) {
    const errorDesc = searchParams.get('error_description') || errorParam
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', errorDesc)
    return NextResponse.redirect(url)
  }

  if (provider !== 'google' && provider !== 'github') {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'unsupported_provider')
    return NextResponse.redirect(url)
  }

  const oauthProvider = provider as OAuthProvider
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  // Verify anti-CSRF state cookie
  const storedStateCookie = request.cookies.get('oauth_state')?.value
  if (!storedStateCookie || !state) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'invalid_state')
    return NextResponse.redirect(url)
  }

  const [storedProvider, storedState] = storedStateCookie.split(':')
  if (storedProvider !== oauthProvider || storedState !== state) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'state_mismatch')
    return NextResponse.redirect(url)
  }

  if (!code) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', 'missing_code')
    return NextResponse.redirect(url)
  }

  try {
    // 1. Exchange authorization code for access tokens
    const tokens = await exchangeCodeForTokens(oauthProvider, code, request.url)

    // 2. Retrieve verified user identity
    const profile = await getUserProfile(oauthProvider, tokens.accessToken, tokens.idToken)

    // 3. Check access control authorization
    if (!isEmailAuthorized(profile.email)) {
      const url = new URL('/admin/login', request.url)
      url.searchParams.set('error', 'unauthorized_email')
      url.searchParams.set('email', profile.email)
      return NextResponse.redirect(url)
    }

    // 4. Upsert admin in database if database is connected
    let adminId = `oauth_${profile.provider}_${profile.id}`
    let adminRole = 'SUPER_ADMIN'

    try {
      const existingAdmin = await prisma.admin.findUnique({
        where: { email: profile.email },
      })

      if (existingAdmin) {
        adminId = existingAdmin.id
        adminRole = existingAdmin.role
      } else {
        const adminCount = await prisma.admin.count()
        const assignedRole = adminCount === 0 ? 'SUPER_ADMIN' : 'CONTENT_ADMIN'
        const placeholderHash = crypto.randomBytes(32).toString('hex')

        const created = await prisma.admin.create({
          data: {
            email: profile.email,
            password: placeholderHash,
            role: assignedRole,
          },
        })
        adminId = created.id
        adminRole = created.role
      }

      // Record activity log
      await prisma.activityLog.create({
        data: {
          adminId: adminId,
          action: 'LOGIN',
          details: `Admin signed in via ${oauthProvider.toUpperCase()} SSO (${profile.email})`,
        },
      })
    } catch (dbError) {
      // Graceful fallback if database is offline/unmigrated in serverless
      console.warn('Database sync skipped during OAuth login:', dbError)
    }

    // 5. Generate secure JWT admin session
    const sessionToken = await encrypt({
      id: adminId,
      email: profile.email,
      name: profile.name,
      avatar: profile.avatarUrl,
      role: adminRole,
      provider: oauthProvider,
    })

    // 6. Redirect to admin dashboard with session cookie
    const redirectUrl = new URL('/admin', request.url)
    const response = NextResponse.redirect(redirectUrl)

    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    // Clear one-time oauth state cookie
    response.cookies.delete('oauth_state')

    return response
  } catch (err: any) {
    console.error('OAuth callback error:', err)
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('error', err.message || 'authentication_failed')
    return NextResponse.redirect(url)
  }
}

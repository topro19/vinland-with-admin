import crypto from 'crypto'

export type OAuthProvider = 'google' | 'github'

export interface OAuthUserProfile {
  id: string
  email: string
  name: string
  avatarUrl?: string
  provider: OAuthProvider
}

export function isProviderConfigured(provider: OAuthProvider): boolean {
  if (provider === 'google') {
    return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  }
  if (provider === 'github') {
    return !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  }
  return false
}

export function getBaseUrl(requestUrl?: string): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (requestUrl) {
    const url = new URL(requestUrl)
    return `${url.protocol}//${url.host}`
  }
  return 'http://localhost:3000'
}

export function getRedirectUri(provider: OAuthProvider, requestUrl?: string): string {
  const base = getBaseUrl(requestUrl)
  return `${base}/api/auth/callback/${provider}`
}

export function generateOAuthState(): string {
  return crypto.randomBytes(24).toString('hex')
}

export function getAuthorizationUrl(provider: OAuthProvider, state: string, requestUrl?: string): string {
  const redirectUri = getRedirectUri(provider, requestUrl)

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID || ''
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      state: state,
      access_type: 'online',
      prompt: 'select_account',
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID || ''
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      state: state,
      allow_signup: 'false',
    })
    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  throw new Error(`Unsupported OAuth provider: ${provider}`)
}

export async function exchangeCodeForTokens(
  provider: OAuthProvider,
  code: string,
  requestUrl?: string
): Promise<{ accessToken: string; idToken?: string }> {
  const redirectUri = getRedirectUri(provider, requestUrl)

  if (provider === 'google') {
    const clientId = process.env.GOOGLE_CLIENT_ID || ''
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ''

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`Google token exchange failed: ${err}`)
    }

    const data = await response.json()
    return {
      accessToken: data.access_token,
      idToken: data.id_token,
    }
  }

  if (provider === 'github') {
    const clientId = process.env.GITHUB_CLIENT_ID || ''
    const clientSecret = process.env.GITHUB_CLIENT_SECRET || ''

    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      throw new Error(`GitHub token exchange failed: ${err}`)
    }

    const data = await response.json()
    if (data.error) {
      throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`)
    }

    return {
      accessToken: data.access_token,
    }
  }

  throw new Error(`Unsupported provider: ${provider}`)
}

export async function getUserProfile(
  provider: OAuthProvider,
  accessToken: string,
  idToken?: string
): Promise<OAuthUserProfile> {
  if (provider === 'google') {
    const res = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      throw new Error('Failed to fetch Google userinfo')
    }

    const info = await res.json()
    if (!info.email) {
      throw new Error('Google account has no verified email')
    }

    return {
      id: info.sub,
      email: info.email.toLowerCase(),
      name: info.name || info.email.split('@')[0],
      avatarUrl: info.picture,
      provider: 'google',
    }
  }

  if (provider === 'github') {
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'Vinland-Admin-IdP',
      },
    })

    if (!userRes.ok) {
      throw new Error('Failed to fetch GitHub profile')
    }

    const user = await userRes.json()
    let email = user.email

    // If primary email is private in profile, fetch from /user/emails
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'Vinland-Admin-IdP',
        },
      })

      if (emailRes.ok) {
        const emails = await emailRes.json()
        const primary = emails.find((e: any) => e.primary && e.verified) || emails.find((e: any) => e.verified)
        if (primary) {
          email = primary.email
        }
      }
    }

    if (!email) {
      throw new Error('No verified email found on GitHub account')
    }

    return {
      id: String(user.id),
      email: email.toLowerCase(),
      name: user.name || user.login,
      avatarUrl: user.avatar_url,
      provider: 'github',
    }
  }

  throw new Error(`Unsupported provider: ${provider}`)
}

/**
 * Validates whether an email is permitted to log in to the admin panel.
 * If ADMIN_ALLOWED_EMAILS is configured, it checks against that list.
 * If not configured, any authenticated social user is permitted.
 */
export function isEmailAuthorized(email: string): boolean {
  const allowed = process.env.ADMIN_ALLOWED_EMAILS
  if (!allowed || allowed.trim() === '' || allowed.trim() === '*') {
    return true
  }

  const list = allowed
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  if (list.length === 0) return true

  const lower = email.toLowerCase()
  return list.some(pattern => {
    if (pattern.startsWith('*@')) {
      const domain = pattern.slice(2)
      return lower.endsWith(`@${domain}`)
    }
    return lower === pattern
  })
}

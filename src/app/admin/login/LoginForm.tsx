'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from './actions'

interface LoginFormProps {
  googleConfigured: boolean
  githubConfigured: boolean
  allowedEmailsConfigured: boolean
  callbackUrl?: string
  initialError?: string
  emailParam?: string
}

export default function LoginForm({
  googleConfigured,
  githubConfigured,
  allowedEmailsConfigured,
  callbackUrl = '/admin',
  initialError,
  emailParam,
}: LoginFormProps) {
  const [error, setError] = useState(initialError || '')
  const [loading, setLoading] = useState(false)
  const [showSetupGuide, setShowSetupGuide] = useState(false)
  const router = useRouter()

  function getErrorMessage(code: string): string {
    switch (code) {
      case 'unauthorized_email':
        return `Access Denied: The account ${emailParam ? `(${emailParam}) ` : ''}is not authorized for admin access. Please contact the system administrator.`
      case 'invalid_state':
      case 'state_mismatch':
        return 'Security validation failed (CSRF state mismatch). Please try logging in again.'
      case 'missing_code':
        return 'No authorization code was returned by the Identity Provider.'
      case 'provider_not_configured':
        return 'This Identity Provider is not yet configured. Please set the required Client ID and Client Secret in your environment.'
      case 'access_denied':
        return 'The login request was cancelled or access was denied by the identity provider.'
      default:
        return code
    }
  }

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')
    try {
      const result = await login(formData)
      if (result.error) {
        setError(result.error)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check credentials or database connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
            <span className="material-symbols-outlined text-2xl">shield_person</span>
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Admin Authentication</h2>
          <p className="mt-1 text-xs text-gray-500">
            Secure Single Sign-On (IdP) for De Westplaat Visual CMS
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-red-500 text-base flex-shrink-0 mt-0.5">error</span>
            <div className="flex-grow">
              <span className="font-semibold block">Authentication Error</span>
              <p className="mt-0.5 leading-relaxed">{getErrorMessage(error)}</p>
            </div>
            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600 text-sm font-bold ml-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Identity Provider (Direct OAuth 2.0 / OIDC SSO) */}
        <div className="space-y-3 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Sign In with Identity Provider (SSO)
          </div>

          {/* Google SSO */}
          <Link
            href="/api/auth/login/google"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-800 text-xs font-bold transition-all shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
            {googleConfigured ? (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-500" title="Google IdP Configured" />
            ) : (
              <span className="ml-auto text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-normal">
                Setup Needed
              </span>
            )}
          </Link>

          {/* GitHub SSO */}
          <Link
            href="/api/auth/login/github"
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm hover:shadow"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>Continue with GitHub</span>
            {githubConfigured ? (
              <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400" title="GitHub IdP Configured" />
            ) : (
              <span className="ml-auto text-[10px] bg-amber-400/20 text-amber-200 px-1.5 py-0.5 rounded font-normal">
                Setup Needed
              </span>
            )}
          </Link>
        </div>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <span className="relative px-3 bg-white text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
            or password credentials
          </span>
        </div>

        {/* Password Form */}
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="email">
              Admin Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@dewestplaat.nl"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow hover:shadow-md disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign in with Password'}
          </button>
        </form>

        {/* Help / Setup Guide Accordion */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setShowSetupGuide(!showSetupGuide)}
            className="text-[11px] text-gray-500 hover:text-gray-800 flex items-center justify-between w-full font-medium"
          >
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">settings</span>
              IdP Setup &amp; Environment Variables
            </span>
            <span className="material-symbols-outlined text-sm transform transition-transform">
              {showSetupGuide ? 'expand_less' : 'expand_more'}
            </span>
          </button>

          {showSetupGuide && (
            <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 text-[11px] text-gray-600 space-y-2.5">
              <p className="font-semibold text-gray-900">Configuring Direct OAuth 2.0 / OIDC:</p>
              
              <div>
                <span className="font-bold text-gray-800 block">1. Google Cloud Console:</span>
                <p className="text-gray-500 text-[10px]">Create an OAuth 2.0 Client ID with Authorized redirect URI:</p>
                <code className="block bg-white p-1.5 rounded border border-gray-200 font-mono text-[10px] break-all my-1 text-gray-800">
                  https://vinland-with-admin.vercel.app/api/auth/callback/google
                </code>
                <p className="text-[10px] text-gray-500">Add to Vercel/env: <code className="text-gray-700">GOOGLE_CLIENT_ID</code> and <code className="text-gray-700">GOOGLE_CLIENT_SECRET</code></p>
              </div>

              <div>
                <span className="font-bold text-gray-800 block">2. GitHub Developer Settings:</span>
                <p className="text-gray-500 text-[10px]">Create an OAuth App with Authorization callback URL:</p>
                <code className="block bg-white p-1.5 rounded border border-gray-200 font-mono text-[10px] break-all my-1 text-gray-800">
                  https://vinland-with-admin.vercel.app/api/auth/callback/github
                </code>
                <p className="text-[10px] text-gray-500">Add to Vercel/env: <code className="text-gray-700">GITHUB_CLIENT_ID</code> and <code className="text-gray-700">GITHUB_CLIENT_SECRET</code></p>
              </div>

              <div>
                <span className="font-bold text-gray-800 block">3. Access Whitelist (Optional):</span>
                <p className="text-[10px] text-gray-500">Set <code className="text-gray-700">ADMIN_ALLOWED_EMAILS</code> to restrict access to specific emails (e.g. <code className="text-gray-700">admin@dewestplaat.nl,topro19@gmail.com</code>).</p>
              </div>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-[11px] text-gray-400 hover:text-gray-600 font-medium">
            ← Terug naar website
          </Link>
        </div>
      </div>
    </div>
  )
}

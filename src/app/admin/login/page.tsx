import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LoginForm from './LoginForm'

export const dynamic = 'force-dynamic'

interface LoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  // If user is already authenticated, redirect directly to admin panel
  const session = await getSession()
  if (session) {
    redirect('/admin')
  }

  const resolvedParams = await searchParams
  const errorParam = typeof resolvedParams.error === 'string' ? resolvedParams.error : undefined
  const emailParam = typeof resolvedParams.email === 'string' ? resolvedParams.email : undefined

  const googleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  const githubConfigured = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  const allowedEmailsConfigured = !!process.env.ADMIN_ALLOWED_EMAILS

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading IdP portal...</div>}>
        <LoginForm
          googleConfigured={googleConfigured}
          githubConfigured={githubConfigured}
          allowedEmailsConfigured={allowedEmailsConfigured}
          initialError={errorParam}
          emailParam={emailParam}
        />
      </Suspense>
    </div>
  )
}

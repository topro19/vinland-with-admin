'use server'

import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function demoLogin(): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await encrypt({
      id: 'demo-client-admin',
      name: 'Demo Client',
      email: 'demo@dewestplaat.nl',
      role: 'SUPER_ADMIN',
      provider: 'demo'
    })
    ;(await cookies()).set('admin_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to initialize demo session' }
  }
}

export async function login(formData: FormData) {
  const email = (formData.get('email') as string)?.trim()
  const password = (formData.get('password') as string)?.trim()

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // Preconfigured Demo Credentials (works even if database is unmigrated/offline)
  const isDemo =
    (email.toLowerCase() === 'demo@dewestplaat.nl' ||
      email.toLowerCase() === 'admin@dewestplaat.nl' ||
      email.toLowerCase() === 'demo' ||
      email.toLowerCase() === 'client') &&
    (password === 'demo' || password === 'admin123' || password === 'demo123' || password === 'admin')

  if (isDemo) {
    const session = await encrypt({
      id: 'demo-client-admin',
      name: 'Demo Client',
      email: email.includes('@') ? email.toLowerCase() : 'demo@dewestplaat.nl',
      role: 'SUPER_ADMIN',
      provider: 'demo'
    })
    ;(await cookies()).set('admin_session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24
    })
    return { success: true }
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { email } })
    
    if (!admin) {
      // If no admins exist, create the first one automatically
      const count = await prisma.admin.count()
      if (count === 0) {
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAdmin = await prisma.admin.create({
          data: {
            email,
            password: hashedPassword,
            role: 'SUPER_ADMIN'
          }
        })
        
        const session = await encrypt({ id: newAdmin.id, role: newAdmin.role, email: newAdmin.email, provider: 'credentials' })
        ;(await cookies()).set('admin_session', session, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' })
        return { success: true }
      }
      return { error: 'Invalid credentials' }
    }

    const isValid = await bcrypt.compare(password, admin.password)
    if (!isValid) {
      return { error: 'Invalid credentials' }
    }

    const session = await encrypt({ id: admin.id, role: admin.role, email: admin.email, provider: 'credentials' })
    ;(await cookies()).set('admin_session', session, { httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' })
    
    try {
      await prisma.activityLog.create({
        data: {
          adminId: admin.id,
          action: 'LOGIN',
          details: 'Admin logged in securely'
        }
      })
    } catch (_) {}

    return { success: true }
  } catch (err: any) {
    console.error('Login database error:', err)
    return { error: 'Database error: ' + (err?.message || 'Database unavailable') }
  }
}

export async function logout() {
  ;(await cookies()).delete('admin_session')
}

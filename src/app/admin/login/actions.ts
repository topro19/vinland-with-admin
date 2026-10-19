'use server'

import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  try {
    // Handle first time setup loosely for this demo, or check db
    const admin = await prisma.admin.findUnique({ where: { email } })
    
    if (!admin) {
      // Optional: If no admins exist, create the first one automatically
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
    
    // Log login action
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

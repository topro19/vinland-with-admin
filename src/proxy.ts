import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth'

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const session = request.cookies.get('admin_session')?.value
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    try {
      await decrypt(session)
      return NextResponse.next()
    } catch (e) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

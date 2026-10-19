import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const url = new URL('/admin/login', request.url)
  const response = NextResponse.redirect(url, { status: 303 })
  response.cookies.delete('admin_session')
  return response
}

export async function GET(request: NextRequest) {
  const url = new URL('/admin/login', request.url)
  const response = NextResponse.redirect(url)
  response.cookies.delete('admin_session')
  return response
}

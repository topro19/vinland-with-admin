import { ReactNode } from 'react'
import '../globals.css'
import Link from 'next/link'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Secure Admin CMS - De Westplaat',
  description: 'Production-Ready Visual CMS with Direct OAuth IdP',
}

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession()

  // Unauthenticated layout (e.g. login screen): render full-width view without admin sidebar
  if (!session) {
    return (
      <html lang="nl">
        <head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          />
        </head>
        <body className="min-h-screen bg-gray-50 antialiased font-sans">
          {children}
        </body>
      </html>
    )
  }

  // Authenticated admin layout
  const providerLabel = session.provider === 'google' 
    ? 'Google SSO' 
    : session.provider === 'github' 
    ? 'GitHub SSO' 
    : session.provider === 'demo'
    ? 'Client Demo'
    : 'Password'

  return (
    <html lang="nl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen bg-gray-50 flex antialiased font-sans">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
          <div className="h-16 flex items-center justify-between px-6 font-bold text-lg tracking-wider border-b border-gray-800">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-xl">shield_person</span>
              VISUAL CMS
            </span>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-1.5 text-xs font-semibold">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">dashboard</span>
              Dashboard
            </Link>
            <Link
              href="/?edit_mode=true"
              target="_blank"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm my-3 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">edit</span>
              Launch Visual Editor
            </Link>
            <Link
              href="/admin/theme"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">palette</span>
              Theme &amp; Typography
            </Link>
            <Link
              href="/admin/content"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">article</span>
              Text Content Data
            </Link>
            <Link
              href="/admin/media"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">photo_library</span>
              Media Library
            </Link>
            <Link
              href="/admin/audit"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">history</span>
              Audit Logs
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-center gap-1.5 text-center text-xs text-gray-400 hover:text-white py-1 transition-colors"
            >
              <span>View Live Website</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </Link>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-gray-800">Admin Control Panel</h2>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                {session.role || 'SUPER_ADMIN'}
              </span>
            </div>

            {/* Authenticated IdP User Profile & Sign Out */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="flex items-center justify-end gap-2">
                  <span className="text-xs font-bold text-gray-900">{session.name || session.email}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 border border-gray-200 px-1.5 py-0.2 rounded font-semibold">
                    {providerLabel}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 font-mono">{session.email}</p>
              </div>

              {session.avatar ? (
                <img
                  src={session.avatar}
                  alt={session.name || 'Admin'}
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                  {(session.name || session.email || 'A').charAt(0).toUpperCase()}
                </div>
              )}

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

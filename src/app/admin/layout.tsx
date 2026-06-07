import { ReactNode } from 'react'
import '../globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Secure Admin CMS',
  description: 'Production-Ready Visual CMS',
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col">
          <div className="h-16 flex items-center px-6 font-bold text-xl tracking-wider border-b border-gray-800">
            VISUAL CMS
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 text-sm font-medium">
            <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-gray-800">Dashboard</Link>
            <Link href="/?edit_mode=true" className="block px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-sm mt-4 mb-4">Launch Visual Editor</Link>
            <Link href="/admin/theme" className="block px-3 py-2 rounded-md hover:bg-gray-800">Theme & Typography</Link>
            <Link href="/admin/content" className="block px-3 py-2 rounded-md hover:bg-gray-800">Text Content Data</Link>
            <Link href="/admin/media" className="block px-3 py-2 rounded-md hover:bg-gray-800">Media Library</Link>
            <Link href="/admin/audit" className="block px-3 py-2 rounded-md hover:bg-gray-800">Audit Logs</Link>
          </nav>
          <div className="p-4 border-t border-gray-800">
             <Link href="/" target="_blank" className="block text-center text-xs text-gray-400 hover:text-white">View Live Site</Link>
          </div>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Admin Control Panel</h2>
            <form action="/admin/login" method="POST" className="text-sm">
               <button className="text-gray-500 hover:text-gray-900 font-medium">Sign Out</button>
            </form>
          </header>
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

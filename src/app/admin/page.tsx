import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  let contentCount = 0
  let mediaCount = 0
  let recentLogs: any[] = []

  try {
    const { contentStore } = await import('@/lib/contentStore')
    const allContent = await contentStore.getAllContent()
    const allMedia = await contentStore.getAllMedia()
    contentCount = allContent.length
    mediaCount = allMedia.length
  } catch (e) {
    // Fallback
  }

  try {
    recentLogs = await prisma.activityLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { admin: { select: { email: true } } },
    })
  } catch (err) {
    console.warn('Prisma query skipped in dashboard (DB unmigrated or offline):', err)
  }

  return (
    <div className="space-y-6">
      {/* Welcome IdP Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Identity Provider Session Active
            </div>
            <h1 className="text-xl font-bold">Welkom, {session.name || session.email}!</h1>
            <p className="text-xs text-emerald-100/80 mt-1">
              Geauthenticeerd via {session.provider === 'google' ? 'Google SSO (OIDC)' : session.provider === 'github' ? 'GitHub SSO (OAuth 2.0)' : 'Credentials'}. U heeft volledige beheerdersrechten.
            </p>
          </div>
          <Link
            href="/?edit_mode=true"
            target="_blank"
            className="inline-flex items-center gap-2 bg-white text-emerald-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-emerald-50 transition-all shadow"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Launch Visual Editor
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Total Content Blocks</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{contentCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">Media Files</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{mediaCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-sm font-medium text-gray-500">System Status</h3>
          <p className="text-xl font-bold text-emerald-600 mt-2 flex items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> Active (IdP Protected)
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Recent Activity Logs</h3>
          <Link href="/admin/audit" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
            View all &rarr;
          </Link>
        </div>
        <ul className="divide-y divide-gray-100">
          {recentLogs.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500 text-xs">No recent administrative activity recorded.</li>
          ) : (
            recentLogs.map(log => (
              <li key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-xs font-bold text-gray-900">{log.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-700">{log.admin?.email || 'System'}</p>
                  <p className="text-[10px] text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const contentCount = await prisma.siteContent.count()
  const mediaCount = await prisma.mediaLibrary.count()
  const recentLogs = await prisma.activityLog.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { admin: { select: { email: true } } }
  })

  return (
    <div className="space-y-6">
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
          <p className="text-xl font-bold text-green-600 mt-2 flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span> Active (Locked CMS)
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity Logs</h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {recentLogs.length === 0 ? (
            <li className="px-6 py-8 text-center text-gray-500 text-sm">No activity recorded yet.</li>
          ) : (
            recentLogs.map(log => (
              <li key={log.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-500">{log.details}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-gray-500">{log.admin.email}</p>
                  <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </li>
            ))
          )}
        </ul>
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 text-right">
          <Link href="/admin/audit" className="text-sm font-medium text-blue-600 hover:text-blue-500">View all logs &rarr;</Link>
        </div>
      </div>
    </div>
  )
}

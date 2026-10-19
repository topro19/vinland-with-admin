import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { updateSiteContent, deleteSiteContent } from './actions'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  const { contentStore } = await import('@/lib/contentStore')
  const contents = await contentStore.getAllContent()

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Text Content Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update text blocks globally. These map directly to `data-cms-id` tags in your HTML pages.
            </p>
          </div>
          <a
            href="/?edit_mode=true"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">edit_note</span>
            Open Visual Editor
          </a>
        </div>

        <div className="p-8 border-b border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Add or Update Content Block</h3>
          <form action={updateSiteContent} className="space-y-4 max-w-2xl bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content ID (e.g. hero.title)</label>
              <input type="text" name="id" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-gray-900 focus:border-gray-900" placeholder="hero.title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Internal Note)</label>
              <input type="text" name="description" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-gray-900 focus:border-gray-900" placeholder="e.g. Main headline on homepage" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML or Text)</label>
              <textarea name="content" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-gray-900 focus:border-gray-900 min-h-[100px]" placeholder="Content..." />
            </div>
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
              Save Content Block
            </button>
          </form>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-semibold mb-4">Existing Content Blocks</h3>
          {contents.length === 0 ? (
            <p className="text-gray-500 text-sm">No content blocks saved in the database yet.</p>
          ) : (
            <div className="space-y-4">
              {contents.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <form action={updateSiteContent} className="space-y-4">
                    <input type="hidden" name="id" value={item.id} />
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mb-2">
                          ID: {item.id}
                        </span>
                        <input type="text" name="description" defaultValue={item.description || ''} className="block w-full text-sm text-gray-500 border-none bg-transparent p-0 focus:ring-0 mb-2" placeholder="Add description..." />
                      </div>
                      <button formAction={deleteSiteContent} className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 bg-red-50 rounded">Delete</button>
                    </div>
                    <textarea name="content" defaultValue={item.content} className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-gray-900 focus:border-gray-900 min-h-[80px]" />
                    <div className="flex justify-end">
                      <button type="submit" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                        Update
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

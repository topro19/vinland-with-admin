import { prisma } from '@/lib/prisma'
import { updateSiteContent, deleteSiteContent } from './actions'

export default async function ContentPage() {
  const contents = await prisma.siteContent.findMany({
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Text Content Management</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update text blocks globally. These map directly to `data-cms-id` tags in your HTML.
            </p>
          </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Value</label>
              <textarea name="content" required className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm h-32 focus:ring-gray-900 focus:border-gray-900" placeholder="Enter the text..." />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                Save Content Block
              </button>
            </div>
          </form>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-semibold mb-6">Existing Content Blocks</h3>
          {contents.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No content blocks found.</p>
          ) : (
            <div className="space-y-6">
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

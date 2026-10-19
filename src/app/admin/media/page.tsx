import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { uploadMedia, deleteMedia } from './actions'

export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const session = await getSession()
  if (!session) {
    redirect('/admin/login')
  }

  let media: any[] = []
  try {
    media = await prisma.mediaLibrary.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (err) {
    console.warn('Prisma query skipped in media page:', err)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Media Library (Supabase)</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload and manage images. Use the generated URLs in your text content blocks to update images dynamically.
          </p>
        </div>

        <div className="p-8 border-b border-gray-100">
          <form action={uploadMedia} className="max-w-xl bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Upload New Media</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image File (Max 5MB)</label>
                <input type="file" name="file" accept="image/*" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text (Optional)</label>
                <input type="text" name="altText" className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-gray-900 focus:border-gray-900" placeholder="Description of the image" />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
                Upload Image
              </button>
            </div>
          </form>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {media.length === 0 ? (
              <p className="text-sm text-gray-500 col-span-full">No media uploaded yet.</p>
            ) : (
              media.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group">
                  <div className="aspect-square bg-gray-100 relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.url} alt={item.altText || item.filename} className="object-cover w-full h-full" />
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-xs font-medium text-gray-900 truncate" title={item.filename}>{item.filename}</p>
                    <p className="text-[10px] text-gray-500 mb-2">{(item.size / 1024).toFixed(1)} KB</p>
                    <input type="text" readOnly value={item.url} className="w-full text-xs border-gray-200 rounded px-2 py-1 mb-2 bg-gray-50 text-gray-600" onClick={e => e.currentTarget.select()} />
                    <form action={deleteMedia}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="filename" value={item.filename} />
                      <button type="submit" className="w-full text-xs text-red-600 border border-red-200 rounded py-1 hover:bg-red-50 font-medium">Delete</button>
                    </form>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

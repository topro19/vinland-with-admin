'use server'

import { contentStore } from '@/lib/contentStore'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function uploadMedia(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  const altText = formData.get('altText') as string

  if (!file || !(file instanceof Blob)) return
  if (!file.type.startsWith('image/')) return
  if (file.size > 5 * 1024 * 1024) return

  try {
    const { filename } = await contentStore.processUpload(file, altText)

    try {
      await prisma.activityLog.create({
        data: {
          adminId: session.id,
          action: 'UPLOAD_MEDIA',
          details: `Uploaded image: ${filename}`
        }
      })
    } catch {
      // Offline fallback
    }

    revalidatePath('/admin/media')
  } catch (e: any) {
    console.error('[UploadMedia Error]:', e)
  }
}

export async function deleteMedia(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const filename = formData.get('filename') as string

  try {
    await contentStore.deleteMedia(id, filename)

    try {
      await prisma.activityLog.create({
        data: {
          adminId: session.id,
          action: 'DELETE_MEDIA',
          details: `Deleted image: ${filename}`
        }
      })
    } catch {
      // Offline fallback
    }

    revalidatePath('/admin/media')
  } catch (e: any) {
    console.error('[DeleteMedia Error]:', e)
  }
}

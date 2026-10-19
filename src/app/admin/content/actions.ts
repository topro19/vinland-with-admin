'use server'

import { contentStore } from '@/lib/contentStore'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateSiteContent(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const content = formData.get('content') as string
  const description = formData.get('description') as string

  if (!id || !content) return

  try {
    await contentStore.saveContent(id, content, description)

    try {
      await prisma.activityLog.create({
        data: {
          adminId: session.id,
          action: 'UPDATE_CONTENT',
          details: `Updated text content for ID: ${id}`
        }
      })
    } catch {
      // Activity log offline fallback
    }

    revalidatePath('/')
    revalidatePath('/admin/content')
  } catch (e: any) {
    console.error('[UpdateSiteContent Error]:', e)
  }
}

export async function deleteSiteContent(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const id = formData.get('id') as string

  try {
    await contentStore.deleteContent(id)
    revalidatePath('/')
    revalidatePath('/admin/content')
  } catch (e: any) {
    console.error('[DeleteSiteContent Error]:', e)
  }
}

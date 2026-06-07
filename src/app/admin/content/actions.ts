'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateSiteContent(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const content = formData.get('content') as string
  const description = formData.get('description') as string

  if (!id || !content) return

  try {
    await prisma.siteContent.upsert({
      where: { id },
      update: { content, description },
      create: { id, content, description }
    })

    await prisma.activityLog.create({
      data: {
        adminId: session.id,
        action: 'UPDATE_CONTENT',
        details: `Updated text content for ID: ${id}`
      }
    })

    revalidatePath('/')
  } catch (e: any) {
    console.error(e)
  }
}

export async function deleteSiteContent(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const id = formData.get('id') as string

  try {
    await prisma.siteContent.delete({ where: { id } })
    revalidatePath('/')
  } catch (e: any) {
    console.error(e)
  }
}

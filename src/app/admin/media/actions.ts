'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
const supabase = createClient(supabaseUrl, supabaseKey)

export async function uploadMedia(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const file = formData.get('file') as File
  const altText = formData.get('altText') as string

  if (!file) return
  if (!file.type.startsWith('image/')) return
  if (file.size > 5 * 1024 * 1024) return

  try {
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const { data, error } = await supabase.storage.from('media').upload(filename, file)

    if (error) throw error

    const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filename)

    await prisma.mediaLibrary.create({
      data: {
        url: publicUrlData.publicUrl,
        filename,
        fileType: file.type,
        size: file.size,
        altText
      }
    })

    await prisma.activityLog.create({
      data: {
        adminId: session.id,
        action: 'UPLOAD_MEDIA',
        details: `Uploaded image: ${filename}`
      }
    })

    revalidatePath('/admin/media')
    revalidatePath('/admin/media')
  } catch (e: any) {
    console.error('Supabase upload error:', e)
  }
}

export async function deleteMedia(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const id = formData.get('id') as string
  const filename = formData.get('filename') as string

  try {
    const { error } = await supabase.storage.from('media').remove([filename])
    if (error) throw error

    await prisma.mediaLibrary.delete({ where: { id } })

    await prisma.activityLog.create({
      data: {
        adminId: session.id,
        action: 'DELETE_MEDIA',
        details: `Deleted image: ${filename}`
      }
    })

    revalidatePath('/admin/media')
    revalidatePath('/admin/media')
  } catch (e: any) {
    console.error(e)
  }
}

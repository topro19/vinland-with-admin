'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function updateThemeSettings(formData: FormData) {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const primaryColor = formData.get('primaryColor') as string
  const secondaryColor = formData.get('secondaryColor') as string
  const accentColor = formData.get('accentColor') as string
  const backgroundColor = formData.get('backgroundColor') as string
  const textColor = formData.get('textColor') as string
  const buttonColor = formData.get('buttonColor') as string
  
  const headingFont = formData.get('headingFont') as string
  const bodyFont = formData.get('bodyFont') as string
  const headingWeight = formData.get('headingWeight') as string

  try {
    await prisma.themeSettings.upsert({
      where: { id: 'global' },
      update: { primaryColor, secondaryColor, accentColor, backgroundColor, textColor, buttonColor, headingFont, bodyFont, headingWeight },
      create: { id: 'global', primaryColor, secondaryColor, accentColor, backgroundColor, textColor, buttonColor, headingFont, bodyFont, headingWeight }
    })

    await prisma.activityLog.create({
      data: {
        adminId: session.id,
        action: 'UPDATE_THEME',
        details: 'Updated global theme colors and typography'
      }
    })

    revalidatePath('/')
  } catch (e: any) {
    console.error(e)
  }
}

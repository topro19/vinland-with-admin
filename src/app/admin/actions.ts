'use server'

import { prisma } from '@/lib/prisma'

export async function updateSiteSettings(data: {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  buttonColor?: string
  textColor?: string
  backgroundColor?: string
  headingFont?: string
  bodyFont?: string
  headingWeight?: string
}) {
  try {
    await prisma.themeSettings.upsert({
      where: { id: 'global' },
      update: data,
      create: {
        id: 'global',
        ...data,
      },
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to update site settings:', error)
    return { success: false, error: 'Failed to update site settings' }
  }
}

export async function updateContentElement(id: string, content: string) {
  try {
    await prisma.siteContent.upsert({
      where: { id },
      update: { content },
      create: { id, content }
    })
    return { success: true }
  } catch (error) {
    console.error('Failed to update content:', error)
    return { success: false, error: 'Failed to update content' }
  }
}

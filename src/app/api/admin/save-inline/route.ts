import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    
    // Process text updates
    const textsStr = formData.get('texts') as string
    if (textsStr) {
      const texts = JSON.parse(textsStr)
      for (const [id, content] of Object.entries(texts)) {
        await prisma.siteContent.upsert({
          where: { id },
          update: { content: content as string },
          create: { id, content: content as string }
        })
      }
    }

    // Process theme updates
    const themeStr = formData.get('theme') as string
    if (themeStr) {
      const theme = JSON.parse(themeStr)
      if (Object.keys(theme).length > 0) {
        // Map UI keys to DB keys
        const updateData: any = {}
        if (theme.primary) updateData.primaryColor = theme.primary
        if (theme.secondary) updateData.secondaryColor = theme.secondary
        if (theme.accent) updateData.accentColor = theme.accent
        if (theme.bg) updateData.backgroundColor = theme.bg
        if (theme.text) updateData.textColor = theme.text
        // also set defaults for required fields in case we are creating 'global' for the first time
        const createData = {
          id: 'global',
          primaryColor: theme.primary || '#00461a',
          secondaryColor: theme.secondary || '#755b00',
          accentColor: theme.accent || '#ffdad6',
          backgroundColor: theme.bg || '#fdf9ed',
          textColor: theme.text || '#1c1c15',
          buttonColor: '#105223',
          headingFont: 'Nunito',
          bodyFont: 'Nunito Sans',
          headingWeight: '800'
        }
        await prisma.themeSettings.upsert({
          where: { id: 'global' },
          update: updateData,
          create: { ...createData, ...updateData }
        })
      }
    }

    // Process image uploads
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      for (const [key, value] of Array.from(formData.entries())) {
        if (key.startsWith('image_') && value instanceof Blob) {
          const id = key.replace('image_', '')
          const file = value as File
          const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
          
          const { error } = await supabase.storage.from('media').upload(filename, file)
          if (!error) {
            const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(filename)
            
            // Image urls are technically just content for an element id or a specific image tag attribute.
            // Since the system uses data-cms-id, we can store the url directly in SiteContent.
            // But wait, if it's an image, the interceptor needs to inject the URL into the `src` attribute.
            await prisma.siteContent.upsert({
              where: { id },
              update: { content: publicUrlData.publicUrl },
              create: { id, content: publicUrlData.publicUrl }
            })
          }
        }
      }
    }

    await prisma.activityLog.create({
      data: {
        adminId: session.id,
        action: 'INLINE_EDIT',
        details: 'Admin performed inline page edits'
      }
    })

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

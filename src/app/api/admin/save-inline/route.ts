import fs from 'fs'
import path from 'path'
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
    const { contentStore } = await import('@/lib/contentStore')
    
    // Process text updates
    const textsStr = formData.get('texts') as string
    if (textsStr) {
      const texts = JSON.parse(textsStr)
      for (const [id, content] of Object.entries(texts)) {
        await contentStore.saveContent(id, content as string)
      }
    }

    // Process catalogue grid updates (added/deleted cards)
    const gridsStr = formData.get('grids') as string
    const pageSlug = formData.get('pageSlug') as string
    if (gridsStr) {
      const grids = JSON.parse(gridsStr)
      for (const [gridId, html] of Object.entries(grids)) {
        await contentStore.saveContent(`grid_${gridId}`, html as string)
      }

      // Also persist directly into _html_source if writable
      if (pageSlug) {
        try {
          // path imported at top
          const targetFile = pageSlug.endsWith('.html') ? pageSlug : `${pageSlug}.html`
          const filePath = path.join(process.cwd(), '_html_source', targetFile)
          if (fs.existsSync(filePath)) {
            const { parse } = await import('node-html-parser')
            let fileHtml = fs.readFileSync(filePath, 'utf-8')
            const root = parse(fileHtml)
            let modified = false
            for (const [gridId, html] of Object.entries(grids)) {
              const gridNode = root.querySelector(`[data-cms-catalog-grid="${gridId}"]`)
              if (gridNode) {
                gridNode.innerHTML = html as string
                modified = true
              }
            }
            if (modified) {
              fs.writeFileSync(filePath, root.toString(), 'utf-8')
            }
          }
        } catch (fileErr) {
          console.warn('[SaveInline] Local file write skipped or failed:', fileErr)
        }
      }
    }

    // Process theme updates
    const themeStr = formData.get('theme') as string
    if (themeStr) {
      const theme = JSON.parse(themeStr)
      if (Object.keys(theme).length > 0) {
        const updateData: any = {}
        if (theme.primary) updateData.primaryColor = theme.primary
        if (theme.secondary) updateData.secondaryColor = theme.secondary
        if (theme.accent) updateData.accentColor = theme.accent
        if (theme.bg) updateData.backgroundColor = theme.bg
        if (theme.text) updateData.textColor = theme.text
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
        try {
          await prisma.themeSettings.upsert({
            where: { id: 'global' },
            update: updateData,
            create: { ...createData, ...updateData }
          })
        } catch {
          // DB offline
        }
      }
    }

    // Process image uploads (Supabase if available, Base64 fallback)
    for (const [key, value] of Array.from(formData.entries())) {
      if (key.startsWith('image_') && value instanceof Blob) {
        const id = key.replace('image_', '')
        const file = value as File
        const { url } = await contentStore.processUpload(file)
        await contentStore.saveContent(id, url)
      }
    }

    try {
      await prisma.activityLog.create({
        data: {
          adminId: session.id,
          action: 'INLINE_EDIT',
          details: 'Admin performed inline page edits'
        }
      })
    } catch {
      // Activity log offline fallback
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('[SaveInline Error]:', e)
    return NextResponse.json({ error: e.message || 'Unknown save error' }, { status: 500 })
  }
}

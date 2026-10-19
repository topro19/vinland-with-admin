import fs from 'fs'
import path from 'path'
import { prisma } from './prisma'
import { createClient } from '@supabase/supabase-js'

interface ContentItem {
  id: string
  content: string
  description?: string | null
  updatedAt?: string | Date
}

interface MediaItem {
  id: string
  url: string
  filename: string
  fileType: string
  size: number
  altText?: string | null
  createdAt?: string | Date
}

// Memory cache fallback for serverless environments (Vercel)
const memoryContent: Record<string, ContentItem> = {}
const memoryMedia: Map<string, MediaItem> = new Map()

function getJsonFilePath(name: string): string {
  // Check if _html_source is accessible
  const sourcePath = path.join(process.cwd(), '_html_source', name)
  if (fs.existsSync(sourcePath)) {
    return sourcePath
  }
  // Fallback to /tmp if write is restricted
  const tmpPath = path.join('/tmp', name)
  return tmpPath
}

function readJsonFile<T>(name: string, fallback: T): T {
  try {
    const primaryPath = path.join(process.cwd(), '_html_source', name)
    if (fs.existsSync(primaryPath)) {
      const data = fs.readFileSync(primaryPath, 'utf-8')
      return JSON.parse(data)
    }
    const tmpPath = path.join('/tmp', name)
    if (fs.existsSync(tmpPath)) {
      const data = fs.readFileSync(tmpPath, 'utf-8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.warn(`[ContentStore] Read warning for ${name}:`, err)
  }
  return fallback
}

function writeJsonFile<T>(name: string, data: T): void {
  const jsonStr = JSON.stringify(data, null, 2)
  let written = false

  try {
    const primaryDir = path.join(process.cwd(), '_html_source')
    if (fs.existsSync(primaryDir)) {
      fs.writeFileSync(path.join(primaryDir, name), jsonStr, 'utf-8')
      written = true
    }
  } catch {
    // Read-only filesystem on Vercel
  }

  if (!written) {
    try {
      fs.writeFileSync(path.join('/tmp', name), jsonStr, 'utf-8')
    } catch {
      // Ignored
    }
  }
}

export const contentStore = {
  /**
   * Retrieves all content overrides (from DB and local store)
   */
  async getAllContent(): Promise<ContentItem[]> {
    const fileData = readJsonFile<Record<string, ContentItem>>('cms-content.json', {})
    const merged: Record<string, ContentItem> = { ...fileData, ...memoryContent }

    try {
      const dbItems = await prisma.siteContent.findMany({
        orderBy: { updatedAt: 'desc' }
      })
      for (const item of dbItems) {
        merged[item.id] = {
          id: item.id,
          content: item.content,
          description: item.description,
          updatedAt: item.updatedAt
        }
      }
    } catch {
      // DB offline or unmigrated; use file + memory
    }

    return Object.values(merged)
  },

  /**
   * Retrieves content as a key-value map for quick HTML injection
   */
  async getContentMap(): Promise<Record<string, string>> {
    const items = await this.getAllContent()
    const map: Record<string, string> = {}
    for (const item of items) {
      if (item.content) {
        map[item.id] = item.content
      }
    }
    return map
  },

  /**
   * Saves a single content override
   */
  async saveContent(id: string, content: string, description?: string): Promise<void> {
    const item: ContentItem = {
      id,
      content,
      description: description || null,
      updatedAt: new Date().toISOString()
    }

    // Update memory & file
    memoryContent[id] = item
    const fileData = readJsonFile<Record<string, ContentItem>>('cms-content.json', {})
    fileData[id] = item
    writeJsonFile('cms-content.json', fileData)

    // Attempt Prisma
    try {
      await prisma.siteContent.upsert({
        where: { id },
        update: { content, description },
        create: { id, content, description }
      })
    } catch (err) {
      console.warn(`[ContentStore] Saved ${id} locally (DB not reachable)`)
    }
  },

  /**
   * Saves multiple content overrides in batch
   */
  async saveMultipleContent(records: Record<string, string>): Promise<void> {
    for (const [id, content] of Object.entries(records)) {
      await this.saveContent(id, content)
    }
  },

  /**
   * Deletes a content override
   */
  async deleteContent(id: string): Promise<void> {
    delete memoryContent[id]
    const fileData = readJsonFile<Record<string, ContentItem>>('cms-content.json', {})
    delete fileData[id]
    writeJsonFile('cms-content.json', fileData)

    try {
      await prisma.siteContent.delete({ where: { id } })
    } catch {
      // Ignored
    }
  },

  /**
   * Retrieves all media items
   */
  async getAllMedia(): Promise<MediaItem[]> {
    const fileMedia = readJsonFile<MediaItem[]>('cms-media.json', [])
    const map = new Map<string, MediaItem>()

    for (const item of fileMedia) {
      map.set(item.id, item)
    }
    for (const [id, item] of memoryMedia.entries()) {
      map.set(id, item)
    }

    try {
      const dbMedia = await prisma.mediaLibrary.findMany({
        orderBy: { createdAt: 'desc' }
      })
      for (const item of dbMedia) {
        map.set(item.id, {
          id: item.id,
          url: item.url,
          filename: item.filename,
          fileType: item.fileType,
          size: item.size,
          altText: item.altText,
          createdAt: item.createdAt
        })
      }
    } catch {
      // DB offline; use local media
    }

    return Array.from(map.values())
  },

  /**
   * Processes an uploaded file (Supabase if available, Base64 Data URL fallback)
   */
  async processUpload(file: File, altText?: string): Promise<{ url: string; filename: string }> {
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    let publicUrl = ''

    // 1. Try Supabase if valid credentials provided
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const isSupabaseValid =
      supabaseUrl &&
      supabaseKey &&
      !supabaseUrl.includes('placeholder') &&
      !supabaseKey.includes('placeholder')

    if (isSupabaseValid) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { error } = await supabase.storage.from('media').upload(filename, file)
        if (!error) {
          const { data } = supabase.storage.from('media').getPublicUrl(filename)
          publicUrl = data.publicUrl
        }
      } catch (err) {
        console.warn('[ContentStore] Supabase upload failed, falling back to Base64:', err)
      }
    }

    // 2. Fallback: Convert to Base64 Data URL
    if (!publicUrl) {
      const buffer = Buffer.from(await file.arrayBuffer())
      const mime = file.type || 'image/jpeg'
      publicUrl = `data:${mime};base64,${buffer.toString('base64')}`
    }

    const id = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    const mediaItem: MediaItem = {
      id,
      url: publicUrl,
      filename,
      fileType: file.type || 'image/jpeg',
      size: file.size,
      altText: altText || null,
      createdAt: new Date().toISOString()
    }

    // Store locally
    memoryMedia.set(id, mediaItem)
    const fileMedia = readJsonFile<MediaItem[]>('cms-media.json', [])
    fileMedia.unshift(mediaItem)
    writeJsonFile('cms-media.json', fileMedia)

    // Store in DB if accessible
    try {
      await prisma.mediaLibrary.create({
        data: {
          url: publicUrl,
          filename,
          fileType: file.type || 'image/jpeg',
          size: file.size,
          altText
        }
      })
    } catch {
      console.warn(`[ContentStore] Stored media item ${filename} locally`)
    }

    return { url: publicUrl, filename }
  },

  /**
   * Deletes a media item
   */
  async deleteMedia(id: string, filename: string): Promise<void> {
    memoryMedia.delete(id)
    const fileMedia = readJsonFile<MediaItem[]>('cms-media.json', [])
    const filtered = fileMedia.filter(m => m.id !== id && m.filename !== filename)
    writeJsonFile('cms-media.json', filtered)

    try {
      await prisma.mediaLibrary.delete({ where: { id } })
    } catch {
      // Ignored
    }
  }
}

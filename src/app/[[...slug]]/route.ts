import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params
  // If slug is missing, it's the root '/'
  let pagePath = resolvedParams.slug ? resolvedParams.slug.join('/') : '2'

  // We only want to serve HTML pages through this interceptor
  let filename = pagePath
  if (!filename.endsWith('.html')) {
    filename += '.html'
  }

  const sourceDir = path.join(process.cwd(), '_html_source')
  // Protect against directory traversal
  const normalizedPath = path.normalize(filename).replace(/^(\.\.[\/\\])+/, '')
  const filePath = path.join(sourceDir, normalizedPath)

  if (!fs.existsSync(filePath)) {
    return new Response(`Page not found. Looked for: ${filePath}`, { status: 404 })
  }

  let rawHtml = fs.readFileSync(filePath, 'utf-8')

  try {
    const { parse } = require('node-html-parser');
    const root = parse(rawHtml);

    const settings = await prisma.themeSettings.findUnique({ where: { id: 'global' } })
    if (settings) {
      const customStyles = `
        <style>
          :root {
            --color-primary: ${settings.primaryColor} !important;
            --color-secondary: ${settings.secondaryColor} !important;
            --color-error: ${settings.accentColor} !important;
            --color-on-primary: ${settings.buttonColor} !important;
            --color-on-background: ${settings.textColor} !important;
            --color-background: ${settings.backgroundColor} !important;
            --font-sans: "${settings.bodyFont}", sans-serif !important;
            --font-display: "${settings.headingFont}", sans-serif !important;
          }
        </style>
      `
      const head = root.querySelector('head');
      if (head) {
        head.insertAdjacentHTML('beforeend', customStyles);
      }
    }

    const siteContent = await prisma.siteContent.findMany()
    siteContent.forEach(el => {
      if (el.content) {
        const node = root.querySelector(`[data-cms-id="${el.id}"]`);
        if (node) {
          if (node.tagName.toLowerCase() === 'img') {
            node.setAttribute('src', el.content);
          } else {
            // For text elements, preserve whitespace by setting innerHTML, but converting \n to <br> if needed,
            // or just directly setting innerText/innerHTML.
            // Since the admin uses innerText which strips <br>, we set innerHTML and encode newlines.
            node.innerHTML = el.content.replace(/\n/g, '<br>');
          }
        }
      }
    })
    
    rawHtml = root.toString();
  } catch(e) {
    console.error('Database error injecting styles/content:', e)
  }

  // Inject Visual CMS if edit_mode=true
  if (request.nextUrl.searchParams.get('edit_mode') === 'true') {
    const { getSession } = await import('@/lib/auth')
    const session = await getSession()
    if (session) {
      rawHtml = rawHtml.replace(/<\/body>/i, `<script src="/visual-cms.js"></script>\n</body>`)
    } else {
      // Redirect to the login page if they try to edit without being logged in
      const loginUrl = new URL('/admin/login', request.url)
      return Response.redirect(loginUrl.toString())
    }
  }

  return new Response(rawHtml, {
    status: 200,
    headers: { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    }
  })
}

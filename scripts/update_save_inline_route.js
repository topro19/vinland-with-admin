const fs = require('fs');

let code = fs.readFileSync('src/app/api/admin/save-inline/route.ts', 'utf8');

const targetStr = `    // Process text updates
    const textsStr = formData.get('texts') as string
    if (textsStr) {
      const texts = JSON.parse(textsStr)
      for (const [id, content] of Object.entries(texts)) {
        await contentStore.saveContent(id, content as string)
      }
    }`;

const replacementStr = `    // Process text updates
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
        await contentStore.saveContent(\`grid_\${gridId}\`, html as string)
      }

      // Also persist directly into _html_source if writable
      if (pageSlug) {
        try {
          const path = await import('path')
          const targetFile = pageSlug.endsWith('.html') ? pageSlug : \`\${pageSlug}.html\`
          const filePath = path.join(process.cwd(), '_html_source', targetFile)
          if (fs.existsSync(filePath)) {
            const { parse } = await import('node-html-parser')
            let fileHtml = fs.readFileSync(filePath, 'utf-8')
            const root = parse(fileHtml)
            let modified = false
            for (const [gridId, html] of Object.entries(grids)) {
              const gridNode = root.querySelector(\`[data-cms-catalog-grid="\${gridId}"]\`)
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
    }`;

const normalize = s => s.replace(/\r\n/g, '\n');

if (normalize(code).includes(normalize(targetStr))) {
  const updated = normalize(code).replace(normalize(targetStr), normalize(replacementStr));
  fs.writeFileSync('src/app/api/admin/save-inline/route.ts', updated, 'utf8');
  console.log('Successfully updated src/app/api/admin/save-inline/route.ts');
} else {
  console.error('Target not found in src/app/api/admin/save-inline/route.ts');
}

import { host } from '@/lib/config'
import { fixturesMode } from '@/lib/fixtures'
import { getSiteMap } from '@/lib/get-site-map'
import type { SiteMap } from '@/lib/types'

export const revalidate = 28_800

export async function GET() {
  // fixture runs only cover the pages under test, not the whole site
  if (fixturesMode) {
    return new Response(null, { status: 404 })
  }

  const siteMap = await getSiteMap()

  return new Response(createSitemap(siteMap), {
    headers: {
      'Cache-Control': 'public, max-age=28800, stale-while-revalidate=28800',
      'Content-Type': 'text/xml'
    }
  })
}

const createSitemap = (siteMap: SiteMap) =>
  `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
      <loc>${host}</loc>
    </url>

    <url>
      <loc>${host}/</loc>
    </url>

    ${Object.keys(siteMap.canonicalPageMap)
      .map((canonicalPagePath) =>
        `
          <url>
            <loc>${host}/${canonicalPagePath}</loc>
          </url>
        `.trim()
      )
      .join('')}
  </urlset>
`

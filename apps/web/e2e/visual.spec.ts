import { expect, type Page, test } from '@playwright/test'

import pages from './pages.json' with { type: 'json' }

/**
 * Visual regression suite.
 *
 * Pages render from recorded server fixtures (NOTION_FIXTURES=replay) and all
 * browser-side traffic outside the app (images, Waline, tweets) is replayed
 * from HAR files, so screenshots only change when the UI does.
 *
 * Re-record data: see e2e/README.md.
 */

const recordHar = process.env.E2E_RECORD_HAR === '1'
const fixedNow = new Date('2026-10-26T12:00:00+08:00')

for (const { name, path, har = name, localStorage } of pages as Array<
  (typeof pages)[number] & { har?: string; localStorage?: object }
>) {
  test(name, async ({ page, baseURL }, testInfo) => {
    await replayExternalTraffic(
      page,
      baseURL!,
      `${testInfo.project.name}--${har}`
    )
    await page.clock.setFixedTime(fixedNow)
    if (localStorage) {
      await page.addInitScript((entries) => {
        for (const [key, value] of Object.entries(entries)) {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      }, localStorage)
    }

    await page.goto(path)
    // fail loudly instead of capturing an error page as the baseline
    await expect(page.locator('main.notion-page')).toBeVisible()
    await settle(page)

    await expect(page).toHaveScreenshot(`${name}.png`, {
      fullPage: true,
      // the copyright year comes from the server clock
      mask: [page.locator('footer [class*="copyright"]')]
    })
  })
}

async function replayExternalTraffic(page: Page, baseURL: string, har: string) {
  const origin = new URL(baseURL).origin.replaceAll(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  )

  // everything not served by the app itself, plus optimized images (whose
  // upstream fetches would otherwise hit the network from the server)
  await page.routeFromHAR(`e2e/fixtures/har/${har}.har`, {
    url: new RegExp(`^(?!${origin})|/_next/image`),
    update: recordHar,
    updateContent: 'attach',
    updateMode: 'minimal',
    notFound: 'abort'
  })

  // never send analytics, not even while recording
  await page.route(/google-analytics\.com|googletagmanager\.com/, (route) =>
    route.abort()
  )
}

async function settle(page: Page) {
  // theme class is applied by next-themes after hydration
  await page.waitForFunction(() =>
    /\b(dark|light)-mode\b/.test(document.documentElement.className)
  )

  // scroll through the page so lazy images and the comment widget load
  await page.evaluate(async () => {
    const step = window.innerHeight / 2
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  })
  await page.waitForLoadState('networkidle')

  await page.waitForFunction(() => {
    const imagesLoaded = [...document.images].every((img) => img.complete)
    const mermaidRendered = [
      ...document.querySelectorAll('[class*="language-mermaid"]')
    ].every((el) => el.querySelector('svg'))
    // the GIF search popup keeps its own idle spinner, so ignore it
    const walineLoaded =
      !document.querySelector('[data-waline]') ||
      (!document.querySelector('.wl-loading:not(.wl-gif-popup *)') &&
        !!document.querySelector('.wl-card, .wl-empty'))

    return imagesLoaded && mermaidRendered && walineLoaded
  })

  await page.evaluate(() => document.fonts.ready)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(300)
}

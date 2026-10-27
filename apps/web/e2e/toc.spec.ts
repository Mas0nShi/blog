import { expect, type Page, test } from '@playwright/test'

/**
 * Floating table of contents: behaviour checks (the visual suite covers how
 * it looks). Desktop only; the table of contents is hidden on small screens.
 */

const post = '/hello-world-116e1f214e9e4f72a3555ccb35e76d1d'

test.beforeEach(async ({ page, baseURL }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-light', 'desktop only')

  const origin = new URL(baseURL!).origin.replaceAll(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  )
  await page.routeFromHAR('e2e/fixtures/har/desktop-light--hello-world.har', {
    url: new RegExp(`^(?!${origin})|/_next/image`),
    notFound: 'abort'
  })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(post)
  await expect(page.locator('main.notion-page')).toBeVisible()
})

const toc = (page: Page) => page.getByRole('navigation', { name: '目录' })

// the section being read: the last heading scrolled under the sticky header
const readingSection = (page: Page) =>
  page.evaluate(() => {
    let reading: string | null = null
    for (const h of document.querySelectorAll<HTMLElement>(
      '.notion-page-content .notion-h'
    )) {
      if (h.getBoundingClientRect().top < 100) {
        reading = h.textContent!.replace('​', '').trim()
      }
    }
    return reading
  })

test('highlights the section being read, scrolling down and up', async ({
  page
}) => {
  const max = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight
  )
  const positions = [...Array.from({ length: 12 }).keys()].map((i) =>
    Math.round((max * i) / 12)
  )

  let checked = 0
  for (const y of [...positions, ...[...positions].reverse()]) {
    await page.evaluate((top) => scrollTo(0, top), y)
    // the table of contents shows once the article is on screen
    await page.waitForTimeout(300)
    const reading = await readingSection(page)
    if (!reading || !(await toc(page).count())) continue

    await expect(toc(page).locator('[aria-current]')).toHaveText(reading)
    checked++
  }

  expect(checked).toBeGreaterThan(12)
})

test('clicking an item scrolls to it, highlights it and updates the URL', async ({
  page
}) => {
  await page.evaluate(() => scrollTo(0, 1200))
  await toc(page).hover()
  await toc(page).getByRole('link', { name: 'Lists', exact: true }).click()

  await expect(toc(page).locator('[aria-current]')).toHaveText('Lists')
  await expect(page).toHaveURL(/#[\da-f]{32}$/)
  await expect
    .poll(() =>
      page
        .locator('.notion-page-content .notion-h', { hasText: /^Lists$/ })
        .evaluate((h) => Math.round(h.getBoundingClientRect().top))
    )
    .toBe(80)
})

test('is reachable and usable with the keyboard', async ({ page }) => {
  await page.evaluate(() => scrollTo(0, 1200))
  const first = toc(page).getByRole('link').first()
  await first.focus()

  // focusing a link opens the panel
  await expect
    .poll(() =>
      first.evaluate(
        (el) => getComputedStyle(el.closest('[class*="w-[258px]"]')!).opacity
      )
    )
    .toBe('1')

  await page.keyboard.press('Tab')
  await expect(toc(page).getByRole('link').nth(1)).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/#[\da-f]{32}$/)
})

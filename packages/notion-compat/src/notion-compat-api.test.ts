import { promises as fs } from 'node:fs'

import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import { expect, test } from 'vitest'

import { NotionCompatAPI } from './notion-compat-api'

// Integration token scoped to the notion kit test pages; the test is skipped
// unless it's provided via the environment.
const auth = process.env.NOTION_TEST_AUTH
const debug = false

const testPageIds = [
  '067dd719a912471ea9a3ac10710e7fdf' // notion kit test suite homepage
]

for (const pageId of testPageIds) {
  test.skipIf(!auth)(
    `NotionCompatAPI test page ${pageId}`,
    { timeout: 30_000 },
    async () => {
    const client = new Client({ auth })
    const compatAPI = new NotionCompatAPI(client)
    const api = new NotionAPI()

    const page = await api.getPage(pageId)
    const compatPage = await compatAPI.getPage(pageId)

    expect(page).toBeTruthy()
    expect(compatPage).toBeTruthy()

    if (debug) {
      await fs.writeFile(`${pageId}.json`, JSON.stringify(page, null, 2))
      await fs.writeFile(
        `${pageId}.compat.json`,
        JSON.stringify(compatPage, null, 2)
      )
    }
  })
}

import { NotionAPI } from 'notion-client'

import { withFixture } from './fixtures'

const client = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL
})

// routed through `withFixture` so visual regression tests can replay data
export const notion = {
  getPage: (pageId: string, opts?: Parameters<NotionAPI['getPage']>[1]) =>
    withFixture('notion-page', { pageId, opts }, () =>
      client.getPage(pageId, opts)
    ),

  search: (params: Parameters<NotionAPI['search']>[0]) =>
    withFixture('notion-search', params, () => client.search(params))
}

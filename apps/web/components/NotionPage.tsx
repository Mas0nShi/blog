'use client'

import cs from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate, getBlockTitle, getBlockValue } from 'notion-utils'
import * as React from 'react'
import BodyClassName from 'react-body-classname'
import {
  type NotionComponents,
  NotionRenderer,
  useNotionContext
} from 'notion-render'
import { Collection } from 'notion-render/third-party/collection'
import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet'
import { useSearchParam } from 'react-use'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { mapImageUrl } from '@/lib/map-image-url'
import { mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'
import { useDarkMode } from '@/lib/use-dark-mode'

import { Waline, type WalineOptions } from './Comment'
import { FloatingTableOfContents } from './FloatingTableOfContents'
import { Footer } from './Footer'
import { NotionPageHeader } from './NotionPageHeader'
import { PageAside } from './PageAside'

// -----------------------------------------------------------------------------
// dynamic imports for optional components
// -----------------------------------------------------------------------------

const Code = dynamic(() =>
  import('notion-render/third-party/code').then(async (m) => {
    // add / remove any prism syntaxes here
    await Promise.allSettled([
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markup-templating.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markup.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-bash.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-c.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-cpp.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-csharp.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-docker.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-java.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-js-templates.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-coffeescript.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-diff.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-git.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-go.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-graphql.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-handlebars.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-less.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-makefile.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-markdown.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-objectivec.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-ocaml.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-python.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-reason.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-rust.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-sass.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-scss.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-solidity.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-sql.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-stylus.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-swift.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-wasm.js'),
      // @ts-expect-error Ignore prisma types
      import('prismjs/components/prism-yaml.js')
    ])
    return m.Code
  })
)

const Equation = dynamic(() =>
  import('notion-render/third-party/equation').then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import('notion-render/third-party/pdf').then((m) => m.Pdf),
  {
    ssr: false
  }
)
const Modal = dynamic(
  () =>
    import('notion-render/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  {
    ssr: false
  }
)

function Tweet({ id }: { id: string }) {
  const { recordMap } = useNotionContext()
  const tweet = (recordMap as types.ExtendedTweetRecordMap)?.tweets?.[id]

  return (
    <React.Suspense fallback={<TweetSkeleton />}>
      {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
    </React.Suspense>
  )
}

const propertyLastEditedTimeValue = (
  { block, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && block?.last_edited_time) {
    return `Last updated ${formatDate(block?.last_edited_time, {
      month: 'long'
    })}`
  }

  return defaultFn()
}

const propertyDateValue = (
  { data, schema, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'published') {
    const publishDate = data?.[0]?.[1]?.[0]?.[1]?.start_date

    if (publishDate) {
      return `${formatDate(publishDate, {
        month: 'long'
      })}`
    }
  }

  return defaultFn()
}

const propertyTextValue = (
  { schema, pageHeader }: any,
  defaultFn: () => React.ReactNode
) => {
  if (pageHeader && schema?.name?.toLowerCase() === 'author') {
    return <b>{defaultFn()}</b>
  }

  return defaultFn()
}

// static waline options; hoisted so they aren't recreated on every render
const walineOptions = {
  emoji: [
    '//cdn.jsdelivr.net/gh/walinejs/emojis@1.4.0/tw-emoji',
    '//cdn.jsdelivr.net/gh/walinejs/emojis@1.4.0/tieba',
    '//cdn.jsdelivr.net/gh/walinejs/emojis@1.4.0/qq',
    '//cdn.jsdelivr.net/gh/walinejs/emojis@1.4.0/weibo'
  ],
  meta: ['nick', 'mail'],
  requiredMeta: ['nick', 'mail'],
  imageUploader: false,
  noCopyright: true,
  reaction: [
    '//npm.elemecdn.com/@waline/emojis/tieba/tieba_agree.png',
    '//npm.elemecdn.com/@waline/emojis/tieba/tieba_look_down.png',
    '//npm.elemecdn.com/@waline/emojis/tieba/tieba_sunglasses.png',
    '//npm.elemecdn.com/@waline/emojis/tieba/tieba_pick_nose.png',
    '//npm.elemecdn.com/@waline/emojis/tieba/tieba_awkward.png',
    '//npm.elemecdn.com/@waline/emojis/tieba/tieba_sleep.png'
  ],
  locale: { reactionTitle: '🎉 文章到底啦' },
  highlighter: true,
  texRenderer: true,
  login: 'disable',
  wordLimit: 10_000
} satisfies Partial<WalineOptions>

const notionRendererComponents: Partial<NotionComponents> = {
  nextImage: Image,
  nextLink: Link,
  Code,
  Collection,
  Equation,
  Pdf,
  Modal,
  Tweet,
  Header: NotionPageHeader,
  propertyLastEditedTimeValue,
  propertyTextValue,
  propertyDateValue
}

export function NotionPage({
  site,
  recordMap,
  pageId
}: Required<Pick<types.PageProps, 'site' | 'recordMap' | 'pageId'>>) {
  const lite = useSearchParam('lite')

  // lite mode is for oembed
  const isLiteMode = lite === 'true'

  const { isDarkMode } = useDarkMode()

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    return mapPageUrl(site, recordMap, searchParams)
  }, [site, recordMap, lite])

  const keys = Object.keys(recordMap?.block || {})
  const block = getBlockValue(recordMap?.block?.[keys[0]!])!

  // const isRootPage =
  //   parsePageId(block?.id) === parsePageId(site?.rootNotionPageId)
  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  const showTableOfContents = !!isBlogPost
  const minTableOfContentsItems = 3

  const pageAside = React.useMemo(
    () => (
      <PageAside block={block!} recordMap={recordMap} isBlogPost={isBlogPost} />
    ),
    [block, recordMap, isBlogPost]
  )

  const title = getBlockTitle(block, recordMap) || site.name

  React.useEffect(() => {
    console.log('notion page', {
      isDev: config.isDev,
      title,
      pageId,
      rootNotionPageId: site.rootNotionPageId,
      recordMap
    })

    // add important objects to the window global for easy debugging
    const g = window as any
    g.pageId = pageId
    g.recordMap = recordMap
    g.block = block
  }, [block, pageId, recordMap, site.rootNotionPageId, title])

  return (
    <>
      {isLiteMode && <BodyClassName className='notion-lite' />}

      {/* 悬浮目录组件 */}
      {showTableOfContents && !isLiteMode && <FloatingTableOfContents />}

      <NotionRenderer
        bodyClassName={cs(pageId === site.rootNotionPageId && 'index-page')}
        darkMode={isDarkMode}
        components={notionRendererComponents}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={!isLiteMode}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={showTableOfContents}
        minTableOfContentsItems={minTableOfContentsItems}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : undefined}
        pageAside={pageAside}
        footer={<Footer />}
        pageFooter={
          pageId === site.rootNotionPageId || !config.walineHost ? null : (
            <Waline
              {...walineOptions}
              serverURL={config.walineHost}
              path={'/' + block.id.replaceAll('-', '')}
              dark={isDarkMode}
            />
          )
        }
      />
    </>
  )
}

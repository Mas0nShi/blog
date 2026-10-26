import type * as types from 'notion-types'
import {
  getBlockCollectionId,
  getBlockIcon,
  getBlockParentPage,
  getBlockValue,
  getListNestingLevel,
  getListNumber,
  getListStyle,
  getPageTableOfContents,
  getTextContent,
  uuidToId
} from 'notion-utils'
import React from 'react'
import { Tweet } from 'react-tweet'

import { AssetWrapper } from './components/asset-wrapper'
import { Audio } from './components/audio'
import { Button } from './components/button'
import { EOI } from './components/eoi'
import { File } from './components/file'
import { GoogleDrive } from './components/google-drive'
import { LazyImage } from './components/lazy-image'
import { PageAside } from './components/page-aside'
import { PageIcon } from './components/page-icon'
import { PageTitle } from './components/page-title'
import { SyncPointerBlock } from './components/sync-pointer-block'
import { TabBlock } from './components/tab-block'
import { Text } from './components/text'
import { ToggleBlock } from './components/toggle-block'
import { useNotionContext } from './context'
import { LinkIcon } from './icons/link-icon'
import { calloutColorClassName } from './colors'
import { tweetClassName } from './media'
import {
  embeddedRootClassName,
  notionRootClassName,
  pageClassName,
  pageShellClassNames
} from './page-shell'
import { bookmarkClassName, bookmarkClassNames } from './rich-blocks'
import {
  blankBlockClassName,
  calloutClassName,
  calloutTextClassName,
  dividerClassName,
  headingAnchorClassName,
  headingClassName,
  headingHashLinkClassName,
  listClassName,
  listItemClassName,
  listItemContentClassName,
  listItemTextClassName,
  quoteClassName,
  textBlockClassName,
  textChildrenClassName,
  toDoClassNames,
  toggleClassNames
} from './text-blocks'
import { cs, isUrl } from './utils'

export interface BlockProps {
  block: types.Block
  level: number

  className?: string
  bodyClassName?: string

  header?: React.ReactNode
  footer?: React.ReactNode
  pageHeader?: React.ReactNode
  pageFooter?: React.ReactNode
  pageTitle?: React.ReactNode
  pageAside?: React.ReactNode
  pageCover?: React.ReactNode

  hideBlockId?: boolean
  disableHeader?: boolean

  children?: React.ReactNode
}

// TODO: use react state instead of a global for this
const tocIndentLevelCache: {
  [blockId: string]: number
} = {}

const pageCoverStyleCache: Record<string, object> = {}

export function Block(props: BlockProps) {
  const ctx = useNotionContext()
  const {
    components,
    fullPage,
    darkMode,
    recordMap,
    mapPageUrl,
    mapImageUrl,
    showTableOfContents,
    minTableOfContentsItems,
    tableOfContentsTitle,
    defaultPageIcon,
    defaultPageCover,
    defaultPageCoverPosition
  } = ctx

  const [activeSection, setActiveSection] = React.useState<string | null>(null)

  const {
    block,
    children,
    level,
    className,
    bodyClassName,
    header,
    footer,
    pageHeader,
    pageFooter,
    pageTitle,
    pageAside,
    pageCover,
    hideBlockId,
    disableHeader
  } = props

  if (!block) {
    return null
  }

  // ugly hack to make viewing raw collection views work properly
  // e.g., 6d886ca87ab94c21a16e3b82b43a57fb
  if (level === 0 && block.type === 'collection_view') {
    ;(block as any).type = 'collection_view_page'
  }

  const blockId = hideBlockId
    ? 'notion-block'
    : `notion-block-${uuidToId(block.id)}`

  switch (block.type) {
    case 'collection_view_page':
    // fallthrough
    case 'page':
      if (level === 0) {
        const {
          page_icon = defaultPageIcon,
          page_cover = defaultPageCover,
          page_cover_position = defaultPageCoverPosition,
          page_full_width,
          page_small_text
        } = block.format || {}

        if (fullPage) {
          const properties =
            block.type === 'page'
              ? block.properties
              : {
                  title: getBlockValue(
                    recordMap.collection[
                      getBlockCollectionId(block, recordMap)!
                    ]
                  )?.name
                }

          const coverPosition = (1 - (page_cover_position || 0.5)) * 100
          const pageCoverObjectPosition = `center ${coverPosition}%`
          let pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition]
          if (!pageCoverStyle) {
            pageCoverStyle = pageCoverStyleCache[pageCoverObjectPosition] = {
              objectPosition: pageCoverObjectPosition
            }
          }

          const pageIcon = getBlockIcon(block, recordMap) ?? defaultPageIcon
          const isPageIconUrl = pageIcon && isUrl(pageIcon)

          const toc = getPageTableOfContents(
            block as types.PageBlock,
            recordMap
          )

          const hasToc =
            showTableOfContents && toc.length >= minTableOfContentsItems
          const hasAside = !!((hasToc || pageAside) && !page_full_width)
          const hasPageCover = !!(pageCover || page_cover)

          return (
            <div
              className={cs(
                notionRootClassName,
                pageShellClassNames.app,
                darkMode ? 'dark-mode' : 'light-mode',
                blockId,
                className
              )}
            >
              <div className={pageShellClassNames.viewport} />

              <div className={pageShellClassNames.frame}>
                {!disableHeader && <components.Header block={block} />}
                {header}

                <div className={pageShellClassNames.scroller}>
                  {hasPageCover &&
                    (pageCover ?? (
                      <div className={pageShellClassNames.coverWrapper}>
                        <LazyImage
                          src={mapImageUrl(page_cover!, block)}
                          alt={getTextContent(properties?.title)}
                          priority={true}
                          fill={true}
                          sizes='100vw'
                          className={pageShellClassNames.cover}
                          style={pageCoverStyle}
                        />
                      </div>
                    ))}

                  <main
                    className={cs(
                      pageClassName({
                        fullPage: true,
                        fullWidth: !!page_full_width,
                        smallText: !!page_small_text,
                        hasCover: hasPageCover,
                        hasIcon: !!page_icon,
                        isImageIcon: !!isPageIconUrl
                      }),
                      hasPageCover
                        ? 'notion-page-has-cover'
                        : 'notion-page-no-cover',
                      page_icon
                        ? 'notion-page-has-icon'
                        : 'notion-page-no-icon',
                      isPageIconUrl
                        ? 'notion-page-has-image-icon'
                        : 'notion-page-has-text-icon',
                      'notion-full-page',
                      page_full_width && 'notion-full-width',
                      page_small_text && 'notion-small-text',
                      bodyClassName
                    )}
                  >
                    {page_icon && (
                      <PageIcon
                        block={block}
                        defaultIcon={defaultPageIcon}
                        inline={false}
                        hasCover={hasPageCover}
                      />
                    )}

                    {pageHeader}

                    <h1 className={pageShellClassNames.title}>
                      {pageTitle ?? (
                        <Text value={properties?.title} block={block} />
                      )}
                    </h1>

                    {(block.type === 'collection_view_page' ||
                      (block.type === 'page' &&
                        block.parent_table === 'collection')) && (
                      <components.Collection block={block} ctx={ctx} />
                    )}

                    {block.type !== 'collection_view_page' && (
                      <div
                        className={cs(
                          pageShellClassNames.content,
                          hasAside && 'notion-page-content-has-aside',
                          hasToc && 'notion-page-content-has-toc'
                        )}
                      >
                        <article className={pageShellClassNames.article}>
                          {children}
                        </article>

                        {hasAside && (
                          <PageAside
                            toc={toc}
                            tocTitle={tableOfContentsTitle}
                            activeSection={activeSection}
                            setActiveSection={setActiveSection}
                            hasToc={hasToc}
                            hasAside={hasAside}
                            pageAside={pageAside}
                          />
                        )}
                      </div>
                    )}

                    {pageFooter}
                  </main>

                  {footer}
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <main
              className={cs(
                embeddedRootClassName({ smallText: !!page_small_text }),
                darkMode ? 'dark-mode' : 'light-mode',
                pageClassName({
                  fullPage: false,
                  fullWidth: !!page_full_width,
                  smallText: !!page_small_text,
                  hasCover: false,
                  hasIcon: false,
                  isImageIcon: false
                }),
                page_full_width && 'notion-full-width',
                page_small_text && 'notion-small-text',
                blockId,
                className,
                bodyClassName
              )}
            >
              <div className={pageShellClassNames.viewport} />

              {pageHeader}

              {(block.type === 'collection_view_page' ||
                (block.type === 'page' &&
                  block.parent_table === 'collection')) && (
                <components.Collection block={block} ctx={ctx} />
              )}

              {block.type !== 'collection_view_page' && children}

              {pageFooter}
            </main>
          )
        }
      } else {
        const blockColor = block.format?.block_color

        return (
          <components.PageLink
            className={cs(
              'notion-page-link',
              blockColor && `notion-${blockColor}`,
              blockId
            )}
            href={mapPageUrl(block.id)}
          >
            <PageTitle block={block} />
          </components.PageLink>
        )
      }

    case 'header':
    // fallthrough
    case 'sub_header':
    // fallthrough
    case 'sub_sub_header':
    // fallthrough
    case 'header_4': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color
      const id = uuidToId(block.id)
      const title =
        getTextContent(block.properties.title) || `Notion Header ${id}`

      // we use a cache here because constructing the ToC is non-trivial
      let indentLevel = tocIndentLevelCache[block.id]
      let indentLevelClass: string | undefined

      if (indentLevel === undefined) {
        const page = getBlockParentPage(block, recordMap)

        if (page) {
          const toc = getPageTableOfContents(page, recordMap)
          const tocItem = toc.find((tocItem) => tocItem.id === block.id)

          if (tocItem) {
            indentLevel = tocItem.indentLevel
            tocIndentLevelCache[block.id] = indentLevel
          }
        }
      }

      if (indentLevel !== undefined) {
        indentLevelClass = `notion-h-indent-${indentLevel}`
      }

      const isH1 = block.type === 'header'
      const isH2 = block.type === 'sub_header'
      const isH3 = block.type === 'sub_sub_header'

      const classNameStr = cs(
        headingClassName(isH1 ? 1 : isH2 ? 2 : isH3 ? 3 : 4, blockColor),
        indentLevelClass,
        blockId
      )

      const innerHeader = (
        <span>
          <div id={id} className={headingAnchorClassName} />
          {!block.format?.toggleable && (
            <a
              className={headingHashLinkClassName}
              href={`#${id}`}
              title={title}
            >
              <LinkIcon />
            </a>
          )}

          <span className='notion-h-title'>
            <Text value={block.properties.title} block={block} />
          </span>
        </span>
      )
      let headerBlock = null

      //page title takes the h1 so all header blocks are greater
      if (isH1) {
        headerBlock = (
          <h2 className={classNameStr} data-id={id}>
            {innerHeader}
          </h2>
        )
      } else if (isH2) {
        headerBlock = (
          <h3 className={classNameStr} data-id={id}>
            {innerHeader}
          </h3>
        )
      } else if (isH3) {
        headerBlock = (
          <h4 className={classNameStr} data-id={id}>
            {innerHeader}
          </h4>
        )
      } else {
        headerBlock = (
          <h5 className={classNameStr} data-id={id}>
            {innerHeader}
          </h5>
        )
      }

      if (block.format?.toggleable) {
        return (
          <details className={cs(toggleClassNames.toggle, blockId)}>
            <summary>{headerBlock}</summary>
            <div>{children}</div>
          </details>
        )
      } else {
        return headerBlock
      }
    }

    case 'divider':
      return <hr className={cs(dividerClassName, blockId)} />

    case 'text': {
      if (!block.properties && !block.content?.length) {
        return <div className={cs(blankBlockClassName, blockId)}>&nbsp;</div>
      }

      const blockColor = block.format?.block_color

      return (
        <div className={cs(textBlockClassName(blockColor), blockId)}>
          {block.properties?.title && (
            <Text value={block.properties.title} block={block} />
          )}

          {children && <div className={textChildrenClassName}>{children}</div>}
        </div>
      )
    }

    case 'bulleted_list':
    // fallthrough
    case 'numbered_list': {
      const wrapList = (content: React.ReactNode) =>
        block.type === 'bulleted_list' ? (
          <div className={cs(listClassName('bulleted'), blockId)}>
            {content}
          </div>
        ) : (
          <div
            className={cs(listClassName('numbered'), blockId)}
            style={
              block.type === 'numbered_list'
                ? {
                    listStyleType: getListStyle(
                      getListNestingLevel(block.id, recordMap.block)
                    )
                  }
                : undefined
            }
          >
            {content}
          </div>
        )

      let output: React.ReactNode | null = null
      const isTopLevel =
        block.type !== getBlockValue(recordMap.block[block.parent_id])?.type
      const start = getListNumber(block.id, recordMap.block)

      const props =
        block.type === 'bulleted_list'
          ? {}
          : {
              'block-list-numbered-counter': start
            }

      if (block.content) {
        output = (
          <>
            {block.properties && (
              <div className={listItemClassName} {...props}>
                <div className={listItemContentClassName}>
                  <div className={listItemTextClassName}>
                    <Text value={block.properties.title} block={block} />
                  </div>
                  <div className={listItemTextClassName}>{children}</div>
                </div>
              </div>
            )}
          </>
        )
      } else {
        output = block.properties ? (
          <div className={listItemClassName} {...props}>
            <div className={listItemContentClassName}>
              <div className={listItemTextClassName}>
                <Text value={block.properties.title} block={block} />
              </div>
            </div>
          </div>
        ) : null
      }

      return isTopLevel ? wrapList(output) : output
    }

    case 'embed':
      return <components.Embed blockId={blockId} block={block} />
    case 'replit':
    // fallthrough
    case 'tweet': {
      const uri = block?.properties?.source?.[0]?.[0] as string
      const id = uri.split('/').pop() as string

      return (
        <div
          data-theme={darkMode ? 'dark' : 'light'}
          className={tweetClassName}
        >
          <Tweet id={id} />
        </div>
      )
    }
    case 'maps':
    // fallthrough
    case 'pdf':
    // fallthrough
    case 'figma':
    // fallthrough
    case 'typeform':
    // fallthrough
    case 'codepen':
    // fallthrough
    case 'excalidraw':
    // fallthrough
    case 'image':
    // fallthrough
    case 'gist':
    // fallthrough
    case 'video':
      return <AssetWrapper blockId={blockId} block={block} />

    case 'drive': {
      const properties = block.format?.drive_properties
      if (!properties) {
        //check if this drive actually needs to be embeded ex. google sheets.
        if (block.format?.display_source) {
          return <AssetWrapper blockId={blockId} block={block} />
        }
      }

      return (
        <GoogleDrive
          block={block as types.GoogleDriveBlock}
          className={blockId}
        />
      )
    }

    case 'audio':
      return <Audio block={block as types.AudioBlock} className={blockId} />

    case 'file':
      return <File block={block as types.FileBlock} className={blockId} />

    case 'equation':
      return (
        <components.Equation
          block={block as types.EquationBlock}
          inline={false}
          className={blockId}
        />
      )

    case 'code':
      return <components.Code block={block as types.CodeBlock} />

    case 'column_list':
      return <div className={cs('notion-row', blockId)}>{children}</div>

    case 'column': {
      // note: notion uses 46px
      const spacerWidth = `min(32px, 4vw)`
      const ratio = block.format?.column_ratio || 0.5
      const parent = getBlockValue(recordMap.block[block.parent_id])
      const columns =
        parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio))

      const width = `calc((100% - (${
        columns - 1
      } * ${spacerWidth})) * ${ratio})`
      const style = { width }

      return (
        <>
          <div
            className={cs(
              'notion-column',
              // the column owns the outer spacing of its first and last block
              'tw:*:first:mx-0! tw:*:first:mt-0! tw:*:last:mx-0! tw:*:last:mb-0!',
              blockId
            )}
            style={style}
          >
            {children}
          </div>

          <div className='notion-spacer' />
        </>
      )
    }

    case 'quote': {
      if (!block.properties) return null

      const blockColor = block.format?.block_color

      return (
        <blockquote className={cs(quoteClassName(blockColor), blockId)}>
          <div>
            <Text value={block.properties.title} block={block} />
          </div>
          {children}
        </blockquote>
      )
    }

    case 'collection_view':
      return (
        <components.Collection block={block} className={blockId} ctx={ctx} />
      )

    case 'callout':
      if (components.Callout) {
        return <components.Callout block={block} className={blockId} />
      } else {
        return (
          <div
            className={cs(
              calloutClassName,
              calloutColorClassName(block.format?.block_color),
              blockId
            )}
          >
            <PageIcon block={block} hideDefaultIcon={true} />

            <div className={calloutTextClassName}>
              <Text value={block.properties?.title} block={block} />
              {children}
            </div>
          </div>
        )
      }

    case 'bookmark': {
      if (!block.properties) return null

      const link = block.properties.link
      if (!link || !link[0]?.[0]) return null

      let title = getTextContent(block.properties.title)
      if (!title) {
        title = getTextContent(link)
      }

      if (title) {
        if (title.startsWith('http')) {
          try {
            const url = new URL(title)
            title = url.hostname
          } catch {
            // ignore invalid links
          }
        }
      }

      return (
        <div className='notion-row'>
          <components.Link
            target='_blank'
            rel='noopener noreferrer'
            className={cs(
              bookmarkClassName(block.format?.block_color),
              blockId
            )}
            href={link[0][0]}
          >
            <div className={bookmarkClassNames.body}>
              {title && (
                <div className={bookmarkClassNames.title}>
                  <Text value={[[title]]} block={block} />
                </div>
              )}

              {block.properties?.description && (
                <div className={bookmarkClassNames.description}>
                  <Text value={block.properties?.description} block={block} />
                </div>
              )}

              <div className={bookmarkClassNames.link}>
                {block.format?.bookmark_icon && (
                  <div className={bookmarkClassNames.linkIcon}>
                    <LazyImage
                      src={mapImageUrl(block.format?.bookmark_icon, block)}
                      alt={title}
                      fill={true}
                      sizes='16px'
                      // this image is likely to be hot-linked from a third-party, so we can't optimize it
                      unoptimized={true}
                    />
                  </div>
                )}

                <div className={bookmarkClassNames.linkText}>
                  <Text value={link} block={block} />
                </div>
              </div>
            </div>

            {block.format?.bookmark_cover && (
              <div className={bookmarkClassNames.image}>
                <LazyImage
                  src={mapImageUrl(block.format?.bookmark_cover, block)}
                  alt={getTextContent(block.properties?.title)}
                  fill={true}
                  sizes='(max-width: 640px) 0px, 25vw'
                  // this image is likely to be hot-linked from a third-party, so we can't optimize it
                  unoptimized={true}
                  style={{
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
          </components.Link>
        </div>
      )
    }

    case 'toggle':
      return (
        <ToggleBlock blockId={blockId} block={block}>
          {children}
        </ToggleBlock>
      )

    case 'button': {
      const ButtonComponent = components.Button || Button

      return (
        <ButtonComponent
          blockId={blockId}
          block={block as types.ButtonBlock}
          className={blockId}
        />
      )
    }

    case 'table_of_contents': {
      const page = getBlockParentPage(block, recordMap)
      if (!page) return null

      const toc = getPageTableOfContents(page, recordMap)
      const blockColor = block.format?.block_color

      return (
        <div
          className={cs(
            'notion-table-of-contents',
            blockColor && `notion-${blockColor}`,
            blockId
          )}
        >
          {toc.map((tocItem) => (
            <a
              key={tocItem.id}
              href={`#${uuidToId(tocItem.id)}`}
              className='notion-table-of-contents-item'
            >
              <span
                className='notion-table-of-contents-item-body'
                style={{
                  display: 'inline-block',
                  marginLeft: tocItem.indentLevel * 24
                }}
              >
                {tocItem.text}
              </span>
            </a>
          ))}
        </div>
      )
    }

    case 'to_do': {
      const isChecked = block.properties?.checked?.[0]?.[0] === 'Yes'

      return (
        <div className={cs(toDoClassNames.root, blockId)}>
          <div className={toDoClassNames.item}>
            <components.Checkbox blockId={blockId} isChecked={isChecked} />

            <div
              className={cs(
                toDoClassNames.body,
                isChecked && toDoClassNames.checked
              )}
            >
              <Text value={block.properties?.title} block={block} />
            </div>
          </div>

          <div className={toDoClassNames.children}>{children}</div>
        </div>
      )
    }

    case 'transclusion_container':
      return <div className={cs('notion-sync-block', blockId)}>{children}</div>

    case 'transclusion_reference':
      return <SyncPointerBlock {...props} level={level + 1} />

    case 'alias': {
      const blockPointerId = block?.format?.alias_pointer?.id
      const linkedBlock = getBlockValue(recordMap.block[blockPointerId])
      if (!linkedBlock) {
        console.log('"alias" missing block', blockPointerId)
        return null
      }

      return (
        <components.PageLink
          className={cs('notion-page-link', blockPointerId)}
          href={mapPageUrl(blockPointerId)}
        >
          <PageTitle block={linkedBlock} />
        </components.PageLink>
      )
    }

    case 'table':
      return (
        <div className={cs('notion-simple-table-container', blockId)}>
          <table className={cs('notion-simple-table', blockId)}>
            <tbody>{children}</tbody>
          </table>
        </div>
      )

    case 'table_row': {
      const tableBlock = getBlockValue(
        recordMap.block[block.parent_id]
      ) as types.TableBlock
      if (!tableBlock) {
        return null
      }

      const order = tableBlock.format?.table_block_column_order
      const formatMap = tableBlock.format?.table_block_column_format
      const backgroundColor = block.format?.block_color

      const hasRowHeader = tableBlock.format?.table_block_column_header === true
      const hasColumnHeader = tableBlock.format?.table_block_row_header === true

      const isHeaderRow = hasRowHeader && tableBlock.content?.[0] === block.id

      if (!tableBlock || !order) {
        return null
      }

      return (
        <tr
          className={cs(
            'notion-simple-table-row',
            backgroundColor && `notion-${backgroundColor}`,
            isHeaderRow && 'notion-simple-table-header-row',
            blockId
          )}
        >
          {order.map((column, columnIndex) => {
            const color = formatMap?.[column]?.color

            const isHeaderColumn = hasColumnHeader && columnIndex === 0

            return (
              <td
                key={column}
                className={cs(
                  color ? `notion-${color}` : '',
                  isHeaderColumn && 'notion-simple-table-header-cell'
                )}
                style={{
                  width: formatMap?.[column]?.width || 120
                }}
              >
                <div className='notion-simple-table-cell'>
                  <Text
                    value={block.properties?.[column] || [['ㅤ']]}
                    block={block}
                  />
                </div>
              </td>
            )
          })}
        </tr>
      )
    }

    case 'tab': {
      const { children: _tabChildren, ...tabBlockProps } = props
      return (
        <TabBlock
          {...tabBlockProps}
          block={block}
          blockId={blockId}
          level={level}
        />
      )
    }

    case 'external_object_instance':
      return <EOI block={block} className={blockId} />

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          'Unsupported block type ' + (block as any).type,
          JSON.stringify(block, null, 2)
        )
      }

      return <div />
  }
}

import type * as types from 'notion-types'
import { getPageBreadcrumbs } from 'notion-utils'
import React from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { useNotionContext } from '../context'
import { SearchIcon } from '../icons/search-icon'
import { type SearchNotionFn } from '../types'
import { cs } from '../utils'
import { PageIcon } from './page-icon'
import { SearchDialog } from './search-dialog'

/**
 * Header styles, exported so custom headers (e.g. the site's navigation
 * header) share them instead of re-implementing the markup's CSS.
 */
export const headerClassNames = {
  // sticky, translucent bar above the page; stacks above page content
  header: cs(
    'notion-header',
    'tw:sticky tw:top-0 tw:left-0 tw:z-(--z-header) tw:w-full tw:max-w-screen tw:overflow-hidden',
    'tw:h-(--notion-header-height) tw:min-h-(--notion-header-height)',
    'tw:bg-[hsla(0,0%,100%,0.8)] tw:backdrop-blur-[16px] tw:backdrop-saturate-[180%]',
    'tw:dark:bg-transparent tw:dark:shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.1)] tw:dark:backdrop-blur-[20px]',
    // Firefox renders a transparent bar poorly; give it a tinted background
    'tw:supports-[-moz-appearance:none]:dark:bg-[hsla(203,8%,20%,0.8)]'
  ),
  nav: cs(
    'notion-nav-header',
    'tw:absolute tw:inset-x-0 tw:top-0 tw:mx-auto tw:flex tw:h-full tw:w-full tw:max-w-[1100px]',
    'tw:flex-row tw:items-center tw:justify-between tw:gap-[12px] tw:overflow-x-auto tw:px-[12px]',
    'tw:text-[14px] tw:leading-[1.2] tw:[text-size-adjust:100%]'
  ),
  breadcrumbs: cs(
    'breadcrumbs',
    'tw:flex tw:h-full tw:min-w-0 tw:grow-0 tw:flex-row tw:items-center'
  ),
  // link-like item in the header: breadcrumb, nav link or icon button
  breadcrumb: cs(
    'breadcrumb',
    'tw:my-[1px] tw:inline-flex tw:cursor-pointer tw:flex-row tw:items-center tw:justify-center',
    'tw:rounded-[3px] tw:bg-transparent tw:px-[6px] tw:py-[4px] tw:whitespace-nowrap tw:text-ellipsis',
    'tw:text-fg tw:no-underline tw:select-none tw:transition-[background] tw:duration-[120ms] tw:ease-in',
    'tw:[&:not(.active):hover]:bg-bg-hover tw:[&:not(.active):active]:bg-bg-subtle tw:[&.active]:cursor-default',
    'tw:[&_.notion-page-icon-inline]:mt-0 tw:[&_.notion-page-icon-inline]:mr-[6px] tw:[&_.notion-page-icon-inline]:mb-0 tw:[&_.notion-page-icon-inline]:ml-0',
    'tw:[&_.notion-page-icon-inline]:text-[18px] tw:[&_.notion-page-icon-inline]:leading-[1.1] tw:[&_.notion-page-icon-span]:top-[1px]'
  ),
  // icon buttons and nav links get a larger hit area than breadcrumbs
  button: cs('button', 'tw:p-[12px]!'),
  spacer: cs('spacer', 'tw:mx-[2px] tw:text-fg-subtle'),
  // labels collapse on narrow screens, leaving icons only
  title: cs('title', 'tw:[@media(max-width:600px)]:hidden')
}

export function Header({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  return (
    <header className={headerClassNames.header}>
      <div className={headerClassNames.nav}>
        <Breadcrumbs block={block} />
        <Search block={block} />
      </div>
    </header>
  )
}

export function Breadcrumbs({
  block,
  rootOnly = false
}: {
  block: types.Block
  rootOnly?: boolean
}) {
  const { recordMap, mapPageUrl, components } = useNotionContext()

  const breadcrumbs = React.useMemo(() => {
    const tempBreadcrumbs = getPageBreadcrumbs(recordMap, block.id)
    if (rootOnly) {
      return [tempBreadcrumbs?.[0]].filter(Boolean)
    }

    return tempBreadcrumbs
  }, [recordMap, block.id, rootOnly])

  return (
    <div className={headerClassNames.breadcrumbs} key='breadcrumbs'>
      {breadcrumbs?.map((breadcrumb, index: number) => {
        if (!breadcrumb) {
          return null
        }

        const pageLinkProps: any = {}
        const componentMap = {
          pageLink: components.PageLink
        }

        if (breadcrumb.active) {
          componentMap.pageLink = (props: any) => <div {...props} />
        } else {
          pageLinkProps.href = mapPageUrl(breadcrumb.pageId)
        }

        return (
          <React.Fragment key={breadcrumb.pageId}>
            <componentMap.pageLink
              className={cs(
                headerClassNames.breadcrumb,
                breadcrumb.active && 'active'
              )}
              {...pageLinkProps}
            >
              {breadcrumb.icon && (
                <PageIcon className='icon' block={breadcrumb.block} />
              )}

              {breadcrumb.title && (
                <span className={headerClassNames.title}>
                  {breadcrumb.title}
                </span>
              )}
            </componentMap.pageLink>

            {index < breadcrumbs.length - 1 && (
              <span className={headerClassNames.spacer}>/</span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export function Search({
  block,
  search,
  title = 'Search'
}: {
  block: types.Block
  search?: SearchNotionFn
  title?: React.ReactNode
}) {
  const { searchNotion, rootPageId, isShowingSearch, onHideSearch } =
    useNotionContext()
  const onSearchNotion = search || searchNotion

  const [isSearchOpen, setIsSearchOpen] = React.useState(isShowingSearch)
  React.useEffect(() => {
    setIsSearchOpen(isShowingSearch)
  }, [isShowingSearch])

  const onOpenSearch = React.useCallback(() => {
    setIsSearchOpen(true)
  }, [])

  const onCloseSearch = React.useCallback(() => {
    setIsSearchOpen(false)
    if (onHideSearch) {
      onHideSearch()
    }
  }, [onHideSearch])

  useHotkeys('cmd+p', (event) => {
    onOpenSearch()
    event.preventDefault()
    event.stopPropagation()
  })

  useHotkeys('cmd+k', (event) => {
    onOpenSearch()
    event.preventDefault()
    event.stopPropagation()
  })

  const hasSearch = !!onSearchNotion

  return (
    <>
      {hasSearch && (
        <div
          role='button'
          className={cs(
            headerClassNames.breadcrumb,
            headerClassNames.button,
            'notion-search-button',
            'tw:gap-[8px] tw:[@media(max-width:600px)]:hidden!'
          )}
          onClick={onOpenSearch}
        >
          <SearchIcon className='searchIcon tw:size-[14px] tw:fill-fg tw:text-fg' />

          {title && <span className={headerClassNames.title}>{title}</span>}
        </div>
      )}

      {isSearchOpen && hasSearch && (
        <SearchDialog
          isOpen={isSearchOpen}
          rootBlockId={rootPageId || block?.id}
          onClose={onCloseSearch}
          searchNotion={onSearchNotion}
        />
      )}
    </>
  )
}

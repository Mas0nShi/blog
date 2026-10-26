import type * as types from 'notion-types'
import {
  getBlockCollectionId,
  getBlockParentPage,
  getBlockValue,
  getTextContent
} from 'notion-utils'
import React from 'react'

import { collectionClassNames } from '../collections'
import { PageIcon } from '../components/page-icon'
import {
  type NotionContext,
  NotionContextProvider,
  useNotionContext
} from '../context'
import { CollectionViewIcon } from '../icons/collection-view-icon'
import { pageTitleClassNames } from '../page-links'
import { cs } from '../utils'
import { CollectionRow } from './collection-row'
import { CollectionView } from './collection-view'
import { useLocalStorage, useWindowSize } from './react-use'

const isServer = !globalThis.window

export function Collection({
  block,
  className,
  ctx
}: {
  block:
    | types.CollectionViewBlock
    | types.CollectionViewPageBlock
    | types.PageBlock
  className?: string
  ctx: NotionContext
}) {
  /**
   * NOTE: there is a weird side effect of us using multiple bundles for
   * collections, where `useNotionContext` returns a *different* context than for
   * the main bundle.
   *
   * This is due to `React.createContext` being called in each bundle which includes
   * `../context.ts`.
   *
   * To circumvent this issue, we're passing the context value directly to
   * `Collection` so all children have the correct context values.
   */
  // console.log('Collection', Object.keys(recordMap.block).length)

  const context: NotionContext = React.useMemo(
    () => ({
      ...ctx
    }),
    [ctx]
  )

  if (block.type === 'page') {
    if (block.parent_table !== 'collection') {
      return null
    }

    return (
      <NotionContextProvider {...context}>
        <div className={collectionClassNames.pageProperties}>
          <CollectionRow
            block={block as types.PageBlock}
            pageHeader={true}
            className={className}
          />
        </div>
      </NotionContextProvider>
    )
  } else {
    return (
      <NotionContextProvider {...context}>
        <CollectionViewBlock block={block} className={className} />
      </NotionContextProvider>
    )
  }
}

function CollectionViewBlock({
  block,
  className
}: {
  block: types.CollectionViewBlock | types.CollectionViewPageBlock
  className?: string
}) {
  const { recordMap, showCollectionViewDropdown } = useNotionContext()
  const { view_ids: viewIds } = block
  const collectionId = getBlockCollectionId(block, recordMap)!

  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const defaultCollectionViewId = viewIds[0]!
  const [collectionState, setCollectionState] = useLocalStorage(block.id, {
    collectionViewId: defaultCollectionViewId
  })

  const collectionViewId =
    (isMounted &&
      viewIds.find((id) => id && id === collectionState?.collectionViewId)) ||
    defaultCollectionViewId

  const onChangeView = React.useCallback(
    (collectionViewId: string) => {
      console.log('change collection view', collectionViewId)

      setCollectionState({
        ...collectionState,
        collectionViewId
      })
    },
    [collectionState, setCollectionState]
  )

  let { width: windowWidth } = useWindowSize()
  if (isServer) {
    windowWidth = 1024
  }

  const collection = getBlockValue(recordMap.collection[collectionId])
  const collectionView = getBlockValue(
    recordMap.collection_view[collectionViewId]
  )
  const collectionData =
    recordMap.collection_query[collectionId]?.[collectionViewId]
  const parentPage = getBlockParentPage(block, recordMap)

  const { width, padding } = React.useMemo(() => {
    const style: React.CSSProperties = {}

    if (collectionView?.type !== 'table' && collectionView?.type !== 'board') {
      return {
        style,
        width: 0,
        padding: 0
      }
    }

    const width = windowWidth
    // TODO: customize for mobile?
    const maxNotionBodyWidth = 708
    let notionBodyWidth = maxNotionBodyWidth

    if (parentPage?.format?.page_full_width) {
      notionBodyWidth = Math.trunc(width - 2 * Math.min(96, width * 0.08))
    } else {
      notionBodyWidth =
        width < maxNotionBodyWidth
          ? Math.trunc(width - width * 0.02) // 2vw
          : maxNotionBodyWidth
    }

    const padding =
      isServer && !isMounted ? 96 : Math.trunc((width - notionBodyWidth) / 2)
    style.paddingLeft = padding
    style.paddingRight = padding

    return {
      style,
      width,
      padding
    }
  }, [windowWidth, parentPage, collectionView?.type, isMounted])

  // console.log({
  //   width,
  //   padding
  // })

  if (!(collection && collectionView && collectionData)) {
    console.warn('skipping missing collection view for block', block.id, {
      collectionId,
      collectionViewId,
      collectionView,
      collectionData,
      recordMap
    })
    return null
  }

  const title = getTextContent(collection.name).trim()
  const showTitle =
    (block.format as any)?.hide_inline_collection_name !== true &&
    collectionView.format?.hide_linked_collection_name !== true &&
    title

  if (collection.icon) {
    block.format = {
      ...block.format,
      page_icon: collection.icon
    }
  }

  return (
    <>
      <div>
        <div>
          {viewIds.length > 1 && showCollectionViewDropdown && (
            <CollectionViewTabs
              collectionViewId={collectionViewId}
              viewIds={viewIds}
              onChangeView={onChangeView}
            />
          )}
        </div>

        {showTitle && (
          <div className={collectionClassNames.header}>
            <div className={collectionClassNames.headerTitle}>
              <PageIcon
                block={block}
                className={pageTitleClassNames.icon}
                hideDefaultIcon
              />

              {title}
            </div>
          </div>
        )}
      </div>

      <div className={cs(collectionClassNames.root, className)}>
        <CollectionView
          collection={collection}
          collectionView={collectionView}
          collectionData={collectionData}
          padding={padding}
          width={width}
        />
      </div>
    </>
  )
}

function CollectionViewTabs({
  collectionViewId,
  viewIds,
  onChangeView
}: {
  collectionViewId: string
  viewIds: string[]
  onChangeView: (viewId: string) => void
}) {
  const { recordMap } = useNotionContext()

  return (
    <div className={collectionClassNames.tabs}>
      {viewIds.map((viewId) => (
        <button
          onClick={() => onChangeView(viewId)}
          key={viewId}
          className={collectionClassNames.tab(collectionViewId === viewId)}
        >
          <CollectionViewColumnDesc
            collectionView={getBlockValue(recordMap.collection_view[viewId])}
          />
        </button>
      ))}
    </div>
  )
}

function CollectionViewColumnDesc({
  collectionView,
  className,
  children,
  ...rest
}: {
  collectionView?: types.CollectionView
  className?: string
  children?: React.ReactNode
}) {
  if (!collectionView) return null

  const { type } = collectionView
  const name =
    collectionView.name || `${type[0]!.toUpperCase()}${type.slice(1)} view`

  return (
    <div className={cs(collectionClassNames.viewType, className)} {...rest}>
      <CollectionViewIcon
        className={collectionClassNames.viewTypeIcon}
        type={type}
      />

      <span className={collectionClassNames.viewTypeTitle}>{name}</span>

      {children}
    </div>
  )
}

export { PropertyImplMemo as Property } from './property'

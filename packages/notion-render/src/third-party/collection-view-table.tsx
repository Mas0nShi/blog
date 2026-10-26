import { getBlockValue } from 'notion-utils'
import React from 'react'

import { collectionClassNames, tableClassNames } from '../collections'
import { useNotionContext } from '../context'
import { type CollectionViewProps } from '../types'
import { CollectionColumnTitle } from './collection-column-title'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'
import { Property } from './property'
import { useClientStyle } from './react-use'
import { TableCellTooltip } from './table-cell-tooltip'

const defaultBlockIds: string[] = []

export function CollectionViewTable({
  collection,
  collectionView,
  collectionData,
  padding,
  width
}: CollectionViewProps) {
  const isGroupedCollection = collectionView?.format?.collection_group_by

  if (isGroupedCollection) {
    const collectionGroups = getCollectionGroups(
      collection,
      collectionView,
      collectionData
    )

    return collectionGroups.map((group, index) => (
      <CollectionGroup
        key={index}
        {...group}
        padding={padding}
        width={width}
        collectionViewComponent={(props) => (
          <Table {...props} padding={padding} width={width} />
        )}
        summaryProps={{
          style: {
            paddingLeft: padding,
            paddingRight: padding
          }
        }}
      />
    ))
  }

  const blockIds =
    (collectionData.collection_group_results?.blockIds ??
      collectionData.blockIds) ||
    defaultBlockIds

  return (
    <Table
      blockIds={blockIds}
      collection={collection}
      collectionView={collectionView}
      padding={padding}
      width={width}
    />
  )
}

function Table({
  blockIds = [],
  collection,
  collectionView,
  width,
  padding
}: {
  blockIds?: string[]
} & Omit<CollectionViewProps, 'collectionData'>) {
  const { recordMap, linkTableTitleProperties } = useNotionContext()

  const [isExpanded, setIsExpanded] = React.useState(false)

  // View-level wrap default; absence means false (Notion convention)
  const tableWrap = collectionView.format?.table_wrap ?? false

  const tableRef = React.useRef<HTMLDivElement | null>(null)

  const { inline_collection_first_load_limit } = collectionView.format || {}
  const loadLimit = inline_collection_first_load_limit?.limit
  const shouldLimit = typeof loadLimit === 'number'

  const showLoadMore =
    shouldLimit && !isExpanded && (blockIds?.length || 0) > loadLimit
  const visibleBlockIds = showLoadMore
    ? blockIds?.slice(0, loadLimit)
    : blockIds

  const tableStyle = useClientStyle(
    {
      width,
      maxWidth: width
    },
    { visibility: 'hidden' }
  )

  const tableViewStyle = useClientStyle({
    paddingLeft: padding,
    paddingRight: padding
  })

  let properties = []

  if (collectionView.format?.table_properties) {
    properties = collectionView.format.table_properties.filter(
      (p: any) => p.visible && collection.schema[p.property]
    )
  } else {
    properties = [{ property: 'title' }].concat(
      Object.keys(collection.schema)
        .filter((p) => p !== 'title')
        .map((property) => ({ property }))
    )
  }

  return (
    <div className={tableClassNames.root} style={tableStyle} ref={tableRef}>
      <div className={tableClassNames.view} style={tableViewStyle}>
        {!!properties.length && (
          <>
            <div className={tableClassNames.header}>
              <div className={tableClassNames.headerInner}>
                {properties.map((p: any, index: number) => {
                  const schema = collection.schema?.[p.property]
                  const isTitle = p.property === 'title'
                  const style: React.CSSProperties = {}

                  if (p.width) {
                    style.width = p.width
                  } else if (isTitle) {
                    style.width = 280
                  } else {
                    style.width = 200
                    // style.width = `${100.0 / properties.length}%`
                  }

                  return (
                    <div className={tableClassNames.th} key={p.property}>
                      <div className={tableClassNames.headerCell} style={style}>
                        <div
                          className={tableClassNames.headerCellInner(
                            index === properties.length - 1
                          )}
                        >
                          {schema && <CollectionColumnTitle schema={schema} />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={tableClassNames.headerPlaceholder}></div>

            <div className={tableClassNames.body}>
              {visibleBlockIds?.map((blockId) => (
                <div className={tableClassNames.row} key={blockId}>
                  {properties.map((p: any) => {
                    const schema = collection.schema?.[p.property]
                    const block = getBlockValue(recordMap.block[blockId])
                    const data = block?.properties?.[p.property]
                    const isTitle = p.property === 'title'
                    const style: React.CSSProperties = {}

                    if (p.width) {
                      style.width = p.width
                    } else if (isTitle) {
                      style.width = 280
                    } else {
                      style.width = 200
                      // style.width = `${100.0 / properties.length}%`
                    }

                    // Per-column wrap overrides view-level default
                    const cellWrap = p.wrap ?? tableWrap

                    return (
                      <div
                        key={p.property}
                        className={tableClassNames.cell({
                          type: schema?.type,
                          wrap: cellWrap
                        })}
                        style={style}
                      >
                        <Property
                          schema={schema}
                          data={data}
                          block={block}
                          collection={collection}
                          linkToTitlePage={linkTableTitleProperties}
                        />
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            <TableCellTooltip tableRef={tableRef} />
          </>
        )}
      </div>

      {showLoadMore && (
        <div
          className={collectionClassNames.loadMore}
          onClick={() => setIsExpanded(true)}
        >
          <svg
            viewBox='0 0 24 24'
            height='16'
            width='16'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 5v14' />
            <path d='m19 12-7 7-7-7' />
          </svg>
          Load more
        </div>
      )}
    </div>
  )
}

import type * as types from 'notion-types'
import { type PageBlock } from 'notion-types'
import { getBlockValue } from 'notion-utils'
import React from 'react'

import { boardClassNames, boardCountClassName } from '../collections'
import { useNotionContext } from '../context'
import { EmptyIcon } from '../icons/empty-icon'
import { type CollectionViewProps } from '../types'
import { CollectionCard } from './collection-card'
import { CollectionGroup } from './collection-group'
import { getCollectionGroups } from './collection-utils'
import { Property } from './property'

export function CollectionViewBoard({
  collection,
  collectionView,
  collectionData,
  padding
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
        summaryProps={{
          style: {
            paddingLeft: padding
          }
        }}
        collectionViewComponent={(props) => (
          <Board padding={padding} {...props} />
        )}
      />
    ))
  }

  return (
    <Board
      padding={padding}
      collectionView={collectionView}
      collection={collection}
      collectionData={collectionData}
    />
  )
}

function Board({
  collectionView,
  collectionData,
  collection,
  padding
}: {
  collection: types.Collection
  collectionView: types.CollectionView
  collectionData: types.CollectionQueryResult
  padding?: number
}) {
  const { recordMap } = useNotionContext()
  const {
    board_cover = { type: 'none' },
    board_cover_size = 'medium',
    board_cover_aspect = 'cover'
  } = collectionView?.format || {}

  const boardGroups =
    collectionView?.format?.board_columns ||
    collectionView?.format?.board_groups2 ||
    []

  const boardGroupBy = collectionView?.format?.board_columns_by?.groupBy

  const classNames = boardClassNames(board_cover_size)

  const boardStyle = React.useMemo(
    () => ({
      paddingLeft: padding
    }),
    [padding]
  )

  return (
    <div className={classNames.root}>
      <div className={classNames.view} style={boardStyle}>
        <div className={classNames.header}>
          <div className={classNames.headerInner}>
            {boardGroups.map((p: any, index: number) => {
              if (!(collectionData as any).board_columns?.results) {
                // no groupResults in the data when collection is in a toggle
                return null
              }
              const group = (collectionData as any).board_columns.results![
                index
              ]
              const schema = collection.schema[p.property]

              if (!group || !schema || p.hidden) {
                return null
              }

              return (
                <div className={classNames.th} key={index}>
                  <div className={classNames.thBody}>
                    {group.value?.value ? (
                      <Property
                        schema={schema}
                        data={[
                          [
                            group.value?.value[boardGroupBy] ||
                              group.value?.value
                          ]
                        ]}
                        collection={collection}
                      />
                    ) : (
                      <span>
                        <EmptyIcon className={classNames.thEmpty} />
                        {schema?.name ? `No ${schema.name}` : 'No Select'}
                      </span>
                    )}

                    <span className={boardCountClassName}>{group.total}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={classNames.headerPlaceholder} />

        <div className={classNames.body}>
          {boardGroups.map((p: any, index: number) => {
            const boardResults = (collectionData as any).board_columns?.results
            if (!boardResults) return null
            if (!p?.value?.type) return null

            const schema = collection.schema[p.property]
            const group = (collectionData as any)[
              `results:${p?.value?.type}:${p?.value?.value || 'uncategorized'}`
            ]

            if (!group || !schema || p.hidden) {
              return null
            }

            return (
              <div className={classNames.group} key={index}>
                {group.blockIds?.map((blockId: string) => {
                  const block = getBlockValue(
                    recordMap.block[blockId]
                  ) as PageBlock
                  if (!block) return null

                  return (
                    <CollectionCard
                      inBoard
                      collection={collection}
                      block={block}
                      cover={board_cover}
                      coverSize={board_cover_size}
                      coverAspect={board_cover_aspect}
                      properties={collectionView.format?.board_properties}
                      key={blockId}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

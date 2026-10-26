import { boardCountClassName, collectionClassNames } from '../collections'
import { type CollectionGroupProps } from '../types'
import { Property } from './property'

export function CollectionGroup({
  collectionViewComponent: CollectionViewComponent,
  collection,
  collectionGroup,
  schema,
  value,
  hidden,
  summaryProps,
  detailsProps,
  ...rest
}: CollectionGroupProps) {
  if (hidden) return null

  return (
    <details open className={collectionClassNames.group} {...detailsProps}>
      <summary className={collectionClassNames.groupTitle} {...summaryProps}>
        <div className={collectionClassNames.groupTitleInner}>
          <Property schema={schema} data={[[value]]} collection={collection} />

          <span className={boardCountClassName}>{collectionGroup?.total}</span>
        </div>
      </summary>

      <CollectionViewComponent
        collection={collection}
        collectionGroup={collectionGroup}
        {...rest}
      />
    </details>
  )
}

import { type CollectionPropertySchema } from 'notion-types'

import { columnTitleClassNames } from '../collections'
import { PropertyIcon } from '../icons/property-icon'

export function CollectionColumnTitle({
  schema,
  variant = 'table'
}: {
  schema: CollectionPropertySchema
  /** `row`: label of a page property row; `hidden`: not shown */
  variant?: 'table' | 'row' | 'hidden'
}) {
  const classNames = columnTitleClassNames(variant)

  return (
    <div className={classNames.root}>
      <PropertyIcon className={classNames.icon} type={schema.type} />

      <div className={classNames.body}>{schema.name}</div>
    </div>
  )
}

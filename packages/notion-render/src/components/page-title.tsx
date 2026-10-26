import { type Block, type Decoration } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
import React from 'react'

import { useNotionContext } from '../context'
import { pageTitleClassNames } from '../page-links'
import { cs } from '../utils'
import { PageIcon } from './page-icon'
import { Text } from './text'

export function PageTitleImpl({
  block,
  className,
  defaultIcon,
  ...rest
}: {
  block: Block
  className?: string
  defaultIcon?: string | null
}) {
  const { recordMap } = useNotionContext()

  if (!block) return null

  if (
    block.type === 'collection_view_page' ||
    block.type === 'collection_view'
  ) {
    const title = getBlockTitle(block, recordMap)
    if (!title) {
      return null
    }

    const titleDecoration: Decoration[] = [[title]]

    return (
      <span className={cs(pageTitleClassNames.root, className)} {...rest}>
        <PageIcon
          block={block}
          defaultIcon={defaultIcon}
          className={pageTitleClassNames.icon}
        />

        <span className={pageTitleClassNames.text}>
          <Text value={titleDecoration} block={block} />
        </span>
      </span>
    )
  }

  if (!block.properties?.title) {
    return null
  }

  return (
    <span className={cs(pageTitleClassNames.root, className)} {...rest}>
      <PageIcon
        block={block}
        defaultIcon={defaultIcon}
        className={pageTitleClassNames.icon}
      />

      <span className={pageTitleClassNames.text}>
        <Text value={block.properties?.title} block={block} />
      </span>
    </span>
  )
}

export const PageTitle = React.memo(PageTitleImpl)

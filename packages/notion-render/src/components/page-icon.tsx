import { type Block, type CalloutBlock, type PageBlock } from 'notion-types'
import {
  getBlockIcon,
  getBlockTitle,
  notionImageProxyOrigin
} from 'notion-utils'
import React from 'react'

import { useNotionContext } from '../context'
import { DefaultPageIcon } from '../icons/default-page-icon'
import {
  pageIconHeroClassName,
  pageIconHeroContentClassName
} from '../page-shell'
import { cs, isUrl } from '../utils'
import { LazyImage } from './lazy-image'

const isIconBlock = (value: Block): value is PageBlock | CalloutBlock => {
  return (
    value.type === 'page' ||
    value.type === 'callout' ||
    value.type === 'collection_view' ||
    value.type === 'collection_view_page'
  )
}

export function PageIconImpl({
  block,
  className,
  inline = true,
  hideDefaultIcon = false,
  defaultIcon,
  hasCover = false
}: {
  block: Block
  className?: string
  inline?: boolean
  hideDefaultIcon?: boolean
  defaultIcon?: string | null
  /** positions the hero (non-inline) icon over the page cover */
  hasCover?: boolean
}) {
  const { mapImageUrl, recordMap, darkMode } = useNotionContext()
  let isImage = false
  let content: any = null

  if (isIconBlock(block)) {
    const icon = getBlockIcon(block, recordMap)?.trim() || defaultIcon
    const title = getBlockTitle(block, recordMap)

    if (icon && isUrl(icon)) {
      const url = mapImageUrl(icon, block)
      isImage = true

      content = (
        <LazyImage
          src={url}
          alt={title || 'page icon'}
          className={cs(
            className,
            'notion-page-icon',
            !inline && pageIconHeroContentClassName.image
          )}
          fill={true}
          sizes={inline ? '24px' : '124px'}
        />
      )
    } else if (icon && icon.startsWith('/icons/')) {
      const url = `${notionImageProxyOrigin}${icon}?mode=${darkMode ? 'dark' : 'light'}`

      content = (
        <LazyImage
          src={url}
          alt={title || 'page icon'}
          className={cs(
            className,
            'notion-page-icon',
            !inline && pageIconHeroContentClassName.image
          )}
          fill={true}
          sizes={inline ? '24px' : '124px'}
        />
      )
    } else if (!icon) {
      if (!hideDefaultIcon) {
        isImage = true
        content = (
          <DefaultPageIcon
            className={cs(
              className,
              'notion-page-icon',
              !inline && pageIconHeroContentClassName.image
            )}
            alt={title || 'page icon'}
          />
        )
      }
    } else {
      isImage = false
      content = (
        <span
          className={cs(
            className,
            'notion-page-icon',
            !inline && pageIconHeroContentClassName.span
          )}
          role='img'
          aria-label={icon}
        >
          {icon}
        </span>
      )
    }
  }

  if (!content) {
    return null
  }

  return (
    <div
      className={
        inline
          ? cs(
              'notion-page-icon-inline',
              isImage ? 'notion-page-icon-image' : 'notion-page-icon-span'
            )
          : pageIconHeroClassName({ isImage, hasCover })
      }
    >
      {content}
    </div>
  )
}

export const PageIcon = React.memo(PageIconImpl)

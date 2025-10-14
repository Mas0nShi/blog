import { type Block } from 'notion-types'
import React from 'react'

import { GitHubEOI } from './eoi/github-eoi'

// External Object Instance
export function EOI({
  block,
  inline,
  className
}: {
  block: Block
  inline?: boolean
  className?: string
}) {
  const { domain } = block?.format || {}

  switch (domain) {
    case 'github.com':
      return <GitHubEOI block={block} inline={inline} className={className} />

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Unsupported external_object_instance domain "${domain}"`,
          JSON.stringify(block, null, 2)
        )
      }

      return null
  }
}

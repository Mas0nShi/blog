import React from 'react'

import { linkMentionClassNames } from '../rich-blocks'

export type LinkMentionData = {
  href: string
  title: string
  icon_url: string
  description: string
  link_provider: string
  thumbnail_url: string
}

export function LinkMention({ metadata }: { metadata: LinkMentionData }) {
  return (
    <span className={linkMentionClassNames.root}>
      <LinkMentionInline metadata={metadata} />
      <LinkMentionPreview metadata={metadata} />
    </span>
  )
}

function LinkMentionInline({ metadata }: { metadata: LinkMentionData }) {
  return (
    <a
      href={metadata.href}
      target='_blank'
      rel='noopener noreferrer'
      className={linkMentionClassNames.link}
    >
      <img
        className={linkMentionClassNames.icon}
        src={metadata.icon_url}
        alt={metadata.link_provider}
      />
      {metadata.link_provider && (
        <span className={linkMentionClassNames.provider}>
          {metadata.link_provider}
        </span>
      )}
      <span className={linkMentionClassNames.title}>{metadata.title}</span>
    </a>
  )
}

function LinkMentionPreview({ metadata }: { metadata: LinkMentionData }) {
  return (
    <div className={linkMentionClassNames.preview}>
      <article className={linkMentionClassNames.card}>
        <img
          className={linkMentionClassNames.thumbnail}
          src={metadata.thumbnail_url}
          alt={metadata.title}
          referrerPolicy='same-origin'
        />
        <div className={linkMentionClassNames.content}>
          <p className={linkMentionClassNames.previewTitle}>{metadata.title}</p>
          <p className={linkMentionClassNames.description}>
            {metadata.description}
          </p>
          <div className={linkMentionClassNames.footer}>
            <img
              className={linkMentionClassNames.previewIcon}
              src={metadata.icon_url}
              alt={metadata.link_provider}
              referrerPolicy='same-origin'
            />
            <span className={linkMentionClassNames.previewProvider}>
              {metadata.link_provider}
            </span>
          </div>
        </div>
      </article>
    </div>
  )
}

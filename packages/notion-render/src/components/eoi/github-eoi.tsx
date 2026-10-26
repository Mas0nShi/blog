import { type Block } from 'notion-types'
import React from 'react'

import { useNotionContext } from '../../context'
import SvgTypeGitHub from '../../icons/type-github'
import { externalClassNames } from '../../rich-blocks'
import { cs, formatNotionDateTime } from '../../utils'
import { MentionPreviewCard } from '../mention-preview-card'

export function GitHubEOI({
  block,
  inline,
  className
}: {
  block: Block
  inline?: boolean
  className?: string
}) {
  const { components } = useNotionContext()
  const { original_url, attributes } = block?.format || {}
  const [ownerAvatar, setOwnerAvatar] = React.useState<string | null>(null)

  if (!original_url || !attributes) {
    return null
  }

  const ownerValue = attributes?.find((attr: any) => attr.id === 'owner')
    ?.values[0]
  const owner = ownerValue ? new URL(ownerValue).pathname.slice(1) : undefined

  React.useEffect(() => {
    if (owner) {
      fetch(`https://api.github.com/users/${owner}`)
        .then((response) => response.json())
        .then((data: any) => {
          if (data.avatar_url) {
            setOwnerAvatar(data.avatar_url)
          }
        })
        .catch((err: any) => {
          setOwnerAvatar(null)
          console.error('Error fetching Github user data', err)
        })
    }
  }, [owner])

  const title = attributes.find((attr: any) => attr.id === 'title')?.values[0]
  const lastUpdatedAt = attributes.find((attr: any) => attr.id === 'updated_at')
    ?.values[0]
  const lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : null

  return (
    <components.Link
      target='_blank'
      rel='noopener noreferrer'
      href={original_url}
      className={cs(externalClassNames.link(!!inline), className)}
    >
      {inline ? (
        <>
          <div className={externalClassNames.mentionFlex}>
            <div className={externalClassNames.mentionWrap}>
              <SvgTypeGitHub className={externalClassNames.mentionImageLeft} />
              <span className={externalClassNames.mentionText}>{title}</span>
              {ownerAvatar && (
                <img
                  className={externalClassNames.mentionImageRight}
                  width={16}
                  height={16}
                  src={ownerAvatar}
                  alt={owner}
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <MentionPreviewCard
          owner={owner}
          lastUpdated={lastUpdated}
          title={title}
          externalImage={
            <>
              {ownerAvatar ? (
                <img
                  src={ownerAvatar}
                  alt={owner || ''}
                  width={30.192}
                  height={30.192}
                  className={externalClassNames.avatar}
                />
              ) : (
                <div className={externalClassNames.avatarPlaceholder} />
              )}
              <SvgTypeGitHub className={externalClassNames.githubIcon} />
            </>
          }
        />
      )}
    </components.Link>
  )
}

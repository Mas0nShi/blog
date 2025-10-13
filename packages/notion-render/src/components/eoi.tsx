import Image from 'next/image'
import { type Block } from 'notion-types'
import React from 'react'

import { useNotionContext } from '../context'
import SvgTypeGitHub from '../icons/type-github'
import { cs, formatNotionDateTime } from '../utils'
import { MentionPreviewCard } from './mention-preview-card'

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
  const { components } = useNotionContext()
  const { original_url, attributes, domain } = block?.format || {}
  const [ownerAvatar, setOwnerAvatar] = React.useState<string | null>(null)
  // `owner` is used in `useEffect` and may be redefined in the switch statement
  const ownerFromAttributes = attributes?.find((attr: any) => attr.id === 'owner')?.values[0]

  React.useEffect(() => {
    if (domain === 'github.com' && ownerFromAttributes) {
      fetch(`https://api.github.com/users/${ownerFromAttributes.split('/')[0]}`)
        .then((response) => response.json())
        .then((data: any) => {
          // console.log('Github user data', data)
          if (data.avatar_url) {
            setOwnerAvatar(data.avatar_url)
          }
        })
        .catch((err: any) => {
          setOwnerAvatar(null)
          console.error('Error fetching Github user data', err)
        })
    }
  }, [ownerFromAttributes, domain])

  if (!original_url || !attributes) {
    return null
  }

  const title = attributes.find((attr: any) => attr.id === 'title')?.values[0]
  let owner = ownerFromAttributes
  const lastUpdatedAt = attributes.find((attr: any) => attr.id === 'updated_at')
    ?.values[0]
  const lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : null
  let externalImage: React.ReactNode

  console.log('EOI', block.format, attributes, { title, owner, lastUpdatedAt, lastUpdated, domain })

  switch (domain) {
    case 'github.com':
      externalImage = ownerAvatar
        ? (
          <>
            <Image
              src={ownerAvatar}
              alt={owner}
              width={30.192}
              height={30.192}
              className='notion-external-block-avatar'
            />
            <SvgTypeGitHub className='notion-external-block-github-icon' />
          </>
          )
        : (<></>)
      if (owner) {
        const parts = owner.split('/')
        owner = parts.at(-1)
      }
      break

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.log(
          `Unsupported external_object_instance domain "${domain}"`,
          JSON.stringify(block, null, 2)
        )
      }

      return null
  }

  return (
    <components.Link
      target='_blank'
      rel='noopener noreferrer'
      href={original_url}
      className={cs(
        'notion-external',
        inline ? 'notion-external-mention' : 'notion-external-block', // notion-row
        className
      )}
    >
      {inline ? (
        <>
          <div className='notion-external-mention-flex'>
            <div className='notion-external-mention-wrap'>
              {domain === 'github.com' && (
                <SvgTypeGitHub className='notion-external-mention-image-left' />
              )}
              <span className='notion-external-mention-text'>{title}</span>
              {ownerAvatar && (
                <Image className='notion-external-mention-image-right' width={16} height={16} src={ownerAvatar} alt={owner} />
              )}
            </div>
          </div>
        </>
      ) : (
        <MentionPreviewCard
          owner={owner}
          lastUpdated={lastUpdated}
          title={title}
          externalImage={externalImage}
        />
      )}
    </components.Link>
  )
}

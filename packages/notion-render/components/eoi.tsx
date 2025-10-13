import React from 'react'
import { type Block } from '@/notion-types'

import { useNotionContext } from '../context'
import SvgTypeGitHub from '../icons/type-github'
import { cs, formatNotionDateTime } from '../utils'
import { MentionPreviewCard } from './mention-preview-card'
import Image from 'next/image'

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
  if (!original_url || !attributes) {
    return null
  }

  const title = attributes.find((attr: any) => attr.id === 'title')?.values[0]
  let owner = attributes.find((attr: any) => attr.id === 'owner')?.values[0]
  const lastUpdatedAt = attributes.find((attr: any) => attr.id === 'updated_at')
    ?.values[0]
  const lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : null
  let externalImage: React.ReactNode

  console.log('EOI', block.format, attributes, { title, owner, lastUpdatedAt, lastUpdated, domain })

  const [ownerAvatar, setOwnerAvatar] = React.useState<string>(null);

  switch (domain) {
    case 'github.com':
      React.useEffect(() => {
        if (domain === 'github.com' && owner) {
          fetch(`https://api.github.com/users/${owner}`)
            .then((response) => response.json())
            .then((data) => {
              // console.log('Github user data', data)  
              if (data.avatar_url) {
                setOwnerAvatar(data.avatar_url)
              }
            })
        }
      }, [owner])
      externalImage = ownerAvatar ? (
        <>
          <Image
            src={ownerAvatar}
            alt={owner}
            width={30.192}
            height={30.192}
            className='notion-external-block-avatar' />
          <SvgTypeGitHub className='notion-external-block-github-icon' />
        </>
      ) : (<></>)
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

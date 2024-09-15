import * as React from 'react'

import { Block } from '@/notion-types'

import { useNotionContext } from '../context'
import { SvgTypeGitHub } from '../icons/type-github'
import { cs, formatNotionDateTime } from '../utils'
import { MentionPreviewCard } from './mention-preview-card'
import Image from 'next/image'

// External Object Instance
export const EOI: React.FC<{
  block: Block
  inline?: boolean
  className?: string
}> = ({ block, inline, className }) => {
  const { components } = useNotionContext()
  const { original_url, attributes, domain } = block?.format || {}
  if (!original_url || !attributes) {
    return null
  }

  const title = attributes.find((attr) => attr.id === 'title')?.values[0]
  let owner = attributes.find((attr) => attr.id === 'owner')?.values[0]
  const lastUpdatedAt = attributes.find((attr) => attr.id === 'updated_at')
    ?.values[0]
  const lastUpdated = lastUpdatedAt ? formatNotionDateTime(lastUpdatedAt) : null
  let externalImage: React.ReactNode

  console.log('EOI', block.format, attributes, { title, owner, lastUpdatedAt, lastUpdated, domain })

  switch (domain) {
    case 'github.com':
      const [ownerAvatar, setOwnerAvatar] = React.useState<string>(null);

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
          width={32}
          height={32}
          className='notion-external-avatar' />
        <SvgTypeGitHub className='notion-external-github-icon'/>
      </>
      ) : (<></>)
      if (owner) {
        const parts = owner.split('/')
        owner = parts[parts.length - 1]
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
        inline ? 'notion-external-mention' : 'notion-external-block notion-row',
        className
      )}
    >
      {externalImage && (
        <div className='notion-external-image'>{externalImage}</div>
      )}

      <div className='notion-external-description'>
        {/* <div className='notion-external-title'>{title}</div> */}

        {(owner || lastUpdated) && (
          <>
          <MentionPreviewCard
            title={title}
            owner={owner}
            lastUpdated={lastUpdated}
            domain={domain}
            externalImage={externalImage}
          />
          {/* {domain === 'github.com' && (
            <div className='notion-preview-card-github-shields'>
              <img
                src={`https://img.shields.io/github/stars/${owner}/${title}?logo=github`}
                alt=''
              />
              <img
                src={`https://img.shields.io/github/last-commit/${owner}/${title}`}
                alt=''
              />
            </div>
          )} */}
          </>
        )}



      </div>
    </components.Link>
  )
}

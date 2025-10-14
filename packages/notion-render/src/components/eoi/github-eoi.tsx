import { type Block } from 'notion-types'
import Image from 'next/image'
import React from 'react'

import { useNotionContext } from '../../context'
import SvgTypeGitHub from '../../icons/type-github'
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

    const ownerValue = attributes?.find((attr: any) => attr.id === 'owner')?.values[0]
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
            className={cs(
                'notion-external',
                inline ? 'notion-external-mention' : 'notion-external-block', // notion-row
                className
            )}
        >
            {inline
                ? (
                    <>
                        <div className='notion-external-mention-flex'>
                            <div className='notion-external-mention-wrap'>
                                <SvgTypeGitHub className='notion-external-mention-image-left' />
                                <span className='notion-external-mention-text'>{title}</span>
                                {ownerAvatar && (
                                    <Image className='notion-external-mention-image-right' width={16} height={16} src={ownerAvatar} alt={owner} />
                                )}
                            </div>
                        </div>
                    </>
                )
                : (
                    <MentionPreviewCard
                        owner={owner}
                        lastUpdated={lastUpdated}
                        title={title}
                        externalImage={
                            <>
                                {ownerAvatar ? (
                                    <Image
                                        src={ownerAvatar}
                                        alt={owner || ''}
                                        width={30.192}
                                        height={30.192}
                                        className='notion-external-block-avatar'
                                    />
                                ) : (
                                    <div className='notion-external-block-avatar-placeholder' />
                                )}
                                <SvgTypeGitHub className='notion-external-block-github-icon' />
                            </>
                        }
                    />
                )
            }
        </components.Link>
    )
}

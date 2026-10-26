import type React from 'react'

import { externalClassNames } from '../rich-blocks'

export function MentionPreviewCard({
  title,
  owner,
  lastUpdated,
  externalImage
}: {
  title: string
  owner: string | undefined
  lastUpdated: string | null
  externalImage?: React.ReactNode
}) {
  return (
    <>
      {externalImage && (
        <div className={externalClassNames.blockImage}>
          <div>
            <div className='tw:size-full'>{externalImage}</div>
          </div>
        </div>
      )}

      <div className={externalClassNames.description}>
        {(owner || lastUpdated) && (
          <>
            <div className={externalClassNames.titleWrap}>
              <div className={externalClassNames.title}>{title}</div>
            </div>
            <div className={externalClassNames.itemWrap}>
              {owner && <div className={externalClassNames.item}>{owner}</div>}
              <div className='tw:mx-[3px]'>•</div>
              {lastUpdated && (
                <div className={externalClassNames.item}>
                  Updated in {lastUpdated}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

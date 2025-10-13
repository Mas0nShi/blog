import type React from 'react'



export function MentionPreviewCard({
  owner,
  lastUpdated,
  externalImage,
  title
}: {
  owner?: string
  lastUpdated?: string | null
  title: string
  externalImage?: React.ReactNode
}) {
  return (
    <>
      {externalImage && (
        <div className='notion-external-block-image'>
          <div>
            <div style={{ width: '100%', height: '100%' }}>
              {externalImage}
            </div>
          </div>
        </div>
      )}

      <div className='notion-external-block-description'>
        {(owner || lastUpdated) && (
          <>
            <div className='notion-external-block-title-wrap'>
              <div className='notion-external-block-title'>
                {title}
              </div>
            </div>
            <div className='notion-external-block-item-wrap'>
              {owner && (
                <div className='notion-external-block-item'>{owner}</div>
              )}
              <div style={{ marginLeft: '3px', marginRight: '3px' }}>•</div>
              {lastUpdated && (
                <div className='notion-external-block-item'>Updated in {lastUpdated}</div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}

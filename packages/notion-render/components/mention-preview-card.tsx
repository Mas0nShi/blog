import React from 'react'

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const MentionPreviewCard: React.FC<{
  owner?: string
  lastUpdated?: string
  title: string
  domain: string
  externalImage?: React.ReactNode
}> = ({ owner, lastUpdated, externalImage, title, domain }) => {
  return (
    <div className='notion-external-subtitle'>
      {externalImage && (
        <div className='notion-preview-card-domain-warp'>
          {/* <div className='notion-preview-card-logo'><SvgTypeGitHub/></div> */}
          {/* <div className='notion-preview-card-domain'>
            {capitalizeFirstLetter(domain.split('.')[0])}
          </div> */}
        </div>
      )}
      <div className='notion-preview-card-title'>{title}</div>
      <div className='notion-external-subtitle-item'>
        {owner && (<div className='notion-external-subtitle-item-name'>{owner}</div>)}
        <div style={{marginLeft: '3px', marginRight: '3px'}}>•</div>
        {lastUpdated && (<div className='notion-external-subtitle-item-desc'>Updated in {lastUpdated}</div>)}
      </div>
    </div>
  )
}

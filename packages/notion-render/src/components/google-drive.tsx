import { type GoogleDriveBlock } from 'notion-types'

import { useNotionContext } from '../context'
import { googleDriveClassNames } from '../media'
import { cs } from '../utils'
import { GracefulImage } from './graceful-image'

export function GoogleDrive({
  block,
  className
}: {
  block: GoogleDriveBlock
  className?: string
}) {
  const { components, mapImageUrl } = useNotionContext()
  const properties = block.format?.drive_properties
  if (!properties) return null
  let domain

  try {
    const url = new URL(properties.url)
    domain = url.hostname
  } catch {
    // ignore invalid urls for robustness
  }

  return (
    <div className={cs(googleDriveClassNames.root, className)}>
      <components.Link
        className={googleDriveClassNames.link}
        href={properties.url}
        target='_blank'
        rel='noopener noreferrer'
      >
        <div className={googleDriveClassNames.preview}>
          <GracefulImage
            src={mapImageUrl(properties.thumbnail, block)!}
            alt={properties.title || 'Google Drive Document'}
            loading='lazy'
          />
        </div>

        <div className={googleDriveClassNames.body}>
          {properties.title && (
            <div className={googleDriveClassNames.title}>
              {properties.title}
            </div>
          )}

          {/* TODO: re-add last modified time with alternative to timeago.js */}
          {/* {properties.modified_time && (
            <div className='notion-google-drive-body-modified-time'>
              Last modified{' '}
              {properties.user_name ? `by ${properties.user_name} ` : ''}
              {timeago(properties.modified_time)}
            </div>
          )} */}

          {properties.icon && domain && (
            <div className={googleDriveClassNames.source}>
              {properties.icon && (
                <div
                  className={googleDriveClassNames.sourceIcon}
                  style={{
                    backgroundImage: `url(${properties.icon})`
                  }}
                />
              )}

              {domain && (
                <div className={googleDriveClassNames.sourceDomain}>
                  {domain}
                </div>
              )}
            </div>
          )}
        </div>
      </components.Link>
    </div>
  )
}

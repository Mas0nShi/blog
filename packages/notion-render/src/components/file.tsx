import { type FileBlock } from 'notion-types'
import { getSignedFileUrl } from 'notion-utils'

import { useNotionContext } from '../context'
import { FileIcon } from '../icons/file-icon'
import { fileClassNames } from '../media'
import { cs } from '../utils'
import { Text } from './text'

export function File({
  block,
  className
}: {
  block: FileBlock
  className?: string
}) {
  const { components, recordMap } = useNotionContext()

  const source = getSignedFileUrl(
    block.properties?.source?.[0]?.[0],
    block,
    recordMap.signed_urls
  )

  if (!source) {
    return null
  }

  return (
    <div className={cs(fileClassNames.root, className)}>
      <components.Link
        className={fileClassNames.link}
        href={source}
        target='_blank'
        rel='noopener noreferrer'
      >
        <FileIcon className={fileClassNames.icon} />

        <div className={fileClassNames.info}>
          <div className={fileClassNames.title}>
            <Text value={block.properties?.title || [['File']]} block={block} />
          </div>

          {block.properties?.size && (
            <div className={fileClassNames.size}>
              <Text value={block.properties.size} block={block} />
            </div>
          )}
        </div>
      </components.Link>
    </div>
  )
}

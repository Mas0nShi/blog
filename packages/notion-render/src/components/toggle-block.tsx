import { type ToggleBlock as ToggleBlockType } from 'notion-types'
import React from 'react'

import { toggleClassNames } from '../text-blocks'
import { cs } from '../utils'
import { Text } from './text'

export function ToggleBlock({
  blockId,
  block,
  children
}: {
  blockId: string
  block: ToggleBlockType
  children?: React.ReactNode
}) {
  const [isOpen, setOpen] = React.useState(false)

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation()
    setOpen((prev) => !prev)
  }

  return (
    <div className={cs(toggleClassNames.block, blockId)}>
      <div className={toggleClassNames.toggle}>
        <div className={toggleClassNames.buttonWrap} onClick={handleClick}>
          <div className={toggleClassNames.button}>
            <svg
              viewBox='0 0 100 100'
              className={cs(
                toggleClassNames.arrow,
                isOpen
                  ? 'tw:[transform:rotateZ(180deg)]'
                  : 'tw:[transform:rotateZ(90deg)]'
              )}
            >
              <polygon points='5.9,88.2 50,11.8 94.1,88.2' />
            </svg>
          </div>
        </div>
        <div className={toggleClassNames.body}>
          <div className='tw:flex'>
            <div className={toggleClassNames.title}>
              <Text value={block?.properties?.title} block={block} />
            </div>
          </div>
          {isOpen && <div className={toggleClassNames.content}>{children}</div>}
        </div>
      </div>
    </div>
  )
}

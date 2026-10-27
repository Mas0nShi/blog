import React from 'react'

import type { TocItem } from './hooks'
import { compactClassNames } from './styles'

interface TocCompactViewProps {
  isHovered: boolean
  tocItems: TocItem[]
  activeId: string
  minLevel: number
  onItemClick: (id: string) => void
}

/**
 * 紧凑线条视图
 */
export function TocCompactView({
  isHovered,
  tocItems,
  activeId,
  minLevel,
  onItemClick
}: TocCompactViewProps) {
  return (
    <div className={compactClassNames.placeholder}>
      <div className={compactClassNames.view(isHovered)}>
        {tocItems.map((item) => {
          const normalizedLevel = item.level - minLevel
          const isActive = activeId === item.id
          const lineWidth = Math.max(12, 28 - normalizedLevel * 6)

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              tabIndex={-1}
              aria-hidden='true'
              className={compactClassNames.line(isActive)}
              style={{ width: `${lineWidth}px` }}
              onClick={(event) => {
                event.preventDefault()
                onItemClick(item.id)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

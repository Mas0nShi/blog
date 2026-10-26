import React from 'react'

import type { TocItem } from './hooks'
import { panelClassNames } from './styles'

interface TocExpandedPanelProps {
  isHovered: boolean
  tocItems: TocItem[]
  activeId: string
  minLevel: number
  onItemClick: (id: string) => void
}

/**
 * 展开的目录面板
 */
export function TocExpandedPanel({
  isHovered,
  tocItems,
  activeId,
  minLevel,
  onItemClick
}: TocExpandedPanelProps) {
  return (
    <div className={panelClassNames.container}>
      <div className={panelClassNames.interactiveArea}>
        <div className={panelClassNames.slide}>
          <div className={panelClassNames.dialog}>
            <div className={panelClassNames.animation(isHovered)}>
              <div className={panelClassNames.panel}>
                <div className={panelClassNames.inner}>
                  {tocItems.map((item) => {
                    const normalizedLevel = item.level - minLevel
                    const isActive = activeId === item.id
                    const indent = normalizedLevel * 12

                    return (
                      <div
                        key={item.id}
                        className={panelClassNames.item(isActive)}
                        onClick={() => onItemClick(item.id)}
                      >
                        <div
                          className={panelClassNames.itemContent}
                          style={{ marginInlineStart: `${indent}px` }}
                        >
                          <div className={panelClassNames.itemText}>
                            <span className={panelClassNames.itemTextSpan}>
                              {item.text}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

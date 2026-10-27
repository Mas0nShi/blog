import React, { useEffect, useRef } from 'react'

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
  const panelRef = useRef<HTMLDivElement>(null)

  // 展开时让当前章节出现在面板里（长目录会超出面板高度）
  useEffect(() => {
    const panel = panelRef.current
    if (!isHovered || !panel) return
    const active = panel.querySelector<HTMLElement>('[aria-current]')
    if (!active) return
    const top = active.offsetTop
    const bottom = top + active.offsetHeight
    if (
      top < panel.scrollTop ||
      bottom > panel.scrollTop + panel.clientHeight
    ) {
      panel.scrollTop = top - panel.clientHeight / 2 + active.offsetHeight / 2
    }
  }, [isHovered, activeId])

  return (
    <div className={panelClassNames.container}>
      <div className={panelClassNames.interactiveArea}>
        <div className={panelClassNames.slide}>
          <div className={panelClassNames.dialog}>
            <div className={panelClassNames.animation(isHovered)}>
              <div ref={panelRef} className={panelClassNames.panel}>
                <div className={panelClassNames.inner}>
                  {tocItems.map((item) => {
                    const normalizedLevel = item.level - minLevel
                    const isActive = activeId === item.id
                    const indent = normalizedLevel * 12

                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        aria-current={isActive ? 'location' : undefined}
                        className={panelClassNames.item(isActive)}
                        onClick={(event) => {
                          event.preventDefault()
                          onItemClick(item.id)
                        }}
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
                      </a>
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

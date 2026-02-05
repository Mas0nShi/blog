import React, { useCallback, useRef } from 'react'

import {
  useActiveHeading,
  useContainerVisibility,
  useDelayedBoolean,
  useSidebarPosition,
  useTocItems
} from './hooks'
import { TocCompactView } from './TocCompactView'
import { TocExpandedPanel } from './TocExpandedPanel'
import styles from './FloatingTableOfContents.module.css'

// 常量配置
const SCROLL_OFFSET = 80
const HOVER_CLOSE_DELAY = 20

interface FloatingTableOfContentsProps {
  containerSelector?: string
  rootMargin?: string
}

export function FloatingTableOfContents({
  containerSelector = '.notion-page-content',
  rootMargin = '-80px 0px -40% 0px'
}: FloatingTableOfContentsProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  // 解析 TOC 项目
  const { tocItems, minLevel } = useTocItems({ containerSelector })

  // 追踪活动标题
  const activeId = useActiveHeading({ tocItems, rootMargin })

  // 容器可见性（分离渲染和显示状态，支持淡出动画）
  const { shouldRender, isVisible } = useContainerVisibility({ containerSelector })

  // 边栏位置
  const { top: sidebarTop, isReady: isPositionReady } = useSidebarPosition({
    containerSelector,
    sidebarRef,
    isVisible: shouldRender,
    hasTocItems: tocItems.length > 0
  })

  // hover 状态（带延迟关闭）
  const {
    value: isHovered,
    setTrue: handleMouseEnter,
    setFalse: handleMouseLeave
  } = useDelayedBoolean(HOVER_CLOSE_DELAY)

  // 点击跳转
  const handleItemClick = useCallback(
    (id: string) => {
      const item = tocItems.find((item) => item.id === id)
      if (item?.headerElement) {
        const elementPosition = item.headerElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.pageYOffset - SCROLL_OFFSET

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    },
    [tocItems]
  )

  // 早期返回：无内容或不需要渲染
  if (tocItems.length === 0 || !shouldRender) {
    return null
  }

  // 只有位置就绪且可见时才显示
  const isReady = isPositionReady && sidebarTop !== null && isVisible

  return (
    <div
      ref={sidebarRef}
      className={`${styles.floatingToc} ${isReady ? styles.visible : ''}`}
      style={{ top: sidebarTop !== null ? `${sidebarTop}px` : undefined }}
    >
      <div
        className={`${styles.hoverWrapper} ${isHovered ? styles.hovered : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <TocCompactView
          tocItems={tocItems}
          activeId={activeId}
          minLevel={minLevel}
          onItemClick={handleItemClick}
        />
        <TocExpandedPanel
          tocItems={tocItems}
          activeId={activeId}
          minLevel={minLevel}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  )
}

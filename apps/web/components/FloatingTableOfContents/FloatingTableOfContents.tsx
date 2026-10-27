import React, { useCallback, useEffect, useRef, useState } from 'react'

import { floatingTocClassName, hoverWrapperClassName } from './styles'
import {
  useActiveHeading,
  useContainerVisibility,
  useDelayedBoolean,
  useSidebarPosition,
  useTocItems
} from './hooks'
import { TocCompactView } from './TocCompactView'
import { TocExpandedPanel } from './TocExpandedPanel'

// 常量配置
const SCROLL_OFFSET = 80
const HOVER_CLOSE_DELAY = 20

interface FloatingTableOfContentsProps {
  containerSelector?: string
}

// 没有悬停能力的设备（触屏）：点一下短线先展开面板
const canHover = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

export function FloatingTableOfContents({
  containerSelector = '.notion-page-content'
}: FloatingTableOfContentsProps) {
  const sidebarRef = useRef<HTMLDivElement>(null)

  // 解析 TOC 项目
  const { tocItems, minLevel } = useTocItems({ containerSelector })

  // 追踪活动标题
  const activeId = useActiveHeading({ tocItems, offset: SCROLL_OFFSET + 20 })

  // 容器可见性（分离渲染和显示状态，支持淡出动画）
  const { shouldRender, isVisible } = useContainerVisibility({
    containerSelector
  })

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

  // 键盘焦点在目录内、或触屏点开时，面板保持展开
  const [hasFocus, setHasFocus] = useState(false)
  const [isTapOpen, setIsTapOpen] = useState(false)
  const wrapperRef = useRef<HTMLElement>(null)
  const isOpen = isHovered || hasFocus || isTapOpen

  // 触屏展开后，点目录以外的地方收起
  useEffect(() => {
    if (!isTapOpen) return
    const close = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsTapOpen(false)
      }
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [isTapOpen])

  // 点击跳转：滚到标题（留出顶栏），并把地址更新为 #章节，便于分享
  const handleItemClick = useCallback(
    (id: string) => {
      const item = tocItems.find((item) => item.id === id)
      if (item?.headerElement) {
        const elementPosition = item.headerElement.getBoundingClientRect().top
        const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET
        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches

        window.scrollTo({
          top: offsetPosition,
          behavior: reduceMotion ? 'auto' : 'smooth'
        })
        window.history.replaceState(window.history.state, '', `#${id}`)
      }
      setIsTapOpen(false)
    },
    [tocItems]
  )

  // 短线：能悬停的设备直接跳转；触屏先展开面板
  const handleLineClick = useCallback(
    (id: string) => {
      if (canHover() || isTapOpen) {
        handleItemClick(id)
      } else {
        setIsTapOpen(true)
      }
    },
    [handleItemClick, isTapOpen]
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
      className={floatingTocClassName(isReady)}
      style={{ top: sidebarTop !== null ? `${sidebarTop}px` : undefined }}
    >
      <nav
        ref={wrapperRef}
        aria-label='目录'
        className={hoverWrapperClassName}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setHasFocus(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setHasFocus(false)
          }
        }}
      >
        <TocCompactView
          isHovered={isOpen}
          tocItems={tocItems}
          activeId={activeId}
          minLevel={minLevel}
          onItemClick={handleLineClick}
        />
        <TocExpandedPanel
          isHovered={isOpen}
          tocItems={tocItems}
          activeId={activeId}
          minLevel={minLevel}
          onItemClick={handleItemClick}
        />
      </nav>
    </div>
  )
}

import cs from 'classnames'
import React, { useEffect, useState } from 'react'

import type { TocItem } from './hooks'
import { sidebarClassNames } from './styles'

interface TocSidebarProps {
  containerSelector: string
  tocItems: TocItem[]
  activeId: string
  minLevel: number
  onItemClick: (id: string) => void
}

/**
 * 宽屏目录栏：正文右侧常驻，随滚动停在顶栏下方，不会压到封面上
 */
export function TocSidebar({
  containerSelector,
  tocItems,
  activeId,
  minLevel,
  onItemClick
}: TocSidebarProps) {
  const top = useStickyTop(containerSelector)

  return (
    <nav
      aria-label='目录'
      className={sidebarClassNames.root}
      style={{ top: top ?? undefined, opacity: top === null ? 0 : 1 }}
    >
      <div className={sidebarClassNames.title}>目录</div>
      <ol className={sidebarClassNames.list}>
        {tocItems.map((item) => {
          const isActive = activeId === item.id

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cs(sidebarClassNames.item(isActive))}
                style={{
                  paddingInlineStart: 12 + (item.level - minLevel) * 12
                }}
                onClick={(event) => {
                  event.preventDefault()
                  onItemClick(item.id)
                }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// below the sticky header, but never above the start of the article
function useStickyTop(containerSelector: string) {
  const [top, setTop] = useState<number | null>(null)

  useEffect(() => {
    const update = () => {
      const container = document.querySelector(containerSelector)
      if (!container) return
      const header = document.querySelector('header.notion-header')
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0
      const contentTop = container.getBoundingClientRect().top
      setTop(Math.max(headerBottom + 32, contentTop))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [containerSelector])

  return top
}

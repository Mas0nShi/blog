import { useEffect, useState } from 'react'

import type { TocItem } from './useTocItems'

interface UseActiveHeadingOptions {
  tocItems: TocItem[]
  /** 标题滚过这条线（距视口顶部的像素）即视为进入该章节 */
  offset?: number
}

/**
 * 追踪当前正在阅读的章节：已经滚过顶部偏移线的最后一个标题。
 *
 * 不用 IntersectionObserver：它只在标题进入某个区域时触发，屏幕下方出现
 * 的标题会被提前点亮，向上滚动时也不会切回上一节。
 */
export function useActiveHeading({
  tocItems,
  offset = 100
}: UseActiveHeadingOptions) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (tocItems.length === 0) return

    let frame = 0

    const update = () => {
      frame = 0
      // 折叠块里隐藏的标题没有布局，跳过
      const shown = tocItems.filter(
        (item) => item.headerElement.getClientRects().length > 0
      )

      let id = ''
      for (const item of shown) {
        if (item.headerElement.getBoundingClientRect().top - offset <= 0) {
          id = item.id
        } else {
          break
        }
      }

      // 滚到底部时，最后几节的标题可能永远到不了顶部：取视口内最后一个
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2
      if (atBottom) {
        for (const item of shown) {
          if (
            item.headerElement.getBoundingClientRect().top < window.innerHeight
          ) {
            id = item.id
          }
        }
      }

      setActiveId(id)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [tocItems, offset])

  return activeId
}

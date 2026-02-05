import { useEffect, useState } from 'react'

import type { TocItem } from './useTocItems'

interface UseActiveHeadingOptions {
  tocItems: TocItem[]
  rootMargin?: string
}

/**
 * 追踪当前可见的活动标题
 */
export function useActiveHeading({
  tocItems,
  rootMargin = '-80px 0px -40% 0px'
}: UseActiveHeadingOptions) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (tocItems.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id || entry.target.id
            if (id) {
              setActiveId(id)
            }
          }
        }
      },
      {
        rootMargin,
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    )

    for (const item of tocItems) {
      observer.observe(item.headerElement)
    }

    return () => observer.disconnect()
  }, [tocItems, rootMargin])

  return activeId
}

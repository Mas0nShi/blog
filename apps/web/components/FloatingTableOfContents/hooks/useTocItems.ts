import { useEffect, useMemo, useState } from 'react'

export interface TocItem {
  id: string
  text: string
  level: number
  element: HTMLElement
  headerElement: HTMLElement
}

interface UseTocItemsOptions {
  containerSelector: string
  parseDelay?: number
}

/**
 * 解析页面标题，生成 TOC 项目列表
 */
export function useTocItems({ containerSelector, parseDelay = 500 }: UseTocItemsOptions) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector(containerSelector)
      if (!container) return

      const headings = container.querySelectorAll('.notion-h')
      const items: TocItem[] = []

      let index = 0
      for (const heading of headings) {
        const element = heading as HTMLElement
        let id = element.dataset.id || element.id

        if (!id) {
          id = `heading-${index}`
          element.dataset.id = id
        }

        let level = 1
        if (element.classList.contains('notion-h1')) {
          level = 1
        } else if (element.classList.contains('notion-h2')) {
          level = 2
        } else if (element.classList.contains('notion-h3')) {
          level = 3
        }

        const text = element.textContent?.replace('​', '').trim() || ''

        const headerElement = (element.closest('h1, h2, h3, h4, h5, h6') || element) as HTMLElement
        if (!headerElement.dataset.id) {
          headerElement.dataset.id = id
        }

        if (text) {
          items.push({ id, text, level, element, headerElement })
        }
        index++
      }

      setTocItems(items)
    }, parseDelay)

    return () => clearTimeout(timer)
  }, [containerSelector, parseDelay])

  const minLevel = useMemo(
    () => (tocItems.length > 0 ? Math.min(...tocItems.map((item) => item.level)) : 1),
    [tocItems]
  )

  return { tocItems, minLevel }
}

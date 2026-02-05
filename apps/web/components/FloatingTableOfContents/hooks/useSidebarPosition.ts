import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react'

interface UseSidebarPositionOptions {
  containerSelector: string
  sidebarRef: RefObject<HTMLDivElement | null>
  isVisible: boolean
  hasTocItems: boolean
}

interface SidebarPosition {
  top: number | null
  isReady: boolean
}

/**
 * 计算并追踪 sidebar 位置
 */
export function useSidebarPosition({
  containerSelector,
  sidebarRef,
  isVisible,
  hasTocItems
}: UseSidebarPositionOptions): SidebarPosition {
  const [top, setTop] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)

  const updatePosition = useCallback((): boolean => {
    const container = document.querySelector(containerSelector)
    if (!container || !sidebarRef.current) return false

    const containerRect = container.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const header = document.querySelector('header.notion-header') as HTMLElement | null
    const headerHeight = header?.getBoundingClientRect().height ?? 0

    const containerTop = Math.max(0, containerRect.top)
    const containerBottom = Math.min(viewportHeight, containerRect.bottom)
    const visibleHeight = containerBottom - containerTop

    if (visibleHeight <= 0) return false

    const sidebarHeight = sidebarRef.current.getBoundingClientRect().height
    const centerPosition = containerTop + visibleHeight / 2 - sidebarHeight / 2
    const safeTop = Math.max(10, headerHeight + 10)
    const finalTop = Math.max(safeTop, centerPosition)

    setTop(finalTop)
    return true
  }, [containerSelector, sidebarRef])

  // 滚动和窗口大小变化时更新位置
  useEffect(() => {
    if (!isVisible) return

    const handleUpdate = () => updatePosition()

    window.addEventListener('scroll', handleUpdate, { passive: true })
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate)
      window.removeEventListener('resize', handleUpdate)
    }
  }, [isVisible, updatePosition])

  // 首次显示时计算位置（在绘制前执行）
  useLayoutEffect(() => {
    if (!isVisible || !hasTocItems) {
      setIsReady(false)
      return
    }

    const rafId = requestAnimationFrame(() => {
      const success = updatePosition()
      if (success) {
        setIsReady(true)
      }
    })

    return () => cancelAnimationFrame(rafId)
  }, [isVisible, hasTocItems, updatePosition])

  return { top, isReady }
}

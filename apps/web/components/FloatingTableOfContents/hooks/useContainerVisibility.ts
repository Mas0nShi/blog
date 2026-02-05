import { useCallback, useEffect, useRef, useState } from 'react'

interface UseContainerVisibilityOptions {
  containerSelector: string
  fadeOutDuration?: number
}

interface ContainerVisibilityState {
  /** 是否应该渲染组件（延迟卸载） */
  shouldRender: boolean
  /** 是否应该显示可见样式（控制淡入淡出） */
  isVisible: boolean
}

/**
 * 监听容器可见性，控制 TOC 显示/隐藏
 * 返回两个状态：shouldRender（是否渲染）和 isVisible（是否可见）
 * 隐藏时先触发淡出动画，再延迟卸载组件
 */
export function useContainerVisibility({
  containerSelector,
  fadeOutDuration = 200
}: UseContainerVisibilityOptions): ContainerVisibilityState {
  const [shouldRender, setShouldRender] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const unmountTimeoutRef = useRef<number | null>(null)

  const clearUnmountTimeout = useCallback(() => {
    if (unmountTimeoutRef.current !== null) {
      window.clearTimeout(unmountTimeoutRef.current)
      unmountTimeoutRef.current = null
    }
  }, [])

  const show = useCallback(() => {
    clearUnmountTimeout()
    setShouldRender(true)
    // 下一帧设置可见，确保 DOM 已挂载
    requestAnimationFrame(() => {
      setIsVisible(true)
    })
  }, [clearUnmountTimeout])

  const hide = useCallback(() => {
    // 先触发淡出动画
    setIsVisible(false)
    clearUnmountTimeout()
    // 等动画完成后再卸载
    unmountTimeoutRef.current = window.setTimeout(() => {
      setShouldRender(false)
    }, fadeOutDuration)
  }, [clearUnmountTimeout, fadeOutDuration])

  useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show()
          } else {
            hide()
          }
        }
      },
      { threshold: 0, rootMargin: '0px' }
    )

    observer.observe(container)

    // 初始检查
    const rect = container.getBoundingClientRect()
    const isCurrentlyVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (isCurrentlyVisible) {
      show()
    }

    return () => {
      observer.disconnect()
      clearUnmountTimeout()
    }
  }, [containerSelector, show, hide, clearUnmountTimeout])

  return { shouldRender, isVisible }
}

import React, { useEffect, useState, useRef, useCallback } from 'react'
import styles from './FloatingTableOfContents.module.css'

interface TocItem {
  id: string
  text: string
  level: number
  element: HTMLElement
  headerElement: HTMLElement
}

interface FloatingTableOfContentsProps {
  containerSelector?: string
  rootMargin?: string
}

export function FloatingTableOfContents({
  containerSelector = '.notion-page-content',
  rootMargin = '-80px 0px -40% 0px'
}: FloatingTableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isVisible, setIsVisible] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [sidebarTop, setSidebarTop] = useState(220)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const containerObserverRef = useRef<IntersectionObserver | undefined>(undefined)

  // 解析页面标题
  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector(containerSelector)
      if (!container) return

      const headings = container.querySelectorAll('.notion-h')
      const items: TocItem[] = []

      headings.forEach((heading, index) => {
        const element = heading as HTMLElement
        let id = element.getAttribute('data-id') || element.id

        if (!id) {
          id = `heading-${index}`
          element.setAttribute('data-id', id)
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
        if (!headerElement.getAttribute('data-id')) {
          headerElement.setAttribute('data-id', id)
        }

        if (text) {
          items.push({ id, text, level, element, headerElement })
        }
      })

      setTocItems(items)
      
      if (items.length > 0) {
        setIsVisible(true)
        // 延迟触发渲染动画
        requestAnimationFrame(() => {
          setIsRendered(true)
        })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [containerSelector])

  // 监听滚动，更新当前活动的标题
  useEffect(() => {
    if (tocItems.length === 0) return

    const observerOptions = {
      rootMargin,
      threshold: [0, 0.25, 0.5, 0.75, 1]
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).getAttribute('data-id') || entry.target.id
          if (id) {
            setActiveId(id)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    tocItems.forEach((item) => {
      observer.observe(item.headerElement)
    })

    return () => {
      observer.disconnect()
    }
  }, [tocItems, rootMargin])

  // 监听容器可见性
  useEffect(() => {
    const container = document.querySelector(containerSelector)
    if (!container) return

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          requestAnimationFrame(() => {
            setIsRendered(true)
          })
        } else {
          setIsRendered(false)
          setTimeout(() => {
            setIsVisible(false)
          }, 200) // 等待动画完成
        }
      })
    }

    containerObserverRef.current = new IntersectionObserver(observerCallback, {
      threshold: 0,
      rootMargin: '0px'
    })

    containerObserverRef.current.observe(container)

    const rect = container.getBoundingClientRect()
    const isCurrentlyVisible = rect.top < window.innerHeight && rect.bottom > 0
    if (isCurrentlyVisible) {
      setIsVisible(true)
      requestAnimationFrame(() => {
        setIsRendered(true)
      })
    }

    return () => {
      containerObserverRef.current?.disconnect()
    }
  }, [containerSelector])

  // 计算边栏位置
  const updateSidebarPosition = useCallback(() => {
    const container = document.querySelector(containerSelector)
    if (!container || !sidebarRef.current) return

    const containerRect = container.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    
    const containerTop = Math.max(0, containerRect.top)
    const containerBottom = Math.min(viewportHeight, containerRect.bottom)
    const visibleHeight = containerBottom - containerTop

    if (visibleHeight <= 0) return

    // 使用固定高度362px来计算位置
    const sidebarHeight = 362

    const centerPosition = containerTop + visibleHeight / 2 - sidebarHeight / 2
    const finalTop = Math.max(10, centerPosition)

    setSidebarTop(finalTop)
  }, [containerSelector])

  // 监听滚动和窗口大小变化
  useEffect(() => {
    updateSidebarPosition()

    const handleScroll = () => {
      updateSidebarPosition()
    }

    const handleResize = () => {
      updateSidebarPosition()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [updateSidebarPosition])

  // 处理点击，平滑滚动
  const handleItemClick = (id: string) => {
    const item = tocItems.find((item) => item.id === id)
    if (item?.headerElement) {
      const elementPosition = item.headerElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - 80

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  // 计算最小层级，用于标准化缩进
  const minLevel = tocItems.length > 0 ? Math.min(...tocItems.map((item) => item.level)) : 1

  if (tocItems.length === 0 || !isVisible) {
    return null
  }

  return (
    <div
      ref={sidebarRef}
      className={`${styles.floatingToc} ${isRendered ? styles.visible : ''}`}
      style={{ top: `${sidebarTop}px` }}
    >
      {/* hover触发器包装 - 统一控制整个组件的hover状态 */}
      <div className={styles.hoverWrapper}>
        {/* 占位区域 - 显示紧凑视图线条 */}
        <div className={styles.placeholderArea}>
          <div className={styles.compactView}>
            {tocItems.map((item) => {
              const normalizedLevel = item.level - minLevel
              const isActive = activeId === item.id
              const lineWidth = Math.max(12, 28 - normalizedLevel * 6)
              return (
                <div
                  key={item.id}
                  className={`${styles.compactLine} ${isActive ? styles.active : ''}`}
                  style={{
                    width: `${lineWidth}px`
                  }}
                  onClick={() => handleItemClick(item.id)}
                />
              )
            })}
          </div>
        </div>

        {/* 内容容器 - 绝对定位在占位区域之上 */}
        <div className={styles.contentContainer}>
          {/* 交互区域 */}
          <div className={styles.interactiveArea}>
            {/* 滑动容器 */}
            <div className={styles.slideContainer}>
              {/* Dialog容器 */}
              <div className={styles.dialogContainer}>
                {/* 动画包装器 */}
                <div className={styles.animationWrapper}>
                  {/* 内容面板 */}
                  <div className={styles.contentPanel}>
                    {/* 内容区域 */}
                    <div className={styles.contentInner}>
                      {tocItems.map((item) => {
                        const normalizedLevel = item.level - minLevel
                        const isActive = activeId === item.id
                        // 缩进：0px, 12px, 24px
                        const indent = normalizedLevel * 12
                        return (
                          <div
                            key={item.id}
                            className={`${styles.tocItem} ${isActive ? styles.active : ''}`}
                            onClick={() => handleItemClick(item.id)}
                          >
                            <div className={styles.tocItemContent} style={{ marginInlineStart: `${indent}px` }}>
                              <div className={styles.tocItemText}>
                                <span className={styles.tocItemTextSpan}>{item.text}</span>
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
      </div>
    </div>
  )
}

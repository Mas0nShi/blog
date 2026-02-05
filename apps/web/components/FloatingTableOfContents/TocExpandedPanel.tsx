import React from 'react'

import type { TocItem } from './hooks'
import styles from './FloatingTableOfContents.module.css'

interface TocExpandedPanelProps {
  tocItems: TocItem[]
  activeId: string
  minLevel: number
  onItemClick: (id: string) => void
}

/**
 * 展开的目录面板
 */
export function TocExpandedPanel({ tocItems, activeId, minLevel, onItemClick }: TocExpandedPanelProps) {
  return (
    <div className={styles.contentContainer}>
      <div className={styles.interactiveArea}>
        <div className={styles.slideContainer}>
          <div className={styles.dialogContainer}>
            <div className={styles.animationWrapper}>
              <div className={styles.contentPanel}>
                <div className={styles.contentInner}>
                  {tocItems.map((item) => {
                    const normalizedLevel = item.level - minLevel
                    const isActive = activeId === item.id
                    const indent = normalizedLevel * 12

                    return (
                      <div
                        key={item.id}
                        className={`${styles.tocItem} ${isActive ? styles.active : ''}`}
                        onClick={() => onItemClick(item.id)}
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
  )
}

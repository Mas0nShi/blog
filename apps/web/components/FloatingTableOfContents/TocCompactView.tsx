import React from 'react'

import type { TocItem } from './hooks'
import styles from './FloatingTableOfContents.module.css'

interface TocCompactViewProps {
  tocItems: TocItem[]
  activeId: string
  minLevel: number
  onItemClick: (id: string) => void
}

/**
 * 紧凑线条视图
 */
export function TocCompactView({ tocItems, activeId, minLevel, onItemClick }: TocCompactViewProps) {
  return (
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
              style={{ width: `${lineWidth}px` }}
              onClick={() => onItemClick(item.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

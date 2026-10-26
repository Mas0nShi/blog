import type * as types from 'notion-types'
import { getBlockValue, getTextContent, uuidToId } from 'notion-utils'
import React from 'react'

import { Block, type BlockProps } from '../block'
import { useNotionContext } from '../context'
import { tabClassNames } from '../layout-blocks'
import { blankBlockClassName } from '../text-blocks'
import { cs } from '../utils'

export type TabBlockProps = Omit<BlockProps, 'children'> & {
  block: types.TabBlock
  blockId: string
}

export function TabBlock(props: TabBlockProps) {
  const { recordMap } = useNotionContext()
  const { block, blockId, level, ...forwardProps } = props

  const tabIds = block.content ?? []
  const [activeIndex, setActiveIndex] = React.useState(0)
  const tabScrollRef = React.useRef<HTMLDivElement>(null)
  const [scrollFadeLeft, setScrollFadeLeft] = React.useState(false)
  const [scrollFadeRight, setScrollFadeRight] = React.useState(false)

  const updateTabScrollFades = React.useCallback(() => {
    const el = tabScrollRef.current
    if (!el) return
    const { scrollLeft, scrollWidth, clientWidth } = el
    const maxScroll = scrollWidth - clientWidth
    const epsilon = 1
    setScrollFadeLeft(scrollLeft > epsilon)
    setScrollFadeRight(maxScroll > epsilon && scrollLeft < maxScroll - epsilon)
  }, [])

  React.useLayoutEffect(() => {
    updateTabScrollFades()
  }, [updateTabScrollFades])

  React.useEffect(() => {
    const el = tabScrollRef.current
    if (!el) return

    const ro = new ResizeObserver(() => updateTabScrollFades())
    ro.observe(el)
    const list = el.firstElementChild
    if (list) ro.observe(list)

    window.addEventListener('resize', updateTabScrollFades)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', updateTabScrollFades)
    }
  }, [updateTabScrollFades])

  React.useEffect(() => {
    if (!tabIds.length) return
    setActiveIndex((i) => Math.min(i, tabIds.length - 1))
  }, [tabIds.length])

  const renderSubtree = (childBlockId: string, lvl: number) => {
    const b = getBlockValue(recordMap.block[childBlockId]) as
      | types.Block
      | undefined
    if (!b) return null
    return (
      <Block key={childBlockId} {...forwardProps} block={b} level={lvl}>
        {b.content?.map((cid) => renderSubtree(cid, lvl + 1))}
      </Block>
    )
  }

  if (!tabIds.length) {
    return (
      <div className={cs(tabClassNames.block, blankBlockClassName, blockId)} />
    )
  }

  const safeIndex = Math.min(activeIndex, tabIds.length - 1)
  const activeTabId = tabIds[safeIndex]
  if (!activeTabId) {
    return (
      <div className={cs(tabClassNames.block, blankBlockClassName, blockId)} />
    )
  }
  const activeTabBlock = getBlockValue(recordMap.block[activeTabId])
  const panelBlocks = activeTabBlock?.content ?? []

  const baseId = `notion-tab-${uuidToId(block.id)}`

  return (
    <div
      className={cs('notion-selectable', tabClassNames.block, blockId)}
      data-block-id={uuidToId(block.id)}
      dir='ltr'
    >
      <div className={tabClassNames.inner}>
        <div className={tabClassNames.headerRow}>
          <div className={tabClassNames.scrollHost}>
            <div
              ref={tabScrollRef}
              className={tabClassNames.scroll}
              onScroll={updateTabScrollFades}
            >
              <div
                role='tablist'
                aria-label='Tab block'
                className={tabClassNames.list}
              >
                {tabIds.map((tabId, i) => {
                  const tabLabelBlock = getBlockValue(recordMap.block[tabId])
                  const rawTitle = tabLabelBlock
                    ? getTextContent(tabLabelBlock.properties?.title)
                    : ''
                  const label =
                    rawTitle.trim() !== '' ? rawTitle : `Tab ${i + 1}`
                  const isSelected = i === safeIndex

                  return (
                    <div key={tabId} className={tabClassNames.pillWrap}>
                      <button
                        type='button'
                        role='tab'
                        id={`${baseId}-tab-${i}`}
                        aria-selected={isSelected}
                        aria-controls={`${baseId}-panel`}
                        aria-posinset={i + 1}
                        aria-setsize={tabIds.length}
                        tabIndex={isSelected ? 0 : -1}
                        onClick={() => setActiveIndex(i)}
                        className={tabClassNames.button(isSelected)}
                      >
                        <span className={tabClassNames.buttonLabel}>
                          {label}
                        </span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            <div
              className={tabClassNames.fade('left', scrollFadeLeft)}
              aria-hidden
            />
            <div
              className={tabClassNames.fade('right', scrollFadeRight)}
              aria-hidden
            />
          </div>
          <div className={tabClassNames.addPlaceholder} aria-hidden />
        </div>

        <div
          role='tabpanel'
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${safeIndex}`}
          className={tabClassNames.panel}
        >
          {panelBlocks.map((childId: string) =>
            renderSubtree(childId, level + 1)
          )}
        </div>
      </div>
    </div>
  )
}

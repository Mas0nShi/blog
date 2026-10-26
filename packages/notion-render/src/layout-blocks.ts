import { hasHighlight, notionColorClassName } from './colors'
import { cs } from './utils'

/**
 * Styles of layout blocks: columns, simple tables, table-of-contents blocks,
 * synced blocks, tabs and buttons.
 */

// columns sit side by side; on narrow screens they wrap into full rows
export const rowClassName = cs(
  'notion-row',
  'tw:flex tw:w-full tw:max-w-full tw:overflow-hidden',
  'tw:max-[640px]:flex-row tw:max-[640px]:flex-wrap tw:max-[640px]:gap-[8px] tw:max-[640px]:*:flex-1'
)

export const columnClassName = cs(
  'notion-column',
  'tw:flex tw:flex-col tw:py-[12px] tw:max-[640px]:w-full!',
  // the column owns the outer spacing of its first and last block
  'tw:*:first:mx-0! tw:*:first:mt-0! tw:*:last:mx-0! tw:*:last:mb-0!'
)

export const columnSpacerClassName = cs(
  'notion-spacer',
  'tw:w-[min(32px,4vw)] tw:last:hidden tw:max-[640px]:hidden'
)

export const simpleTableClassNames = {
  container: cs(
    'notion-simple-table-container',
    'tw:mx-auto tw:my-0 tw:block tw:max-w-full tw:overflow-auto'
  ),
  table: cs(
    'notion-simple-table',
    'tw:min-w-max tw:text-[14px] tw:[border-collapse:collapse] tw:[border-spacing:0] tw:[border:1px_solid_var(--fg-color-5)]'
  ),
  row: (color: string | undefined | null, isHeaderRow: boolean) =>
    cs(
      'notion-simple-table-row',
      notionColorClassName(color),
      isHeaderRow && 'notion-simple-table-header-row'
    ),
  cell: ({
    color,
    isHeaderRow,
    isHeaderColumn
  }: {
    color?: string | null
    isHeaderRow: boolean
    isHeaderColumn: boolean
  }) =>
    cs(
      notionColorClassName(color),
      isHeaderColumn && 'notion-simple-table-header-cell',
      // cells keep their padding even when highlighted
      'tw:p-[8px]! tw:whitespace-pre-wrap tw:[border:1px_solid_var(--notion-simple-list-item-cursor)]',
      // header rows replace any highlight; header columns only tint it
      isHeaderRow
        ? 'tw:bg-bg-subtle! tw:bg-none!'
        : isHeaderColumn && 'tw:bg-bg-subtle!'
    )
}

export function tableOfContentsClassName(color?: string | null) {
  return cs(
    'notion-table-of-contents',
    notionColorClassName(color),
    'tw:mx-0 tw:my-[4px] tw:w-full'
  )
}

export const tableOfContentsItemClassName = cs(
  'notion-table-of-contents-item',
  'tw:flex tw:w-full tw:cursor-pointer tw:items-center tw:truncate tw:p-[6px] tw:text-[14px] tw:leading-[1.3]',
  'tw:text-fg tw:no-underline tw:opacity-70 tw:select-none',
  'tw:transition-[background] tw:duration-[20ms] tw:ease-in tw:[&:hover]:bg-bg-hover tw:[&:hover]:opacity-100'
)

export const tableOfContentsItemBodyClassName = cs(
  'notion-table-of-contents-item-body',
  'tw:[border-bottom:1px_solid_var(--fg-color-1)]'
)

export const syncBlockClassName = cs('notion-sync-block', 'tw:w-full')

export const tabClassNames = {
  block: cs(
    'notion-tab-block',
    'tw:box-border tw:w-full tw:max-w-(--notion-max-width)'
  ),
  inner: cs(
    'notion-tab-block-inner',
    'tw:relative tw:rounded-[16px] tw:text-inherit tw:fill-inherit tw:[border:1px_solid_var(--fg-color-0)]'
  ),
  headerRow: cs(
    'notion-tab-header-row',
    'tw:flex tw:items-center tw:rounded-[16px_16px_0_0] tw:px-[12px] tw:pt-[12px] tw:pb-[10px]'
  ),
  scrollHost: cs(
    'notion-tab-scroll-host',
    'tw:relative tw:flex tw:w-full tw:min-w-0 tw:items-center'
  ),
  scroll: cs(
    'notion-tab-scroll',
    'tw:z-1 tw:m-[4px] tw:w-full tw:max-w-full tw:overflow-x-auto',
    'tw:[scrollbar-width:none] tw:[-ms-overflow-style:none] tw:[&::-webkit-scrollbar]:hidden'
  ),
  // edge fades hinting that the tab list scrolls
  fade: (side: 'left' | 'right', visible: boolean) =>
    cs(
      'notion-tab-scroll-fade',
      `notion-tab-scroll-fade-${side}`,
      visible && 'notion-tab-scroll-fade-visible',
      'tw:pointer-events-none tw:absolute tw:top-[4px] tw:bottom-[4px] tw:z-2 tw:w-[18px]',
      'tw:transition-opacity tw:duration-[120ms] tw:ease-[ease]',
      visible ? 'tw:opacity-100' : 'tw:opacity-0',
      side === 'left'
        ? 'tw:left-0 tw:bg-[linear-gradient(to_right,var(--bg-color)_0%,rgba(0,0,0,0)_100%)]'
        : 'tw:right-0 tw:bg-[linear-gradient(to_left,var(--bg-color)_0%,rgba(0,0,0,0)_100%)]'
    ),
  list: cs(
    'notion-tab-list-inner',
    'tw:m-0 tw:flex tw:flex-row tw:flex-nowrap tw:gap-[4px]'
  ),
  pillWrap: cs('notion-tab-pill-wrap', 'tw:flex tw:shrink-0 tw:flex-row'),
  button: (selected: boolean) =>
    cs(
      'notion-tab-button',
      selected && 'notion-tab-button-active',
      'tw:inline-flex tw:h-[32px] tw:max-w-[240px] tw:shrink-0 tw:cursor-pointer tw:items-center tw:justify-center',
      'tw:rounded-[16px] tw:px-[10px] tw:py-0 tw:text-[14px] tw:font-medium tw:whitespace-nowrap tw:[border:none] tw:[font-family:inherit]',
      selected
        ? 'tw:bg-bg-hover tw:text-fg'
        : 'tw:bg-transparent tw:text-fg-muted tw:[&:hover]:bg-bg-hover'
    ),
  buttonLabel: cs('notion-tab-button-label', 'notranslate tw:truncate'),
  addPlaceholder: cs(
    'notion-tab-add-placeholder',
    'tw:pointer-events-none tw:flex tw:w-0 tw:shrink-0 tw:items-center tw:justify-end tw:overflow-hidden tw:opacity-0'
  ),
  panel: cs('notion-tab-panel', 'tw:relative tw:px-[20px] tw:pt-0 tw:pb-[16px]')
}

export const buttonBlockClassName = cs(
  'notion-button-block',
  'tw:mx-0 tw:my-[4px] tw:py-[4px]'
)

// Notion "item" tints used for colored buttons, keyed by background color
const buttonColors: Record<string, string> = {
  gray: 'tw:bg-(--notion-item-gray)! tw:[border-color:var(--notion-item-gray)]!',
  brown:
    'tw:bg-(--notion-item-brown)! tw:[border-color:var(--notion-item-brown)]!',
  orange:
    'tw:bg-(--notion-item-orange)! tw:[border-color:var(--notion-item-orange)]!',
  yellow:
    'tw:bg-(--notion-item-yellow)! tw:[border-color:var(--notion-item-yellow)]!',
  teal: 'tw:bg-(--notion-item-green)! tw:[border-color:var(--notion-item-green)]!',
  green:
    'tw:bg-(--notion-item-green)! tw:[border-color:var(--notion-item-green)]!',
  blue: 'tw:bg-(--notion-item-blue)! tw:[border-color:var(--notion-item-blue)]!',
  purple:
    'tw:bg-(--notion-item-purple)! tw:[border-color:var(--notion-item-purple)]!',
  pink: 'tw:bg-(--notion-item-pink)! tw:[border-color:var(--notion-item-pink)]!',
  red: 'tw:bg-(--notion-item-red)! tw:[border-color:var(--notion-item-red)]!'
}

const pressedShadows =
  'tw:[&:hover]:shadow-[inset_0_0_0_2000px_rgba(0,0,0,0.04)] tw:[&:active]:shadow-[inset_0_0_0_2000px_rgba(0,0,0,0.08)]'

export function buttonClassName({
  color,
  success
}: {
  color?: string | null
  success?: boolean
}) {
  const background = color?.endsWith('_background')
    ? buttonColors[color.slice(0, -'_background'.length)]
    : undefined
  const highlighted = hasHighlight(color)

  return cs(
    'notion-button',
    // background colors also get the site's highlight treatment (gradient,
    // padding and corners) via notionColorClassName
    background
      ? notionColorClassName(color)
      : color
        ? `notion-${color}`
        : undefined,
    success && 'notion-success',
    'tw:inline-flex tw:min-h-[32px] tw:cursor-pointer tw:items-center tw:justify-center tw:text-[14px] tw:font-normal tw:text-black',
    'tw:[border:1px_solid_var(--notion-gray)] tw:transition-[background-color] tw:duration-150 tw:ease-[ease]',
    !highlighted && 'tw:rounded-[3px] tw:px-[12px] tw:py-[6px]',
    'tw:focus-visible:[outline:2px_solid_var(--fg-color)] tw:focus-visible:outline-offset-2',
    'tw:disabled:cursor-not-allowed tw:disabled:opacity-40',
    'tw:dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] tw:dark:[&:hover]:shadow-[0_2px_6px_rgba(0,0,0,0.4)]!',
    success
      ? 'tw:bg-[#0f7b6c]! tw:text-white! tw:[border-color:rgb(175,210,175)]! tw:[&:hover]:bg-[#0a5f54]!'
      : background
        ? cs(background, pressedShadows)
        : color === 'default'
          ? cs(
              'tw:bg-(--notion-item-default) tw:[border-color:var(--notion-gray)]!',
              'tw:[&:hover]:bg-fg-faint tw:[&:active]:bg-(--notion-item-default)',
              pressedShadows
            )
          : 'tw:bg-transparent tw:[&:hover]:bg-[rgba(0,0,0,0.03)] tw:[&:active]:bg-[rgba(0,0,0,0.06)]'
  )
}

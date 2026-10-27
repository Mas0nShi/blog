import cs from 'classnames'

/**
 * Floating table of contents: a column of short lines at the right edge that
 * expands into a panel of headings on hover. Hidden on narrow screens.
 */

const reducedMotion = 'tw:motion-reduce:transition-none'

export function floatingTocClassName(visible: boolean) {
  return cs(
    'tw:fixed tw:right-[12px] tw:z-100 tw:will-change-[transform,opacity] tw:[@media(max-width:1200px)]:hidden',
    // wide screens show the sidebar instead
    'tw:min-[1280px]:hidden',
    'tw:[transition:opacity_200ms_ease,transform_200ms_ease]',
    reducedMotion,
    visible
      ? 'tw:opacity-100 tw:[transform:translateX(0)]'
      : 'tw:opacity-0 tw:[transform:translateX(20px)]'
  )
}

// also widens the hover target around the lines and the panel
export const hoverWrapperClassName = cs(
  'tw:relative tw:flex tw:items-start tw:justify-end',
  "tw:before:pointer-events-auto tw:before:absolute tw:before:-top-[10px] tw:before:-start-[12px] tw:before:-end-[12px] tw:before:-bottom-[10px] tw:before:content-['']"
)

export const compactClassNames = {
  placeholder:
    'tw:relative tw:flex tw:h-max tw:min-h-0 tw:w-[56px] tw:items-start tw:justify-end tw:py-[10px] tw:pr-[8px]',
  // hidden while the panel is open
  view: (hovered: boolean) =>
    cs(
      'tw:flex tw:flex-col tw:gap-[12px]',
      reducedMotion,
      hovered
        ? 'tw:pointer-events-none tw:opacity-0 tw:[transform:translateX(10px)] tw:[transition:opacity_200ms_ease,transform_200ms_ease]'
        : 'tw:opacity-100 tw:[transition:opacity_200ms_ease_50ms,transform_200ms_ease_50ms]'
    ),
  line: (active: boolean) =>
    cs(
      'tw:origin-left tw:cursor-pointer tw:rounded-[1px] tw:[transition:all_0.2s_cubic-bezier(0.4,0,0.2,1)]',
      reducedMotion,
      active
        ? 'tw:h-[2px] tw:bg-[rgba(0,0,0,0.9)] tw:[transform:scaleX(1.05)] tw:dark:bg-[rgba(255,255,255,0.9)]'
        : cs(
            'tw:h-[1.5px] tw:bg-[rgba(0,0,0,0.25)] tw:dark:bg-[rgba(255,255,255,0.25)]',
            'tw:[&:hover]:bg-[rgba(0,0,0,0.5)] tw:[&:hover]:[transform:scaleX(1.1)_scaleY(1.3)] tw:dark:[&:hover]:bg-[rgba(255,255,255,0.5)]!'
          )
    )
}

export const panelClassNames = {
  container:
    'tw:pointer-events-none tw:absolute tw:start-0 tw:top-0 tw:flex tw:size-full tw:flex-col tw:items-end tw:justify-start',
  interactiveArea:
    'tw:pointer-events-none tw:relative tw:end-full tw:h-max tw:w-max',
  slide:
    'tw:pointer-events-none tw:relative tw:-end-[56px] tw:top-0 tw:flex tw:origin-[right_0%] tw:flex-row tw:items-center tw:transition-none',
  dialog:
    'tw:pointer-events-none tw:relative tw:-mt-[10px] tw:max-w-[calc(-24px+100vw)] tw:rounded-[10px] tw:backdrop-filter-none',
  animation: (hovered: boolean) =>
    cs(
      'tw:flex tw:w-[258px] tw:cursor-default tw:flex-row tw:ps-[16px]',
      hovered
        ? 'tw:pointer-events-auto tw:visible tw:opacity-100 tw:[transform:translateX(0)] tw:[transition:opacity_200ms_ease,transform_200ms_ease,visibility_0ms_0ms,pointer-events_0ms_0ms]'
        : 'tw:pointer-events-none tw:invisible tw:opacity-0 tw:[transform:translateX(10px)] tw:[transition:opacity_200ms_ease,transform_200ms_ease,visibility_0ms_200ms,pointer-events_0ms_200ms]'
    ),
  panel: cs(
    'tw:relative tw:me-[10px] tw:flex tw:max-h-[362px] tw:w-[242px] tw:flex-row tw:items-start tw:overflow-x-hidden tw:overflow-y-auto tw:rounded-[14px] tw:px-[12px] tw:pt-[12px] tw:pb-0',
    'tw:bg-[rgba(255,255,255,0.98)] tw:shadow-[0_4px_16px_rgba(0,0,0,0.1)] tw:dark:bg-[rgba(30,30,30,0.98)] tw:dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)]',
    'tw:[&::-webkit-scrollbar]:w-[6px] tw:[&::-webkit-scrollbar-track]:bg-transparent tw:[&::-webkit-scrollbar-thumb]:rounded-[3px]',
    'tw:[&::-webkit-scrollbar-thumb]:bg-[rgba(0,0,0,0.2)] tw:[&::-webkit-scrollbar-thumb:hover]:bg-[rgba(0,0,0,0.3)]',
    'tw:dark:[&::-webkit-scrollbar-thumb]:bg-[rgba(255,255,255,0.2)]! tw:dark:[&::-webkit-scrollbar-thumb:hover]:bg-[rgba(255,255,255,0.3)]!'
  ),
  inner:
    'tw:w-full tw:max-w-[500px] tw:cursor-default tw:px-[6px] tw:pt-[6px] tw:pb-[12px]',
  item: (active: boolean) =>
    cs(
      'tw:block tw:w-full tw:cursor-pointer tw:fill-inherit tw:no-underline tw:select-none tw:[transition:color_0.15s]',
      reducedMotion,
      active
        ? 'tw:text-[rgb(35,131,226)] tw:dark:text-[rgb(82,156,202)]'
        : cs(
            'tw:text-[rgba(0,0,0,0.6)] tw:dark:text-[rgba(255,255,255,0.6)]',
            'tw:[&:hover]:text-[rgba(0,0,0,0.8)] tw:dark:[&:hover]:text-[rgba(255,255,255,0.8)]!'
          )
    ),
  itemContent: 'tw:flex tw:items-center',
  itemText:
    'tw:flex tw:items-center tw:p-[4px] tw:text-[13px] tw:leading-[1.3]',
  itemTextSpan: 'tw:line-clamp-2'
}

// wide screens: a column next to the article (article: 712px, centered)
export const sidebarClassNames = {
  root: cs(
    'tw:fixed tw:left-[calc(50%+396px)] tw:z-100 tw:hidden tw:w-[220px] tw:min-[1280px]:block',
    'tw:max-h-[calc(100vh-140px)] tw:overflow-y-auto tw:transition-opacity tw:duration-200',
    reducedMotion
  ),
  title:
    'tw:mb-[10px] tw:ps-[12px] tw:text-[12px] tw:font-semibold tw:tracking-[0.08em] tw:text-fg-muted',
  list: 'tw:m-0 tw:list-none tw:p-0 tw:[border-inline-start:1px_solid_var(--fg-color-0)]',
  item: (active: boolean) =>
    cs(
      'tw:-ms-px tw:block tw:py-[5px] tw:pe-[8px] tw:text-[13px] tw:leading-[1.45] tw:no-underline',
      'tw:[border-inline-start:2px_solid_transparent] tw:transition-colors tw:duration-150',
      reducedMotion,
      active
        ? 'tw:[border-inline-start-color:var(--select-color-0)] tw:font-medium tw:text-(--select-color-0)'
        : 'tw:text-fg-muted tw:[&:hover]:text-fg'
    )
}

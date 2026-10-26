import { type CollectionCardCoverSize } from 'notion-types'

import { itemColorClassName } from './colors'
import { pageLinkClassName } from './page-links'
import { cs } from './utils'

/**
 * Styles of collections (databases): the collection block, its views (table,
 * gallery, board, list), cards, rows of page properties and property values.
 *
 * Containers own how page titles, icons, links and properties look inside
 * them (descendant variants on the container), so those components keep a
 * single context-free style (see page-links.ts).
 */

type CoverSize = CollectionCardCoverSize

const nowrapEllipsis = 'tw:truncate'

// Tables and boards break out of the content column to the full viewport
// width, except inside toggles, columns and "lite" embeds. The views'
// horizontal padding is an inline style, hence the `!`.
const fullBleed = cs(
  'tw:w-screen tw:max-w-screen tw:self-center tw:overflow-x-auto tw:overflow-y-hidden',
  'tw:[.notion-toggle_&]:w-full! tw:[.notion-toggle_&]:max-w-full!',
  'tw:[.notion-column_&]:w-full! tw:[.notion-column_&]:max-w-full!',
  'tw:[.notion-lite_&]:w-full!'
)

const nestedNoInlinePadding =
  'tw:[.notion-toggle_&]:px-0! tw:[.notion-column_&]:px-0! tw:[.notion-lite_&]:px-0!'

export const collectionClassNames = {
  // page properties at the top of a database page
  pageProperties: cs(
    'notion-collection-page-properties',
    'tw:flex tw:w-full tw:flex-col'
  ),
  header: cs(
    'notion-collection-header',
    'tw:flex tw:h-[42px] tw:items-center tw:overflow-hidden tw:px-[2px] tw:py-[4px] tw:whitespace-nowrap',
    nestedNoInlinePadding
  ),
  headerTitle: cs(
    'notion-collection-header-title',
    'tw:mr-[0.5em] tw:inline-flex tw:items-center tw:text-[1.25em] tw:leading-[1.2] tw:font-semibold',
    'tw:whitespace-pre-wrap tw:[word-break:break-word]'
  ),
  root: cs('notion-collection', 'tw:min-w-full tw:self-center'),
  tabs: cs(
    'notion-collection-view-tabs-row',
    'tw:flex tw:w-[120%] tw:flex-row tw:flex-wrap tw:max-[730px]:w-full'
  ),
  // `all: unset` in the original, spelled out
  tab: (active: boolean) =>
    cs(
      'notion-collection-view-tabs-content-item',
      active && 'notion-collection-view-tabs-content-item-active',
      'tw:relative tw:m-0 tw:box-content tw:flex tw:h-[25px] tw:cursor-pointer tw:items-center tw:px-[10px] tw:py-[7px] tw:select-none',
      'tw:appearance-none tw:bg-transparent tw:text-[14px] tw:leading-none tw:text-[rgb(55,53,47)] tw:[font-family:inherit] tw:[outline:none] tw:[text-align:inherit]',
      'tw:[&:hover]:rounded-[3px] tw:[&:hover]:bg-fg-faint',
      active
        ? 'tw:font-bold tw:[border-color:#000] tw:[border-style:none_none_solid] tw:[border-width:0_0_2px]'
        : 'tw:[font-weight:inherit] tw:[border-style:none]'
    ),
  viewType: cs(
    'notion-collection-view-type',
    'tw:flex tw:items-center tw:text-[14px]'
  ),
  viewTypeIcon: cs(
    'notion-collection-view-type-icon',
    'tw:mr-[6px] tw:inline-block tw:size-[14px] tw:fill-[rgb(55,53,47)]'
  ),
  viewTypeTitle: cs(
    'notion-collection-view-type-title',
    'tw:text-fg',
    nowrapEllipsis
  ),
  loadMore: cs(
    'notion-collection-load-more',
    'tw:mt-[1rem] tw:flex tw:cursor-pointer tw:items-center tw:justify-start tw:rounded-notion tw:px-[1rem] tw:py-[0.5rem] tw:select-none',
    'tw:text-[14px] tw:font-medium tw:text-fg-subtle',
    'tw:transition-[background] tw:duration-[120ms] tw:ease-in tw:[&:hover]:bg-bg-hover tw:[&:hover]:text-fg',
    'tw:[&_svg]:mr-[6px] tw:[&_svg]:size-[16px] tw:[&_svg]:fill-current'
  ),
  group: cs('notion-collection-group', 'tw:mb-[1em]'),
  groupTitle: 'notion-collection-group-title',
  groupTitleInner:
    'tw:inline-flex tw:origin-[0%_50%] tw:items-center tw:[transform:scale(0.85)]'
}

/** Name of a property: table column headers and page property rows. */
export function columnTitleClassNames(variant: 'table' | 'row' | 'hidden') {
  return {
    root: cs(
      'notion-collection-column-title',
      'tw:min-w-0 tw:items-center tw:text-[14px] tw:leading-[120%]',
      variant === 'hidden' ? 'tw:hidden' : 'tw:flex',
      variant === 'row' &&
        'tw:h-[34px] tw:w-[160px] tw:px-[6px] tw:text-fg-muted'
    ),
    icon: cs(
      'notion-collection-column-title-icon',
      'tw:mr-[6px] tw:inline-block tw:fill-fg-subtle',
      variant === 'row'
        ? 'tw:size-[16px] tw:min-h-[16px] tw:min-w-[16px]'
        : 'tw:size-[14px] tw:min-h-[14px] tw:min-w-[14px]'
    ),
    body: cs('notion-collection-column-title-body', nowrapEllipsis)
  }
}

/** Wrapper of a single property value. */
export function propertyClassName(type: string) {
  return cs(
    'notion-property',
    `notion-property-${type}`,
    (type === 'select' || type === 'multi_select' || type === 'status') &&
      'tw:flex tw:flex-wrap tw:gap-[6px]',
    type === 'file' && propertyFileClassName,
    type === 'checkbox' && 'tw:size-[16px]',
    type === 'created_time' && 'tw:flex!'
  )
}

export const propertyFileClassName = cs(
  'notion-property-file',
  'tw:flex tw:flex-wrap tw:content-start',
  'tw:[&_img]:mr-[6px] tw:[&_img]:max-h-[24px] tw:[&_img]:max-w-full'
)

/** A select, multi-select or status option. */
export function propertyItemClassName(type: string, color?: string | null) {
  return cs(
    `notion-property-${type}-item`,
    itemColorClassName(color),
    'tw:flex tw:h-[20px] tw:items-center tw:px-[6px] tw:leading-[120%]',
    nowrapEllipsis,
    type === 'status' ? 'tw:rounded-[20px]' : 'tw:rounded-[3px]'
  )
}

export const propertyCheckboxClassNames = {
  container: 'notion-property-checkbox-container',
  // the property name is only shown on cards
  text: cs('notion-property-checkbox-text', 'tw:hidden')
}

export const propertyUrlClassNames = {
  domain: cs('notion-url-domain', 'tw:text-inherit'),
  path: cs(
    'notion-url-path',
    'tw:text-[rgba(55,53,47,0.45)] tw:dark:text-[rgba(255,255,255,0.4)]'
  )
}

// page property rows (database pages and the site's post header)
export const collectionRowClassNames = {
  root: cs(
    'notion-collection-row',
    'tw:mb-[1em] tw:w-full tw:pt-[4px] tw:pb-[1em] tw:[border-bottom:1px_solid_var(--fg-color-0)]'
  ),
  body: cs('notion-collection-row-body', 'tw:flex tw:flex-col tw:gap-[4px]'),
  property: cs(
    'notion-collection-row-property',
    'tw:flex tw:items-center',
    'tw:[&_.notion-property]:flex tw:[&_.notion-property]:w-full tw:[&_.notion-property]:justify-center',
    'tw:[&_.notion-property-auto_increment_id]:text-(--fg-color-7)',
    'tw:[&_.notion-property-relation_.notion-page-title-text]:[border-bottom:1px_solid]'
  ),
  value: cs(
    'notion-collection-row-value',
    'tw:flex tw:min-h-[23px] tw:flex-1 tw:items-center tw:p-0 tw:text-[14px]'
  )
}

// table view

export const tableClassNames = {
  root: cs('notion-table', fullBleed),
  view: cs(
    'notion-table-view',
    'tw:relative tw:float-left tw:min-w-(--notion-max-width) tw:pl-0',
    nestedNoInlinePadding
  ),
  header: cs(
    'notion-table-header',
    'tw:absolute tw:z-82 tw:flex tw:h-[33px] tw:min-w-(--notion-max-width) tw:text-fg-muted'
  ),
  headerInner: cs(
    'notion-table-header-inner',
    'tw:inline-flex tw:w-full tw:[border-top:1px_solid_var(--fg-color-1)] tw:[border-bottom:1px_solid_var(--fg-color-1)]'
  ),
  headerPlaceholder: cs('notion-table-header-placeholder', 'tw:h-[34px]'),
  th: cs('notion-table-th', 'tw:relative tw:flex'),
  headerCell: cs(
    'notion-table-view-header-cell',
    'tw:flex tw:h-[32px] tw:shrink-0 tw:overflow-hidden tw:p-0 tw:text-[14px]'
  ),
  headerCellInner: (isLast: boolean) =>
    cs(
      'notion-table-view-header-cell-inner',
      'tw:flex tw:size-full tw:px-[8px] tw:select-none',
      !isLast && 'tw:[border-right:1px_solid_var(--fg-color-0)]'
    ),
  body: cs('notion-table-body', 'tw:relative tw:min-w-(--notion-max-width)'),
  row: cs(
    'notion-table-row',
    'tw:flex tw:[border-bottom:1px_solid_var(--fg-color-1)]'
  ),
  cell: ({ type, wrap }: { type?: string; wrap: boolean }) => {
    const isSelect = type === 'select' || type === 'multi_select'
    const preWrap = type === 'text' || type === 'number'
    const tallLines =
      preWrap || type === 'url' || type === 'email' || type === 'phone_number'

    return cs(
      'notion-table-cell',
      `notion-table-cell-${type}`,
      !wrap && 'notion-table-cell-nowrap',
      'tw:min-h-[32px] tw:overflow-hidden tw:text-[14px] tw:[word-break:break-word]',
      'tw:[border-right:1px_solid_var(--fg-color-1)] tw:last:[border-right:0_none]',
      isSelect
        ? 'tw:px-[8px] tw:pt-[7px] tw:pb-0'
        : 'tw:px-[8px] tw:pt-[5px] tw:pb-[6px]',
      tallLines ? 'tw:leading-[1.5]' : 'tw:leading-none',
      !wrap
        ? 'tw:text-ellipsis tw:whitespace-nowrap'
        : preWrap
          ? 'tw:whitespace-pre-wrap'
          : 'tw:whitespace-normal',
      type === 'auto_increment_id' && 'tw:text-(--fg-color-7)',
      type === 'title' &&
        cs(
          'tw:font-medium',
          'tw:[&_.notion-page-link]:font-medium tw:[&_.notion-page-link]:not-italic',
          'tw:[&_.notion-page-link_:is(em,i,b,strong)]:[font-style:inherit] tw:[&_.notion-page-link_:is(em,i,b,strong)]:[font-weight:inherit]'
        ),
      'tw:[&_.notion-page-icon-inline]:shrink-0'
    )
  }
}

// gallery and board cards

/** Height of a card cover by card size and the view it is shown in. */
function cardCoverHeight(size: CoverSize, inBoard: boolean) {
  if (inBoard) {
    return size === 'small'
      ? 'tw:h-[100px]'
      : size === 'large'
        ? 'tw:h-[180px]'
        : 'tw:h-[148px]'
  }

  return size === 'small' ? 'tw:h-[124px]' : 'tw:h-[190px]'
}

export function collectionCardClassNames({
  size,
  inBoard
}: {
  size: CoverSize
  inBoard: boolean
}) {
  return {
    root: cs(
      'notion-collection-card',
      `notion-collection-card-size-${size}`,
      inBoard && 'notion-board-group-card tw:mb-[8px]',
      'tw:flex tw:cursor-pointer tw:flex-col tw:overflow-visible tw:rounded-[16px] tw:bg-bg tw:text-fg tw:no-underline tw:shadow-none tw:select-none',
      'tw:transition-shadow tw:duration-200 tw:ease-[ease]',
      'tw:[&:hover]:bg-transparent tw:[&:hover]:shadow-[0_4px_10px_rgba(0,0,0,0.2)]',
      // page links and checkboxes inside the card
      'tw:[&_.notion-page-link]:m-0 tw:[&_.notion-page-link]:h-[unset] tw:[&_.notion-page-link]:bg-transparent! tw:[&_.notion-page-link]:transition-none',
      'tw:[&_.notion-property-checkbox-container]:flex',
      'tw:[&_.notion-property-checkbox-text]:ml-[6px] tw:[&_.notion-property-checkbox-text]:inline-block'
    ),
    cover: cs(
      'notion-collection-card-cover',
      cardCoverHeight(size, inBoard),
      'tw:relative tw:w-full tw:overflow-hidden tw:rounded-[16px] tw:shadow-[2px_2px_8px_4px_rgba(15,15,15,0.1)]',
      'tw:filter-none tw:transition-[filter] tw:duration-150 tw:ease-linear tw:[.notion-collection-card:hover_&]:brightness-100',
      'tw:[&_img]:size-full tw:[&_img]:max-h-full! tw:[&_img]:min-h-full! tw:[&_img]:rounded-[16px]',
      'tw:[&_.lazy-image-wrapper]:h-full tw:[&_.lazy-image-wrapper]:p-0!'
    ),
    coverEmpty: cs(
      'notion-collection-card-cover-empty',
      'tw:pointer-events-none tw:size-full tw:overflow-hidden tw:bg-(--fg-color-5) tw:px-[8px] tw:pt-[8px] tw:pb-0',
      'tw:shadow-[inset_0_-1px_0_0_var(--fg-color-0)]'
    ),
    // a file property used as the cover
    coverFile: cs(
      'notion-property-file',
      'tw:relative tw:block tw:h-full tw:[&_img]:m-0'
    ),
    body: cs('notion-collection-card-body', 'tw:flex tw:flex-col tw:p-[10px]'),
    property: (isTitle: boolean) =>
      cs(
        'notion-collection-card-property',
        'tw:overflow-hidden tw:px-0 tw:py-[4px] tw:[word-break:break-word] tw:[&_img]:max-h-[18px]!',
        isTitle ? 'tw:text-[14px] tw:font-medium' : 'tw:text-[12px]',
        // gallery cards wrap long titles and values
        inBoard
          ? cs(
              'tw:whitespace-nowrap',
              isTitle ? 'tw:text-ellipsis' : 'tw:text-clip'
            )
          : 'tw:text-clip tw:[white-space:unset]',
        'tw:[&_.notion-page-title]:transition-none',
        'tw:[&_.notion-page-title-icon]:ml-0 tw:[&_.notion-page-title-icon]:size-[18px]',
        'tw:[&_.notion-page-title-text]:[border-bottom:0_none]',
        'tw:[&_.notion-property-relation_.notion-page-title-text]:[border-bottom:1px_solid]',
        !inBoard &&
          cs(
            'tw:[&_.notion-page-icon-inline]:hidden tw:[&_.notion-property-text]:text-[14px]',
            'tw:[&_.notion-page-title-text]:text-[2em] tw:[&_.notion-page-title-text]:[white-space:unset]'
          )
      ),
    // links are rendered as forms so cards don't nest <a> tags
    nestedLink: cs(
      'nested-form-link notion-link',
      'tw:cursor-pointer tw:bg-transparent! tw:bg-none! tw:p-0! tw:underline tw:[border:none]'
    )
  }
}

export const galleryClassNames = {
  root: cs('notion-gallery', 'tw:self-center'),
  view: cs(
    'notion-gallery-view',
    'tw:relative tw:pl-0 tw:transition-[padding] tw:duration-200 tw:ease-out'
  ),
  grid: (size: CoverSize) =>
    cs(
      'notion-gallery-grid',
      `notion-gallery-grid-size-${size}`,
      'tw:relative tw:grid tw:auto-rows-fr tw:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] tw:gap-[6vmin]',
      'tw:pt-[16px] tw:pb-[4px] tw:[border-top:1px_solid_var(--fg-color-1)]'
    )
}

// board view

function boardColumnWidth(size: CoverSize) {
  return size === 'small'
    ? 'tw:w-[180px]'
    : size === 'large'
      ? 'tw:w-[320px]'
      : 'tw:w-[260px]'
}

export function boardClassNames(size: CoverSize) {
  return {
    root: cs('notion-board', fullBleed),
    view: cs(
      'notion-board-view',
      `notion-board-view-size-${size}`,
      'tw:relative tw:float-left tw:min-w-full tw:pl-0 tw:transition-[padding] tw:duration-200 tw:ease-out',
      nestedNoInlinePadding
    ),
    header: cs(
      'notion-board-header',
      'tw:absolute tw:z-82 tw:flex tw:h-[44px] tw:min-w-full'
    ),
    headerInner: cs(
      'notion-board-header-inner',
      'tw:inline-flex tw:[border-top:1px_solid_var(--fg-color-1)] tw:[border-bottom:1px_solid_var(--fg-color-1)]'
    ),
    headerPlaceholder: cs(
      'notion-board-header-placeholder',
      'tw:h-(--notion-header-height)'
    ),
    th: cs(
      'notion-board-th',
      boardColumnWidth(size),
      'tw:box-content tw:flex tw:shrink-0 tw:items-center tw:pr-[16px] tw:text-[14px]'
    ),
    thBody: cs(
      'notion-board-th-body',
      'tw:flex tw:items-center tw:overflow-hidden tw:pr-[4px] tw:pl-[2px] tw:text-[14px] tw:leading-[1.2] tw:whitespace-nowrap'
    ),
    thEmpty: cs(
      'notion-board-th-empty',
      'tw:relative tw:top-[2px] tw:mr-[4px]'
    ),
    body: cs('notion-board-body', 'tw:inline-flex'),
    group: cs(
      'notion-board-group',
      boardColumnWidth(size),
      'tw:box-content tw:flex-[0_0_auto] tw:pr-[16px]'
    )
  }
}

// number of items in a board column or collection group
export const boardCountClassName = cs(
  'notion-board-th-count',
  'tw:px-[8px] tw:font-medium tw:text-fg-muted'
)

// list view

export const listClassNames = {
  root: cs('notion-list-collection', 'tw:w-full tw:max-w-full tw:self-center'),
  view: cs(
    'notion-list-view',
    'tw:relative tw:max-w-full tw:pl-0 tw:transition-[padding] tw:duration-200 tw:ease-out'
  ),
  body: cs(
    'notion-list-body',
    'tw:flex tw:max-w-full tw:flex-col tw:overflow-hidden tw:pt-[8px] tw:[border-top:1px_solid_var(--fg-color-1)]'
  ),
  item: cs(
    pageLinkClassName,
    'notion-list-item',
    'tw:max-w-full tw:items-center tw:justify-between tw:overflow-hidden tw:rounded-[0.5rem] tw:px-[4px] tw:py-0'
  ),
  itemTitle: cs(
    'notion-list-item-title',
    'tw:flex tw:items-center tw:leading-[1.3] tw:font-medium',
    nowrapEllipsis
  ),
  itemBody: cs(
    'notion-list-item-body',
    'tw:flex tw:flex-nowrap tw:items-center tw:overflow-hidden'
  ),
  itemProperty: cs(
    'notion-list-item-property',
    'tw:ml-[14px] tw:text-[14px]',
    'tw:[&_.notion-property-title]:hidden tw:[&_.notion-property-date]:align-middle',
    'tw:[&_:is(.notion-property-date,.notion-property-created_time,.notion-property-last_edited_time,.notion-property-url)]:inline-block',
    'tw:[&_:is(.notion-property-date,.notion-property-created_time,.notion-property-last_edited_time,.notion-property-url)]:text-[12px]',
    'tw:[&_:is(.notion-property-date,.notion-property-created_time,.notion-property-last_edited_time,.notion-property-url)]:text-fg-muted',
    'tw:[&_:is(.notion-property-date,.notion-property-created_time,.notion-property-last_edited_time,.notion-property-url)]:overflow-hidden',
    'tw:[&_:is(.notion-property-date,.notion-property-created_time,.notion-property-last_edited_time,.notion-property-url)]:text-ellipsis'
  )
}

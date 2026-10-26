import { hasHighlight, notionColorClassName } from './colors'
import { cs } from './utils'

/**
 * Styles of text blocks (paragraphs, headings, lists, quotes, dividers,
 * callouts, toggles, to-dos) and inline text formatting.
 *
 * Blocks with a highlight color get their padding from the highlight box
 * (see colors.ts), so each block only sets its own padding otherwise.
 */

const wrapText = 'tw:whitespace-pre-wrap tw:[word-break:break-word]'

export function textBlockClassName(color?: string | null) {
  return cs(
    'notion-text',
    notionColorClassName(color),
    'tw:my-[1px] tw:w-full tw:first:mt-[2px]',
    wrapText,
    !hasHighlight(color) && 'tw:px-[2px] tw:py-[0.5em]',
    // paragraphs directly inside a toggle sit flush with its title
    'tw:[.notion-toggle-block_&]:p-0! tw:[.notion-toggle-block_&]:first:mt-0!'
  )
}

export const textChildrenClassName = cs(
  'notion-text-children',
  'tw:flex tw:flex-col tw:pl-[1.5em]'
)

export const blankBlockClassName = cs(
  'notion-blank',
  'tw:my-[1px] tw:min-h-[1rem] tw:w-full tw:px-[2px] tw:py-[3px]'
)

const headingLevels = {
  1: 'notion-h1 tw:mt-[1.08em] tw:mb-[0.25em] tw:text-[1.875em] tw:first:mt-0',
  2: 'notion-h2 tw:mt-[1.1em] tw:mb-[0.25em] tw:text-[1.5em]',
  3: 'notion-h3 tw:mt-[1em] tw:mb-[0.25em] tw:text-[1.25em]',
  4: 'notion-h4 tw:mt-[1em] tw:mb-[1px] tw:text-[1.15em]'
}

export function headingClassName(level: 1 | 2 | 3 | 4, color?: string | null) {
  return cs(
    'notion-h',
    headingLevels[level],
    notionColorClassName(color),
    'tw:relative tw:inline tw:w-full tw:max-w-full tw:leading-[1.3] tw:font-semibold',
    wrapText,
    !hasHighlight(color) && 'tw:px-[2px] tw:py-[3px]',
    'tw:[.notion-sync-block_&]:block tw:[details.notion-toggle_&]:inline!'
  )
}

// scroll target that clears the sticky header
export const headingAnchorClassName = cs(
  'notion-header-anchor',
  'tw:absolute tw:top-[-54px] tw:left-0'
)

export const headingHashLinkClassName = cs(
  'notion-hash-link',
  'tw:float-left tw:-ml-[20px] tw:pr-[4px] tw:no-underline tw:opacity-0',
  'tw:fill-(--fg-color-icon) tw:[.notion-h:hover_&]:opacity-100'
)

export function listClassName(type: 'bulleted' | 'numbered') {
  return cs(
    'notion-list',
    type === 'bulleted'
      ? 'notion-list-disc tw:list-disc'
      : 'notion-list-numbered tw:relative tw:list-decimal tw:p-[2px]',
    'tw:m-0 tw:ml-[2px] tw:max-w-full tw:list-outside'
  )
}

// The marker comes from the outermost list: nested items are rendered inside
// their top-level list's wrapper.
export const listItemClassName = cs(
  'notion-block-list-item',
  'tw:relative tw:flex tw:min-w-[1px] tw:flex-row tw:items-start',
  'tw:before:flex tw:before:w-[24px] tw:before:min-h-[calc(1.5em_-_8px)] tw:before:shrink-0 tw:before:grow-0 tw:before:items-center tw:before:justify-center',
  "tw:[.notion-list-disc_&]:before:mt-[2px] tw:[.notion-list-disc_&]:before:font-[Arial,serif] tw:[.notion-list-disc_&]:before:text-[1.5em] tw:[.notion-list-disc_&]:before:leading-none tw:[.notion-list-disc_&]:before:content-['•']",
  "tw:[.notion-list-numbered_&]:before:whitespace-nowrap tw:[.notion-list-numbered_&]:before:content-[attr(block-list-numbered-counter)_'.']"
)

export const listItemContentClassName = cs(
  'notion-block-list-item-content',
  'tw:flex tw:w-full tw:max-w-[calc(100%_-_24px)] tw:flex-[1_1_0px] tw:flex-col tw:items-start'
)

export const listItemTextClassName = cs('tw:w-full tw:max-w-full', wrapText)

export function quoteClassName(color?: string | null) {
  return cs(
    'notion-quote',
    notionColorClassName(color),
    'tw:mx-0 tw:my-[6px] tw:block tw:w-full tw:text-[1em] tw:leading-normal',
    'tw:[border-left:4px_solid_var(--notion-blue)]',
    wrapText,
    !hasHighlight(color) && 'tw:px-[0.75em] tw:py-[0.2em]'
  )
}

export const dividerClassName = cs(
  'notion-hr',
  'tw:mx-0 tw:my-[6px] tw:w-full tw:p-0 tw:rounded-[0.25em]',
  'tw:[border-style:none_none_solid_none] tw:[border-width:0_0_1px_0] tw:[border-color:var(--bg-color-0)]'
)

export const calloutClassName = cs(
  'notion-callout',
  'tw:mx-0 tw:my-[0.75em] tw:box-border tw:inline-flex tw:w-full tw:items-center',
  'tw:rounded-notion tw:p-[16px_16px_16px_12px]',
  'tw:[border:1px_solid_var(--fg-color-0)] tw:dark:[border-color:var(--bg-color-2)]',
  // the callout icon, and any page icon inside the callout
  'tw:[&_.notion-page-icon-inline]:size-[24px] tw:[&_.notion-page-icon-inline]:self-start tw:[&_.notion-page-icon-inline]:text-[1.3em] tw:[&_.notion-page-icon-inline]:leading-[24px] tw:[&_.notion-page-icon-inline]:select-none'
)

export const calloutTextClassName = cs(
  'notion-callout-text',
  'tw:ml-[8px] tw:w-full',
  wrapText
)

export const toggleClassNames = {
  block: cs(
    'notion-toggle-block',
    'tw:flex tw:w-full tw:items-start tw:pl-[2px] tw:text-inherit tw:fill-inherit'
  ),
  toggle: cs('notion-toggle', 'tw:flex tw:w-full tw:items-start'),
  buttonWrap: cs(
    'notion-toggle-button-wrap',
    'tw:mr-[2px] tw:flex tw:w-[24px] tw:min-h-[calc(1.5em_+_6px)] tw:shrink-0 tw:grow-0',
    'tw:items-center tw:justify-center tw:pr-[2px] tw:select-none'
  ),
  button: cs(
    'notion-toggle-button',
    'tw:relative tw:flex tw:size-[24px] tw:cursor-pointer tw:items-center tw:justify-center',
    'tw:rounded-[4px] tw:pt-[2px] tw:select-none',
    'tw:transition-[background] tw:duration-100 tw:ease-in tw:[&:hover]:bg-(--bg-color-2)'
  ),
  arrow:
    'tw:block tw:size-[0.6875em] tw:shrink-0 tw:fill-current tw:opacity-100 tw:transition-transform tw:duration-200 tw:ease-out',
  body: 'tw:min-w-[1px] tw:flex-[1_1_0px] tw:px-[2px] tw:py-[3px]',
  title: cs('tw:w-full tw:max-w-full tw:text-left', wrapText),
  content: 'tw:flex tw:w-full tw:flex-col tw:flex-wrap'
}

export const toDoClassNames = {
  root: cs('notion-to-do', 'tw:flex tw:w-full tw:flex-col'),
  item: cs(
    'notion-to-do-item',
    'tw:flex tw:min-h-[calc(1.5em_+_3px_+_3px)] tw:w-full tw:items-center tw:pl-[2px]',
    'tw:[&_.notion-property-checkbox]:mr-[8px]'
  ),
  body: cs('notion-to-do-body', wrapText),
  checked: cs(
    'notion-to-do-checked',
    'tw:text-fg-strong tw:line-through tw:opacity-[0.375]'
  ),
  children: cs('notion-to-do-children', 'tw:pl-[1.5em]')
}

// inline formatting

export const linkClassName = cs(
  'notion-link',
  'tw:relative tw:text-inherit tw:opacity-100 tw:[text-decoration:inherit] tw:[word-break:break-word]',
  // an underline that turns into a gradient sweeping in on hover
  'tw:[border-bottom-style:solid] tw:[border-bottom-width:0.1rem] tw:[border-color:var(--fg-color-2)]',
  'tw:bg-transparent tw:bg-no-repeat tw:bg-origin-border tw:bg-[position:50%_100%] tw:bg-[length:0_0.1rem]',
  'tw:[&:hover,&:focus]:[border-bottom-color:transparent] tw:[&:hover,&:focus]:bg-[linear-gradient(90.68deg,#b439df_0.26%,#e5337e_102.37%)]',
  'tw:[&:hover,&:focus]:bg-[position:0_100%] tw:[&:hover,&:focus]:bg-[length:100%_0.1rem]',
  'tw:[&:hover,&:focus]:[transition-property:background-position,background-size] tw:[&:hover,&:focus]:duration-300',
  // links inside collection properties have no underline
  'tw:[.notion-collection-card-property_&]:[border-bottom:0_none] tw:[.notion-collection-row-property_&]:[border-bottom:0_none]'
)

export const inlineCodeClassName = cs(
  'notion-inline-code',
  'tw:rounded-notion tw:bg-(--bg-color-2) tw:px-[0.4em] tw:py-[0.2em]',
  "tw:font-['SFMono-Regular',Consolas,'Liberation_Mono',Menlo,Courier,monospace] tw:text-[length:85%] tw:text-[#eb5757] tw:break-all"
)

export const inlineUnderlineClassName = cs(
  'notion-inline-underscore',
  'tw:underline'
)

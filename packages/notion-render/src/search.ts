import { cs } from './utils'

/** Styles of the search dialog (a react-modal overlay and content). */
export const searchClassNames = {
  overlay: cs(
    'notion-search-overlay',
    'tw:fixed tw:inset-0 tw:z-1001 tw:flex tw:items-start tw:justify-center tw:bg-[rgba(15,15,15,0.6)]'
  ),
  dialog: cs(
    'notion-search',
    'tw:relative tw:top-[90px] tw:max-h-[80vh] tw:min-h-[50px] tw:w-3/4 tw:max-w-[600px] tw:overflow-hidden tw:rounded-[3px] tw:bg-bg tw:[outline:none]',
    'tw:shadow-[rgba(15,15,15,0.05)_0_0_0_1px,rgba(15,15,15,0.1)_0_5px_10px,rgba(15,15,15,0.2)_0_15px_40px]',
    'tw:font-sans tw:text-[16px] tw:leading-[1.5] tw:text-[rgb(55,53,47)] tw:caret-[rgb(55,53,47)]',
    // result page icons use the text color
    'tw:[&_.notion-page-icon]:text-fg'
  ),
  menu: cs(
    'quickFindMenu',
    'tw:flex tw:h-full tw:max-h-[80vh] tw:min-h-[50px] tw:min-w-full tw:max-w-[calc(100vw-24px)] tw:flex-col'
  ),
  searchBar: cs(
    'searchBar',
    'tw:flex tw:h-[52px] tw:flex-row tw:items-center tw:p-[16px] tw:text-[18px] tw:leading-[27px] tw:shadow-[var(--fg-color-0)_0_1px_0]'
  ),
  inlineIcon: cs('inlineIcon', 'tw:mr-[10px] tw:fill-fg-subtle'),
  // keyframes: `spinner` in styles.css
  loadingIcon: cs('loadingIcon', 'tw:animate-[spinner_0.6s_linear_infinite]'),
  input: cs(
    'searchInput',
    'tw:flex-1 tw:resize-none tw:whitespace-nowrap tw:bg-bg tw:leading-[inherit] tw:text-fg tw:caret-fg tw:[font-size:inherit] tw:[border:none] tw:[outline:none]'
  ),
  clearButton: cs(
    'clearButton',
    'tw:ml-[8px] tw:cursor-pointer tw:rounded-[20px] tw:select-none'
  ),
  clearIcon: cs(
    'clearIcon',
    'tw:size-[14px] tw:fill-fg-subtle',
    'tw:[.clearButton:hover:not(:active)_&]:fill-fg-muted tw:[.clearButton:active_&]:fill-(--fg-color-6)'
  ),
  resultsPane: cs(
    'resultsPane',
    'tw:flex tw:h-full tw:flex-1 tw:flex-col tw:overflow-auto'
  ),
  result: cs(
    'result',
    'tw:my-[1px] tw:flex tw:w-full tw:flex-col tw:items-stretch tw:px-[14px] tw:py-[8px] tw:text-[14px] tw:text-fg tw:no-underline tw:select-none',
    'tw:[border-bottom:1px_solid_rgba(55,53,47,0.06)]',
    'tw:transition-[background] tw:duration-[120ms] tw:ease-in',
    'tw:[&:hover:not(:active)]:bg-(--bg-color-2) tw:[&:active]:bg-fg-faint'
  ),
  // a result's title is a full row
  resultTitle: 'tw:flex!',
  resultHighlight: cs(
    'notion-search-result-highlight',
    'tw:mt-[4px] tw:mr-0 tw:mb-0 tw:ml-[30px] tw:text-[90%]'
  ),
  footer: cs(
    'resultsFooter',
    'tw:mt-[1px] tw:flex tw:min-h-[28px] tw:flex-col tw:justify-center tw:px-[16px] tw:text-[12px] tw:text-fg-subtle tw:select-none',
    'tw:shadow-[rgba(55,53,47,0.09)_0_-1px_0]'
  ),
  count: cs('resultsCount', 'tw:font-medium tw:text-fg-muted'),
  noResultsPane: cs(
    'noResultsPane',
    'tw:flex tw:flex-col tw:items-center tw:justify-center tw:px-[16px] tw:py-[32px]'
  ),
  noResults: cs(
    'noResults',
    'tw:text-[14px] tw:leading-[20px] tw:font-medium tw:text-fg-muted'
  ),
  noResultsDetail: cs(
    'noResultsDetail',
    'tw:mt-[2px] tw:text-[14px] tw:text-fg-subtle'
  )
}

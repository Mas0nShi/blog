import { isBackgroundColor, notionColorClassName } from './colors'
import { cs } from './utils'

/**
 * Styles of references to pages: page links (blocks, aliases and collection
 * titles), page titles, inline page icons and checkboxes.
 *
 * Containers that change how these look (collection cards, table cells,
 * callouts, breadcrumbs, to-dos) own those changes; see collections.ts and the
 * container styles.
 */

export const pageLinkClassName = cs(
  'notion-page-link',
  'tw:mx-0 tw:my-[1px] tw:flex tw:h-[30px] tw:w-full tw:text-fg tw:no-underline tw:select-none',
  'tw:transition-[background] tw:duration-[120ms] tw:ease-in tw:[&:hover]:bg-bg-hover'
)

/**
 * Block color of a page link: backgrounds get the usual highlight, while text
 * colors don't apply (links keep the text color).
 */
export function pageLinkColorClassName(color?: string | null) {
  if (!color) {
    return undefined
  }

  return isBackgroundColor(color)
    ? notionColorClassName(color)
    : `notion-${color}`
}

export const pageTitleClassNames = {
  root: cs(
    'notion-page-title',
    'tw:inline-flex tw:max-w-full tw:items-center tw:leading-[1.3]',
    'tw:transition-[background] tw:duration-[120ms] tw:ease-in',
    'tw:[&_.notion-page-icon-inline]:mr-[6px] tw:[&_.notion-page-icon-inline]:ml-[2px]'
  ),
  // applied to the icon itself (see PageIcon's className)
  icon: cs(
    'notion-page-title-icon',
    'tw:flex tw:size-[22px] tw:shrink-0 tw:items-center tw:justify-center tw:rounded-notion'
  ),
  text: cs(
    'notion-page-title-text',
    'tw:relative tw:top-[1px] tw:truncate tw:leading-[1.3] tw:font-medium',
    'tw:[border-bottom:1px_solid_var(--fg-color-1)] tw:[.notion-link_&]:[border-bottom:0_none]'
  )
}

/** Box around an inline (non-hero) page icon. */
export function inlinePageIconClassName(isImage: boolean) {
  return cs(
    'notion-page-icon-inline',
    isImage ? 'notion-page-icon-image' : 'notion-page-icon-span',
    'tw:relative tw:mx-[4px] tw:my-0 tw:size-[22px] tw:max-h-[22px] tw:max-w-[22px]',
    'tw:[&_span]:max-h-full tw:[&_span]:max-w-full tw:[&_img]:object-cover'
  )
}

// the icon itself: an emoji, an image or the default page icon (svg)
const pageIconGlyph =
  'tw:font-emoji tw:text-[1.1em] tw:text-(--fg-color-icon) tw:fill-(--fg-color-6)'

/** Inline page icon content; hero icons use pageIconHeroContentClassName. */
export const inlinePageIconContentClassName = cs(
  'notion-page-icon',
  pageIconGlyph,
  'tw:[&:is(img,svg)]:block tw:[&:is(img,svg)]:max-h-full tw:[&:is(img,svg)]:max-w-full tw:[&:is(img,svg)]:rounded-notion'
)

/** Hero image icons still take the glyph colors (the default icon is an svg). */
export const heroPageIconGlyphClassName = cs('notion-page-icon', pageIconGlyph)

export const checkboxClassNames = {
  root: cs('notion-property notion-property-checkbox', 'tw:size-[16px]'),
  checked: cs(
    'notion-property-checkbox-checked',
    'tw:size-[16px] tw:bg-accent',
    'tw:[&_svg]:relative tw:[&_svg]:top-[2px] tw:[&_svg]:left-[2px] tw:[&_svg]:block tw:[&_svg]:size-[12px] tw:[&_svg]:shrink-0 tw:[&_svg]:fill-white'
  ),
  unchecked: cs(
    'notion-property-checkbox-unchecked',
    'tw:size-[16px]',
    'tw:[&_svg]:relative tw:[&_svg]:block tw:[&_svg]:size-[16px] tw:[&_svg]:fill-fg'
  )
}

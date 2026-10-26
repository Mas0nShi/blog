import { cs } from './utils'

/**
 * Layout of a full Notion page:
 *
 *   root (.notion-app)
 *   └─ frame
 *      ├─ header (sticky, see components/header.tsx)
 *      └─ scroller
 *         ├─ cover
 *         ├─ page (main)
 *         │  ├─ icon (hero, overlaps the cover)
 *         │  ├─ title
 *         │  └─ content
 *         │     ├─ article
 *         │     └─ aside
 *         └─ footer
 *
 * Every element owns its own layout here, driven by page state instead of
 * descendant selectors. `notion-*` class names are kept as a stable styling
 * hook and for anchors like `.notion-viewport` (modal root).
 */

/** Base typography for the root of a rendered Notion tree. */
export const notionRootClassName = cs(
  'notion',
  'tw:font-sans tw:text-[16px] tw:leading-normal tw:text-fg tw:caret-fg'
)

/**
 * Root of an embedded (non full-page) render, where the root element is also
 * the page itself: the page's line height and small text win.
 */
export function embeddedRootClassName({ smallText }: { smallText: boolean }) {
  return cs(
    'notion',
    'tw:font-sans tw:text-fg tw:caret-fg',
    smallText ? 'tw:text-[14px]' : 'tw:text-[16px]'
  )
}

export const pageShellClassNames = {
  app: cs(
    'notion-app',
    'tw:relative tw:min-h-screen tw:bg-bg',
    'tw:[--notion-header-height:54px]'
  ),
  viewport: cs('notion-viewport', 'tw:relative tw:p-0'),
  frame: cs('notion-frame', 'tw:flex tw:h-full tw:w-full tw:flex-col tw:p-0'),
  scroller: cs(
    'notion-page-scroller',
    'tw:relative tw:flex tw:grow tw:flex-col tw:items-center',
    'tw:min-h-[calc(100vh_-_var(--notion-header-height))]'
  ),
  coverWrapper: cs(
    'notion-page-cover-wrapper',
    'tw:relative tw:flex tw:w-full tw:max-w-[1200px] tw:items-center tw:justify-center',
    'tw:h-[30vh] tw:min-h-[30vh] tw:max-h-[30vh]',
    'tw:rounded-[24px] tw:shadow-[2px_2px_8px_4px_rgba(15,15,15,0.1)]',
    'tw:max-[1200px]:rounded-none'
  ),
  // next/image `fill` sets inline width/height, hence the important sizes
  cover: cs(
    'notion-page-cover',
    'tw:block tw:p-0 tw:object-cover tw:w-full! tw:max-w-[1200px]',
    'tw:h-[30vh]! tw:min-h-[30vh]! tw:max-h-[30vh]!',
    'tw:rounded-[24px] tw:max-[1200px]:rounded-none',
    // as a lazy image: no aspect-ratio padding, and the preview stays behind
    'tw:[&.lazy-image-wrapper]:p-0! tw:[&_:is(.lazy-image-preview,.lazy-image-real)]:will-change-auto!',
    'tw:[&.lazy-image-loaded_.lazy-image-preview]:opacity-100'
  ),
  title: cs(
    'notion-title',
    'tw:mb-[20px] tw:block tw:w-full tw:text-center',
    'tw:text-[2.5em] tw:leading-[1.2] tw:font-semibold'
  ),
  content: cs('notion-page-content', 'tw:flex tw:w-full tw:flex-col'),
  article: cs(
    'notion-page-content-inner',
    'tw:relative tw:flex tw:flex-col tw:items-start'
  ),
  // the aside column is not displayed yet (the site renders its own
  // floating table of contents)
  aside: cs('notion-aside', 'tw:hidden')
}

/** The `main` element of a page, full-page or embedded. */
export function pageClassName({
  fullPage,
  fullWidth,
  smallText,
  hasCover,
  hasIcon,
  isImageIcon
}: {
  fullPage: boolean
  fullWidth: boolean
  smallText: boolean
  hasCover: boolean
  hasIcon: boolean
  isImageIcon: boolean
}) {
  return cs(
    'notion-page',
    'tw:relative tw:mx-auto tw:flex tw:shrink-0 tw:grow tw:flex-col tw:items-start',
    'tw:w-(--notion-max-width) tw:max-w-full tw:leading-[1.65]',
    'tw:pb-[max(5vh,32px)]',
    fullWidth
      ? 'tw:px-[min(96px,8vw)] tw:[--notion-max-width:min(1920px,98vw)]'
      : 'tw:px-[min(16px,8vw)]',
    'tw:max-[720px]:px-[2vw]',
    // embedded root elements set their own font size (see embeddedRootClassName)
    fullPage && smallText && 'tw:text-[14px]',
    // pages embedded via oEmbed ("lite" mode) span the full width
    'tw:[.notion-lite_&]:w-full tw:[.notion-lite_&]:px-0!',
    // vertical room for the hero icon, which overlaps the cover
    fullPage &&
      (hasCover
        ? !hasIcon
          ? 'tw:pt-[48px]'
          : isImageIcon
            ? 'tw:pt-[96px]'
            : 'tw:pt-[64px]'
        : cs(
            'tw:mt-[48px]',
            !hasIcon
              ? 'tw:pt-0'
              : isImageIcon
                ? 'tw:pt-[148px]'
                : 'tw:pt-[96px]'
          ))
  )
}

/** The large page icon shown above the title. */
export function pageIconHeroClassName({
  isImage,
  hasCover
}: {
  isImage: boolean
  hasCover: boolean
}) {
  return cs(
    'notion-page-icon-hero',
    'tw:absolute tw:left-1/2 tw:flex tw:flex-row tw:justify-center',
    isImage
      ? cs(
          'notion-page-icon-image',
          'tw:size-[124px] tw:-ml-[62px]',
          hasCover ? 'tw:-top-[62px]' : 'tw:top-0'
        )
      : cs(
          'notion-page-icon-span',
          'tw:size-[78px] tw:-ml-[39px]',
          hasCover ? 'tw:-top-[42px]' : 'tw:top-0'
        )
  )
}

export const pageIconHeroContentClassName = {
  image:
    'tw:relative tw:block tw:size-full tw:max-h-full tw:max-w-full tw:object-cover tw:rounded-full tw:shadow-[0_8px_40px_0_rgb(0_0_0/21%)]',
  span: 'tw:relative tw:block tw:ml-0 tw:font-emoji tw:text-[78px] tw:leading-[1.1] tw:text-(--fg-color-icon) tw:fill-(--fg-color-6)'
}

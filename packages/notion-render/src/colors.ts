import { cs } from './utils'

/**
 * Notion block and inline colors (`block_color` / highlight decorations).
 *
 * Each value keeps its `notion-<color>` class as a styling hook. Class strings
 * are spelled out in full so Tailwind can find them.
 */

const textColors: Record<string, string> = {
  gray: 'tw:text-notion-gray',
  brown: 'tw:text-notion-brown',
  orange: 'tw:text-notion-orange',
  yellow: 'tw:text-notion-yellow',
  teal: 'tw:text-notion-teal',
  blue: 'tw:text-notion-blue',
  purple: 'tw:text-notion-purple',
  pink: 'tw:text-notion-pink',
  red: 'tw:text-notion-red'
}

// Backgrounds render as a soft marker-style highlight in light mode: a
// gradient fading in from and out to the page background. Dark mode keeps
// the flat Notion background color.
const backgroundColors: Record<string, string> = {
  gray: 'tw:bg-notion-gray-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#cfcfcf_10.5%,#a0a0a0_85.29%,var(--bg-color))]',
  brown:
    'tw:bg-notion-brown-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#cab7ae_10.5%,#b1998d_85.29%,var(--bg-color))]',
  orange:
    'tw:bg-notion-orange-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#ffe6b1_10.5%,#ffd09b_85.29%,var(--bg-color))]',
  yellow:
    'tw:bg-notion-yellow-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#fff697_10.5%,#fdf59d_85.29%,var(--bg-color))]',
  teal: 'tw:bg-notion-teal-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#d4eabc_10.5%,#d2eabc_85.29%,var(--bg-color))]',
  blue: 'tw:bg-notion-blue-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#d9eafd_10.5%,#b3d6ff_85.29%,var(--bg-color))]',
  purple:
    'tw:bg-notion-purple-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#e4d3fd_10.5%,#d3b6ff_85.29%,var(--bg-color))]',
  pink: 'tw:bg-notion-pink-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#ffd2e7_10.5%,#ffadd3_85.29%,var(--bg-color))]',
  red: 'tw:bg-notion-red-bg tw:bg-[linear-gradient(119deg,var(--bg-color),#ffc3c3_10.5%,#fba6a3_85.29%,var(--bg-color))]'
}

// Shape of every highlighted element, inline or block. It owns the padding:
// elements with a background color must not set their own.
const highlightBox = cs(
  'tw:py-0 tw:pr-[0.5rem] tw:pl-[0.25rem] tw:box-decoration-clone',
  'tw:rounded-[0.5rem_0.5rem_0.5rem_0.125rem]',
  'tw:dark:m-0! tw:dark:bg-none'
)

// Callouts use the softer `_co` variants.
const calloutTextColors: Record<string, string> = {
  gray: 'tw:text-notion-gray',
  brown: 'tw:text-notion-brown',
  orange: 'tw:text-notion-orange',
  yellow: 'tw:text-notion-yellow',
  teal: 'tw:text-notion-teal',
  blue: 'tw:text-notion-blue',
  purple: 'tw:text-notion-purple',
  pink: 'tw:text-notion-pink',
  red: 'tw:text-notion-red'
}

const calloutBackgroundColors: Record<string, string> = {
  gray: 'tw:bg-(--notion-gray_background_co)',
  brown: 'tw:bg-(--notion-brown_background_co)',
  orange: 'tw:bg-(--notion-orange_background_co)',
  yellow: 'tw:bg-(--notion-yellow_background_co)',
  teal: 'tw:bg-(--notion-teal_background_co)',
  blue: 'tw:bg-(--notion-blue_background_co)',
  purple: 'tw:bg-(--notion-purple_background_co)',
  pink: 'tw:bg-(--notion-pink_background_co)',
  red: 'tw:bg-(--notion-red_background_co)'
}

const backgroundSuffix = '_background'

/** Whether a Notion color is a background (highlight) color. */
export function isBackgroundColor(color?: string | null): boolean {
  return !!color?.endsWith(backgroundSuffix)
}

/**
 * Whether the color renders the highlight shape, which owns the element's
 * padding (see `highlightBox`).
 */
export function hasHighlight(color?: string | null): boolean {
  return (
    isBackgroundColor(color) &&
    !!backgroundColors[color!.slice(0, -backgroundSuffix.length)]
  )
}

/** Classes for a block or inline text with the given Notion color. */
export function notionColorClassName(
  color?: string | null
): string | undefined {
  if (!color) {
    return undefined
  }

  if (isBackgroundColor(color)) {
    const background =
      backgroundColors[color.slice(0, -backgroundSuffix.length)]
    return cs(`notion-${color}`, background && cs(background, highlightBox))
  }

  return cs(`notion-${color}`, textColors[color])
}

/** Classes for a callout with the given Notion color. */
export function calloutColorClassName(
  color?: string | null
): string | undefined {
  if (!color) {
    return undefined
  }

  const utilities = isBackgroundColor(color)
    ? calloutBackgroundColors[color.slice(0, -backgroundSuffix.length)]
    : calloutTextColors[color]

  return cs(`notion-${color}_co`, utilities)
}

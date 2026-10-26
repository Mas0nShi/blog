import { cs } from './utils'

/**
 * Styles of media and embed blocks: the asset figure (images, videos,
 * iframes, tweets, PDFs), its caption, files, audio, Google Drive previews
 * and the lite YouTube player, plus inline user avatars and custom emoji.
 *
 * Sizes that come from Notion data (aspect ratio, width, alignment) stay
 * inline styles in components/asset.tsx.
 */

const wrapText = 'tw:whitespace-pre-wrap tw:[word-break:break-word]'

export function assetFigureClassName({
  type,
  fullWidth
}: {
  type: string
  fullWidth: boolean
}) {
  return cs(
    'notion-asset-wrapper',
    `notion-asset-wrapper-${type}`,
    fullWidth && 'notion-asset-wrapper-full',
    'tw:mx-0 tw:my-[1em] tw:flex tw:min-w-full tw:flex-col tw:self-center',
    fullWidth
      ? 'tw:max-w-screen'
      : type === 'image'
        ? 'tw:max-w-full'
        : 'tw:max-w-screen tw:max-[730px]:max-w-full',
    // images (incl. next/image output) fill the asset box
    'tw:[&_img]:size-full tw:[&_img]:max-h-full tw:[&_iframe]:[border:none]',
    type === 'video' && 'tw:[&>div]:w-full! tw:[&_video]:w-full!'
  )
}

export const assetCaptionClassName = cs(
  'notion-asset-caption',
  'tw:py-[6px] tw:pr-0 tw:pl-[2px] tw:text-center tw:text-[14px] tw:leading-[1.4] tw:text-fg-muted tw:caret-fg',
  wrapText
)

// iframes and players stretched over an aspect-ratio box
export const assetObjectFitClassName = cs(
  'notion-asset-object-fit',
  'tw:absolute tw:inset-0 tw:size-full tw:rounded-[1px]'
)

export const tweetClassName = cs(
  'notion-tweet',
  'tw:mx-auto tw:flex tw:max-w-[66.666%] tw:justify-center tw:select-none'
)

export const fileClassNames = {
  root: cs('notion-file', 'tw:mx-0 tw:my-[1px] tw:w-full'),
  link: cs(
    'notion-file-link',
    'tw:flex tw:items-center tw:rounded-notion tw:px-[2px] tw:py-[3px] tw:text-inherit tw:no-underline',
    'tw:transition-[background] tw:duration-[20ms] tw:ease-in tw:[&:hover]:bg-bg-hover'
  ),
  icon: cs(
    'notion-file-icon',
    'tw:mr-[2px] tw:flex tw:h-[1.35em] tw:min-h-[calc(1.5em_+_3px_+_3px)] tw:w-[1.35em] tw:shrink-0 tw:grow-0 tw:items-center tw:justify-center'
  ),
  info: cs('notion-file-info', 'tw:flex tw:items-baseline'),
  title: cs('notion-file-title', 'tw:truncate'),
  size: cs(
    'notion-file-size',
    'tw:ml-[6px] tw:truncate tw:text-[12px] tw:leading-[16px] tw:text-fg-muted'
  )
}

export const audioClassName = cs(
  'notion-audio',
  'tw:w-full tw:[&_audio]:w-full'
)

export const googleDriveClassNames = {
  root: cs(
    'notion-google-drive',
    'tw:mx-0 tw:my-[4px] tw:w-full tw:self-center'
  ),
  link: cs(
    'notion-google-drive-link',
    'tw:relative tw:flex tw:w-full tw:cursor-pointer tw:flex-col tw:rounded-[3px] tw:text-inherit tw:no-underline tw:select-none',
    'tw:[border:1px_solid_var(--fg-color-1)]',
    'tw:transition-[background] tw:duration-[20ms] tw:ease-in tw:[&:hover]:bg-bg-hover'
  ),
  preview: cs(
    'notion-google-drive-preview',
    'tw:relative tw:block tw:w-full tw:overflow-hidden tw:pb-[55%]',
    'tw:[&_img]:absolute tw:[&_img]:inset-0 tw:[&_img]:w-full tw:[&_img]:object-cover tw:[&_img]:object-top'
  ),
  body: cs(
    'notion-google-drive-body',
    'tw:min-h-[60px] tw:w-full tw:overflow-hidden tw:px-[14px] tw:pt-[12px] tw:pb-[14px]',
    'tw:[border-top:1px_solid_var(--fg-color-1)]'
  ),
  title: cs(
    'notion-google-drive-body-title',
    'tw:mb-[2px] tw:truncate tw:text-[14px] tw:leading-[20px]'
  ),
  source: cs(
    'notion-google-drive-body-source',
    'tw:mt-[6px] tw:flex tw:items-center'
  ),
  sourceIcon: cs(
    'notion-google-drive-body-source-icon',
    'tw:mr-[6px] tw:size-[16px] tw:shrink-0 tw:bg-cover'
  ),
  sourceDomain: cs(
    'notion-google-drive-body-source-domain',
    'tw:truncate tw:text-[12px] tw:leading-[16px]'
  )
}

export const userAvatarClassName = cs(
  'notion-user',
  'tw:block tw:size-[20px] tw:rounded-full tw:object-cover'
)

export const customEmojiClassName = cs(
  'notion-custom-emoji',
  'tw:inline-block tw:size-[20px] tw:object-contain tw:align-middle'
)

// lite YouTube player: poster + play button until the iframe is requested

// darkens the top of the poster behind the title bar
export const youTubeTopShadow =
  'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADGCAYAAAAT+OqFAAAAdklEQVQoz42QQQ7AIAgEF/T/D+kbq/RWAlnQyyazA4aoAB4FsBSA/bFjuF1EOL7VbrIrBuusmrt4ZZORfb6ehbWdnRHEIiITaEUKa5EJqUakRSaEYBJSCY2dEstQY7AuxahwXFrvZmWl2rh4JZ07z9dLtesfNj5q0FU3A5ObbwAAAABJRU5ErkJggg==)'

export const youTubePlayButton = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 68 48"><path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="red"/><path d="M45 24 27 14v20" fill="white"/></svg>')`

export function youTubeClassNames(initialized: boolean) {
  const hiddenOnceInitialized =
    initialized && 'tw:pointer-events-none tw:opacity-0'

  return {
    root: cs(
      'notion-yt-lite',
      'tw:absolute tw:block tw:size-full tw:bg-black tw:bg-cover tw:bg-center tw:[contain:content]',
      initialized ? 'tw:cursor-[unset]' : 'tw:cursor-pointer'
    ),
    shadow: cs(
      'tw:absolute tw:top-0 tw:block tw:h-[60px] tw:w-full tw:pb-[50px] tw:bg-top tw:bg-repeat-x',
      'tw:transition-all tw:duration-200 tw:ease-[cubic-bezier(0,0,0.2,1)]',
      hiddenOnceInitialized
    ),
    thumbnail: cs(
      'notion-yt-thumbnail',
      'tw:absolute tw:inset-0 tw:size-full tw:object-cover'
    ),
    playButton: cs(
      'notion-yt-playbtn',
      'tw:absolute tw:top-1/2 tw:left-1/2 tw:z-1 tw:h-[48px] tw:w-[68px] tw:cursor-pointer tw:[border:none] tw:bg-transparent',
      'tw:[transform:translate3d(-50%,-50%,0)] tw:grayscale tw:transition-[filter] tw:duration-100 tw:ease-[cubic-bezier(0,0,0.2,1)]',
      'tw:[.notion-yt-lite:hover>&]:filter-none',
      hiddenOnceInitialized
    ),
    iframe: 'tw:absolute tw:top-0 tw:left-0 tw:size-full'
  }
}

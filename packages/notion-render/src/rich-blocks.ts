import { notionColorClassName } from './colors'
import { cs } from './utils'

/**
 * Styles of rich content blocks: code (incl. mermaid), equations, bookmarks,
 * GitHub embeds and link-mention previews.
 *
 * Prism token colors and KaTeX internals style third-party markup and stay
 * in CSS.
 */

const monoFont =
  "tw:font-['SFMono-Regular',Consolas,'Liberation_Mono',Menlo,Courier,monospace]"

export const codeClassNames = {
  wrapper: 'tw:relative tw:w-full',
  block: cs(
    'notion-code',
    'tw:mx-0 tw:my-[4px] tw:box-border tw:block tw:overflow-x-auto tw:rounded-[0.375rem] tw:p-[1.5em]',
    'tw:text-[length:85%] tw:whitespace-pre tw:[tab-size:2] tw:[overflow-wrap:break-word]',
    monoFont,
    'tw:bg-[rgba(249,250,251,1)] tw:[border:1px_solid_rgba(229,231,235,1)]',
    'tw:dark:bg-[rgba(17,24,39,1)] tw:dark:[border-color:rgba(55,65,81,1)]',
    // scrollable, but without a visible scrollbar
    'tw:[scrollbar-width:none] tw:[-ms-overflow-style:none] tw:[&::-webkit-scrollbar]:hidden'
  ),
  // copy button, revealed while hovering the block
  copy: cs(
    'notion-code-copy',
    'tw:absolute tw:top-[1em] tw:right-[1em] tw:z-9 tw:opacity-0 tw:select-none',
    'tw:transition-opacity tw:duration-200 tw:ease-[cubic-bezier(0.3,0,0.5,1)]',
    'tw:[.notion-code:hover_&]:opacity-100'
  ),
  copyButton: cs(
    'notion-code-copy-button',
    'tw:inline-block tw:cursor-pointer tw:rounded-[6px] tw:p-[0.6em] tw:text-[1.25em] tw:leading-[1em]',
    'tw:[transition:background-color_0.2s_cubic-bezier(0.3,0,0.5,1),color_0.2s_cubic-bezier(0.3,0,0.5,1),border-color_0.2s_cubic-bezier(0.3,0,0.5,1)]',
    'tw:shadow-[0_1px_0_rgba(27,31,36,0.04),inset_0_1px_0_rgba(255,255,255,0.25)]',
    'tw:bg-[#f6f8fa] tw:text-[#24292f] tw:[border:1px_solid_rgba(27,31,36,0.15)]',
    'tw:[&:hover]:bg-[#f3f4f6] tw:[&:hover]:[transition-duration:0.1s]',
    'tw:[&:active]:bg-[hsla(220,14%,93%,1)] tw:[&:active]:[transition:none]',
    'tw:dark:bg-[#24292f] tw:dark:text-[#f6f8fa] tw:dark:[border-color:var(--bg-color-0)]',
    'tw:dark:[&:hover]:bg-[#24292f] tw:dark:[&:active]:bg-[hsla(220,14%,23%,1)]',
    'tw:[&_svg]:block'
  ),
  tooltip: cs(
    'notion-code-copy-tooltip',
    'tw:pointer-events-none tw:absolute tw:bottom-[-38px] tw:left-0 tw:z-99 tw:flex tw:w-full tw:flex-row tw:justify-center tw:text-[14px]'
  ),
  tooltipLabel:
    'tw:rounded-[6px] tw:bg-[#222] tw:px-[8px] tw:py-[6px] tw:text-white',
  mermaid:
    'tw:flex tw:items-center tw:justify-center tw:leading-[1.16] tw:select-none'
}

export function equationClassName(inline: boolean) {
  return cs(
    'notion-equation',
    'tw:relative tw:rounded-[3px] tw:text-inherit tw:fill-inherit tw:[&:hover]:bg-bg-hover',
    inline
      ? 'notion-equation-inline tw:inline-flex tw:select-all tw:transition-[background] tw:duration-[20ms] tw:ease-in'
      : cs(
          'notion-equation-block',
          'tw:mx-0 tw:my-[4px] tw:flex tw:w-full tw:max-w-full tw:cursor-pointer tw:flex-col tw:items-center tw:overflow-visible tw:px-[8px] tw:py-[4px] tw:select-none',
          'tw:transition-[background] tw:duration-100 tw:ease-in-out'
        )
  )
}

export function bookmarkClassName(color?: string | null) {
  return cs(
    'notion-bookmark',
    notionColorClassName(color),
    'tw:mx-0 tw:my-[4px] tw:box-border tw:flex tw:w-full tw:overflow-hidden tw:rounded-notion tw:no-underline tw:select-none',
    'tw:[border:1px_solid_var(--fg-color-1)] tw:dark:[border-color:var(--bg-color-0)]',
    'tw:[&:hover]:[border-image:linear-gradient(90.68deg,#b439df_0.26%,#e5337e_102.37%)_1]'
  )
}

export const bookmarkClassNames = {
  body: 'tw:flex-[4_1_180px] tw:overflow-hidden tw:px-[14px] tw:pt-[12px] tw:pb-[14px] tw:text-left tw:text-fg',
  title: cs(
    'notion-bookmark-title',
    'tw:mb-[2px] tw:min-h-[24px] tw:truncate tw:text-[14px] tw:leading-[20px]'
  ),
  description: cs(
    'notion-bookmark-description',
    'tw:h-[32px] tw:overflow-hidden tw:text-[12px] tw:leading-[16px] tw:opacity-80'
  ),
  link: cs('notion-bookmark-link', 'tw:mt-[6px] tw:flex'),
  linkIcon: cs(
    'notion-bookmark-link-icon',
    'tw:relative tw:mr-[6px] tw:size-[16px] tw:min-w-[16px] tw:[&_img]:max-h-full tw:[&_img]:max-w-full'
  ),
  linkText: cs(
    'notion-bookmark-link-text',
    'tw:truncate tw:text-[12px] tw:leading-[16px] tw:text-fg'
  ),
  // cover image; dropped on narrow screens and inside columns
  image: cs(
    'notion-bookmark-image',
    'tw:relative tw:flex-[1_1_180px] tw:[&>*]:absolute! tw:[&>*]:size-full',
    'tw:[&_.lazy-image-wrapper]:h-full tw:[&_.lazy-image-wrapper]:p-0!',
    'tw:[@media(max-width:640px)]:hidden tw:[.notion-column_&]:hidden'
  )
}

const githubIconBadge =
  'tw:rounded-full tw:bg-(--notion-github-bg-icon) tw:text-(--notion-github-icon) tw:[transform:translate3d(0,0,0)]'

export const externalClassNames = {
  link: (inline: boolean) =>
    cs(
      'notion-external',
      'tw:rounded-[4px] tw:no-underline tw:transition-[background] tw:duration-[120ms] tw:ease-in tw:[&:hover]:bg-bg-hover',
      inline
        ? 'notion-external-mention tw:inline-flex tw:min-w-[1px] tw:flex-[1_1_0px] tw:flex-col'
        : 'notion-external-block tw:mt-[4px] tw:flex tw:w-full tw:px-[12px] tw:py-[8px] tw:select-none tw:[border:1px_solid_var(--bg-color-0)]'
    ),
  mentionFlex: cs('notion-external-mention-flex', 'tw:flex'),
  mentionWrap: cs(
    'notion-external-mention-wrap',
    'tw:w-full tw:max-w-full tw:px-[2px] tw:py-[3px] tw:text-start tw:whitespace-pre-wrap tw:[word-break:break-word] tw:caret-(--fg-color-3)'
  ),
  mentionImageLeft: cs(
    'notion-external-mention-image-left',
    'tw:mr-[0.3em] tw:size-[1em] tw:align-[-0.15em] tw:select-none',
    githubIconBadge
  ),
  mentionImageRight: cs(
    'notion-external-mention-image-right',
    'tw:ml-[0.3em] tw:size-[1em] tw:rounded-[4px] tw:align-[-0.15em] tw:select-none'
  ),
  mentionText: cs(
    'notion-external-mention-text',
    'tw:shrink-0 tw:font-medium tw:[border-bottom:0.05em_solid_var(--fg-color-3)]'
  ),
  blockImage: cs(
    'notion-external-block-image',
    'tw:relative tw:mt-[6px] tw:mr-[12px] tw:mb-[5px] tw:ml-[4px] tw:flex tw:size-[32px] tw:self-start'
  ),
  avatar: cs(
    'notion-external-block-avatar',
    'tw:block tw:size-[30.192px] tw:rounded-[34px] tw:object-cover tw:shadow-[rgba(15,15,15,0.1)_0px_2px_4px] tw:transition-opacity tw:duration-100 tw:ease-out'
  ),
  avatarPlaceholder: cs(
    'notion-external-block-avatar-placeholder',
    'tw:block tw:size-[30.192px] tw:rounded-[34px] tw:bg-bg-hover tw:object-cover tw:shadow-[rgba(15,15,15,0.1)_0px_2px_4px] tw:transition-opacity tw:duration-100 tw:ease-out'
  ),
  githubIcon: cs(
    'notion-external-block-github-icon',
    'tw:absolute tw:right-[-2px] tw:bottom-[-2px] tw:size-[14.208px]',
    githubIconBadge
  ),
  description: cs(
    'notion-external-block-description',
    'tw:flex tw:shrink tw:grow tw:flex-col tw:justify-center tw:overflow-hidden'
  ),
  titleWrap: cs(
    'notion-external-block-title-wrap',
    'tw:flex tw:items-baseline tw:text-[14px]'
  ),
  title: cs(
    'notion-external-block-title',
    'tw:truncate tw:font-medium tw:text-fg-strong'
  ),
  itemWrap: cs(
    'notion-external-block-item-wrap',
    'tw:flex tw:items-center tw:text-[12px] tw:text-fg-muted'
  ),
  item: cs('notion-external-block-item', 'tw:whitespace-nowrap')
}

export const linkMentionClassNames = {
  root: cs(
    'notion-link-mention',
    'tw:relative tw:inline-flex tw:items-center tw:align-middle'
  ),
  link: cs(
    'notion-link-mention-link',
    'tw:inline-flex tw:items-center tw:gap-[0.5rem]'
  ),
  icon: cs(
    'notion-link-mention-icon',
    'tw:size-[1.5rem] tw:rounded-[0.375rem]'
  ),
  provider: cs('notion-link-mention-provider', 'tw:text-[0.875rem] tw:text-fg'),
  title: cs(
    'notion-link-mention-title',
    'tw:text-[0.875rem] tw:font-semibold tw:text-fg'
  ),
  // preview card, shown while hovering the mention
  preview: cs(
    'notion-link-mention-preview',
    'tw:absolute tw:top-full tw:left-0 tw:z-(--z-popover) tw:mt-[0.5rem] tw:hidden',
    'tw:[.notion-link-mention:hover_&]:block'
  ),
  card: cs(
    'notion-link-mention-card',
    'tw:h-[15rem] tw:w-[18rem] tw:overflow-hidden tw:rounded-[0.75rem] tw:bg-bg',
    'tw:[border:1px_solid_rgba(27,31,36,0.15)] tw:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]'
  ),
  thumbnail: cs(
    'notion-link-mention-preview-thumbnail',
    'tw:h-[55%] tw:w-full tw:object-cover'
  ),
  content: cs(
    'notion-link-mention-preview-content',
    'tw:flex tw:h-[45%] tw:flex-col tw:gap-[0.125rem] tw:px-[1rem] tw:py-[0.5rem]'
  ),
  previewTitle: cs(
    'notion-link-mention-preview-title',
    'tw:m-0 tw:text-[0.875rem] tw:font-bold tw:text-fg'
  ),
  description: cs(
    'notion-link-mention-preview-description',
    'tw:m-0 tw:line-clamp-2 tw:text-[0.875rem] tw:text-fg'
  ),
  footer: cs(
    'notion-link-mention-preview-footer',
    'tw:mt-auto tw:flex tw:items-center tw:gap-[0.375rem] tw:pb-[0.5rem]'
  ),
  previewIcon: cs(
    'notion-link-mention-preview-icon',
    'tw:size-[1rem] tw:rounded-[0.25rem]'
  ),
  previewProvider: cs(
    'notion-link-mention-preview-provider',
    'tw:text-[0.875rem] tw:text-fg-subtle'
  )
}

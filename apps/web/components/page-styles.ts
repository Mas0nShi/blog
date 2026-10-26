import cs from 'classnames'

/** Full-viewport centered layout of the loading, 404 and error pages. */
export const statusPageClassNames = {
  container: cs(
    'tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:p-[2vmin]',
    'tw:bg-bg tw:text-[16px] tw:leading-[1.5] tw:text-fg tw:caret-fg',
    "tw:font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Helvetica,'Apple_Color_Emoji',Arial,sans-serif,'Segoe_UI_Emoji','Segoe_UI_Symbol']"
  ),
  main: 'tw:flex tw:flex-col tw:items-center tw:justify-center',
  image: 'tw:w-[640px] tw:max-w-full'
}

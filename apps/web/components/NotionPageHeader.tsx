import type * as types from 'notion-types'
import cs from 'classnames'
import {
  Breadcrumbs,
  Header,
  headerClassNames,
  Search,
  useNotionContext
} from 'notion-render'
import * as React from 'react'

import { isSearchEnabled, navigationLinks, navigationStyle } from '@/lib/config'
import { MoonIcon } from '@/lib/icons/moon'
import { SunIcon } from '@/lib/icons/sun'
import { useDarkMode } from '@/lib/use-dark-mode'

function ToggleThemeButton() {
  const { hasMounted, isDarkMode, toggleDarkMode } = useDarkMode()

  const onToggleTheme = React.useCallback(() => {
    toggleDarkMode()
  }, [toggleDarkMode])

  return (
    <div
      className={cs(
        headerClassNames.breadcrumb,
        headerClassNames.button,
        !hasMounted && 'tw:invisible'
      )}
      onClick={onToggleTheme}
    >
      {hasMounted && isDarkMode ? <MoonIcon /> : <SunIcon />}
    </div>
  )
}

export function NotionPageHeader({
  block
}: {
  block: types.CollectionViewPageBlock | types.PageBlock
}) {
  const { components, mapPageUrl } = useNotionContext()

  if (navigationStyle === 'default') {
    return <Header block={block} />
  }

  return (
    <header className={headerClassNames.header}>
      <div className={headerClassNames.nav}>
        <Breadcrumbs block={block} rootOnly={true} />

        <div
          className={cs(
            'notion-nav-header-rhs',
            headerClassNames.breadcrumbs,
            'tw:gap-[0.5rem]'
          )}
        >
          {navigationLinks
            ?.map((link, index) => {
              if (!link?.pageId && !link?.url) {
                return null
              }

              if (link.pageId) {
                return (
                  <components.PageLink
                    href={mapPageUrl(link.pageId)}
                    key={index}
                    className={cs(
                      headerClassNames.breadcrumb,
                      headerClassNames.button
                    )}
                  >
                    {link.title}
                  </components.PageLink>
                )
              } else {
                return (
                  <components.Link
                    href={link.url}
                    key={index}
                    className={cs(
                      headerClassNames.breadcrumb,
                      headerClassNames.button
                    )}
                  >
                    {link.title}
                  </components.Link>
                )
              }
            })
            .filter(Boolean)}

          <ToggleThemeButton />

          {isSearchEnabled && <Search block={block} title={null} />}
        </div>
      </div>
    </header>
  )
}

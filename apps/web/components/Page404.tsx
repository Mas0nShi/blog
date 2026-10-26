'use client'

import { usePathname } from 'next/navigation'

import type * as types from '@/lib/types'

import { statusPageClassNames } from './page-styles'

export function Page404({ pageId, error }: types.PageProps) {
  const pathname = usePathname()
  const missingPageId = pageId || pathname?.replace(/^\//, '')

  return (
    <div className={statusPageClassNames.container}>
      <main className={statusPageClassNames.main}>
        <h1>似乎不存在这个页面 🤔</h1>

        {error ? (
          <p>{error.message}</p>
        ) : (
          missingPageId && <p>Page Id 不存在 / 已删除或移动。</p>
        )}

        <img
          src='/404.png'
          alt='404 Not Found'
          className={statusPageClassNames.image}
        />
      </main>
    </div>
  )
}

// all global CSS, in explicit cascade layers (see styles/index.css)
import '@/styles/index.css'

import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import * as config from '@/lib/config'

import { Providers } from './providers'

export const metadata: Metadata = {
  metadataBase: new URL(config.host),
  title: config.name,
  description: config.description,
  manifest: '/manifest.json',
  icons: {
    shortcut: '/favicon.ico',
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
        sizes: '32x32'
      }
    ]
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black'
  },
  alternates: {
    types: {
      'application/rss+xml': [
        {
          url: '/feed',
          title: config.name
        }
      ]
    }
  },
  openGraph: {
    type: 'website',
    siteName: config.name,
    title: config.name,
    description: config.description
  },
  twitter: {
    card: 'summary',
    creator: config.twitter ? `@${config.twitter}` : undefined,
    title: config.name,
    description: config.description
  },
  other: {
    'mobile-web-app-capable': 'yes'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: '#fefffe'
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: '#2d3439'
    }
  ]
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={config.language} suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

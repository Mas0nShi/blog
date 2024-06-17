// global styles shared across the entire site
import * as React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'

// google analytics
import ReactGA from 'react-ga4'

import * as Fathom from 'fathom-client'
// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
import posthog from 'posthog-js'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import '@/baseline/styles.css'
import 'styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'
// global style overrides for waline (optional)
import 'styles/waline.css'
// global style overrides for notion
import 'styles/notion.css'

import {
  fathomConfig,
  fathomId,
  posthogConfig,
  posthogId,
  googleAnalyticsId
} from '@/lib/config'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()


  React.useEffect(() => {
    function onRouteChangeComplete() {

      if (googleAnalyticsId) {
        ReactGA.send('pageview')
      }

      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    if (googleAnalyticsId) {
      ReactGA.initialize(googleAnalyticsId)
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeComplete', onRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', onRouteChangeComplete)
    }
  }, [router.events])

  return <Component {...pageProps} />
}

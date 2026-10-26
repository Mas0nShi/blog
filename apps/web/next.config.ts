import type { NextConfig } from 'next'

import { optimizedImageHosts } from './lib/optimized-image-hosts'

export default {
  staticPageGenerationTimeout: 300,
  images: {
    remotePatterns: optimizedImageHosts.map((hostname) => ({
      protocol: 'https' as const,
      hostname
    })),
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // workspace packages export their TypeScript sources directly
  // See https://react-tweet.vercel.app/next#troubleshooting for react-tweet
  transpilePackages: [
    'notion-client',
    'notion-compat',
    'notion-render',
    'notion-types',
    'notion-utils',
    'react-tweet'
  ]
} satisfies NextConfig

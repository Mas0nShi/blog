import Image, { type ImageProps } from 'next/image'

import { isOptimizedImageSrc } from '@/lib/optimized-image-hosts'

/**
 * `next/image` that falls back to an unoptimized image for hosts outside of
 * `images.remotePatterns`, which `/_next/image` would otherwise reject.
 */
export function NotionImage(props: ImageProps) {
  const { src, unoptimized } = props

  return (
    <Image
      {...props}
      unoptimized={
        unoptimized || (typeof src === 'string' && !isOptimizedImageSrc(src))
      }
    />
  )
}

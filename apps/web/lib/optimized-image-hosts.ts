/**
 * Hosts whose images are served through Next.js image optimization.
 *
 * Images from any other host (e.g. avatars on the links page) are rendered
 * unoptimized, straight from their origin, instead of being rejected by
 * `/_next/image` with a 400.
 */
export const optimizedImageHosts = [
  'www.notion.so',
  'notion.so',
  'app.notion.com',
  'file.notion.com',
  'images.unsplash.com',
  'abs.twimg.com',
  'pbs.twimg.com',
  's3.us-west-2.amazonaws.com',
  'img.notionusercontent.com'
]

const optimizedImageHostSet = new Set(optimizedImageHosts)

/** Whether `next/image` can optimize this src under the configured hosts. */
export function isOptimizedImageSrc(src: string): boolean {
  // relative and data URLs don't go through remotePatterns
  if (!/^https?:\/\//i.test(src)) {
    return true
  }

  try {
    const url = new URL(src)
    return url.protocol === 'https:' && optimizedImageHostSet.has(url.hostname)
  } catch {
    return false
  }
}

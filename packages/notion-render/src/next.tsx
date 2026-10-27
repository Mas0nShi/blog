import React from 'react'
import isEqual from 'react-fast-compare'

// One wrapper per wrapped component: a new wrapper is a new component type,
// and React would remount every image or link that uses it. Wrappers are
// also returned as-is, since nested context providers pass them back in.
const imageWrappers = new WeakMap<object, React.FC<any>>()
const linkWrappers = new WeakMap<object, React.FC<any>>()
const wrappers = new WeakSet<object>()

export const wrapNextImage = (NextImage: any): React.FC<any> => {
  if (wrappers.has(NextImage)) return NextImage
  let wrapper = imageWrappers.get(NextImage)
  if (!wrapper) {
    wrapper = createNextImage(NextImage)
    imageWrappers.set(NextImage, wrapper)
    wrappers.add(wrapper)
  }
  return wrapper
}

function createNextImage(NextImage: any): React.FC<any> {
  return React.memo(function ReactNotionXNextImage({
    src,
    alt = '',

    width,
    height,

    className,

    fill,
    preload,
    priority,
    loading,

    ...rest
  }) {
    const hasIntrinsicSize =
      typeof width === 'number' &&
      width > 0 &&
      typeof height === 'number' &&
      height > 0
    const shouldFill = fill ?? !hasIntrinsicSize
    const shouldPreload = preload ?? priority

    return (
      <NextImage
        className={className}
        src={src}
        alt={alt}
        width={shouldFill ? undefined : width}
        height={shouldFill ? undefined : height}
        fill={shouldFill}
        preload={shouldPreload || undefined}
        loading={shouldPreload ? undefined : loading}
        {...rest}
      />
    )
  }, isEqual)
}

export function wrapNextLink(NextLink: any): React.FC<any> {
  if (wrappers.has(NextLink)) return NextLink
  let wrapper = linkWrappers.get(NextLink)
  if (!wrapper) {
    wrapper = createNextLink(NextLink)
    linkWrappers.set(NextLink, wrapper)
    wrappers.add(wrapper)
  }
  return wrapper
}

function createNextLink(NextLink: any): React.FC<any> {
  return function ReactNotionXNextLink({
    href,
    as,
    passHref,
    prefetch,
    replace,
    scroll,
    shallow,
    locale,
    ...linkProps
  }: any) {
    return (
      <NextLink
        href={href}
        as={as}
        passHref={passHref}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        locale={locale}
        legacyBehavior
      >
        <a {...linkProps} />
      </NextLink>
    )
  }
}

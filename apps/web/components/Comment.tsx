import {
  init,
  type WalineInitOptions,
  type WalineInstance
} from '@waline/client'
import React, { useEffect, useRef } from 'react'

import styles from './styles.module.css'

export type WalineOptions = Omit<WalineInitOptions, 'el'> & { path: string }

// Only `path` and `dark` are synced after mount; other options are read once on init.
export function Waline(props: WalineOptions) {
  const walineInstanceRef = useRef<WalineInstance | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const initPropsRef = useRef(props)
  const { path, dark } = props

  useEffect(() => {
    const instance = init({
      ...initPropsRef.current,
      el: containerRef.current
    })
    walineInstanceRef.current = instance

    return () => {
      instance?.destroy()
      walineInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const initProps = initPropsRef.current
    if (path === initProps.path && dark === initProps.dark) {
      return
    }

    initPropsRef.current = { ...initProps, path, dark }
    walineInstanceRef.current?.update({ path, dark })
  }, [path, dark])

  return <div ref={containerRef} className={styles.comments} />
}

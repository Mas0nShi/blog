import { useCallback, useRef, useState } from 'react'

/**
 * 带延迟关闭的布尔状态 hook
 * 用于 hover 和 visibility 等需要延迟切换的场景
 */
export function useDelayedBoolean(closeDelay = 0) {
  const [value, setValue] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const setTrue = useCallback(() => {
    clearPendingTimeout()
    setValue(true)
  }, [clearPendingTimeout])

  const setFalse = useCallback(() => {
    clearPendingTimeout()
    if (closeDelay > 0) {
      timeoutRef.current = window.setTimeout(() => {
        setValue(false)
      }, closeDelay)
    } else {
      setValue(false)
    }
  }, [clearPendingTimeout, closeDelay])

  return { value, setTrue, setFalse, clearPendingTimeout }
}

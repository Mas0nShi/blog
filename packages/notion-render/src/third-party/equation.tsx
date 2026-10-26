import Katex from '@matejmazur/react-katex'
import { type EquationBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'

import { useNotionContext } from '../context'
import { equationClassName } from '../rich-blocks'
import { cs } from '../utils'

const katexSettings = {
  throwOnError: false,
  strict: false
}

export function Equation({
  block,
  math,
  inline = false,
  className,
  ...rest
}: {
  block: EquationBlock
  math?: string
  inline?: boolean
  className?: string
}) {
  const { recordMap } = useNotionContext()
  math = math || getBlockTitle(block, recordMap)
  if (!math) return null

  return (
    <div
      // tabIndex={0}
      className={cs(equationClassName(inline), className)}
    >
      <Katex math={math} settings={katexSettings} {...rest} />
    </div>
  )
}

// eslint-disable-next-line import/no-duplicates
import 'prismjs'
import 'prismjs/components/prism-clike.min.js'
import 'prismjs/components/prism-css-extras.min.js'
import 'prismjs/components/prism-css.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-js-extras.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-jsx.min.js'
import 'prismjs/components/prism-tsx.min.js'
import 'prismjs/components/prism-typescript.min.js'

import copyToClipboard from 'clipboard-copy'
import mermaid from 'mermaid'
// eslint-disable-next-line import/no-duplicates, no-duplicate-imports
import prism from 'prismjs'
import React from 'react'

import { type CodeBlock } from '@/notion-types'
import { getBlockTitle } from '@/notion-utils'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import CopyIcon from '../icons/copy'
import { cs } from '../utils'

export function Code({
  block,
  defaultLanguage = 'typescript',
  className
}: {
  block: CodeBlock
  defaultLanguage?: string
  className?: string
}) {
  const [isCopied, setIsCopied] = React.useState(false)
  const copyTimeout = React.useRef<number | undefined>(undefined)
  const { recordMap, darkMode } = useNotionContext()
  const content = getBlockTitle(block, recordMap)
  const language = (() => {
    const languageNotion = (
      block.properties?.language?.[0]?.[0] || defaultLanguage
    ).toLowerCase()

    switch (languageNotion) {
      case 'c++':
        return 'cpp'
      case 'f#':
        return 'fsharp'
      default:
        return languageNotion
    }
  })()
  const caption = block.properties.caption


  const codeRef = React.useRef<HTMLElement | null>(null)
  React.useEffect(() => {
    if (codeRef.current) {
      if (language === 'mermaid') {
        const mermaidRender = async () => {
          mermaid.initialize({
            startOnLoad: true,
            theme: darkMode ? 'dark' : 'neutral',
            themeVariables: {
              // fontSize: '14px'
            },
            fontFamily: `SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;`,
            htmlLabels: true,
            securityLevel: "strict"
          })

          const { svg, bindFunctions } = await mermaid.render(`mermaid-${block.id}`, content)
          codeRef.current.innerHTML = svg;
          bindFunctions?.(codeRef.current)
        }
        mermaidRender().catch((err) => {
          console.error('mermaid render error', err)
        });
      } else {
        try {
          prism.highlightElement(codeRef.current)
        } catch (err) {
          console.warn('prismjs highlight error', err)
        }
      }
    }
  }, [codeRef, language, darkMode])

  const onClickCopyToClipboard = React.useCallback(() => {
    void copyToClipboard(content)
    setIsCopied(true)

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current)
      copyTimeout.current = undefined
    }

    copyTimeout.current = setTimeout(() => {
      setIsCopied(false)
    }, 1200) as unknown as number
  }, [content, copyTimeout])

  const copyButton = (
    <div className='notion-code-copy-button' onClick={onClickCopyToClipboard}>
      <CopyIcon />
    </div>
  )

  return (
    <>
    <div style={{position: 'relative', width: '100%'}}>
      <div className={cs('notion-code', className)}>
        <div className='notion-code-copy'>
          {copyButton}

          {isCopied && (
            <div className='notion-code-copy-tooltip'>
              <div>{isCopied ? 'Copied' : 'Copy'}</div>
            </div>
          )}
        </div>

        <div className={`language-${language}`} ref={codeRef as any}>
          {content}
        </div>
      </div>

      {caption && (
        <figcaption className='notion-asset-caption'>
          <Text value={caption} block={block} />
        </figcaption>
      )}
    </div>
    </>
  )
}
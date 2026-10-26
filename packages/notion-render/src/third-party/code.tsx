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
import { type CodeBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
// eslint-disable-next-line import/no-duplicates, no-duplicate-imports
import prism from 'prismjs'
import React from 'react'

import { Text } from '../components/text'
import { useNotionContext } from '../context'
import CopyIcon from '../icons/copy'
import { assetCaptionClassName } from '../media'
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

  // Highlight during render instead of mutating React-owned DOM afterwards:
  // re-renders (theme switch, copy state) used to reset it to plain text.
  const highlighted = React.useMemo(() => {
    const grammar = prism.languages[language]
    if (language === 'mermaid' || !grammar) {
      return undefined
    }

    try {
      return prism.highlight(content, grammar, language)
    } catch (err) {
      console.warn('prismjs highlight error', err)
      return undefined
    }
  }, [content, language])

  const [mermaidSvg, setMermaidSvg] = React.useState<string>()
  const mermaidRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    if (language !== 'mermaid') {
      return
    }

    let cancelled = false
    const mermaidRender = async () => {
      mermaid.initialize({
        startOnLoad: false,
        theme: darkMode ? 'dark' : 'neutral',
        fontFamily: `SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;`,
        htmlLabels: true,
        securityLevel: 'strict'
      })

      const { svg, bindFunctions } = await mermaid.render(
        `mermaid-${block.id}`,
        content
      )
      if (cancelled) {
        return
      }

      setMermaidSvg(svg)
      // bind after React has committed the svg
      requestAnimationFrame(() => {
        if (!cancelled && mermaidRef.current) {
          bindFunctions?.(mermaidRef.current)
        }
      })
    }

    mermaidRender().catch((err) => {
      console.error('mermaid render error', err)
    })

    return () => {
      cancelled = true
    }
  }, [language, darkMode, block.id, content])

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
      <div style={{ position: 'relative', width: '100%' }}>
        <div className={cs('notion-code', className)}>
          <div className='notion-code-copy'>
            {copyButton}

            {isCopied && (
              <div className='notion-code-copy-tooltip'>
                <div>{isCopied ? 'Copied' : 'Copy'}</div>
              </div>
            )}
          </div>

          {language === 'mermaid' ? (
            <div
              className={`language-${language}`}
              ref={mermaidRef}
              {...(mermaidSvg
                ? { dangerouslySetInnerHTML: { __html: mermaidSvg } }
                : { children: content })}
            />
          ) : highlighted === undefined ? (
            <div className={`language-${language}`}>{content}</div>
          ) : (
            <div
              className={`language-${language}`}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          )}
        </div>

        {caption && (
          <figcaption className={assetCaptionClassName}>
            <Text value={caption} block={block} />
          </figcaption>
        )}
      </div>
    </>
  )
}

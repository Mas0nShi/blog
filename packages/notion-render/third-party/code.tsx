import * as React from 'react'

import copyToClipboard from 'clipboard-copy'
import { CodeBlock } from '@/notion-types'
import { getBlockTitle } from '@/notion-utils'
import { highlightElement } from 'prismjs'
import 'prismjs/components/prism-clike.min.js'
import 'prismjs/components/prism-css-extras.min.js'
import 'prismjs/components/prism-css.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-js-extras.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-jsx.min.js'
import 'prismjs/components/prism-tsx.min.js'
import 'prismjs/components/prism-typescript.min.js'
import mermaid from 'mermaid'


import { Text } from '../components/text'
import { useNotionContext } from '../context'
import CopyIcon from '../icons/copy'
import { cs } from '../utils'
import { sv } from 'date-fns/locale'

export const Code: React.FC<{
  block: CodeBlock
  defaultLanguage?: string
  className?: string
}> = ({ block, defaultLanguage = 'typescript', className}) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const copyTimeout = React.useRef<number>()
  const { recordMap, darkMode: isDarkMode } = useNotionContext()
  const content = getBlockTitle(block, recordMap)
  /* Fixes https://github.com/NotionX/react-notion-x/issues/220 */
  const language = (() => {
    const languageFromNotion = (block.properties?.language?.[0]?.[0] || defaultLanguage
  ).toLowerCase()
    switch (languageFromNotion) {
      case "c++":
        return "cpp";
      case "f#":
        return "fsharp";
      default:
        return languageFromNotion;
    }
  })();

  const caption = block.properties.caption


  const codeRef = React.useRef()

  React.useEffect(() => {
    if (codeRef.current) {
      if (language === 'mermaid') {

        const mermaidRender = async () => {
          mermaid.initialize({
            startOnLoad: true,
            theme: isDarkMode ? 'dark' : 'neutral',
            themeVariables: {
              // fontSize: '14px'
            },
            fontFamily: `SFMono-Regular, Consolas, 'Liberation Mono', Menlo, Courier, monospace;`,
            htmlLabels: true,
            securityLevel: "strict"
          })

          const { svg } = await mermaid.render(`mermaid-${block.id}`, content)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          codeRef.current.innerHTML = svg; // todo: fix this
        }
        mermaidRender().catch((err)=>{
          console.error('mermaid render error', err)
        });

      } else {
        try {
          highlightElement(codeRef.current)
        } catch (err) {
          console.warn('prismjs highlight error', err)
        }
      }
    }
  }, [codeRef, language, isDarkMode])

  const onClickCopyToClipboard = React.useCallback(() => {
    copyToClipboard(content)
    setIsCopied(true)

    if (copyTimeout.current) {
      clearTimeout(copyTimeout.current)
      copyTimeout.current = null
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
      <pre className={cs('notion-code', className)}>
        <div className='notion-code-copy'>
          {copyButton}

          {isCopied && (
            <div className='notion-code-copy-tooltip'>
              <div>{isCopied ? 'Copied' : 'Copy'}</div>
            </div>
          )}
        </div>

        <code className={`language-${language}`} ref={codeRef}>
          {content}
        </code>
      </pre>

      {caption && (
        <figcaption className='notion-asset-caption'>
          <Text value={caption} block={block} />
        </figcaption>
      )}
    </>
  )
}

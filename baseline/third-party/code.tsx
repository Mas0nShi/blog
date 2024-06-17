import * as React from 'react'

import copyToClipboard from 'clipboard-copy'
import { CodeBlock } from 'notion-types'
import { getBlockTitle } from 'notion-utils'
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

export const Code: React.FC<{
  block: CodeBlock
  defaultLanguage?: string
  className?: string
}> = ({ block, defaultLanguage = 'typescript', className }) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const copyTimeout = React.useRef<number>()
  const { recordMap } = useNotionContext()
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

  // Initialize mermaid
  React.useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      flowchart: {
        useMaxWidth: false,
        htmlLabels: true,
        curve: 'linear'
      }
    })
  }, []);

  const codeRef = React.useRef()
  React.useEffect(() => {
    if (codeRef.current) {
      if (language === 'mermaid') {
        const mermaidRender = async () => {
          await mermaid.run({nodes: [codeRef.current]})
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
  }, [codeRef, language])

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

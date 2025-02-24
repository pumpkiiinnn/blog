import path from 'node:path'

import rehypeShikiFromHighlighter from '@shikijs/rehype/core'
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/twoslash'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { rehypeDefaultCodeLang } from 'rehype-default-code-lang'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { MDX, type MDXProps } from 'rsc-mdx'
import {
  bundledLanguages,
  bundledThemes,
  createHighlighter,
} from 'shiki/bundle/full'
import { visit } from 'unist-util-visit'

import { Mermaid, Pre } from '@/markdown/components'

import { rehypeFixTags, rehypeGithubAlert } from './plugins'
import { rendererMdx } from './twoslash/renderMdx'

import type { RehypeShikiOptions } from '@shikijs/rehype'

interface MarkdownProps {
  source: string
  useMDXComponents?: MDXProps['useMDXComponents']
}

const highlighter = await createHighlighter({
  langs: Object.keys(bundledLanguages),
  themes: Object.keys(bundledThemes),
})

const debugLinks = () => {
  return (tree: any) => {
    visit(tree, ['link', 'image'], node => {
      console.log('[Debug] Found link/image:', {
        position: node.position,
        title: node.title,
        type: node.type,
        url: node.url,
      })
    })
  }
}

// 预处理 Markdown 内容，修复 HTML 标签问题
function preprocessMarkdown(content: string): string {
  // 使用 MDX 兼容的格式修复 HTML 标签问题
  content = content
    // 将 HTML 风格的自闭合标签转换为 JSX 风格
    .replace(
      /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)\s*\/?>/g,
      (_match, tag, attrs) => {
        // 移除末尾的斜杠，使用 JSX 风格的空内容标签
        return `<${tag}${attrs}></${tag}>`
      },
    )
    // 修复 a 标签内的 img 标签
    .replace(
      /<a([^>]*)>\s*<img([^>]*?)\/?\s*>\s*<\/a>/g,
      (_match, aAttrs, imgAttrs) => {
        return `<a${aAttrs}><img${imgAttrs}></img></a>`
      },
    )
    // 修复可能的标签嵌套问题
    .replace(/(<[^>]+>)([^<]*)(<\/[^>]+>)/g, (match, open, content, close) => {
      // 确保开闭标签匹配
      const openTag = open.match(/<([a-z]+)/i)?.[1]
      const closeTag = close.match(/<\/([a-z]+)/i)?.[1]
      if (
        openTag &&
        closeTag &&
        openTag.toLowerCase() !== closeTag.toLowerCase()
      ) {
        console.log(`[Debug] Found mismatched tags: ${openTag} and ${closeTag}`)
        // 如果是 img 标签，使用 JSX 风格的闭合
        if (openTag.toLowerCase() === 'img') {
          return `${open}${content}</img>`
        }
      }
      return match
    })

  return content
}

export async function Markdown(props: MarkdownProps) {
  const { source, useMDXComponents } = props

  console.log('[Debug] Processing Markdown content')

  // 预处理 Markdown 内容
  const processedSource = preprocessMarkdown(source)

  return (
    <MDX
      rehypePlugins={[
        debugLinks,
        rehypeGithubAlert,
        rehypeFixTags,
        rehypeSlug,
        rehypeAutolinkHeadings,
        [
          rehypeDefaultCodeLang,
          {
            defaultLang: 'text',
          },
        ],
        // eslint-disable-next-line unicorn/consistent-function-scoping
        () => tree => {
          visit(tree, 'element', node => {
            if (
              node.tagName === 'pre' &&
              node.children?.[0]?.type === 'element' &&
              node.children[0].tagName === 'code'
            ) {
              const codeNode = node.children[0]
              const lang = codeNode.properties?.className?.[0]?.replace(
                'language-',
                '',
              )

              if (lang === 'mermaid') {
                const content = codeNode.children?.[0]?.value || ''

                node.tagName = 'div'
                node.properties = {
                  className: ['mermaid-wrapper'],
                }
                node.children = [
                  {
                    children: [
                      {
                        type: 'text',
                        value: content,
                      },
                    ],
                    properties: {
                      className: ['mermaid'],
                      'data-content': content,
                    },
                    tagName: 'div',
                    type: 'element',
                  },
                ]
              }
            }
          })
        },
        [
          rehypeShikiFromHighlighter,
          highlighter,
          {
            parseMetaString(meta, node) {
              const code = node.children[0]
              if (code.type === 'element' && code.tagName === 'code') {
                const lang = code.properties.className?.[0]?.replace(
                  'language-',
                  '',
                )

                if (lang === 'mermaid') {
                  return { skip: true }
                }
              }

              const metaData = meta.split(' ')
              const fileName = metaData.find(item => path.extname(item) !== '')
              return {
                'data-file': fileName,
              }
            },
            themes: {
              dark: 'dracula-soft',
              light: 'github-light',
            },
            transformers: [
              transformerNotationDiff(),
              transformerNotationHighlight(),
              transformerNotationWordHighlight(),
              transformerNotationFocus(),
              transformerNotationErrorLevel(),
              transformerMetaHighlight(),
              transformerMetaWordHighlight(),
              transformerTwoslash({
                explicitTrigger: true,
                renderer: rendererMdx(),
              }),
            ],
          } as RehypeShikiOptions,
        ],
      ]}
      remarkPlugins={[remarkGfm]}
      source={processedSource}
      //@ts-expect-error 能力有限
      useMDXComponents={components => ({
        div(props) {
          if (props.className?.includes('mermaid-wrapper')) {
            const content = props.children?.props?.['data-content']
            return <Mermaid chart={content} />
          }
          return <div {...props} />
        },
        pre(props) {
          return <Pre {...props} />
        },
        //@ts-expect-error 能力有限
        // eslint-disable-next-line react-hooks/rules-of-hooks
        ...useMDXComponents?.(components),
      })}
    />
  )
}

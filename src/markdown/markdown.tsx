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

import { findCodeText, rehypeGithubAlert, rehypeFixTags } from './plugins'
import { rendererMdx } from './twoslash/renderMdx'
import { visit } from 'unist-util-visit'

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
    visit(tree, ['link', 'image'], (node) => {
      console.log('[Debug] Found link/image:', {
        type: node.type,
        url: node.url,
        title: node.title,
        position: node.position
      })
    })
  }
}

// 预处理 Markdown 内容，修复 HTML 标签问题
function preprocessMarkdown(content: string): string {
  // 使用 MDX 兼容的格式修复 HTML 标签问题
  content = content
    // 将 HTML 风格的自闭合标签转换为 JSX 风格
    .replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)([^>]*?)\s*\/?>/g, (_match, tag, attrs) => {
      // 移除末尾的斜杠，使用 JSX 风格的空内容标签
      return `<${tag}${attrs}></${tag}>`
    })
    // 修复 a 标签内的 img 标签
    .replace(/<a([^>]*)>\s*<img([^>]*?)\/?\s*>\s*<\/a>/g, (_match, aAttrs, imgAttrs) => {
      return `<a${aAttrs}><img${imgAttrs}></img></a>`
    })
    // 修复可能的标签嵌套问题
    .replace(/(<[^>]+>)([^<]*)(<\/[^>]+>)/g, (match, open, content, close) => {
      // 确保开闭标签匹配
      const openTag = open.match(/<([a-z]+)/i)?.[1]
      const closeTag = close.match(/<\/([a-z]+)/i)?.[1]
      if (openTag && closeTag && openTag.toLowerCase() !== closeTag.toLowerCase()) {
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
      source={processedSource}
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
        [
          rehypeShikiFromHighlighter,
          highlighter,
          {
            parseMetaString(meta, node) {
              const metaData = meta.split(' ')
              const fileName = metaData.find(item => path.extname(item) !== '')
              const codeText = findCodeText(node)

              return {
                content: codeText?.value,
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
      useMDXComponents={useMDXComponents}
    />
  )
}

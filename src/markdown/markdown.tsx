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

import { rehypeGithubAlert } from './plugins'
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

export async function Markdown(props: MarkdownProps) {
  const { source, useMDXComponents } = props

  return (
    <MDX
      rehypePlugins={[
        rehypeGithubAlert,
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
      source={source}
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

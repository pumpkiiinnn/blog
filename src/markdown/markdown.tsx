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

import { findCodeText, rehypeGithubAlert } from './plugins'
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
      source={source}
      useMDXComponents={useMDXComponents}
    />
  )
}

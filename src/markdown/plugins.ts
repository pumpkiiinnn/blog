import { isElement } from 'hast-util-is-element'
import { visit } from 'unist-util-visit'

import type { Text } from 'hast'
import type { Plugin } from 'unified'

export const findCodeText = (node: unknown): Text | null => {
  if (!isElement(node)) {
    return null
  }

  if (node.tagName === 'code') {
    return node.children[0] as Text
  }

  for (const child of node.children) {
    const text = findCodeText(child)
    if (text) {
      return text
    }
  }
  return null
}

// eslint-disable-next-line unicorn/consistent-function-scoping
export const rehypeGithubAlert: Plugin = () => tree =>
  visit(tree, node => {
    if (isElement(node)) {
      if (node.tagName === 'blockquote') {
        const firstParagraph = node.children.find(child => {
          return isElement(child) && child.tagName === 'p'
        })
        if (!isElement(firstParagraph)) {
          return
        }
        const text = firstParagraph.children[0] as Text
        const value = text.value
        if (!value) {
          return
        }
        const matches = value.match(/\[!(.+)\]/)
        if (matches) {
          const type = matches[1].toLowerCase()
          text.value = value.replace(matches[0], '').trim()
          node.tagName = 'Alert'
          node.properties = {
            ...node.properties,
            type,
          }
        }
      }
    }
  })

// 添加链接处理插件
export const rehypeLinks: Plugin = () => tree => {
  visit(tree, node => {
    if (isElement(node)) {
      // 检查 a 标签
      if (node.tagName === 'a') {
        console.log('[Debug] Found link:', {
          href: node.properties?.href,
          children: node.children,
          properties: node.properties
        })
      }
      // 检查 img 标签
      if (node.tagName === 'img') {
        console.log('[Debug] Found image:', {
          src: node.properties?.src,
          alt: node.properties?.alt,
          properties: node.properties
        })
      }
    }
  })
  return tree
}

// 修复 HTML 标签嵌套问题的插件
export const rehypeFixTags: Plugin = () => tree => {
  visit(tree, 'element', (node: any) => {
    if (!node || typeof node !== 'object') return

    // 修复 img 标签，确保它是自闭合的
    if (node.tagName === 'img') {
      node.children = []
      // 删除可能导致问题的属性
      if (node.properties) {
        delete node.properties.children
      }
    }

    // 修复 a 标签内的内容
    if (node.tagName === 'a') {
      // 确保 children 是数组
      if (!Array.isArray(node.children)) {
        node.children = []
      }

      // 处理每个子元素
      node.children = node.children.map((child: any) => {
        if (!child || typeof child !== 'object') return child

        // 如果是 img 标签
        if (child.tagName === 'img') {
          child.children = []
          if (child.properties) {
            delete child.properties.children
          }
        }

        return child
      }).filter(Boolean)

      // 删除可能导致问题的属性
      if (node.properties) {
        delete node.properties.children
      }
    }
  })
  return tree
}

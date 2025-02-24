import { Client } from '@discublog/api/client'
import { Octokit } from '@octokit/core'
import { repoName, repoOwner } from '~/blog-config'

import { unstable_cache as cache } from 'next/cache'

import type { PinnedItems, RepositoryFile } from './interface'

import 'server-only'

const { graphql } = new Octokit({ auth: process.env.GITHUB_TOKEN })

const client = new Client({
  name: repoName,
  owner: repoOwner,
  token: process.env.GITHUB_TOKEN!,
})

export const queryProfileREADME = cache(async () => {
  const [masterResult, mainResult] = await Promise.allSettled([
    graphql<RepositoryFile>(
      `
        query queryProfileREADME($owner: String!, $file: String!) {
          repository(owner: $owner, name: $owner) {
            object(expression: $file) {
              ... on Blob {
                text
              }
            }
          }
        }
      `,
      {
        file: 'master:README.md',
        owner: repoOwner,
      },
    ),
    graphql<RepositoryFile>(
      `
        query queryProfileREADME($owner: String!, $file: String!) {
          repository(owner: $owner, name: $owner) {
            object(expression: $file) {
              ... on Blob {
                text
              }
            }
          }
        }
      `,
      {
        file: 'main:README.md',
        owner: repoOwner,
      },
    ),
  ])

  if (masterResult.status === 'fulfilled') {
    const { repository } = masterResult.value
    if (repository?.object.text) {
      return masterResult.value
    }
  }

  if (mainResult.status === 'fulfilled') {
    const { repository } = mainResult.value
    if (repository?.object.text) {
      return mainResult.value
    }
  }

  return {
    repository: {
      object: {
        text: 'create [GitHub profile repository](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/about-your-profile) to use Bio block.',
      },
    },
  }
})

export const queryPinnedItems = cache(() =>
  graphql<PinnedItems>(
    `
      query queryPinnedItems($owner: String!) {
        user(login: $owner) {
          pinnedItems(first: 6, types: REPOSITORY) {
            nodes {
              ... on Repository {
                name
                url
                description
                homepageUrl
                visibility
                stargazerCount
                forkCount
                languages(first: 1, orderBy: { field: SIZE, direction: DESC }) {
                  nodes {
                    name
                    color
                  }
                }
              }
            }
          }
        }
      }
    `,
    {
      owner: repoOwner,
    },
  ),
)

export const queryAllLabels = cache(() => client.queryLabels())

// 预处理 Markdown 内容，修复 HTML 标签问题
function preprocessMarkdown(content: string): string {
  // 修复 img 标签嵌套问题
  content = content.replace(/<img([^>]*)>\s*<\/img>/g, '<img$1 />')
  content = content.replace(/<img([^>]*)>(?![\s]*\/)/g, '<img$1 />')
  
  // 修复 a 标签内的 img 标签问题
  content = content.replace(/<a([^>]*)>\s*<img([^>]*)>\s*<\/a>/g, '<a$1><img$2 /></a>')
  
  return content
}

export const queryAllPosts = cache(async () => {
  const result = await client.search({ body: true, bodyText: true })
  
  // 预处理每个帖子的内容
  if (result.search?.nodes) {
    result.search.nodes = result.search.nodes.map(node => {
      if (node.body) {
        node.body = preprocessMarkdown(node.body)
      }
      return node
    })
  }
  
  return result
})

export const queryByLabel = cache((label: string) => client.search({ label }))

import { site } from '~/blog-config'

import type { MetadataRoute } from 'next'

import { staticPage } from '@/app/static-page'
import { queryAllLabels, queryAllPosts } from '@/service'

const url = (url: string) => `${site}/${url}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  const [, ...restStaticPage] = staticPage

  const allPosts = await queryAllPosts()
  const allTags = await queryAllLabels()

  return [
    // Home Page
    ...['', ...restStaticPage].map(path => ({
      priority: path ? 0.8 : 1,
      url: url(path),
    })),
    // Post List
    {
      priority: 0.6,
      url: url('/posts/all'),
    },
    // Posts
    ...allPosts.search.nodes.map(post => ({
      priority: 1,
      url: url(`/posts/${post.number}`),
    })),
    // Tags
    ...(allTags.repository?.labels.nodes.map(label => ({
      priority: 0.6,
      url: url(`/tags/${label.name}`),
    })) ?? []),
    // Resume
    {
      priority: 0.6,
      url: url('resume'),
    },
  ].map(item => ({ ...item, changeFrequency: 'weekly', lastModified }))
}

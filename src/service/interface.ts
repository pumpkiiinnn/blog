import type { Connection, Label, Repository } from '@discublog/api/interface'

export interface PinnedItemContent {
  description: string
  forkCount: number
  homepageUrl: string
  languages: Connection<Label>
  name: string
  stargazerCount: number
  url: string
  visibility: 'PUBLIC'
}

export interface PinnedItems {
  user: {
    pinnedItems: {
      nodes: PinnedItemContent[]
    }
  }
}

export type RepositoryFile = Repository<{ object: { text: string } }>

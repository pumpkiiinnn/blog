import { IconHash } from '@tabler/icons-react'

import Link from 'next/link'

import { createSummary, getSummary, writeSummery } from '@/service/summary'

import { Block } from '../blocks/block'

import type { Discussion } from '@discublog/api/interface'

interface PostProps {
  node: Discussion
}

export const Post = async (props: PostProps) => {
  const { node } = props
  const { bodyText, labels, number } = node
  const firstLabel = labels.nodes[0]

  const summaryJson = await getSummary()

  const currentSummary = summaryJson[number]

  if (
    !currentSummary &&
    bodyText &&
    process.env.NODE_ENV === 'development' &&
    process.env.OPENAI_API_KEY
  ) {
    const result = await createSummary(bodyText)
    if (result) {
      const newSummaryJson = await getSummary()
      newSummaryJson[number] = result
      await writeSummery(newSummaryJson)
    }
  }

  return (
    <Block
      className='group grid grid-rows-[1fr_min-content_2fr] bg-gradient-to-b from-surface-1 to-white dark:bg-[linear-gradient(rgba(255,255,255,0.05)_0%,rgba(255,255,255,0)_100%)] max-lg:p-2 max-md:row-span-2 max-sm:col-span-2 max-sm:row-span-1 xl:grid-rows-[1fr_min-content_2fr_auto]'
      data-type='posts'
    >
      <div className='row-span-4 grid grid-rows-subgrid gap-1 xl:gap-2'>
        <Link
          aria-label={`Post ${node.title}`}
          className='relative flex items-center text-balance text-sm font-bold lg:text-base xl:text-xl'
          href={`/posts/${number}`}
        >
          <h2>
            {node.title}
            {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
            {firstLabel && (
              <i
                className='absolute -bottom-1 left-1 block h-1 w-1/3 opacity-80'
                style={{ background: `#${firstLabel.color}` }}
              />
            )}
          </h2>
        </Link>
        <p className='mt-1 truncate text-color-2'>
          {labels.nodes.map(node => (
            <Link
              key={node.id}
              aria-label={`Tag ${node.name}`}
              className='relative inline-flex items-center px-1 text-xs underline-offset-1 before:absolute before:-inset-x-0 before:-inset-y-4 before:content-["_"] after:content-[",_"] first:pl-0 last:after:content-none hover:underline'
              href={`/tags/${node.name}`}
            >
              <IconHash className='size-2.5' />
              {node.name}
            </Link>
          ))}
        </p>
        <p className='text-xs dark:text-color-4 xl:text-sm'>{currentSummary}</p>
        <p className='flex justify-end max-xl:hidden'>
          <Link
            aria-label={`Read more about ${node.title}`}
            className='translate-y-2 items-center rounded-full border bg-surface px-2.5 py-1.5 font-semibold opacity-0 outline-offset-4 ring-surface-3 transition-all duration-700 ease-out hover:scale-105 hover:border-transparent hover:ring-4 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100'
            href={`/posts/${number}`}
          >
            Read more <span className='sr-only'>about {node.title}</span>
          </Link>
        </p>
      </div>
    </Block>
  )
}

import {
  IconAlertTriangle,
  IconBug,
  IconBulb,
  IconHash,
  IconHourglassHigh,
  IconInfoSquareRounded,
} from '@tabler/icons-react'
import { repoName, repoOwner } from '~/blog-config'
import { TOC } from 'react-markdown-toc/server'

import Link from 'next/link'

import { GiscusScript } from '@/components/giscus'
import { Markdown } from '@/markdown'
import {Alert, CodeGroup, Details, Mermaid, Pre} from '@/markdown/components'
import { TwoslashTooltip } from '@/markdown/twoslash/tooltip'
import { TwoslashTrigger } from '@/markdown/twoslash/triger'
import { queryAllPosts } from '@/service'
import { getSummary } from '@/service/summary'
import { formatDateTime, readingTime } from '@/utils'

// shiki style
import './shiki.css'

interface PageProps {
  params: {
    id: string
  }
}

export const generateStaticParams = async () => {
  const {
    search: { nodes },
  } = await queryAllPosts()
  return nodes.map(node => ({ id: `${node.number}` }))
}

export const generateMetadata = async ({ params }: PageProps) => {
  const { id } = params

  const {
    search: { nodes },
  } = await queryAllPosts()
  const discussion = nodes.find(node => node.number === +id)!
  const { title } = discussion

  // TODO og, twitter
  const summery = await getSummary()
  const description = summery[id]
  return {
    description,
    title,
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = params

  const {
    search: { nodes },
  } = await queryAllPosts()

  const discussion = nodes.find(node => node.number === +id)!
  const { body, bodyText, createdAt, labels, number, title, updatedAt } =
    discussion

  const formatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  } satisfies Intl.DateTimeFormatOptions
  const createDate = formatDateTime(formatOptions, new Date(createdAt))
  const updateDate = formatDateTime(formatOptions, new Date(updatedAt))

  const showLastUpdateTime = createDate !== updateDate

  return (
    <main className='m-auto grid grid-cols-[1fr_min(80ch,100%)_1fr] justify-center bg-[linear-gradient(to_bottom,transparent,rgb(var(--surface)/1)_150px,rgb(var(--surface)/1)_calc(100%_-_150px),transparent_100%)] px-4 py-28 md:px-8 xl:grid-cols-[80ch_30ch]'>
      <header className='mb-24 w-fit space-y-8 max-xl:col-start-2 xl:col-span-2'>
        <span className='text-color-2'>
          <small>{createDate}</small>
          {showLastUpdateTime && (
            <small className='ml-4 rounded bg-brand/10 px-1.5 py-1 text-brand'>
              Last Updated: {updateDate}
            </small>
          )}
        </span>
        <h1 className='text-5xl'>{title}</h1>
        <div className='flex items-center justify-between text-sm text-color-3'>
          <span className='flex gap-2'>
            {labels.nodes.map(node => (
              <Link
                key={node.id}
                className='inline-flex items-center hover:underline'
                href={`/tags/${node.name}`}
              >
                <IconHash className='size-3.5' />
                {node.name}
              </Link>
            ))}
          </span>
          <span className='flex items-center gap-1'>
            <IconHourglassHigh className='size-3.5' />
            {readingTime(bodyText!.length)} min to read
          </span>
        </div>
      </header>
      <article className='prose prose-slate max-w-none dark:prose-invert prose-code:break-words prose-pre:px-5 dark:prose-img:brightness-75 max-xl:col-start-2 max-sm:prose-pre:rounded-none sm:prose-img:rounded'>
        <Markdown
          source={body!}
          useMDXComponents={() => ({
            Alert,
            CodeGroup,
            Details,
            Mermaid,
            IconAlertTriangle,
            IconBug,
            IconBulb,
            IconInfoSquareRounded,
            TwoslashTooltip,
            TwoslashTrigger,
            pre: Pre,
          })}
        />
        <GiscusScript number={number} repo={`${repoOwner}/${repoName}`} />
      </article>
      <aside className='sticky top-32 ml-auto h-fit w-[22ch] max-xl:hidden'>
        <h2 className='mb-4 whitespace-nowrap text-lg font-semibold tracking-wider has-[+ul:empty]:hidden'>
          TABLE OF CONTENTS
        </h2>
        <TOC
          a='data-[active=true]:text-brand dark:data-[active=true]:text-white block text-sm mb-2'
          className='space-y-3 dark:text-color-4'
          markdown={body!}
          throttleTime={100}
          ul='pl-6 space-y-2'
        />
      </aside>
    </main>
  )
}

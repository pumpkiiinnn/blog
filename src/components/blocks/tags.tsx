import { IconHash, IconTags } from '@tabler/icons-react'

import Link from 'next/link'

import { queryAllLabels } from '@/service'

import { Block } from './block'

export const Tags = async () => {
  const { repository } = await queryAllLabels()

  const { nodes } = repository!.labels

  return (
    <Block
      className='col-span-2 flex flex-col overflow-clip bg-gradient-to-l from-amber-50 to-surface dark:from-surface-1 max-lg:row-span-2 sm:col-span-3 md:col-span-2 lg:col-span-4'
      data-type='tags'
    >
      <h2 className='mb-4 flex items-center gap-4 text-2xl text-brand'>
        <IconTags />
        Tags
      </h2>
      <ul className='flex flex-1 flex-wrap items-center gap-1 md:gap-2 lg:gap-4 lg:p-4'>
        {nodes.map(node => {
          const { color, name } = node
          return (
            <li key={name}>
              <Link
                className='flex items-center rounded-2xl px-1 py-0.5 text-sm shadow-sm md:gap-1 md:px-2 md:py-1 lg:text-base'
                href={`/tags/${name}`}
                style={{
                  backgroundColor: `#${color}33`,
                  border: `2px solid #${color}`,
                }}
              >
                <IconHash className='size-4' />
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </Block>
  )
}

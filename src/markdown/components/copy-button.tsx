'use client'

import { IconCheck, IconCopy } from '@tabler/icons-react'
import { clsx } from 'clsx'

import { useState } from 'react'

interface CopyButtonProps {
  content: string
}

export const CopyButton = (props: CopyButtonProps) => {
  const { content } = props
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const Icon = copied ? IconCheck : IconCopy

  return (
    <button
      className={clsx(
        'copy-button absolute right-1 top-6 hidden -translate-y-1/2 rounded p-2 hover:bg-gray-100 group-hover:block dark:hover:bg-gray-700 md:-right-4',
        copied
          ? '!block bg-gray-100 text-green-500 dark:bg-gray-700'
          : 'text-gray-500',
      )}
      onClick={() => void handleClick()}
    >
      {copied && (
        <span className='absolute -left-2 top-1/2 -translate-x-full -translate-y-1/2 rounded bg-black/90 p-2 text-xs text-surface dark:bg-inherit dark:text-color-1'>
          Copied!
        </span>
      )}
      <Icon className='size-4' />
    </button>
  )
}

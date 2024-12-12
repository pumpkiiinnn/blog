'use client'

import { IconSettings } from '@tabler/icons-react'
import { clsx } from 'clsx'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import type { StaticPageParams } from '@/app/static-page'

export const Setting = () => {
  const { tab } = useParams<StaticPageParams>()

  return (
    <Link
      aria-label='Setting'
      className={clsx(
        'justify-self-end rounded-full bg-surface-2 p-1 shadow-inner dark:bg-surface-1 max-sm:hidden',
      )}
      href='/setting'
    >
      <IconSettings
        className={clsx(
          'size-8 rounded-full p-1.5 transition-all duration-1000 ease-out',
          tab === 'setting'
            ? 'bg-surface text-brand shadow-sm dark:bg-surface-2'
            : 'text-color-3',
        )}
      />
    </Link>
  )
}

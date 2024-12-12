'use client'

import { twMerge } from 'tailwind-merge'
import { useFlip } from 'use-flip'

import { useParams } from 'next/navigation'

import type { StaticPageParams } from '@/app/static-page'

export const Block = (props: React.HTMLAttributes<HTMLDivElement>) => {
  const { children, className, style, ...rest } = props

  const { tab: currentTab } = useParams() as Partial<StaticPageParams>

  const ref = useFlip([currentTab], { duration: 700 })

  const type = rest['data-type']

  const needOrderFirst = currentTab === type

  const needChangeStyle = !currentTab || needOrderFirst

  return (
    <div
      ref={ref}
      {...rest}
      className={twMerge(
        'relative rounded-xl border p-2.5 text-sm shadow-bento transition-[filter] duration-700 dark:border-none dark:shadow-none dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:rounded-[inherit] dark:before:bg-[linear-gradient(rgba(255,255,255,0.1),rgba(255,255,255,0.07))] dark:before:p-px dark:before:content-["_"] dark:before:[mask-clip:content-box,border-box] dark:before:[mask-composite:exclude] dark:before:[mask-image:linear-gradient(black,black),linear-gradient(black,black)] lg:rounded-2xl lg:p-4 xl:rounded-3xl',
        className,
      )}
      style={{
        ...style,
        filter: needChangeStyle ? 'blur(0)' : 'blur(3px)',
        opacity: needChangeStyle ? 1 : 0.8,
        order: needChangeStyle ? 0 : 1,
        ...(needChangeStyle
          ? {}
          : {
              pointerEvents: 'none',
              userSelect: 'none',
            }),
      }}
    >
      {children}
    </div>
  )
}

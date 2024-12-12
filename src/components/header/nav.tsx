'use client'
import { clsx } from 'clsx'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import { useEffect, useRef, useState } from 'react'

import { staticPage, type StaticPageParams } from '@/app/static-page'
import { usePrevious } from '@/hooks/usePrevious'

const staticNav = staticPage.slice(0, -1)

export const Nav = () => {
  const { tab: currentTab } = useParams() as Partial<StaticPageParams>
  const [pos, setPos] = useState<Record<string, [number, number]>>({})
  const ulRef = useRef<HTMLUListElement | null>(null)

  const currentSelected = currentTab ?? 'all'
  const currentPos = pos[currentSelected]

  const prevPos = usePrevious(currentPos)

  useEffect(() => {
    if (!ulRef.current) {
      return
    }
    const tabs = ulRef.current.querySelectorAll<HTMLLIElement>('[data-name]')

    const calcTabSize = () => {
      const pos = Array.from(tabs).reduce(
        (pre, cur) => {
          const name = cur.dataset.name!
          pre[name] = [cur.offsetLeft, cur.offsetWidth]
          return pre
        },
        // eslint-disable-next-line no-use-before-define
        {} as typeof pos,
      )
      setPos(pos)
    }
    calcTabSize()

    const resizeObserver = new ResizeObserver(calcTabSize)
    resizeObserver.observe(ulRef.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  const hidden = !currentPos
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [left, width] = currentPos ?? prevPos ?? []

  return (
    <nav className='relative justify-self-center rounded-full bg-surface-2 p-1.5 shadow-inner dark:bg-surface-1'>
      <div
        className={clsx(
          'absolute inset-y-1.5 left-1.5 rounded-full bg-surface shadow-sm transition-[opacity,transform] duration-1000 ease-out dark:bg-surface-2',
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          hidden ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          transform: `translateX(${left}px)`,
          width,
        }}
      />
      <ul ref={ulRef} className='relative z-10 flex text-sm font-semibold'>
        {staticNav.map((name, index) => {
          const tab = name.toLowerCase()
          const linkUrl = tab === 'all' ? '' : tab
          return (
            <li
              // eslint-disable-next-line react/no-array-index-key
              key={`${name}-${index}`}
              aria-label={tab}
              className={clsx(
                'px-2.5 py-1 transition-colors duration-1000 ease-out sm:px-4',
                tab === currentSelected ? 'text-brand' : 'text-color-3',
              )}
              data-name={tab}
            >
              <Link prefetch href={`/${linkUrl}`}>
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

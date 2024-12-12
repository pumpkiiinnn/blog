import { IconChevronRight } from '@tabler/icons-react'
import { clsx } from 'clsx'

import { useEffect, useRef } from 'react'

import { useIsServer } from '@/hooks/useIsServer'
import { sleep } from '@/utils'

import type { TypedChildProps } from './typed'

export interface TypedTextProps extends TypedChildProps {
  afterDelay?: number
  beforeDelay?: number
}

export const TypedText = (props: TypedTextProps) => {
  const {
    active,
    afterDelay = 500,
    beforeDelay = 500,
    children,
    onRendered,
  } = props
  const ref = useRef<HTMLElement | null>(null)
  const isServer = useIsServer()

  useEffect(
    () => {
      if (typeof children !== 'string') {
        return
      }
      ref.current?.scrollIntoView({ behavior: 'smooth' })
      let cancel = false
      let id: number
      const typed = () => {
        if (!ref.current || cancel) {
          return
        }
        const text = children.trim()
        const stringArr = Array.from(
          text.replace(ref.current.textContent!.trim(), ''),
        )
        let index = 0
        id = window.setInterval(() => {
          if (!ref.current || index === stringArr.length) {
            window.clearInterval(id)
            sleep(afterDelay).then(onRendered)
            return
          }
          ref.current.textContent += stringArr[index++]
        }, 150)
      }
      if (beforeDelay) {
        sleep(beforeDelay).then(typed)
      } else {
        typed()
      }
      return () => {
        cancel = true
        window.clearInterval(id)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  if (isServer) {
    return (
      <p className='flex items-center gap-1'>
        <IconChevronRight className='size-3.5 text-green-400' />
        {children}
      </p>
    )
  }

  return (
    <p
      className={clsx('flex items-center gap-1', {
        'after:content-["█"]': active,
        'font-bold italic': !active,
      })}
    >
      <span className='text-sky-400' hidden={!active}>
        ~
      </span>
      <IconChevronRight className='size-3.5 text-green-400' />
      <span ref={ref} />
    </p>
  )
}

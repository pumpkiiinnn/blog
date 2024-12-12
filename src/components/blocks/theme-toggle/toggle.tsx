'use client'
import { useDarkToggle } from 'dark-toggle/react'

export const Toggle = (props: { children: React.ReactNode }) => {
  const { children } = props
  const { toggle } = useDarkToggle()
  return (
    <button aria-label='Theme Toggle' className='size-full' onClick={toggle}>
      {children}
    </button>
  )
}

'use client'

import { Switch } from 'react-aria-components'

import { useFont } from '@/hooks/useFont'
import { cn } from '@/utils'

export const Toggle = () => {
  const [font, onToggle] = useFont()

  return (
    <div
      aria-label='Font Toggle Label'
      className='col-span-3 row-span-2 flex items-center gap-2 p-4 text-3xl'
      role='button'
      tabIndex={0}
      onClick={void onToggle}
      onKeyDown={void onToggle}
    >
      <span className='font-sans'>T</span>
      <Switch
        aria-label='Font Toggle Switch'
        className={cn(
          'relative h-6 w-12 rounded-lg border shadow-inner duration-500 before:absolute before:inset-y-0.5 before:left-0 before:w-4 before:translate-x-0.5 before:rounded-md before:bg-surface before:shadow before:transition-transform before:duration-500 before:content-["_"] dark:border-gray-500 dark:before:bg-surface-4',
          font === 'serif' &&
            'bg-blue-400 before:!translate-x-7 before:rotate-180 dark:bg-gray-700',
        )}
        isSelected={font === 'serif'}
        onChange={() => onToggle()}
      />
      <span className='font-serif'>T</span>
    </div>
  )
}

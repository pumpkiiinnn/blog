'use client'

import { IconCheck, IconTypography } from '@tabler/icons-react'
import { MenuTrigger } from 'react-aria-components'

import { useDeferredValue } from 'react'

import { Button, Menu, MenuItem, Popover } from '@/components/ui'
import { useFont } from '@/hooks/useFont'

import type { FontType } from '@/context/font'

export const FontToggle = () => {
  const [font, toggleFont] = useFont()
  const currentFont = useDeferredValue(font)
  return (
    <MenuTrigger>
      <Button
        aria-label='Menu'
        className='rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1'
      >
        <IconTypography className='size-5' />
      </Button>
      <Popover placement='bottom right'>
        <Menu
          className='w-[130px]'
          onAction={font => {
            toggleFont(font as FontType)
          }}
        >
          {[
            ['Serif', 'serif'],
            ['Sans Serif', 'sans'],
          ].map(([name, font]) => (
            <MenuItem key={font} className='flex justify-between' id={font}>
              {name}
              {font === currentFont && (
                <IconCheck className='size-4 text-brand' />
              )}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}

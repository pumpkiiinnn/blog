'use client'

import { IconCheck, IconMoon, IconSun } from '@tabler/icons-react'
import { useDarkToggle } from 'dark-toggle/react'
import { MenuTrigger } from 'react-aria-components'

import { Button, Menu, MenuItem, Popover } from '@/components/ui'
import { useIsServer } from '@/hooks/useIsServer'

import type { Theme } from 'dark-toggle'

export const ThemeToggle = () => {
  const { isDark, setTheme, theme } = useDarkToggle()
  const isServer = useIsServer()

  if (isServer) {
    return null
  }

  const currentTheme: Theme = theme ?? 'system'

  const Icon = isDark ? IconMoon : IconSun
  return (
    <MenuTrigger>
      <Button
        aria-label='Menu'
        className='rounded p-1.5 outline-none transition-colors hover:bg-surface-1 pressed:bg-surface-1'
      >
        <Icon className='size-5' />
      </Button>
      <Popover placement='bottom right'>
        <Menu
          className='w-[130px]'
          onAction={theme => {
            setTheme(theme as Theme)
          }}
        >
          {[
            ['Light', 'light'],
            ['Dark', 'dark'],
            ['System', 'system'],
          ].map(([name, theme]) => (
            <MenuItem key={theme} className='flex justify-between' id={theme}>
              {name}
              {theme === currentTheme && (
                <IconCheck className='size-4 text-brand' />
              )}
            </MenuItem>
          ))}
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}

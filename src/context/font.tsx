import { createContext, useEffect, useState } from 'react'

import { isServer } from '@/utils'

export type FontType = 'sans' | 'serif'

// eslint-disable-next-line react-refresh/only-export-components
export const fontContext = createContext<[FontType, (font?: FontType) => void]>(
  ['sans', () => {}],
)

let defaultFont: FontType = 'sans'

if (!isServer()) {
  const storedFont = sessionStorage.getItem('font') as FontType | null
  if (storedFont) {
    defaultFont = storedFont
  }
}

export const FontProvider = ({ children }: { children: React.ReactNode }) => {
  const [font, setFont] = useState<FontType>('sans')

  useEffect(
    () => {
      toggleFont(defaultFont)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  function toggleFont(next?: FontType) {
    const newFont =
      typeof next === 'string' ? next : font === 'serif' ? 'sans' : 'serif'
    sessionStorage.setItem('font', newFont)
    document.documentElement.style.setProperty(
      '--font-remote',
      newFont === 'serif'
        ? 'var(--font-remote-serif), serif'
        : 'var(--font-remote-sans)',
    )
    setFont(newFont)
  }

  return (
    <fontContext.Provider value={[font, toggleFont]}>
      {children}
    </fontContext.Provider>
  )
}

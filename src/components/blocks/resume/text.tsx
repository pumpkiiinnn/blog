'use client'
import Typed from 'typed.js'

import { useEffect, useRef } from 'react'

export const ResumeText = () => {
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref.current) {
      return
    }
    const typed = new Typed(ref.current, {
      backDelay: 200,
      backSpeed: 100,
      cursorChar: '_',
      loop: true,
      strings: ['ls^100 resume ^500', 'vim ^1000', 'cat resume ^2000'],
      typeSpeed: 150,
    })
    return () => {
      typed.destroy()
    }
  }, [])

  return <span ref={ref}>resume</span>
}

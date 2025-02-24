'use client'

import { useDarkToggle } from 'dark-toggle/react'
import mermaid from 'mermaid'

import { useEffect, useState } from 'react'

interface MermaidProps {
  chart: string
}

export function Mermaid({ chart }: MermaidProps) {
  const { isDark } = useDarkToggle()
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string>('')

  console.log('=== Mermaid Component ===')
  console.log('Chart content:', chart)
  console.log('Chart type:', typeof chart)
  console.log('Chart length:', chart?.length)
  console.log('Is chart empty?', !chart)

  useEffect(() => {
    if (!chart || typeof chart !== 'string') {
      console.error('Invalid chart content:', chart)
      setError('Invalid chart content')
      return
    }

    if (!chart.trim()) {
      console.error('Empty chart content')
      setError('Empty chart content')
      return
    }

    console.log('=== Mermaid useEffect ===')
    console.log('isDark:', isDark)
    console.log('Chart changed:', chart)

    try {
      console.log('Initializing mermaid...')
      mermaid.initialize({
        fontFamily: 'var(--font-remote)',
        securityLevel: 'loose',
        startOnLoad: false,
        theme: isDark ? 'dark' : 'default',
      })
      console.log('Mermaid initialized successfully')

      const renderChart = async () => {
        try {
          console.log('Starting chart render...')
          console.log('Chart content to render:', chart)
          
          // 创建一个临时的容器元素
          const tempContainer = document.createElement('div')
          tempContainer.style.display = 'none'
          document.body.appendChild(tempContainer)
          
          // 生成一个有效的 ID
          const id = `mermaid-${Date.now()}`
          tempContainer.id = id
          
          console.log('Generated chart ID:', id)
          
          try {
            const { svg } = await mermaid.render(id, chart)
            console.log('Chart rendered successfully')
            console.log('SVG length:', svg.length)
            setSvg(svg)
            setError('')
          } finally {
            // 确保临时容器被移除
            tempContainer.remove()
          }
        } catch (err) {
          console.error('Mermaid render error:', err)
          console.error('Error details:', {
            message: err instanceof Error ? err.message : String(err),
            stack: err instanceof Error ? err.stack : undefined,
          })
          setError(err instanceof Error ? err.message : 'Failed to render chart')
        }
      }

      void renderChart()
    } catch (err) {
      console.error('Mermaid initialization error:', err)
      setError('Failed to initialize mermaid')
    }
  }, [chart, isDark])

  if (error) {
    console.log('Rendering error state:', error)
    return (
      <div className='rounded bg-red-50 p-4 text-red-500 dark:bg-red-900/20'>
        Failed to render chart: {error}
      </div>
    )
  }

  console.log('Rendering chart SVG, length:', svg.length)
  return (
    <div
      dangerouslySetInnerHTML={{ __html: svg }}
      className='my-4 flex justify-center overflow-x-auto'
    />
  )
}

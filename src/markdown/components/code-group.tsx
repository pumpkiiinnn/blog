'use client'

import clsx from 'clsx'

import { Children, isValidElement, useState } from 'react'

interface CodeGroupProps {
  children: React.ReactNode
  'data-children-meta': string
}
const CodeGroup = (props: CodeGroupProps) => {
  const { children } = props
  const [index, setIndex] = useState(0)

  const childrenArray = Children.toArray(children)
  // eslint-disable-next-line array-callback-return
  const fileNames = childrenArray.map(child => {
    if (isValidElement(child)) {
      const childrenArr = Children.toArray(
        child.props.children,
      ) as React.ReactElement[]

      return childrenArr[0].props['data-file']
    }
  })

  if (fileNames.length !== childrenArray.length) {
    return children
  }

  const current = childrenArray[index]

  return (
    <div className='mdx-components -mx-4 border bg-surface-1 md:-mx-8 md:rounded'>
      <header className='flex border-b px-4'>
        {fileNames.map((fileName, i) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={i}
            className={clsx(
              'flex items-center justify-center border-b-2 px-4 py-2',
              i === index
                ? 'border-brand text-brand'
                : 'border-transparent text-color-3',
            )}
            onClick={() => setIndex(i)}
          >
            {fileName}
          </button>
        ))}
      </header>
      {current}
    </div>
  )
}

export default CodeGroup

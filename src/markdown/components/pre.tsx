import { clsx } from 'clsx'

import { CopyButton } from './copy-button'

interface PreProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  > {
  content?: string
}

export const Pre = (props: PreProps) => {
  const { children, className, content, ...rest } = props
  return (
    <div className='relative'>
      <pre {...rest} className={clsx('group', className)}>
        {children}
        {content && <CopyButton content={content} />}
      </pre>
    </div>
  )
}

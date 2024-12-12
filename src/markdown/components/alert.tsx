import {
  IconAlertTriangle,
  IconBulb,
  IconInfoSquare,
  IconMessageReport,
  IconUrgent,
} from '@tabler/icons-react'
import clsx from 'clsx'

interface AlertProps {
  children: React.ReactNode
  type: 'caution' | 'important' | 'note' | 'tip' | 'warning '
}

const icons = {
  caution: IconUrgent,
  important: IconMessageReport,
  note: IconInfoSquare,
  tip: IconBulb,
  warning: IconAlertTriangle,
}

export const Alert = (props: AlertProps) => {
  const { children, type } = props

  const Icon = icons[type]

  const textClses = {
    caution: 'text-red-500',
    important: 'text-purple-600',
    note: 'text-blue-500',
    tip: 'text-green-600',
    warning: 'text-yellow-600',
  }

  const borderClses = {
    caution: 'border-red-500',
    important: 'border-purple-600',
    note: 'border-blue-500',
    tip: 'border-green-600',
    warning: 'border-yellow-600',
  }

  const textCls = textClses[type]
  const borderCls = borderClses[type]

  return (
    <div className={clsx('not-prose mb-4 border-l-4 pl-4', borderCls)}>
      <p className={clsx('flex items-center gap-2 py-2 font-bold', textCls)}>
        <Icon className='size-5' />
        <span className='block first-letter:uppercase'>{type}</span>
      </p>
      {children}
    </div>
  )
}

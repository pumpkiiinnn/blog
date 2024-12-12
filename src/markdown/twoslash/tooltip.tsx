'use client'

import { OverlayArrow } from 'react-aria-components'

import { Tooltip } from '@/components/ui'

interface TwoslashTooltipProps {
  children: React.ReactNode
  noArrow?: boolean
  portalContainer?: HTMLElement
}

export const TwoslashTooltip = (props: TwoslashTooltipProps) => {
  const { children, noArrow, portalContainer } = props

  return (
    <Tooltip
      UNSTABLE_portalContainer={portalContainer}
      arrowBoundaryOffset={8}
      className='shiki-twoslash max-w-[80vw] origin-top-left md:max-w-[90ch]'
      offset={4}
      placement='bottom left'
      shouldFlip={false}
    >
      <div className='not-prose rounded border bg-surface shadow-lg'>
        {!noArrow && (
          <OverlayArrow>
            <span className='relative block border-[6px] border-transparent before:absolute before:left-0 before:top-0 before:-translate-x-1/2 before:-translate-y-1/2 before:border-[7px] before:border-transparent before:border-b-border before:content-[""] after:absolute after:left-0 after:top-px after:z-10  after:-translate-x-1/2 after:-translate-y-1/2 after:border-[6px] after:border-transparent after:border-b-surface after:content-[""]' />
          </OverlayArrow>
        )}
        {children}
      </div>
    </Tooltip>
  )
}

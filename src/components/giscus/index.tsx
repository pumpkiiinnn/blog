'use client'

import Giscus from '@giscus/react'
import { useDarkToggle } from 'dark-toggle/react'

interface GiscusScriptProps {
  number: number
  repo: `${string}/${string}`
}

export function GiscusScript(props: GiscusScriptProps) {
  const { number, repo } = props
  const { isDark } = useDarkToggle()

  return (
    <div className='mt-32'>
      <Giscus
        emitMetadata='0'
        inputPosition='top'
        lang='en'
        mapping='number'
        reactionsEnabled='1'
        repo={repo}
        repoId='MDEwOlJlcG9zaXRvcnkzMjk0OTk1NjU='
        term={`${number}`}
        theme={isDark ? 'dark' : 'light'}
      />
    </div>
  )
}

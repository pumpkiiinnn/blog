import { useSyncExternalStore } from 'react'

const noop = () => {}

export const useIsServer = () =>
  useSyncExternalStore(
    () => noop,
    () => false,
    () => true,
  )

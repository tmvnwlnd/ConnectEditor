import { useSyncExternalStore } from 'react'

/* The open tab of the Publiceren step ("publiceren" | "targeting"). Shared because the TABS live in the sticky
   page header (Layout) while the CONTENT is ArticleSettings — both read and set it through `usePublishTab()`. */
let current = 'publiceren'
const subscribers = new Set()

export const PUBLISH_TABS = [
  { id: 'publiceren', label: 'Publiceren' },
  { id: 'targeting', label: 'Targeting' },
]

export function setPublishTab(id) {
  current = id
  subscribers.forEach((fn) => fn())
}

export function usePublishTab() {
  const tab = useSyncExternalStore(
    (fn) => {
      subscribers.add(fn)
      return () => subscribers.delete(fn)
    },
    () => current,
  )
  return [tab, setPublishTab]
}

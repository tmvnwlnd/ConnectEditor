import { useSyncExternalStore } from 'react'

/* The open tab of the last step ("publiceren" | "update"). Shared because the TABS live in the sticky
   page header (Layout) while the CONTENT is ArticleSettings — both read and set it through `usePublishTab()`. */
let current = 'publiceren'
const subscribers = new Set()

// New article: Publicatie only (targeting lives on the Plaatsing step). Updating an existing article: Update comes FIRST.
export const PUBLISH_TABS = [
  { id: 'publiceren', label: 'Publicatie' },
]
export const UPDATE_PUBLISH_TABS = [
  { id: 'update', label: 'Update' },
  ...PUBLISH_TABS,
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

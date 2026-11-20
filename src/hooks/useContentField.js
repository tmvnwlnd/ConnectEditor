import { useEffect, useRef, useState } from 'react'

/**
 * Local editing state for one field of a block's `content` that FOLLOWS the prop:
 * when `content[key]` changes from outside (Word import, AI suggestion, undo, swap, duplicate…),
 * the local value is replaced with it. Edits made here still go out via the editor's own onChange.
 *
 * `const [caption, setCaption] = useContentField(content, 'caption', '')`
 * (Same `||` fallback as the old `useState(content?.caption || '')`.)
 */
export function useContentField(content, key, fallback) {
  const external = content?.[key]
  const [value, setValue] = useState(() => external || (typeof fallback === 'function' ? fallback() : fallback))
  const last = useRef(external)
  useEffect(() => {
    if (external === last.current) return
    last.current = external
    setValue(external || (typeof fallback === 'function' ? fallback() : fallback))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [external])
  return [value, setValue]
}

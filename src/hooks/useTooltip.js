import { useEffect, useRef } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'

const OPTIONS = { theme: 'translucent', arrow: true, animation: 'fade' }

/**
 * Attach a tippy tooltip to one element: `const ref = useTooltip('Dupliceer')` → `<div ref={ref}>`.
 * Re-created when the text or placement changes; destroyed on unmount.
 */
export function useTooltip(text, placement = 'left') {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !text) return
    const instance = tippy(ref.current, { ...OPTIONS, content: text, placement })
    return () => instance.destroy()
  }, [text, placement])
  return ref
}

/**
 * Tooltips for every `[data-tooltip]` element INSIDE a container (scoped — never matches other blocks' buttons).
 * `const ref = useTooltips('top')` → `<div ref={ref}>…<button data-tooltip="…">`.
 * Pass `deps` that change when the set of buttons changes.
 */
export function useTooltips(placement = 'top', deps = []) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const targets = Array.from(ref.current.querySelectorAll('[data-tooltip]'))
    if (!targets.length) return
    const instances = tippy(targets, { ...OPTIONS, content: (el) => el.getAttribute('data-tooltip'), placement })
    return () => instances.forEach((i) => i.destroy())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, ...deps])
  return ref
}

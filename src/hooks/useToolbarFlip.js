import { useEffect, useState } from 'react'

const GAP = 8 // matches the toolbar's margin above the field (--s-small)

/**
 * The Trumbowyg toolbar floats ABOVE its field (styles/ContentEditor.css). When there isn't room for it between the
 * field and the top of the scrolling canvas / under the page header (e.g. the Header block's title), it flips BELOW the field.
 * Measured when editing starts and while the canvas scrolls. Returns true = place the toolbar below.
 *
 * @param {React.RefObject} rootRef - The editor's root element (contains .trumbowyg-box)
 * @param {boolean} isEditing
 */
export function useToolbarFlip(rootRef, isEditing) {
  const [below, setBelow] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    if (!isEditing || !root) return
    const box = root.querySelector('.trumbowyg-box')
    const pane = root.querySelector('.trumbowyg-button-pane')
    const scroller = root.closest('.article-canvas') || document.documentElement
    if (!box || !pane) return

    const measure = () => {
      // The page header floats over the top of the canvas, so the usable top is whichever ends lower.
      const header = document.querySelector('.page-header')
      const limit = Math.max(
        scroller === document.documentElement ? 0 : scroller.getBoundingClientRect().top,
        header ? header.getBoundingClientRect().bottom : 0
      )
      setBelow(box.getBoundingClientRect().top - pane.offsetHeight - GAP < limit)
    }
    measure()
    scroller.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      scroller.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [rootRef, isEditing])

  return below
}

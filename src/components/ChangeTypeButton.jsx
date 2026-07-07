import { useEffect, useRef } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import { Icon } from './ds'

/**
 * ChangeTypeButton
 *
 * Small swap icon next to a versioned block's title. Reopens the block-type
 * picker so the version's block type can be changed.
 *
 * @param {Function} onClick
 */
function ChangeTypeButton({ onClick }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const instance = tippy(ref.current, {
      content: 'Wijzig bloktype',
      placement: 'top',
      theme: 'translucent',
      arrow: true,
      animation: 'fade',
    })
    return () => instance.destroy()
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      className="element-change-type"
      onClick={(e) => { e.stopPropagation(); onClick() }}
      aria-label="Wijzig bloktype"
    >
      <Icon name="ui-arrow-2-capsuleshape" size={16} color="var(--gray-400)" />
    </button>
  )
}

export default ChangeTypeButton

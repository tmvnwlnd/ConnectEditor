import { useEffect, useRef } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import Icon from './Icon'
import './InfoTip.css'

/**
 * InfoTip — an info icon (for inside a label) whose explanation shows as a tooltip on hover or keyboard focus.
 * The text is also the icon's accessible name, so screen readers get it without the tooltip.
 *
 * @param {string} text - The explanation
 */
function InfoTip({ text, className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current || !text) return
    const t = tippy(ref.current, { content: text, theme: 'translucent', arrow: true, animation: 'fade', placement: 'top', maxWidth: 320 })
    return () => t.destroy()
  }, [text])
  if (!text) return null
  return (
    <span ref={ref} className={`ds-infotip ${className}`} tabIndex={0} role="img" aria-label={text}
      onClick={(e) => e.preventDefault()}>
      <Icon name="ui-info" size={16} color="var(--gray-400)" />
    </span>
  )
}

export default InfoTip

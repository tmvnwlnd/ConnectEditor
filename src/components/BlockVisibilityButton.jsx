import { useEffect, useId, useRef, useState } from 'react'
import { Icon, RadioButton } from './ds'
import '../styles/BlockVisibilityButton.css'

/**
 * BlockVisibilityButton Component
 *
 * A subtle eye-icon button shown next to a block's title. Hovering it reveals
 * a small popover to the right with three radios for target audience
 * visibility. Selection is applied instantly. When the block has a non-default
 * visibility the button expands into a green pill showing the selected
 * audience name next to the eye icon.
 *
 * @param {string} blockLabel - Label used for the aria-label (kept for a11y)
 * @param {string} visibility - Current visibility ("all" | "kpn-excellence" | "routit")
 * @param {Function} onVisibilityChange - Called with the new visibility value
 */

export const VISIBILITY_OPTIONS = [
  { value: 'all', label: 'Alle partnertypes' },
  { value: 'kpn-excellence', label: 'KPN Excellence' },
  { value: 'routit', label: 'RoutIT' }
]

export const DEFAULT_VISIBILITY = 'all'

// Small delay before closing on mouse leave, so the user can move
// from the button to the popover across the gap without it disappearing.
const CLOSE_DELAY_MS = 350

const BlockVisibilityButton = ({
  blockLabel,
  visibility = DEFAULT_VISIBILITY,
  onVisibilityChange
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const closeTimerRef = useRef(null)
  // Unique radio group name per instance so DOM-level radio grouping
  // doesn't cross-contaminate across blocks (which all mount their popover
  // for the fade transition).
  const groupName = useId()

  const hasCustomVisibility = visibility !== DEFAULT_VISIBILITY
  const selectedLabel = VISIBILITY_OPTIONS.find(opt => opt.value === visibility)?.label

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  // Cleanup any pending close timer on unmount
  useEffect(() => clearCloseTimer, [])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleMouseEnter = () => {
    clearCloseTimer()
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY_MS)
  }

  const handleSelect = (value) => {
    if (onVisibilityChange) onVisibilityChange(value)
  }

  return (
    <div
      className="block-visibility-wrapper"
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        className={`block-visibility-button ${hasCustomVisibility ? 'has-selection' : ''}`}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        aria-label={`Zichtbaarheid van dit blok instellen${blockLabel ? ` (${blockLabel})` : ''}`}
        aria-expanded={isOpen}
      >
        <Icon
          name="ui-eye"
          size={16}
          color={hasCustomVisibility ? 'var(--kpn-green-700)' : 'var(--gray-300)'}
        />
        {hasCustomVisibility && (
          <span className="block-visibility-label">{selectedLabel}</span>
        )}
      </button>

      <div
        className={`block-visibility-popover ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="block-visibility-options">
          {VISIBILITY_OPTIONS.map(opt => (
            <RadioButton
              key={opt.value}
              label={opt.label}
              name={groupName}
              value={opt.value}
              checked={visibility === opt.value}
              onChange={() => handleSelect(opt.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BlockVisibilityButton

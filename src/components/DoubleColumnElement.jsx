import { useEffect, useState } from 'react'
import BlockHeader from './BlockHeader'
import PositioningButtons from './PositioningButtons'
import ElementContent from './ElementContent'
import { getDoubleElementConfig } from '../config/elementTypes'
import '../styles/DoubleColumnElement.css'

/**
 * DoubleColumnElement — a combined block: one header + rail, with its inner blocks (slots) side by side.
 * Inner blocks are bare editors (ElementContent): no icon, title or rail of their own.
 *
 * @param {string} type - Double element type (e.g. 'paragraph-image') — gives the header's icon + label
 * @param {Array<{type, content}>} slots - Inner blocks in display order (swap = reversed by the parent)
 * @param {Function} onUpdateSlot - (index, content) => void
 * @param {boolean} isFocused, isFirst, isLast
 * @param {Function} onMoveUp, onMoveDown, onSwap, onDuplicate, onDelete
 * @param {boolean} hasOtherText - For the AI button (inner blocks don't show one today)
 */
function DoubleColumnElement({
  type,
  slots = [],
  isFocused = false,
  isFirst = false,
  isLast = false,
  hasOtherText = false,
  onUpdateSlot,
  onMoveUp,
  onMoveDown,
  onSwap,
  onDuplicate,
  onDelete
}) {
  const [isSwapping, setIsSwapping] = useState(false)
  const config = getDoubleElementConfig(type)

  // Swap animation (400ms, matches the CSS)
  useEffect(() => {
    if (!isSwapping) return
    const timer = setTimeout(() => setIsSwapping(false), 400)
    return () => clearTimeout(timer)
  }, [isSwapping])

  if (!config) {
    console.error(`Unknown double element type: ${type}`)
    return null
  }

  const handleSwap = onSwap && (() => {
    setIsSwapping(true)
    onSwap()
  })

  return (
    <div className="double-column-container">
      <PositioningButtons
        visible={isFocused}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onSwap={handleSwap}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      <div className={`double-column-wrapper ${isFocused ? 'focused' : ''}`}>
        <BlockHeader icon={config.icon} label={config.label} isFocused={isFocused} greenLabelWhenFocused />
        <div className={`double-column-grid ${isSwapping ? 'swapping' : ''}`}>
          {slots.slice(0, 2).map((slot, i) => (
            <div key={i} className={i === 0 ? 'double-column-left' : 'double-column-right'}>
              <ElementContent
                type={slot.type}
                content={slot.content}
                onChange={(content) => onUpdateSlot?.(i, content)}
                isFocused={isFocused}
                hasOtherText={hasOtherText}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoubleColumnElement

import { useEffect, useRef, useState } from 'react'
import BlockHeader from './BlockHeader'
import PositioningButtons from './PositioningButtons'
import ElementContent from './ElementContent'
import { getDoubleElementConfig } from '../config/elementTypes'
import '../styles/DoubleColumnElement.css'

/**
 * DoubleColumnElement Component
 *
 * Renders predetermined double-column element combinations.
 * Handles swap functionality and positioning controls.
 *
 * @param {string} type - Double element type (e.g., 'paragraph-image')
 * @param {*} leftContent - Content for left column
 * @param {*} rightContent - Content for right column
 * @param {boolean} swapped - Whether columns are swapped
 * @param {boolean} isFocused - Whether this element is focused
 * @param {boolean} isFirst - Whether this is the first element
 * @param {boolean} isLast - Whether this is the last element
 * @param {Function} onUpdateLeft - Handler for left content updates
 * @param {Function} onUpdateRight - Handler for right content updates
 * @param {Function} onMoveUp - Handler for move up action
 * @param {Function} onMoveDown - Handler for move down action
 * @param {Function} onSwap - Handler for swap columns action
 * @param {Function} onDuplicate - Handler for duplicate action
 * @param {Function} onDelete - Handler for delete action
 * @param {boolean} hasOtherText - Whether other text blocks exist (for Judith AI conditions)
 */
function DoubleColumnElement({
  type,
  leftContent,
  rightContent,
  swapped = false,
  isFocused = false,
  isFirst = false,
  isLast = false,
  hasOtherText = false,
  onUpdateLeft,
  onUpdateRight,
  onMoveUp,
  onMoveDown,
  onSwap,
  onDuplicate,
  onDelete
}) {
  const [isSwapping, setIsSwapping] = useState(false)
  const previousSwapped = useRef(swapped)

  const config = getDoubleElementConfig(type)

  // Detect swap changes and trigger animation
  useEffect(() => {
    if (previousSwapped.current !== swapped) {
      setIsSwapping(true)
      const timer = setTimeout(() => {
        setIsSwapping(false)
      }, 400) // Match animation duration
      previousSwapped.current = swapped
      return () => clearTimeout(timer)
    }
  }, [swapped])

  if (!config) {
    console.error(`Unknown double element type: ${type}`)
    return null
  }

  // Determine actual left/right types and content based on swap state
  const leftType = swapped ? config.rightType : config.leftType
  const rightType = swapped ? config.leftType : config.rightType
  const leftContentActual = swapped ? rightContent : leftContent
  const rightContentActual = swapped ? leftContent : rightContent
  const onUpdateLeftActual = swapped ? onUpdateRight : onUpdateLeft
  const onUpdateRightActual = swapped ? onUpdateLeft : onUpdateRight

  return (
    <div className="double-column-container">
      <PositioningButtons
        visible={isFocused}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onSwap={onSwap}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      {/* Double Column Grid */}
      <div className={`double-column-wrapper ${isFocused ? 'focused' : ''}`}>
        <BlockHeader icon={config.icon} label={config.label} isFocused={isFocused} greenLabelWhenFocused />
        <div className={`double-column-grid ${isSwapping ? 'swapping' : ''}`}>
          <div className="double-column-left">
            <ElementContent
              type={leftType}
              content={leftContentActual}
              onChange={onUpdateLeftActual}
              isFocused={isFocused}
              hasOtherText={hasOtherText}
            />
          </div>
          <div className="double-column-right">
            <ElementContent
              type={rightType}
              content={rightContentActual}
              onChange={onUpdateRightActual}
              isFocused={isFocused}
              hasOtherText={hasOtherText}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoubleColumnElement

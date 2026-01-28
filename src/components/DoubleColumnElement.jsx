import { useEffect, useRef, useState } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import { Button, JudithButton } from './ds'
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
 */
function DoubleColumnElement({
  type,
  leftContent,
  rightContent,
  swapped = false,
  isFocused = false,
  isFirst = false,
  isLast = false,
  onUpdateLeft,
  onUpdateRight,
  onMoveUp,
  onMoveDown,
  onSwap,
  onDuplicate,
  onDelete
}) {
  const upRef = useRef(null)
  const downRef = useRef(null)
  const swapRef = useRef(null)
  const duplicateRef = useRef(null)
  const deleteRef = useRef(null)
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

  useEffect(() => {
    // Initialize tippy.js tooltips
    const instances = []

    if (upRef.current) {
      instances.push(tippy(upRef.current, {
        content: 'Verplaats omhoog',
        placement: 'left',
        theme: 'translucent',
        arrow: true,
        animation: 'fade'
      }))
    }

    if (downRef.current) {
      instances.push(tippy(downRef.current, {
        content: 'Verplaats omlaag',
        placement: 'left',
        theme: 'translucent',
        arrow: true,
        animation: 'fade'
      }))
    }

    if (swapRef.current) {
      instances.push(tippy(swapRef.current, {
        content: 'Wissel kolommen',
        placement: 'left',
        theme: 'translucent',
        arrow: true,
        animation: 'fade'
      }))
    }

    if (duplicateRef.current) {
      instances.push(tippy(duplicateRef.current, {
        content: 'Dupliceer',
        placement: 'left',
        theme: 'translucent',
        arrow: true,
        animation: 'fade'
      }))
    }

    if (deleteRef.current) {
      instances.push(tippy(deleteRef.current, {
        content: 'Verwijder',
        placement: 'left',
        theme: 'translucent',
        arrow: true,
        animation: 'fade'
      }))
    }

    // Cleanup
    return () => {
      instances.forEach(instance => instance.destroy())
    }
  }, [isFocused])

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

  // Determine if we should show Judith button (at least one column is paragraph)
  const showJudithButton = leftType === 'paragraph' || rightType === 'paragraph'

  // Handlers for applying AI suggestions to columns
  const handleApplyLeft = (suggestion) => {
    if (leftType === 'paragraph') {
      const newContent = `<p>${suggestion}</p>`
      onUpdateLeftActual(newContent)
    }
  }

  const handleApplyRight = (suggestion) => {
    if (rightType === 'paragraph') {
      const newContent = `<p>${suggestion}</p>`
      onUpdateRightActual(newContent)
    }
  }

  return (
    <div className="double-column-container">
      {/* Positioning Buttons */}
      {isFocused && (
        <div className="double-column-buttons">
          <div ref={upRef}>
            <Button
              variant="icon-only"
              iconColor="secondary"
              icon="ui-arrow-up"
              onClick={(e) => {
                e.stopPropagation()
                if (!isFirst && onMoveUp) onMoveUp()
              }}
              disabled={isFirst}
              aria-label="Verplaats omhoog"
            />
          </div>
          <div ref={downRef}>
            <Button
              variant="icon-only"
              iconColor="secondary"
              icon="ui-arrow-down"
              onClick={(e) => {
                e.stopPropagation()
                if (!isLast && onMoveDown) onMoveDown()
              }}
              disabled={isLast}
              aria-label="Verplaats omlaag"
            />
          </div>
          <div ref={swapRef}>
            <Button
              variant="icon-only"
              iconColor="secondary"
              icon="ui-arrow-right-arrow-left"
              onClick={(e) => {
                e.stopPropagation()
                if (onSwap) onSwap()
              }}
              aria-label="Wissel kolommen"
            />
          </div>
          <div ref={duplicateRef}>
            <Button
              variant="icon-only"
              iconColor="secondary"
              icon="ui-copy"
              onClick={(e) => {
                e.stopPropagation()
                if (onDuplicate) onDuplicate()
              }}
              aria-label="Dupliceer"
            />
          </div>
          <div ref={deleteRef}>
            <Button
              variant="icon-only"
              iconColor="secondary-red"
              icon="ui-trash"
              onClick={(e) => {
                e.stopPropagation()
                if (onDelete) onDelete()
              }}
              aria-label="Verwijder"
            />
          </div>
        </div>
      )}

      {/* Double Column Grid */}
      <div className={`double-column-wrapper ${isFocused ? 'focused' : ''}`}>
        {/* Header with Judith Button */}
        {isFocused && showJudithButton && (
          <div className="double-column-header">
            <JudithButton
              context="paragraph"
              isTwoColumn={true}
              onApplyLeft={handleApplyLeft}
              onApplyRight={handleApplyRight}
            />
          </div>
        )}
        <div className={`double-column-grid ${isSwapping ? 'swapping' : ''}`}>
          <div className="double-column-left">
            <ElementContent
              type={leftType}
              content={leftContentActual}
              onChange={onUpdateLeftActual}
              isFocused={isFocused}
            />
          </div>
          <div className="double-column-right">
            <ElementContent
              type={rightType}
              content={rightContentActual}
              onChange={onUpdateRightActual}
              isFocused={isFocused}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoubleColumnElement

import { useEffect, useRef } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import { Button } from './ds'
import '../styles/PositioningButtons.css'

/**
 * PositioningButtons Component
 *
 * Action buttons for single-column elements.
 * Uses design system icon-only buttons with tooltips.
 *
 * @param {boolean} visible - Whether buttons are visible
 * @param {boolean} dimmed - Whether buttons should be dimmed
 * @param {boolean} isFirst - Whether element is first
 * @param {boolean} isLast - Whether element is last
 * @param {Function} onMoveUp - Handler for move up
 * @param {Function} onMoveDown - Handler for move down
 * @param {Function} onDuplicate - Handler for duplicate
 * @param {Function} onDelete - Handler for delete
 */
const PositioningButtons = ({
  visible,
  dimmed,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete
}) => {
  const upRef = useRef(null)
  const downRef = useRef(null)
  const duplicateRef = useRef(null)
  const deleteRef = useRef(null)

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
  }, [])

  return (
    <div className={`positioning-buttons ${visible ? 'visible' : ''} ${dimmed ? 'dimmed' : ''}`}>
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
  )
}

export default PositioningButtons

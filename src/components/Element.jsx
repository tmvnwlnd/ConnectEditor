import { useState } from 'react'
import ElementWrapper from './ElementWrapper'
import { getSingleElementConfig } from '../config/elementTypes'

/**
 * Element Component
 *
 * Unified component for single-column elements.
 * Routes element types to their content components via ElementWrapper.
 *
 * @param {string} type - Element type (e.g., 'paragraph', 'header', 'citation', etc.)
 * @param {*} content - Element content
 * @param {Function} onChange - Content change handler
 * @param {boolean} isFocused - Whether this element is focused
 * @param {boolean} isFirst - Whether this is the first element
 * @param {boolean} isLast - Whether this is the last element
 * @param {Function} onMoveUp - Move up handler
 * @param {Function} onMoveDown - Move down handler
 * @param {Function} onDuplicate - Duplicate handler
 * @param {Function} onDelete - Delete handler
 */
const Element = ({
  type,
  content,
  onChange,
  isFocused = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete
}) => {
  // State for dimming positioning buttons (used by TableContent)
  const [dimPositioningButtons, setDimPositioningButtons] = useState(false)

  // Get element configuration
  const config = getSingleElementConfig(type)

  if (!config) {
    console.error(`Unknown element type: ${type}`)
    return null
  }

  const { label, icon, ContentComponent } = config

  // Render placeholder for disabled elements
  if (!ContentComponent) {
    return (
      <ElementWrapper
        elementType={type}
        label={label}
        icon={icon}
        isFocused={isFocused}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        dimPositioningButtons={dimPositioningButtons}
      >
        <div className="element-placeholder">
          <p className="body-r text-gray-400">Dit element is nog niet beschikbaar</p>
        </div>
      </ElementWrapper>
    )
  }

  return (
    <ElementWrapper
      elementType={type}
      label={label}
      icon={icon}
      isFocused={isFocused}
      isFirst={isFirst}
      isLast={isLast}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDuplicate={onDuplicate}
      onDelete={onDelete}
      dimPositioningButtons={dimPositioningButtons}
    >
      <ContentComponent
        content={content}
        onChange={onChange}
        isFocused={isFocused}
        onDimPositioningButtons={setDimPositioningButtons}
      />
    </ElementWrapper>
  )
}

export default Element

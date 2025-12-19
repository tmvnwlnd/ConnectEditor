import PositioningButtons from './PositioningButtons'
import Icon from './Icon'
import '../styles/ElementWrapper.css'

/**
 * ElementWrapper Component
 *
 * Standardized wrapper for all article elements.
 * Provides consistent styling, focus behavior, header, and positioning controls.
 *
 * @param {string} elementType - Type identifier (e.g., 'header', 'paragraph', 'citation', 'image', 'table', 'audio')
 * @param {string} label - Display label for the element header
 * @param {React.ComponentType} icon - Icon component for the header
 * @param {boolean} isFocused - Whether this element is currently focused
 * @param {boolean} isFirst - Whether this is the first element
 * @param {boolean} isLast - Whether this is the last element
 * @param {boolean} isLinking - Whether this element is in linking mode
 * @param {Function} onMoveUp - Handler for move up action
 * @param {Function} onMoveDown - Handler for move down action
 * @param {Function} onLink - Handler for link action
 * @param {Function} onDuplicate - Handler for duplicate action
 * @param {Function} onDelete - Handler for delete action
 * @param {React.ReactNode} children - Element-specific content to render
 * @param {string} className - Additional CSS classes
 * @param {boolean} dimPositioningButtons - Whether to dim positioning buttons (for nested focus)
 */
const ElementWrapper = ({
  elementType,
  label,
  icon: IconComponent,
  isFocused = false,
  isFirst = false,
  isLast = false,
  isLinking = false,
  onMoveUp,
  onMoveDown,
  onLink,
  onDuplicate,
  onDelete,
  children,
  className = '',
  dimPositioningButtons = false
}) => {
  return (
    <div className="editor-section-container">
      <PositioningButtons
        visible={isFocused && !dimPositioningButtons}
        dimmed={dimPositioningButtons}
        isFirst={isFirst}
        isLast={isLast}
        isLinking={isLinking}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onLink={onLink}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      <div
        className={`
          element-wrapper
          element-wrapper-${elementType}
          ${isFocused ? 'element-focused' : ''}
          ${className}
        `.trim()}
      >
        <div className="element-header">
          <span className="element-header-icon">
            <Icon
              icon={IconComponent}
              color={isFocused ? '#00c300' : '#737373'}
              size={24}
            />
          </span>
          <span>{label}</span>
        </div>

        <div className="element-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ElementWrapper

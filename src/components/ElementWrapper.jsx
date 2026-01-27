import PositioningButtons from './PositioningButtons'
import { Icon } from './ds'
import '../styles/ElementWrapper.css'

/**
 * ElementWrapper Component
 *
 * Standardized wrapper for all single-column article elements.
 * Provides consistent styling, focus behavior, header, and positioning controls.
 *
 * @param {string} elementType - Type identifier (e.g., 'header', 'paragraph', 'citation', 'image', 'table')
 * @param {string} label - Display label for the element header
 * @param {string} icon - Icon name for the header
 * @param {boolean} isFocused - Whether this element is currently focused
 * @param {boolean} isFirst - Whether this is the first element
 * @param {boolean} isLast - Whether this is the last element
 * @param {Function} onMoveUp - Handler for move up action
 * @param {Function} onMoveDown - Handler for move down action
 * @param {Function} onDuplicate - Handler for duplicate action
 * @param {Function} onDelete - Handler for delete action
 * @param {React.ReactNode} children - Element-specific content to render
 * @param {string} className - Additional CSS classes
 * @param {boolean} dimPositioningButtons - Whether to dim positioning buttons (for nested focus)
 */
const ElementWrapper = ({
  elementType,
  label,
  icon,
  isFocused = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  children,
  className = '',
  dimPositioningButtons = false
}) => {
  return (
    <div className="element-section-container">
      <PositioningButtons
        visible={isFocused && !dimPositioningButtons}
        dimmed={dimPositioningButtons}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
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
          <Icon
            name={icon}
            size={24}
            color={isFocused ? 'var(--kpn-green-500)' : 'var(--gray-400)'}
          />
          <span className="body-l">{label}</span>
        </div>

        <div className="element-content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ElementWrapper

import PositioningButtons from './PositioningButtons'
import BlockHeader from './BlockHeader'
import { JudithButton } from './ds'
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
 * @param {boolean} showJudithButton - Whether to show Judith AI button
 * @param {Function} onApplySuggestion - Handler for applying AI suggestion
 * @param {string} judithContext - Context for AI suggestions ('header', 'paragraph', 'citation')
 * @param {*} currentContent - Current content for Judith AI condition checking
 * @param {boolean} hasOtherText - Whether other text blocks exist (for Judith AI conditions)
 */
const ElementWrapper = ({
  elementType,
  label,
  icon,
  topBar = null,
  isTargeted = false,
  onTarget,
  isFocused = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  children,
  className = '',
  dimPositioningButtons = false,
  showJudithButton = false,
  onApplySuggestion,
  judithContext = 'paragraph',
  currentContent = '',
  hasOtherText = false
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
        onTarget={onTarget}
        isTargeted={isTargeted}
      />

      <div className="element-versioned-stack">
        {topBar}
        <div
          className={`
            element-wrapper
            element-wrapper-${elementType}
            ${isFocused ? 'element-focused' : ''}
            ${isTargeted ? 'element-versioned' : ''}
            ${className}
          `.trim()}
        >
          <BlockHeader
            icon={icon}
            label={label}
            isFocused={isFocused}
            right={showJudithButton && isFocused && onApplySuggestion ? (
              <JudithButton
                context={judithContext}
                onApplySuggestion={onApplySuggestion}
                currentContent={currentContent}
                hasOtherText={hasOtherText}
              />
            ) : null}
          />

          <div className="element-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ElementWrapper

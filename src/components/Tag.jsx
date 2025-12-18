import Icon from './Icon'
import XIcon from '../icons/ui-x.svg?react'
import '../styles/Tag.css'

/**
 * Tag Component
 *
 * A flexible tag/badge component with optional remove button.
 * Used for group tags, category tags, etc.
 *
 * @param {string} label - Tag text content
 * @param {Function} onRemove - Optional callback when remove button is clicked
 * @param {string} variant - Visual style: 'default' | 'success' | 'info' | 'warning'
 * @param {React.ComponentType} removeIcon - Icon for remove button (default: XIcon)
 * @param {number} removeIconSize - Size of remove icon (default: 12)
 * @param {string} className - Additional CSS classes
 */
const Tag = ({
  label,
  onRemove,
  variant = 'default',
  removeIcon = XIcon,
  removeIconSize = 12,
  className = ''
}) => {
  return (
    <span className={`tag tag-${variant} ${className}`}>
      <span className="tag-label">{label}</span>
      {onRemove && (
        <button
          className="tag-remove"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          type="button"
        >
          <Icon icon={removeIcon} size={removeIconSize} />
        </button>
      )}
    </span>
  )
}

export default Tag

import { useState } from 'react'
import Icon from './Icon'
import PlusIcon from '../icons/ui-plus.svg?react'

/**
 * SidebarListItem Component
 *
 * A list item for the element sidebar that shows:
 * - Element icon (green)
 * - Element label
 * - Plus icon on hover (for enabled items)
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the element
 * @param {string} props.label - Display label for the element
 * @param {React.ComponentType} props.icon - Icon component for the element
 * @param {boolean} props.enabled - Whether the element is enabled/clickable
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const SidebarListItem = ({
  id,
  label,
  icon: IconComponent,
  enabled = true,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (enabled && onClick) {
      onClick(id)
    }
  }

  return (
    <div
      className={`element-item ${!enabled ? 'disabled' : ''} ${isHovered ? 'hovered' : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="element-icon">
        <Icon icon={IconComponent} color="#00c300" size={20} />
      </span>
      <span className="element-label">{label}</span>
      {enabled && isHovered && (
        <span className="plus-icon">
          <Icon icon={PlusIcon} color="#00c300" size={20} />
        </span>
      )}
    </div>
  )
}

export default SidebarListItem

import { useState } from 'react'
import IconButton from './IconButton'
import PlusIcon from '../icons/ui-plus.svg?react'
import '../styles/TemplateListItem.css'

/**
 * TemplateListItem Component
 *
 * A list item for templates in the sidebar
 *
 * @param {string} id - Unique identifier for the template
 * @param {string} title - Template title
 * @param {string} description - Template description
 * @param {Function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */
const TemplateListItem = ({
  id,
  title,
  description,
  onClick,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    if (onClick) {
      onClick(id)
    }
  }

  return (
    <div
      className={`template-item ${isHovered ? 'hovered' : ''} ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="template-content">
        <h4 className="template-title">{title}</h4>
        <p className="template-description">{description}</p>
      </div>
      <IconButton
        variant="outline-primary"
        icon={PlusIcon}
        size={24}
        onClick={(e) => {
          e.stopPropagation()
          handleClick()
        }}
      />
    </div>
  )
}

export default TemplateListItem

import { useState } from 'react'
import Icon from './Icon'
import '../styles/IconButton.css'

/**
 * IconButton Component
 *
 * Icon-only button with consistent styling from Button component.
 * Always 40x40px.
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline-primary' | 'outline-secondary'} props.variant - Button style variant
 * @param {React.ComponentType} props.icon - Icon component (SVG React component)
 * @param {number} props.size - Icon size in pixels (default: 24)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 */
const IconButton = ({
  variant = 'primary',
  icon: IconComponent,
  size = 24,
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const baseClass = 'icon-btn'
  const variantClass = `icon-btn-${variant}`
  const buttonClasses = `${baseClass} ${variantClass} ${className}`.trim()

  // Determine icon color based on variant and hover state
  const getIconColor = () => {
    if (variant === 'primary') {
      return 'white'
    }
    if (variant === 'secondary') {
      return isHovered ? 'white' : '#0066EE'
    }
    if (variant === 'outline-primary') {
      return isHovered ? 'white' : '#0066EE'
    }
    if (variant === 'outline-secondary') {
      return '#737373'
    }
    return 'currentColor'
  }

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {IconComponent && (
        <Icon icon={IconComponent} color={getIconColor()} size={size} />
      )}
    </button>
  )
}

export default IconButton

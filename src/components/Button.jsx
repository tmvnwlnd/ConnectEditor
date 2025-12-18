import { useState } from 'react'
import Icon from './Icon'
import '../styles/Button.css'

/**
 * Reusable Button Component
 *
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline-primary' | 'outline-secondary'} props.variant - Button style variant
 * @param {React.ReactNode} props.children - Button text/content
 * @param {React.ComponentType} props.icon - Optional icon component (SVG React component)
 * @param {'left' | 'right'} props.iconPosition - Position of icon relative to text (default: 'right')
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disabled state
 * @param {Function} props.onClick - Click handler
 */
const Button = ({
  variant = 'primary',
  children,
  icon: IconComponent,
  iconPosition = 'right',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const baseClass = 'btn'
  const variantClass = `btn-${variant}`
  const iconClass = IconComponent ? 'btn-with-icon' : ''
  const buttonClasses = `${baseClass} ${variantClass} ${iconClass} ${className}`.trim()

  // Determine icon color based on variant and hover state
  const getIconColor = () => {
    if (variant === 'primary') {
      return 'white'
    }
    if (variant === 'secondary') {
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
      {IconComponent && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">
          <Icon icon={IconComponent} color={getIconColor()} size={24} />
        </span>
      )}
      <span className="btn-text">{children}</span>
      {IconComponent && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">
          <Icon icon={IconComponent} color={getIconColor()} size={24} />
        </span>
      )}
    </button>
  )
}

export default Button

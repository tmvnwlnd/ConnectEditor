/**
 * Button Component
 * Primary action button with multiple variants
 *
 * @param {string} variant - 'primary', 'secondary', 'blue', 'lime', 'red', 'secondary-blue', 'secondary-lime', 'secondary-red', 'ghost', 'icon-only'
 * @param {string} iconColor - Color variant for icon-only buttons: 'primary', 'secondary', 'lime', 'red', 'secondary-red'
 * @param {string} size - 'default' (40px), 'compact' (32px) - only for ghost variant
 * @param {string} children - Button text content
 * @param {string} icon - Icon name (optional, displayed on right)
 * @param {string} iconStart - Icon name (optional, displayed on left)
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} type - Button type (default: 'button')
 * @param {string} className - Additional CSS classes
 */

import Icon from './Icon'
import './Button.css'

function Button({
  variant = 'primary',
  iconColor,
  size = 'default',
  children,
  icon,
  iconStart,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}) {
  // Icon-only variant
  if (variant === 'icon-only') {
    const iconColorClass = iconColor ? `btn-icon-${iconColor}` : ''
    return (
      <button
        className={`btn btn-icon-only ${iconColorClass} ${className}`}
        onClick={onClick}
        disabled={disabled}
        type={type}
        {...props}
      >
        {icon && (
          <Icon
            name={icon}
            size={24}
          />
        )}
      </button>
    )
  }

  // Regular button variants
  return (
    <button
      className={`btn btn-${variant} btn-size-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {iconStart && (
        <Icon
          name={iconStart}
          size={24}
          className="btn-icon-start"
        />
      )}
      <span className="btn-text">{children}</span>
      {icon && (
        <Icon
          name={icon}
          size={24}
          className="btn-icon"
        />
      )}
    </button>
  )
}

export default Button

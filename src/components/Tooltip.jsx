import Icon from './Icon'
import '../styles/Tooltip.css'

/**
 * Tooltip Component
 *
 * Displays a tooltip on hover with an icon trigger.
 * Commonly used with info icons to provide additional context.
 *
 * @param {React.ComponentType} icon - Icon component to display (default: no icon, uses children)
 * @param {number} iconSize - Size of icon in pixels (default: 16)
 * @param {string} iconColor - Color of icon (default: #0066EE)
 * @param {string} text - Tooltip text content
 * @param {string} position - Tooltip position: 'top' | 'bottom' | 'left' | 'right' (default: 'top')
 * @param {number} maxWidth - Maximum width of tooltip in pixels (default: 300)
 * @param {React.ReactNode} children - Optional children instead of icon
 * @param {string} className - Additional CSS classes
 */
const Tooltip = ({
  icon,
  iconSize = 16,
  iconColor = '#0066EE',
  text,
  position = 'top',
  maxWidth = 300,
  children,
  className = ''
}) => {
  return (
    <span
      className={`tooltip-wrapper tooltip-${position} ${className}`}
      data-tooltip={text}
      style={{ '--tooltip-max-width': `${maxWidth}px` }}
    >
      {icon ? (
        <Icon icon={icon} size={iconSize} color={iconColor} />
      ) : (
        children
      )}
    </span>
  )
}

export default Tooltip

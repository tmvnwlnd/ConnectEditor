/**
 * Pill Component
 * Interactive pill-shaped button for filters and selections
 *
 * @param {string} children - Pill text content
 * @param {string} variant - Size variant: 'default' (32px) or 'large' (40px)
 * @param {boolean} isSelected - Whether the pill is selected
 * @param {boolean} showCloseIcon - Show X icon when selected (default: true)
 * @param {boolean} disabled - Whether the pill is disabled
 * @param {function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */

import Icon from './Icon'
import './Pill.css'

function Pill({ children, variant = 'default', isSelected = false, showCloseIcon = true, disabled = false, onClick, className = '', ...props }) {
  return (
    <button
      className={`pill pill-size-${variant} ${isSelected ? 'pill-state-selected' : 'pill-state-default'} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      {...props}
    >
      <span className="pill-text">{children}</span>
      {isSelected && showCloseIcon && (
        <Icon
          name="ui-x"
          size={variant === 'large' ? 20 : 16}
          color="var(--gray-000)"
          className="pill-icon"
        />
      )}
    </button>
  )
}

export default Pill

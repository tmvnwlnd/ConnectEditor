/**
 * TextField Component
 * Single-line text input with optional icons
 *
 * @param {string} variant - Field variant: 'default' or 'search'
 * @param {string} label - Field label (bold)
 * @param {string} id - Input ID
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {function} onFocus - Focus handler
 * @param {function} onBlur - Blur handler
 * @param {string} placeholder - Placeholder text
 * @param {string} startIcon - Icon name for start position (optional)
 * @param {string} endIcon - Icon name for end position (optional)
 * @param {React.ReactNode} endButton - Optional button to display at the end
 * @param {boolean} hideStartIconOnFocus - Hide start icon when focused (for search variant)
 * @param {string} type - Input type (default: 'text')
 * @param {string} error - Error message (red outline + red text below field)
 * @param {string} warning - Warning message (orange text with icon below field)
 * @param {string} className - Additional CSS classes
 */

import { useState, useId } from 'react'
import Icon from './Icon'
import './Form.css'

function TextField({
  variant = 'default',
  label,
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = '',
  startIcon,
  endIcon,
  endButton,
  hideStartIconOnFocus = false,
  type = 'text',
  error,
  warning,
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false)
  const autoId = useId()
  const messageId = `${id || autoId}-message`

  const handleFocus = (e) => {
    setIsFocused(true)
    if (onFocus) onFocus(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    if (onBlur) onBlur(e)
  }

  const showStartIcon = startIcon && !(hideStartIconOnFocus && isFocused)
  const iconSize = variant === 'search' ? 24 : 20
  const iconColor = variant === 'search' ? 'var(--kpn-green-500)' : 'var(--gray-400)'
  const hasMessage = error || warning

  return (
    <div className={`form-field field-variant-${variant} ${className}`}>
      {label && variant !== 'search' && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <div className="field-input-wrapper">
        {showStartIcon && (
          <Icon
            name={startIcon}
            size={iconSize}
            color={iconColor}
            className="field-icon field-icon-start"
          />
        )}
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`field-input field-input-${variant} ${showStartIcon ? 'has-start-icon' : ''} ${endIcon ? 'has-end-icon' : ''} ${endButton ? 'has-end-button' : ''} ${error ? 'field-input-error' : ''}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          {...props}
        />
        {endIcon && (
          <Icon
            name={endIcon}
            size={iconSize}
            color="var(--kpn-blue-500)"
            className="field-icon field-icon-end"
          />
        )}
        {endButton && (
          <div className="field-end-button">
            {endButton}
          </div>
        )}
      </div>
      {error && (
        <p id={messageId} className="body-r field-error-message" role="alert">{error}</p>
      )}
      {!error && warning && (
        <p id={messageId} className="body-r field-warning-message">
          <Icon name="ui-exclamationmark-triangle" size={16} color="var(--color-warning)" />
          {warning}
        </p>
      )}
    </div>
  )
}

export default TextField

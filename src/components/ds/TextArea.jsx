/**
 * TextArea Component
 * Multi-line text input
 *
 * @param {string} label - Field label (bold)
 * @param {string} id - TextArea ID
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {function} onBlur - Blur handler
 * @param {string} placeholder - Placeholder text
 * @param {number} rows - Number of rows (default: 4)
 * @param {React.ReactNode} endButton - Optional button to display at the end
 * @param {string} error - Error message (red outline + red text below field)
 * @param {string} warning - Warning message (orange text with icon below field)
 * @param {string} className - Additional CSS classes
 * @param {React.Ref} textareaRef - Ref for the textarea element
 */

import { useId } from 'react'
import Icon from './Icon'
import './Form.css'

function TextArea({
  label,
  id,
  value,
  onChange,
  onBlur,
  placeholder = '',
  rows = 4,
  endButton,
  error,
  warning,
  className = '',
  textareaRef,
  ...props
}) {
  const autoId = useId()
  const messageId = `${id || autoId}-message`
  const hasMessage = error || warning

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <div className={`field-input-wrapper ${endButton ? 'is-multiline' : ''}`}>
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={rows}
          className={`field-textarea ${endButton ? 'has-end-button' : ''} ${error ? 'field-textarea-error' : ''}`}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          {...props}
        />
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

export default TextArea

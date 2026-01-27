/**
 * TextArea Component
 * Multi-line text input
 *
 * @param {string} label - Field label (bold)
 * @param {string} id - TextArea ID
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {number} rows - Number of rows (default: 4)
 * @param {React.ReactNode} endButton - Optional button to display at the end
 * @param {string} className - Additional CSS classes
 */

import './Form.css'

function TextArea({
  label,
  id,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  endButton,
  className = '',
  ...props
}) {
  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      )}
      <div className={`field-input-wrapper ${endButton ? 'is-multiline' : ''}`}>
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className={`field-textarea ${endButton ? 'has-end-button' : ''}`}
          {...props}
        />
        {endButton && (
          <div className="field-end-button">
            {endButton}
          </div>
        )}
      </div>
    </div>
  )
}

export default TextArea

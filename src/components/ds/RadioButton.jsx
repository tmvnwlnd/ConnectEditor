/**
 * RadioButton Component
 * Styled radio button with label
 *
 * @param {string} label - Radio button label text
 * @param {string} name - Radio group name
 * @param {boolean} checked - Whether the radio button is selected
 * @param {function} onChange - Change handler
 * @param {boolean} disabled - Whether the radio button is disabled
 * @param {React.ReactNode} children - Optional content rendered below the radio (e.g. a date picker)
 * @param {string} className - Additional CSS classes
 */

import './Form.css'

function RadioButton({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  return (
    <div className={`field-radio-row ${className}`}>
      <label className={`field-choice ${disabled ? 'field-choice-disabled' : ''}`}>
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <span>{label}</span>
      </label>
      {children}
    </div>
  )
}

export default RadioButton

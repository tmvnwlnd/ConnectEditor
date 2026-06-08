/**
 * Checkbox Component
 * Styled checkbox with label
 *
 * @param {string} label - Checkbox label text
 * @param {boolean} checked - Whether the checkbox is checked
 * @param {function} onChange - Change handler
 * @param {boolean} disabled - Whether the checkbox is disabled
 * @param {string} className - Additional CSS classes
 */

import './Form.css'

function Checkbox({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <label className={`field-choice ${disabled ? 'field-choice-disabled' : ''} ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      <span>{label}</span>
    </label>
  )
}

export default Checkbox

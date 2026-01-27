/**
 * Dropdown Component
 * Select dropdown with styled appearance
 *
 * @param {string} label - Field label (bold)
 * @param {string} id - Select ID
 * @param {string} value - Selected value
 * @param {function} onChange - Change handler
 * @param {array} options - Array of {value, label} objects
 * @param {string} placeholder - Placeholder option text
 * @param {string} className - Additional CSS classes
 */

import './Form.css'

function Dropdown({
  label,
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Selecteer...',
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="field-select"
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Dropdown

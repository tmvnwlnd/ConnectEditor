import '../styles/Dropdown.css'

/**
 * Dropdown Component
 *
 * A simple dropdown/select component.
 *
 * @param {string} value - Current selected value
 * @param {Function} onChange - Callback when selection changes
 * @param {Array} options - Array of {value, label} objects
 * @param {string} placeholder - Placeholder text when no value selected
 * @param {string} className - Additional CSS classes
 */
const Dropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Selecteer...',
  className = ''
}) => {
  return (
    <select
      className={`dropdown ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export default Dropdown

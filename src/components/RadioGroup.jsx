import '../styles/RadioGroup.css'

/**
 * RadioGroup Component
 *
 * A flexible radio button group with consistent styling.
 * Handles both simple and complex option structures.
 *
 * @param {string} name - Radio group name (required for grouping)
 * @param {Array} options - Array of options. Can be:
 *   - Simple: ['Option 1', 'Option 2']
 *   - Complex: [{value: 'val1', label: 'Label 1', description: 'Optional desc'}, ...]
 * @param {string|boolean} value - Currently selected value
 * @param {Function} onChange - Callback when selection changes: (value) => {}
 * @param {string} direction - Layout direction: 'vertical' (default) or 'horizontal'
 * @param {string} className - Additional CSS classes
 */
const RadioGroup = ({
  name,
  options = [],
  value,
  onChange,
  direction = 'vertical',
  className = ''
}) => {
  // Normalize options to always have {value, label} structure
  const normalizedOptions = options.map(option => {
    if (typeof option === 'string') {
      return { value: option, label: option }
    }
    return option
  })

  const handleChange = (optionValue) => {
    if (onChange) {
      onChange(optionValue)
    }
  }

  return (
    <div className={`radio-group radio-group-${direction} ${className}`}>
      {normalizedOptions.map((option, index) => {
        const isChecked = option.value === value
        const radioId = `${name}-${index}`

        return (
          <label key={radioId} className="radio-option">
            <input
              type="radio"
              id={radioId}
              name={name}
              value={option.value}
              checked={isChecked}
              onChange={() => handleChange(option.value)}
            />
            <span className="radio-label">
              {option.label}
              {option.description && (
                <span className="radio-description">{option.description}</span>
              )}
            </span>
          </label>
        )
      })}
    </div>
  )
}

export default RadioGroup

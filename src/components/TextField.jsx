import Tooltip from './Tooltip'
import Icon from './Icon'
import InfoIcon from '../icons/ui-info.svg?react'
import '../styles/TextField.css'

/**
 * TextField Component
 *
 * A flexible text input field with label, optional tooltip, and icon support.
 *
 * @param {string} label - Label text for the input field
 * @param {string} value - Current value of the input
 * @param {Function} onChange - Change handler function
 * @param {string} placeholder - Placeholder text
 * @param {string} tooltipText - Optional tooltip text to display on info icon hover
 * @param {boolean} multiline - If true, renders a textarea instead of input
 * @param {number} rows - Number of rows for textarea (default: 3)
 * @param {React.ComponentType} startIcon - Optional icon component to display at the start of input
 * @param {React.ComponentType} endIcon - Optional icon component to display at the end of input
 * @param {React.ReactNode} endContent - Optional custom content to display at the end (e.g., button)
 * @param {string} className - Additional CSS classes
 */
const TextField = ({
  label,
  value,
  onChange,
  placeholder = '',
  tooltipText,
  multiline = false,
  rows = 3,
  startIcon,
  endIcon,
  endContent,
  className = ''
}) => {
  const InputComponent = multiline ? 'textarea' : 'input'
  const hasStartIcon = !!startIcon
  const hasEndIcon = !!endIcon
  const hasEndContent = !!endContent

  return (
    <div className={`text-field ${className}`}>
      {label && (
        <label className="text-field-label">
          {label}
          {tooltipText && (
            <Tooltip
              icon={InfoIcon}
              text={tooltipText}
              position="top"
              iconSize={16}
              iconColor="#0066EE"
            />
          )}
        </label>
      )}
      <div className={`text-field-wrapper ${hasStartIcon ? 'has-start-icon' : ''} ${hasEndIcon ? 'has-end-icon' : ''} ${hasEndContent ? 'has-end-content' : ''}`}>
        {startIcon && (
          <span className="text-field-start-icon">
            <Icon icon={startIcon} color="#737373" size={20} />
          </span>
        )}
        <InputComponent
          type={multiline ? undefined : 'text'}
          className="text-field-input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          rows={multiline ? rows : undefined}
        />
        {endIcon && (
          <span className="text-field-end-icon">
            <Icon icon={endIcon} color="#737373" size={20} />
          </span>
        )}
        {endContent && (
          <span className="text-field-end-content">
            {endContent}
          </span>
        )}
      </div>
    </div>
  )
}

export default TextField

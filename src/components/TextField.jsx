import { useEffect, useRef } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
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
 * @param {string} error - Error message to display below the field
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
  error,
  className = '',
  ...props
}) => {
  const tooltipIconRef = useRef(null)
  const InputComponent = multiline ? 'textarea' : 'input'
  const hasStartIcon = !!startIcon
  const hasEndIcon = !!endIcon
  const hasEndContent = !!endContent

  useEffect(() => {
    if (tooltipText && tooltipIconRef.current) {
      const instance = tippy(tooltipIconRef.current, {
        content: tooltipText,
        placement: 'top',
        theme: 'translucent',
        arrow: true,
        animation: 'fade'
      })

      return () => {
        instance.destroy()
      }
    }
  }, [tooltipText])

  return (
    <div className={`text-field ${className}`}>
      {label && (
        <label className="text-field-label">
          {label}
          {tooltipText && (
            <span ref={tooltipIconRef} style={{ display: 'inline-flex', cursor: 'pointer' }}>
              <Icon icon={InfoIcon} color="#0066EE" size={16} />
            </span>
          )}
        </label>
      )}
      <div className={`text-field-wrapper ${hasStartIcon ? 'has-start-icon' : ''} ${hasEndIcon ? 'has-end-icon' : ''} ${hasEndContent ? 'has-end-content' : ''} ${multiline ? 'is-multiline' : ''} ${error ? 'has-error' : ''}`}>
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
          {...props}
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
      {error && (
        <p className="body-s text-field-error">{error}</p>
      )}
    </div>
  )
}

export default TextField

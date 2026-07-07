/**
 * Switch Component
 * An on/off toggle switch.
 *
 * @param {boolean} checked - Whether the switch is on
 * @param {function} onChange - Called with the new boolean state
 * @param {boolean} disabled
 * @param {string} label - Optional accessible label
 * @param {string} className
 */

import './Switch.css'

function Switch({ checked = false, onChange, disabled = false, label, className = '' }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={`ds-switch ${checked ? 'is-on' : ''} ${className}`}
      onClick={(e) => { e.stopPropagation(); if (!disabled && onChange) onChange(!checked) }}
    >
      <span className="ds-switch-thumb" />
    </button>
  )
}

export default Switch

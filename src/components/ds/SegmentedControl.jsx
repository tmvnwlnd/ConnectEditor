/**
 * SegmentedControl Component
 * A compact segmented selector for switching between a few mutually exclusive
 * options — same interaction pattern as the editor's write/preview toggle, but
 * tag-shaped and in a white / light-blue scheme.
 *
 * @param {Array<{id: string, label: string, icon?: string}>} options - Selectable segments
 * @param {string} value - The id of the currently active option
 * @param {function} onChange - Called with the selected option id
 * @param {string} className - Additional CSS classes
 */

import Icon from './Icon'
import './SegmentedControl.css'

function SegmentedControl({ options = [], value, onChange, className = '' }) {
  return (
    <div className={`segmented-control ${className}`} role="tablist">
      {options.map(option => {
        const isActive = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`segmented-option ${isActive ? 'active' : ''}`}
            onClick={() => onChange(option.id)}
          >
            {option.icon && (
              <Icon name={option.icon} size={16} color="currentColor" />
            )}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default SegmentedControl

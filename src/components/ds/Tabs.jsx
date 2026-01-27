/**
 * Tabs Component
 * Simple tab navigation with optional icons
 *
 * @param {array} tabs - Array of {id, label, icon?} objects
 * @param {string} activeTab - ID of the currently active tab
 * @param {function} onChange - Callback when tab is clicked (receives tab id)
 * @param {string} className - Additional CSS classes
 */

import Icon from './Icon'
import './Tabs.css'

function Tabs({ tabs = [], activeTab, onChange, className = '' }) {
  return (
    <div className={`tabs ${className}`}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'tab-active' : ''}`}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          {tab.icon && (
            <Icon name={tab.icon} size={20} color="currentColor" />
          )}
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

export default Tabs

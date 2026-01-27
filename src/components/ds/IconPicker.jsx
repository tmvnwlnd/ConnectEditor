/**
 * IconPicker Component
 * Searchable dropdown with grid display of all available icons
 *
 * @param {string} value - Currently selected icon name
 * @param {function} onChange - Callback when icon is selected (receives icon name)
 * @param {string} label - Field label
 * @param {string} className - Additional CSS classes
 */

import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'
import { VALID_ICON_NAMES } from './iconNames'
import './IconPicker.css'

function IconPicker({
  value,
  onChange,
  label,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Filter icons based on search query
  const filteredIcons = VALID_ICON_NAMES.filter(iconName =>
    iconName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectIcon = (iconName) => {
    onChange(iconName)
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div className={`icon-picker ${className}`} ref={containerRef}>
      {label && <label className="field-label">{label}</label>}

      {/* Selected Icon Display / Trigger */}
      <button
        type="button"
        className="icon-picker-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="icon-picker-selected">
          {value ? (
            <>
              <Icon name={value} size={24} />
              <span className="body-r">{value}</span>
            </>
          ) : (
            <span className="body-r text-gray-400">Kies een icoon...</span>
          )}
        </div>
        <Icon name="ui-chevron-down" size={20} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="icon-picker-dropdown">
          {/* Search Input */}
          <input
            type="text"
            className="icon-picker-search"
            placeholder="Zoek icoon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />

          {/* Icon Grid */}
          <div className="icon-picker-grid">
            {filteredIcons.length > 0 ? (
              filteredIcons.map(iconName => (
                <button
                  key={iconName}
                  type="button"
                  className={`icon-picker-item ${value === iconName ? 'is-selected' : ''}`}
                  onClick={() => handleSelectIcon(iconName)}
                  title={iconName}
                >
                  <Icon name={iconName} size={24} />
                </button>
              ))
            ) : (
              <div className="icon-picker-empty body-r text-gray-400">
                Geen iconen gevonden
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default IconPicker

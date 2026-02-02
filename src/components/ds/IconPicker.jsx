/**
 * IconPicker Component
 * Searchable dropdown with grid display of all available icons
 * Optionally shows AI-suggested icons when content is available
 *
 * @param {string} value - Currently selected icon name
 * @param {function} onChange - Callback when icon is selected (receives icon name)
 * @param {string} label - Field label
 * @param {boolean} showAiSuggestions - Show AI icon suggestions
 * @param {boolean} hasContent - Whether there is content to base suggestions on
 * @param {string} className - Additional CSS classes
 */

import { useState, useRef, useEffect, useMemo } from 'react'
import Icon from './Icon'
import Button from './Button'
import { VALID_ICON_NAMES } from './iconNames'
import './IconPicker.css'

// Get 4 "random" icons - in a real implementation this would be AI-powered
// For the prototype, we use a seeded shuffle to get consistent results
function getAiSuggestedIcons() {
  // Curated list of icons that work well for articles
  const goodIcons = [
    'ui-bulb', 'ui-star', 'ui-heart', 'ui-bookmark',
    'ui-bell', 'ui-flag', 'ui-flame', 'ui-gift',
    'ui-leaf', 'ui-diamond', 'ui-chat', 'ui-calendar',
    'ui-clock', 'ui-location', 'ui-people', 'ui-thumbs-up',
    'ui-check-shield', 'ui-world', 'ui-camera', 'ui-music-note'
  ]
  // Shuffle and take first 4
  const shuffled = [...goodIcons].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 4)
}

function IconPicker({
  value,
  onChange,
  label,
  showAiSuggestions = false,
  hasContent = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef(null)

  // Generate AI suggestions once when content appears
  const [aiSuggestions, setAiSuggestions] = useState(null)
  const [hasAutoSelected, setHasAutoSelected] = useState(false)

  // Generate suggestions when content becomes available
  useEffect(() => {
    if (showAiSuggestions && hasContent && !aiSuggestions) {
      const suggestions = getAiSuggestedIcons()
      setAiSuggestions(suggestions)
      // Auto-select the first suggestion if no value is set
      if (!value || value === 'ui-star') {
        onChange(suggestions[0])
        setHasAutoSelected(true)
      }
    }
  }, [showAiSuggestions, hasContent, aiSuggestions, value, onChange])

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

  const handleSelectAiSuggestion = (iconName) => {
    onChange(iconName)
  }

  // Check if the selected value is one of the AI suggestions
  const isAiSuggestion = aiSuggestions?.includes(value)
  const showSuggestions = showAiSuggestions && hasContent && aiSuggestions

  return (
    <div className={`icon-picker ${showSuggestions ? 'has-ai-suggestions' : ''} ${className}`} ref={containerRef}>
      {label && <label className="field-label">{label}</label>}

      {/* AI Suggestions */}
      {showSuggestions && (
        <div className="ai-suggestions-section">
          <span className="ai-suggestions-label body-r">Judith adviseert</span>
          <div className="ai-suggestions-row">
            {/* AI Suggested Icons */}
            {aiSuggestions.map(iconName => (
              <button
                key={iconName}
                type="button"
                className={`ai-suggestion-item ${value === iconName ? 'is-selected' : ''}`}
                onClick={() => handleSelectAiSuggestion(iconName)}
                title={iconName}
              >
                <Icon name={iconName} size={24} />
              </button>
            ))}

            {/* Custom selected icon (if not from AI suggestions) */}
            {value && !isAiSuggestion && (
              <button
                type="button"
                className="ai-suggestion-item is-selected is-custom"
                title={value}
              >
                <Icon name={value} size={24} />
              </button>
            )}

            {/* "zelf kiezen" button */}
            <Button
              variant="ghost"
              onClick={() => setIsOpen(!isOpen)}
              className="self-choose-button"
            >
              zelf kiezen…
            </Button>
          </div>
        </div>
      )}

      {/* Original trigger (only show when no AI suggestions) */}
      {!showSuggestions && (
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
      )}

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

import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'
import StarIcon from '../icons/ui-star.svg?react'
import ChevronDownIcon from '../icons/ui-chevron-down.svg?react'
import '../styles/AIDropdown.css'

/**
 * AIDropdown Component
 *
 * Dropdown menu for AI text improvement options
 * Styled to match Trumbowyg toolbar
 * Positioned to the right of Trumbowyg editors
 */
const AIDropdown = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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

  const handleOptionClick = (option) => {
    // Mock implementation - does nothing
    console.log(`AI option selected: ${option}`)
    setIsOpen(false)
  }

  return (
    <div className={`ai-dropdown ${className}`} ref={dropdownRef}>
      <button
        className={`ai-dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        aria-label="AI text assistant"
        aria-expanded={isOpen}
      >
        <Icon icon={StarIcon} color="currentColor" size={20} />
        <Icon icon={ChevronDownIcon} color="currentColor" size={12} />
      </button>

      {isOpen && (
        <div className="ai-dropdown-menu">
          <button
            className="ai-dropdown-item"
            onClick={() => handleOptionClick('improve')}
            type="button"
          >
            Verbeter tekst
          </button>
          <button
            className="ai-dropdown-item"
            onClick={() => handleOptionClick('expand')}
            type="button"
          >
            Breid tekst uit
          </button>
          <button
            className="ai-dropdown-item"
            onClick={() => handleOptionClick('spelling')}
            type="button"
          >
            Spelling en grammatica
          </button>
        </div>
      )}
    </div>
  )
}

export default AIDropdown

import { useState, useRef, useEffect } from 'react'
import '../styles/DropdownMenu.css'

/**
 * DropdownMenu Component
 *
 * A reusable dropdown menu component with trigger and menu items.
 *
 * @param {React.ReactNode} trigger - The trigger element (e.g., a button)
 * @param {Array} items - Array of menu item objects: { label, onClick, disabled }
 * @param {boolean} visible - Whether the dropdown should be visible (for fade in/out)
 * @param {string} className - Additional CSS classes
 */
const DropdownMenu = ({ trigger, items = [], visible = true, className = '' }) => {
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
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  const handleItemClick = (item) => {
    if (!item.disabled && item.onClick) {
      item.onClick()
      setIsOpen(false)
    }
  }

  return (
    <div
      ref={dropdownRef}
      className={`dropdown-menu-container ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.2s ease',
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div className="dropdown-menu-popup">
          {items.map((item, index) => (
            <button
              key={index}
              className={`dropdown-menu-popup-item ${item.disabled ? 'disabled' : ''}`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default DropdownMenu

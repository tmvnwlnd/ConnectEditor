/**
 * JudithButton Component
 * AI assistant button for form fields
 * Displays a prompt interface when clicked to show AI assistance capability
 *
 * @param {string} className - Additional CSS classes
 */

import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'
import Button from './Button'
import TextArea from './TextArea'
import './JudithButton.css'

function JudithButton({ className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [promptText, setPromptText] = useState('')
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

  const handleAsk = () => {
    // Mock AI interaction - just close the dropdown
    console.log('Judith AI prompt:', promptText)
    setPromptText('')
    setIsOpen(false)
    // In real implementation, this would send the prompt to the AI system
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  return (
    <div className={`judith-button-container ${className}`} ref={containerRef}>
      <button
        type="button"
        className="judith-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="judith-button-text">Vraag Judith</span>
        <Icon name="ui-chevron-down" size={16} />
      </button>

      {isOpen && (
        <div className="judith-dropdown">
          <TextArea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Hoe wil je dat Judith AI je helpt?"
            rows={1}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <Button
            variant="icon-only"
            iconColor="primary"
            icon="ui-arrow-up"
            onClick={handleAsk}
            aria-label="Verstuur prompt"
          />
          <Button
            variant="icon-only"
            icon="ui-x"
            onClick={() => setIsOpen(false)}
            aria-label="Sluit"
          />
        </div>
      )}
    </div>
  )
}

export default JudithButton

/**
 * JudithButton Component
 * AI assistant button for form fields
 * Displays a prompt interface when clicked to show AI assistance capability
 *
 * @param {string} className - Additional CSS classes
 * @param {function} onApplySuggestion - Callback to apply AI suggestion to field (single column mode)
 * @param {function} onApplyLeft - Callback to apply to left column (two-column mode)
 * @param {function} onApplyRight - Callback to apply to right column (two-column mode)
 * @param {string} context - Context for AI suggestions: 'title', 'introduction', 'header', 'paragraph'
 * @param {boolean} isTwoColumn - Whether this is for a two-column layout
 * @param {string} variant - Color variant: 'green' or 'blue' (default: 'green')
 */

import { useState, useRef, useEffect } from 'react'
import Icon from './Icon'
import Button from './Button'
import TextArea from './TextArea'
import Pill from './Pill'
import './JudithButton.css'

function JudithButton({
  className = '',
  onApplySuggestion,
  onApplyLeft,
  onApplyRight,
  context = 'paragraph',
  isTwoColumn = false,
  variant = 'green'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [isSending, setIsSending] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const containerRef = useRef(null)
  const textareaRef = useRef(null)

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

  const getSuggestedPrompts = () => {
    const prompts = {
      title: [
        'Schrijf een titel op basis van de introductie',
        'Maak mijn titel korter'
      ],
      introduction: [
        'Schrijf een introductie op basis van de titel',
        'Maak de introductie pakkender'
      ],
      header: [
        'Schrijf een tussenkop voor deze sectie',
        'Maak de kop vragender'
      ],
      paragraph: [
        'Schrijf een alinea over dit onderwerp',
        'Breid deze tekst uit met voorbeelden'
      ]
    }

    return prompts[context] || prompts.paragraph
  }

  const getMockResponse = () => {
    const responses = {
      title: {
        suggestion: 'KPN lanceert 5G-netwerk: sneller internet voor heel Nederland',
        explanation: 'Deze titel is specifieker en nieuwswaardig. Het benoemt direct de organisatie (KPN), de actie (lanceert), en het voordeel voor de lezer.'
      },
      introduction: {
        suggestion: 'KPN introduceert vandaag het nieuwe 5G-netwerk in Nederland. De technologie belooft tot tien keer sneller internet dan 4G, met directe gevolgen voor consumenten en bedrijven. De uitrol start in de grote steden en breidt zich de komende maanden uit over het hele land.',
        explanation: 'Deze introductie vat de kern samen: wie (KPN), wat (5G-netwerk), wanneer (vandaag), en waarom het belangrijk is (sneller internet met impact). Het wekt interesse zonder alles te verklappen.'
      },
      header: {
        suggestion: 'Wat betekent 5G voor de gewone consument?',
        explanation: 'Deze kop stelt een vraag die lezers zich afvragen en nodigt uit om verder te lezen. Het maakt het onderwerp persoonlijk en relevant.'
      },
      paragraph: {
        suggestion: 'De nieuwe 5G-technologie maakt downloadsnelheden tot 1 gigabit per seconde mogelijk. Dat betekent dat een HD-film in enkele seconden te downloaden is. Voor bedrijven opent dit deuren naar nieuwe toepassingen zoals realtime videoverbindingen en slimme fabrieken. De technologie vormt daarmee de ruggengraat van de digitale economie van de toekomst.',
        explanation: 'Deze alinea geeft concrete voorbeelden (downloadsnelheid, HD-film) en verbindt technische details met praktische gevolgen voor zowel consumenten als bedrijven. Het eindigt met een blik op de toekomst.'
      }
    }

    return responses[context] || responses.paragraph
  }

  const handleAsk = () => {
    if (!promptText.trim()) return

    // Trigger send animation
    setIsSending(true)

    // Start thinking animation after button animation
    setTimeout(() => {
      setIsSending(false)
      setIsThinking(true)
      setPromptText('')
    }, 300)

    // Mock AI response after thinking period
    setTimeout(() => {
      setIsThinking(false)
      setAiResponse(getMockResponse())
    }, 1800)
  }

  const handleCopy = async () => {
    if (aiResponse) {
      try {
        await navigator.clipboard.writeText(aiResponse.suggestion)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleApply = () => {
    if (aiResponse && onApplySuggestion) {
      onApplySuggestion(aiResponse.suggestion)
    }
    handleClose()
  }

  const handleApplyToColumn = (column) => {
    if (!aiResponse) return

    if (column === 'left' && onApplyLeft) {
      onApplyLeft(aiResponse.suggestion)
    } else if (column === 'right' && onApplyRight) {
      onApplyRight(aiResponse.suggestion)
    }
    handleClose()
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      setPromptText('')
      setIsThinking(false)
      setAiResponse(null)
      setIsSending(false)
      setIsCopied(false)
    }, 200) // Match animation duration
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAsk()
    }
  }

  const handleTextChange = (e) => {
    setPromptText(e.target.value)

    // Auto-grow textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px'
      const scrollHeight = textareaRef.current.scrollHeight
      if (scrollHeight > 40) {
        textareaRef.current.style.height = Math.min(scrollHeight, 200) + 'px'
      }
    }
  }

  // Reset height when dropdown opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.style.height = '40px'
    }
  }, [isOpen])

  return (
    <div className={`judith-button-container ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`judith-button judith-button-${variant}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="judith-button-text">Vraag Judith</span>
      </button>

      {isOpen && (
        <div className={`judith-dropdown ${isClosing ? 'judith-dropdown-closing' : ''}`}>
          {!isThinking && !aiResponse && (
            <div className="judith-prompt-section">
              <div className="judith-prompt-row">
                <TextArea
                  value={promptText}
                  onChange={handleTextChange}
                  placeholder="Hoe wil je dat Judith AI je helpt?"
                  rows={1}
                  onKeyDown={handleKeyDown}
                  textareaRef={textareaRef}
                  autoFocus
                />
                <Button
                  variant="icon-only"
                  iconColor="primary"
                  icon="ui-arrow-up"
                  onClick={handleAsk}
                  aria-label="Verstuur prompt"
                  className={isSending ? 'button-sending' : ''}
                />
                <Button
                  variant="icon-only"
                  icon="ui-x"
                  onClick={handleClose}
                  aria-label="Sluit"
                />
              </div>
              <div className="judith-suggested-prompts">
                {getSuggestedPrompts().map((prompt, index) => (
                  <Pill
                    key={index}
                    onClick={() => setPromptText(prompt)}
                  >
                    {prompt}
                  </Pill>
                ))}
              </div>
            </div>
          )}

          {isThinking && (
            <div className="judith-thinking">
              <div className="judith-thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span className="judith-thinking-text">Judith denkt na...</span>
            </div>
          )}

          {aiResponse && (
            <div className="judith-response">
              <div className="judith-response-content">
                <div className="judith-response-suggestion">
                  {aiResponse.suggestion}
                  <button
                    className="judith-copy-button"
                    onClick={handleCopy}
                    aria-label="Kopieer naar klembord"
                  >
                    <Icon
                      name={isCopied ? 'ui-check' : 'ui-copy'}
                      size={16}
                      color={isCopied ? 'var(--kpn-green-500)' : 'var(--gray-400)'}
                    />
                  </button>
                </div>
                <div className="judith-response-explanation">{aiResponse.explanation}</div>
              </div>
              <div className="judith-response-actions">
                {isTwoColumn ? (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => handleApplyToColumn('left')}
                    >
                      Links toepassen
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleApplyToColumn('right')}
                    >
                      Rechts toepassen
                    </Button>
                    <Button
                      variant="icon-only"
                      icon="ui-x"
                      onClick={handleClose}
                      aria-label="Sluit"
                    />
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      onClick={handleApply}
                    >
                      Toepassen
                    </Button>
                    <Button
                      variant="icon-only"
                      icon="ui-x"
                      onClick={handleClose}
                      aria-label="Sluit"
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JudithButton

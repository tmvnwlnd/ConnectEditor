/**
 * AIShowcase - Display all JudithButton states side by side for design review
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import { Button } from './ds'
import './AIShowcase.css'

/**
 * Floating Notepad for collecting design feedback
 */
function FloatingNotepad() {
  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('showcase-notes') || ''
  })
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('showcase-notepad-position')
    return saved ? JSON.parse(saved) : { x: window.innerWidth - 340, y: 20 }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [copied, setCopied] = useState(false)
  const notepadRef = useRef(null)

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem('showcase-notes', notes)
  }, [notes])

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('showcase-notepad-position', JSON.stringify(position))
  }, [position])

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.notepad-header')) {
      setIsDragging(true)
      const rect = notepadRef.current.getBoundingClientRect()
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y))
      })
    }
  }, [isDragging, dragOffset])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(notes)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    if (notes && confirm('Clear all notes?')) {
      setNotes('')
    }
  }

  if (isMinimized) {
    return (
      <button
        className="notepad-minimized"
        style={{ left: position.x, top: position.y }}
        onClick={() => setIsMinimized(false)}
        title="Open notepad"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
        {notes && <span className="notepad-badge" />}
      </button>
    )
  }

  return (
    <div
      ref={notepadRef}
      className="floating-notepad"
      style={{ left: position.x, top: position.y }}
      onMouseDown={handleMouseDown}
    >
      <div className="notepad-header">
        <span className="notepad-title">Design Notes</span>
        <div className="notepad-actions">
          <button onClick={handleCopy} title={copied ? 'Copied!' : 'Copy notes'}>
            {copied ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--kpn-green-500)" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            )}
          </button>
          <button onClick={handleClear} title="Clear notes">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
          <button onClick={() => setIsMinimized(true)} title="Minimize">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
      <textarea
        className="notepad-content"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="- [button]: change color to...&#10;- [panel]: increase padding...&#10;- [response]: font too small..."
      />
    </div>
  )
}

// Import the question config and mock response generator
const QUESTION_CONFIG = {
  paragraph: [
    { id: 'summarize_above', label: 'Vat bovenstaande tekst samen', condition: ({ hasOtherText }) => hasOtherText, disabledReason: 'Er is nog geen andere tekst beschikbaar' },
    { id: 'continue_above', label: 'Ga verder op bovenstaande tekst', condition: ({ hasOtherText }) => hasOtherText, disabledReason: 'Er is nog geen andere tekst beschikbaar' },
    { id: 'rewrite_paragraph', label: 'Herschrijf deze tekst', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_paragraph_formal', label: 'Maak deze tekst formeel', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_paragraph_shorter', label: 'Maak deze tekst korter', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'expand_paragraph', label: 'Breid deze tekst uit', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' }
  ]
}

const MOCK_RESPONSE = {
  suggestion: 'De digitale transformatie biedt ongekende mogelijkheden voor bedrijven die bereid zijn te innoveren.',
  explanation: 'Herschreven met behoud van de kernboodschap.'
}

/**
 * Static panel display component (no portal, no animation)
 */
function StaticPanel({ title, variant = 'green', children }) {
  return (
    <div className="showcase-panel-wrapper">
      <h3 className="showcase-panel-title">{title}</h3>
      <div className={`showcase-panel judith-floating-panel-${variant}`}>
        {children}
      </div>
    </div>
  )
}

/**
 * Button state display
 */
function ButtonState({ title, variant = 'green', hasPending = false, isDisabled = false }) {
  const buttonWrapperRef = useRef(null)

  useEffect(() => {
    if (buttonWrapperRef.current && isDisabled) {
      const instance = tippy(buttonWrapperRef.current, {
        content: 'Voeg eerst tekst toe om Judith te kunnen gebruiken',
        placement: 'top',
        theme: 'translucent',
        arrow: true,
        animation: 'fade',
        maxWidth: 200
      })
      return () => {
        instance.destroy()
      }
    }
  }, [isDisabled])

  return (
    <div className="showcase-panel-wrapper">
      <h3 className="showcase-panel-title">{title}</h3>
      <div className="showcase-button-container">
        <span ref={buttonWrapperRef} style={{ display: 'inline-block' }}>
          <button
            className={`judith-button judith-button-${variant} body-s-bold ${isDisabled ? 'judith-button-disabled' : ''}`}
            disabled={isDisabled}
          >
            Vraag Judith
            {hasPending && <span className="judith-button-indicator" />}
          </button>
        </span>
      </div>
    </div>
  )
}

/**
 * Questions list state
 */
function QuestionsState({ title, variant = 'green', hasContent = true, hasOtherText = true }) {
  const questions = QUESTION_CONFIG.paragraph

  const isQuestionEnabled = (question) => {
    return question.condition({ hasContent, hasOtherText })
  }

  // Filter to only show enabled questions
  const enabledQuestions = questions.filter(q => isQuestionEnabled(q))

  return (
    <StaticPanel title={title} variant={variant}>
      <div className="judith-panel-content">
        <div className="judith-questions-list">
          {enabledQuestions.map((question) => (
            <button
              key={question.id}
              className="judith-question-item text-truncate"
              style={{ opacity: 1, transform: 'none', animation: 'none' }}
            >
              {question.label}
            </button>
          ))}
        </div>
      </div>
    </StaticPanel>
  )
}

/**
 * Thinking state
 */
function ThinkingState({ title }) {
  return (
    <StaticPanel title={title}>
      <div className="judith-panel-content">
        <div className="judith-thinking" style={{ opacity: 1, transform: 'none', animation: 'none' }}>
          <div className="judith-thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="judith-thinking-text body-r">Judith denkt na...</span>
        </div>
      </div>
    </StaticPanel>
  )
}

/**
 * Response state
 */
function ResponseState({ title }) {
  return (
    <StaticPanel title={title}>
      <div className="judith-panel-content">
        <div className="judith-response" style={{ opacity: 1, transform: 'none', animation: 'none' }}>
          <div className="judith-response-question body-s-bold">Herschrijf deze tekst</div>
          <div className="judith-response-content">
            <div className="judith-response-suggestion body-r">
              {MOCK_RESPONSE.suggestion}
              <button className="judith-copy-button" aria-label="Kopieer naar klembord">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
            <div className="judith-response-explanation body-s">{MOCK_RESPONSE.explanation}</div>
          </div>
          <div className="judith-response-actions">
            <Button variant="primary">Toepassen</Button>
            <Button variant="icon-only" icon="ui-x" aria-label="Sluit" />
          </div>
        </div>
      </div>
    </StaticPanel>
  )
}

function AIShowcase() {
  return (
    <div className="ai-showcase">
      <FloatingNotepad />

      <header className="ai-showcase-header">
        <h1>Judith AI Button - All States</h1>
        <p>Design review showcase</p>
      </header>

      <section className="ai-showcase-section">
        <h2>Button States</h2>
        <div className="ai-showcase-row">
          <ButtonState title="Default (Green)" variant="green" />
          <ButtonState title="Default (Blue)" variant="blue" />
          <ButtonState title="With Pending Response" variant="green" hasPending={true} />
          <ButtonState title="Disabled (Green)" variant="green" isDisabled={true} />
          <ButtonState title="Disabled (Blue)" variant="blue" isDisabled={true} />
        </div>
      </section>

      <section className="ai-showcase-section">
        <h2>Questions Panel - Green Variant</h2>
        <div className="ai-showcase-row">
          <QuestionsState title="All Questions" variant="green" hasContent={true} hasOtherText={true} />
          <QuestionsState title="Has Other Text Only" variant="green" hasContent={false} hasOtherText={true} />
          <QuestionsState title="Has Content Only" variant="green" hasContent={true} hasOtherText={false} />
        </div>
      </section>

      <section className="ai-showcase-section">
        <h2>Questions Panel - Blue Variant</h2>
        <div className="ai-showcase-row">
          <QuestionsState title="All Questions" variant="blue" hasContent={true} hasOtherText={true} />
          <QuestionsState title="Has Other Text Only" variant="blue" hasContent={false} hasOtherText={true} />
        </div>
      </section>

      <section className="ai-showcase-section">
        <h2>Thinking State</h2>
        <div className="ai-showcase-row">
          <ThinkingState title="Loading..." />
        </div>
      </section>

      <section className="ai-showcase-section">
        <h2>Response State</h2>
        <div className="ai-showcase-row">
          <ResponseState title="With Response" />
        </div>
      </section>
    </div>
  )
}

export default AIShowcase

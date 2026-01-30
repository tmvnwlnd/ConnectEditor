/**
 * JudithButton Component
 * AI assistant button that expands into a floating panel via portal
 *
 * The button spawns a portal that animates from the button's position,
 * creating a smooth "pop out and expand" effect.
 *
 * @param {string} className - Additional CSS classes
 * @param {function} onApplySuggestion - Callback to apply AI suggestion to field
 * @param {string} context - Context for AI questions
 * @param {string} variant - Color variant: 'green' or 'blue'
 * @param {string} currentContent - Current content of the field
 * @param {boolean} hasOtherText - Whether other blocks with text exist
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import Icon from './Icon'
import Button from './Button'
import './JudithButton.css'

/**
 * Question Configuration
 * Each question has a condition and a disabledReason for when it's not available
 */
const QUESTION_CONFIG = {
  header: [
    { id: 'generate_header_from_text', label: 'Verzin een kop bij de tekst', condition: ({ hasOtherText }) => hasOtherText, disabledReason: 'Er is nog geen andere tekst beschikbaar' },
    { id: 'rewrite_header', label: 'Herschrijf deze tekst', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_header_formal', label: 'Maak tekst formeel', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_header_shorter', label: 'Maak tekst korter', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'expand_header', label: 'Breid de tekst uit', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' }
  ],
  paragraph: [
    { id: 'summarize_above', label: 'Vat bovenstaande tekst samen', condition: ({ hasOtherText }) => hasOtherText, disabledReason: 'Er is nog geen andere tekst beschikbaar' },
    { id: 'continue_above', label: 'Ga verder op bovenstaande tekst', condition: ({ hasOtherText }) => hasOtherText, disabledReason: 'Er is nog geen andere tekst beschikbaar' },
    { id: 'rewrite_paragraph', label: 'Herschrijf deze tekst', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_paragraph_formal', label: 'Maak deze tekst formeel', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_paragraph_shorter', label: 'Maak deze tekst korter', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'expand_paragraph', label: 'Breid deze tekst uit', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' }
  ],
  citation: [
    { id: 'extract_quote', label: 'Haal een citaat uit de tekst', condition: ({ hasOtherText }) => hasOtherText, disabledReason: 'Er is nog geen andere tekst beschikbaar' },
    { id: 'rewrite_citation', label: 'Herschrijf deze tekst', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_citation_formal', label: 'Maak tekst formeel', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' },
    { id: 'make_citation_shorter', label: 'Maak tekst korter', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst tekst toe aan dit veld' }
  ],
  title: [
    { id: 'generate_title_from_description', label: 'Verzin een kop bij de omschrijving', condition: ({ hasOtherText }) => hasOtherText, disabledReason: 'Voeg eerst een omschrijving toe' },
    { id: 'rewrite_title', label: 'Herschrijf deze tekst', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een titel toe' },
    { id: 'make_title_formal', label: 'Maak tekst formeel', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een titel toe' },
    { id: 'make_title_shorter', label: 'Maak tekst korter', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een titel toe' },
    { id: 'expand_title', label: 'Breid de tekst uit', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een titel toe' }
  ],
  description: [
    { id: 'rewrite_description', label: 'Herschrijf deze tekst', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een omschrijving toe' },
    { id: 'make_description_formal', label: 'Maak tekst formeel', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een omschrijving toe' },
    { id: 'make_description_shorter', label: 'Maak tekst korter', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een omschrijving toe' },
    { id: 'expand_description', label: 'Breid de tekst uit', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een omschrijving toe' }
  ],
  introduction: [
    { id: 'rewrite_introduction', label: 'Herschrijf deze tekst', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een inleiding toe' },
    { id: 'make_introduction_formal', label: 'Maak tekst formeel', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een inleiding toe' },
    { id: 'make_introduction_shorter', label: 'Maak tekst korter', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een inleiding toe' },
    { id: 'expand_introduction', label: 'Breid de tekst uit', condition: ({ hasContent }) => hasContent, disabledReason: 'Voeg eerst een inleiding toe' }
  ]
}

/**
 * Mock AI Response Generator
 */
const getAIResponse = async (questionId) => {
  await new Promise(resolve => setTimeout(resolve, 1800))

  const mockResponses = {
    generate_header_from_text: { suggestion: 'De toekomst van digitale innovatie', explanation: 'Deze kop vat de kern van de tekst samen en wekt interesse bij de lezer.' },
    rewrite_header: { suggestion: 'Innovatie in het digitale tijdperk', explanation: 'Een frisse formulering die dezelfde boodschap overbrengt.' },
    make_header_formal: { suggestion: 'Digitale transformatie in de moderne onderneming', explanation: 'Een formelere toon passend bij zakelijke communicatie.' },
    make_header_shorter: { suggestion: 'Digitale innovatie', explanation: 'Korter en krachtiger, de kern behouden.' },
    expand_header: { suggestion: 'De toekomst van digitale innovatie: wat betekent dit voor u?', explanation: 'Uitgebreid met een vraag die de lezer aanspreekt.' },
    summarize_above: { suggestion: 'De voorgaande tekst behandelt de belangrijkste ontwikkelingen op het gebied van digitalisering.', explanation: 'Een beknopte samenvatting van de bovenstaande tekst.' },
    continue_above: { suggestion: 'Daarnaast is het belangrijk om te benadrukken dat deze ontwikkelingen niet op zichzelf staan.', explanation: 'Een logisch vervolg op de bovenstaande tekst.' },
    rewrite_paragraph: { suggestion: 'De digitale transformatie biedt ongekende mogelijkheden voor bedrijven die bereid zijn te innoveren.', explanation: 'Herschreven met behoud van de kernboodschap.' },
    make_paragraph_formal: { suggestion: 'De implementatie van digitale oplossingen biedt substantiële voordelen voor organisaties.', explanation: 'Een formelere toon passend bij zakelijke documenten.' },
    make_paragraph_shorter: { suggestion: 'Digitalisering biedt kansen voor innovatieve bedrijven.', explanation: 'Korter en bondiger met behoud van de essentie.' },
    expand_paragraph: { suggestion: 'De digitale transformatie biedt ongekende mogelijkheden voor bedrijven die bereid zijn te innoveren. Dit geldt niet alleen voor grote ondernemingen, maar ook voor het mkb.', explanation: 'Uitgebreid met concrete voorbeelden en nuance.' },
    extract_quote: { suggestion: '"Innovatie is niet langer een optie, maar een noodzaak voor elke organisatie die relevant wil blijven."', explanation: 'Een krachtig citaat dat de kern van de tekst vangt.' },
    rewrite_citation: { suggestion: '"De toekomst behoort toe aan degenen die vandaag durven te veranderen."', explanation: 'Een alternatieve formulering met dezelfde impact.' },
    make_citation_formal: { suggestion: '"Strategische innovatie vormt de basis voor duurzaam concurrentievoordeel."', explanation: 'Een formelere toon voor zakelijke contexten.' },
    make_citation_shorter: { suggestion: '"Innoveer of word ingehaald."', explanation: 'Kort en krachtig, maximale impact.' },
    generate_title_from_description: { suggestion: 'De kracht van samenwerking', explanation: 'Een titel die de essentie van de omschrijving vangt.' },
    rewrite_title: { suggestion: 'Samen sterker: een nieuw perspectief', explanation: 'Een frisse kijk op hetzelfde thema.' },
    make_title_formal: { suggestion: 'Strategische samenwerking in de moderne organisatie', explanation: 'Een formelere toon voor zakelijke doeleinden.' },
    make_title_shorter: { suggestion: 'Samen sterker', explanation: 'Kort en krachtig.' },
    expand_title: { suggestion: 'De kracht van samenwerking: hoe teams samen successen behalen', explanation: 'Uitgebreid met een duidelijke belofte aan de lezer.' },
    rewrite_description: { suggestion: 'In dit artikel ontdekt u hoe moderne organisaties door effectieve samenwerking hun doelen bereiken.', explanation: 'Een herschreven versie met een duidelijke structuur.' },
    rewrite_introduction: { suggestion: 'In dit artikel ontdekt u hoe moderne organisaties door effectieve samenwerking hun doelen bereiken.', explanation: 'Een herschreven versie met een duidelijke structuur.' },
    make_description_formal: { suggestion: 'Dit document presenteert een analyse van effectieve samenwerkingsstrategieën binnen moderne organisaties.', explanation: 'Een formelere toon voor zakelijke documenten.' },
    make_introduction_formal: { suggestion: 'Dit document presenteert een analyse van effectieve samenwerkingsstrategieën binnen moderne organisaties.', explanation: 'Een formelere toon voor zakelijke documenten.' },
    make_description_shorter: { suggestion: 'Ontdek hoe samenwerking uw organisatie versterkt.', explanation: 'Beknopt met behoud van de kernboodschap.' },
    make_introduction_shorter: { suggestion: 'Ontdek hoe samenwerking uw organisatie versterkt.', explanation: 'Beknopt met behoud van de kernboodschap.' },
    expand_description: { suggestion: 'In dit artikel ontdekt u hoe moderne organisaties door effectieve samenwerking hun doelen bereiken. We bespreken praktische strategieën en concrete voorbeelden.', explanation: 'Uitgebreid met meer context en een duidelijke belofte.' },
    expand_introduction: { suggestion: 'In dit artikel ontdekt u hoe moderne organisaties door effectieve samenwerking hun doelen bereiken. We bespreken praktische strategieën en concrete voorbeelden.', explanation: 'Uitgebreid met meer context en een duidelijke belofte.' }
  }

  return mockResponses[questionId] || { suggestion: 'Dit is een voorbeeld van AI-gegenereerde tekst.', explanation: 'Judith AI heeft deze suggestie gegenereerd op basis van uw vraag.' }
}

const hasContentText = (content) => {
  if (!content) return false
  if (typeof content === 'string') {
    const text = content.replace(/<[^>]*>/g, '').trim()
    return text.length > 0
  }
  if (typeof content === 'object' && content.quote) {
    const text = content.quote.replace(/<[^>]*>/g, '').trim()
    return text.length > 0
  }
  return false
}

// Max width constraint for the panel
const MAX_PANEL_WIDTH = 320

/**
 * Floating Panel Component (rendered via portal)
 */
function FloatingPanel({
  buttonRect,
  variant,
  isClosing,
  onClose,
  questions,
  isQuestionEnabled,
  onQuestionClick,
  isThinking,
  aiResponse,
  selectedQuestion,
  onCopy,
  isCopied,
  onApply,
  onMouseEnter,
  onMouseLeave
}) {
  const panelRef = useRef(null)
  const contentRef = useRef(null)
  const questionRefs = useRef([])
  // Phase: 'measure' -> 'ready' -> 'expanded'
  const [phase, setPhase] = useState('measure')
  const [measuredHeight, setMeasuredHeight] = useState(null)
  const [measuredWidth, setMeasuredWidth] = useState(null)
  // Track content state for re-measurement
  const [contentState, setContentState] = useState('questions') // 'questions' | 'thinking' | 'response'

  // Reset refs array when questions change
  useEffect(() => {
    questionRefs.current = questionRefs.current.slice(0, questions.length)
  }, [questions.length])

  // Track content state changes for re-measurement
  useEffect(() => {
    const newState = aiResponse ? 'response' : isThinking ? 'thinking' : 'questions'
    if (newState !== contentState) {
      setContentState(newState)
      // Re-measure when content changes
      if (phase === 'expanded') {
        setPhase('measure')
        setMeasuredHeight(null)
        setMeasuredWidth(null)
      }
    }
  }, [aiResponse, isThinking, contentState, phase])

  // Phase 1: Measure content dimensions
  useEffect(() => {
    if (phase === 'measure' && panelRef.current) {
      const naturalHeight = panelRef.current.scrollHeight
      const naturalWidth = Math.min(panelRef.current.scrollWidth + 1, MAX_PANEL_WIDTH)
      setMeasuredHeight(naturalHeight)
      setMeasuredWidth(naturalWidth)
      setPhase('ready')
    }
  }, [phase, contentState])

  // Phase 2: After one frame at button size, expand
  useEffect(() => {
    if (phase === 'ready') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setPhase('expanded')
        })
      })
    }
  }, [phase])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])


  // Calculate center point of the original button
  const buttonCenterX = buttonRect.left + buttonRect.width / 2
  const buttonCenterY = buttonRect.top + buttonRect.height / 2

  // Determine current target dimensions based on state
  const getTargetHeight = () => {
    return measuredHeight || buttonRect.height
  }

  const getTargetWidth = () => {
    return measuredWidth || MAX_PANEL_WIDTH
  }

  // Calculate dimensions based on phase
  let currentWidth, currentHeight, visibility
  if (phase === 'measure') {
    // Measuring phase: auto width (with max), auto height, invisible
    currentWidth = 'auto'
    currentHeight = 'auto'
    visibility = 'hidden'
  } else if (phase === 'ready') {
    // Ready phase: button size, visible (no transition yet)
    currentWidth = buttonRect.width
    currentHeight = buttonRect.height
    visibility = 'visible'
  } else {
    // Expanded phase: animate to target
    currentWidth = getTargetWidth()
    currentHeight = getTargetHeight()
    visibility = 'visible'
  }

  const isExpanded = phase === 'expanded'

  // Position panel so its center aligns with button center
  const panelStyle = {
    position: 'fixed',
    left: buttonCenterX,
    top: buttonCenterY,
    width: currentWidth,
    height: currentHeight,
    transform: 'translate(-50%, -50%)',
    zIndex: 10001,
    visibility,
    pointerEvents: phase === 'measure' ? 'none' : 'auto',
    // Disable transitions during measure and ready phases
    transition: phase === 'expanded' ? undefined : 'none',
  }

  return createPortal(
    <div
      ref={panelRef}
      className={`judith-floating-panel judith-floating-panel-${variant} ${isExpanded ? 'judith-floating-expanded' : ''} ${isClosing ? 'judith-floating-closing' : ''}`}
      style={panelStyle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Content */}
      <div ref={contentRef} className="judith-panel-content">
        {!isThinking && !aiResponse && (
          <div className="judith-questions-list">
            {questions.filter(q => isQuestionEnabled(q)).map((question, index) => (
              <button
                key={question.id}
                ref={el => questionRefs.current[index] = el}
                className="judith-question-item text-truncate body-s"
                onClick={() => onQuestionClick(question)}
                style={{ animationDelay: `${0.15 + index * 0.04}s` }}
              >
                {question.label}
              </button>
            ))}
          </div>
        )}

        {isThinking && (
          <div className="judith-thinking">
            <div className="judith-thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="judith-thinking-text body-s">Judith denkt na...</span>
          </div>
        )}

        {aiResponse && (
          <div className="judith-response">
            <div className="judith-response-question body-s text-gray-300">"{selectedQuestion?.label}"</div>
            <div className="judith-response-content">
              <div className="judith-response-suggestion body-r">
                {aiResponse.suggestion}
              </div>
              <div className="judith-response-explanation body-s">{aiResponse.explanation}</div>
            </div>
            <div className="judith-response-actions">
              <Button variant="primary" onClick={onApply}>
                Toepassen
              </Button>
              <Button variant="icon-only" iconColor="secondary" icon={isCopied ? 'ui-check' : 'ui-copy'} onClick={onCopy} aria-label="Kopieer naar klembord" />
              <div style={{ flex: 1 }} />
              <Button variant="icon-only" iconColor="secondary-red" icon="ui-trash" onClick={onClose} aria-label="Verwijder" />
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

function JudithButton({
  className = '',
  onApplySuggestion,
  context = 'paragraph',
  variant = 'green',
  currentContent = '',
  hasOtherText = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [isCopied, setIsCopied] = useState(false)
  const [buttonRect, setButtonRect] = useState(null)
  // Persist response when modal is closed without applying
  const [pendingResponse, setPendingResponse] = useState(null)
  const [pendingQuestion, setPendingQuestion] = useState(null)
  const buttonRef = useRef(null)
  const buttonWrapperRef = useRef(null)
  const mouseLeaveTimerRef = useRef(null)

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (mouseLeaveTimerRef.current) {
        clearTimeout(mouseLeaveTimerRef.current)
      }
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (isOpen && !isThinking && !aiResponse) {
      mouseLeaveTimerRef.current = setTimeout(() => {
        handleClose()
      }, 2000)
    }
  }, [isOpen, isThinking, aiResponse])

  const handleMouseEnter = useCallback(() => {
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current)
      mouseLeaveTimerRef.current = null
    }
  }, [])

  const getQuestions = useCallback(() => {
    return QUESTION_CONFIG[context] || QUESTION_CONFIG.paragraph
  }, [context])

  const isQuestionEnabled = useCallback((question) => {
    const hasContent = hasContentText(currentContent)
    return question.condition({ hasContent, hasOtherText })
  }, [currentContent, hasOtherText])

  // Check if all questions are disabled
  const allQuestionsDisabled = getQuestions().every(q => !isQuestionEnabled(q))
  const tippyInstanceRef = useRef(null)

  // Initialize tippy tooltip on wrapper (disabled buttons don't receive mouse events)
  useEffect(() => {
    if (buttonWrapperRef.current) {
      const instance = tippy(buttonWrapperRef.current, {
        content: 'Voeg eerst tekst toe om Judith te kunnen gebruiken',
        placement: 'top',
        theme: 'translucent',
        arrow: true,
        animation: 'fade',
        maxWidth: 200
      })
      // tippy returns array for multiple elements, single instance for one element
      tippyInstanceRef.current = Array.isArray(instance) ? instance[0] : instance
      // Start disabled
      tippyInstanceRef.current.disable()
    }

    return () => {
      if (tippyInstanceRef.current) {
        tippyInstanceRef.current.destroy()
        tippyInstanceRef.current = null
      }
    }
  }, [])

  // Enable/disable tippy based on button state
  useEffect(() => {
    if (tippyInstanceRef.current) {
      if (allQuestionsDisabled) {
        tippyInstanceRef.current.enable()
      } else {
        tippyInstanceRef.current.disable()
      }
    }
  }, [allQuestionsDisabled])

  const handleQuestionClick = useCallback(async (question) => {
    if (!isQuestionEnabled(question)) return

    // Clear any pending close timer
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current)
      mouseLeaveTimerRef.current = null
    }

    setSelectedQuestion(question)
    setIsThinking(true)

    try {
      const response = await getAIResponse(question.id)
      setAiResponse(response)
    } catch (error) {
      console.error('AI request failed:', error)
      setAiResponse({
        suggestion: 'Er is iets misgegaan. Probeer het opnieuw.',
        explanation: 'De AI-service is momenteel niet beschikbaar.'
      })
    } finally {
      setIsThinking(false)
    }
  }, [isQuestionEnabled])

  const handleCopy = useCallback(async () => {
    if (aiResponse) {
      try {
        await navigator.clipboard.writeText(aiResponse.suggestion)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }, [aiResponse])

  const handleClose = useCallback((clearPending = false) => {
    if (mouseLeaveTimerRef.current) {
      clearTimeout(mouseLeaveTimerRef.current)
      mouseLeaveTimerRef.current = null
    }

    // Preserve response if closing without applying
    if (aiResponse && !clearPending) {
      setPendingResponse(aiResponse)
      setPendingQuestion(selectedQuestion)
    }

    if (clearPending) {
      setPendingResponse(null)
      setPendingQuestion(null)
    }

    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      setIsThinking(false)
      setAiResponse(null)
      setSelectedQuestion(null)
      setIsCopied(false)
      setButtonRect(null)
    }, 250)
  }, [aiResponse, selectedQuestion])

  const handleApply = useCallback(() => {
    if (aiResponse && onApplySuggestion) {
      onApplySuggestion(aiResponse.suggestion)
    }
    handleClose(true) // Clear pending when applied
  }, [aiResponse, onApplySuggestion, handleClose])

  const handleButtonClick = useCallback(() => {
    if (isOpen) {
      handleClose()
    } else {
      // Capture button position before opening
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setButtonRect({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        })
      }
      // Restore pending response if available
      if (pendingResponse) {
        setAiResponse(pendingResponse)
        setSelectedQuestion(pendingQuestion)
      }
      setIsOpen(true)
    }
  }, [isOpen, handleClose, pendingResponse, pendingQuestion])

  const hasPendingResponse = !!pendingResponse

  return (
    <div className={`judith-button-container ${className}`}>
      <span ref={buttonWrapperRef} style={{ display: 'inline-block' }}>
        <button
          ref={buttonRef}
          type="button"
          className={`judith-button judith-button-${variant} body-s ${isOpen ? 'judith-button-hidden' : ''} ${allQuestionsDisabled ? 'judith-button-disabled' : ''}`}
          onClick={handleButtonClick}
          disabled={allQuestionsDisabled}
        >
          Vraag Judith
          {hasPendingResponse && <span className="judith-button-indicator" />}
        </button>
      </span>

      {isOpen && buttonRect && (
        <FloatingPanel
          buttonRect={buttonRect}
          variant={variant}
          isClosing={isClosing}
          onClose={handleClose}
          questions={getQuestions()}
          isQuestionEnabled={isQuestionEnabled}
          onQuestionClick={handleQuestionClick}
          isThinking={isThinking}
          aiResponse={aiResponse}
          selectedQuestion={selectedQuestion}
          onCopy={handleCopy}
          isCopied={isCopied}
          onApply={handleApply}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </div>
  )
}

export default JudithButton

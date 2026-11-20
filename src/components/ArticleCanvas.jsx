import { useEffect, useRef, forwardRef, useMemo } from 'react'
import Element from './Element'
import DoubleColumnElement from './DoubleColumnElement'
import TeamkpnPreview from './TeamkpnPreview'
import ErrorNotices from './ErrorNotices'
import CombinedBlock from './CombinedBlock'
import { Icon } from './ds'
import { DOUBLE_ELEMENT_TYPES, elementHasText } from '../config/elementTypes'

const escapeHtml = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const htmlToText = (html) => {
  const d = document.createElement('div')
  d.innerHTML = (html || '').replace(/<\/(p|h[1-6]|li|div)>/g, '</$1> ')
  return d.textContent.replace(/\s+/g, ' ').trim()
}

// The Header block's slots ⇄ articleSetupData (coverImage / title(+Html) / introduction(+Html)).
const headerSlots = (h) => [
  { type: 'image', content: { image: h?.coverImage || null }, props: { emptyLabel: 'Omslagfoto' } },
  {
    type: 'header',
    content: h?.titleHtml || (h?.title ? `<h2>${escapeHtml(h.title)}</h2>` : ''),
    props: { placeholder: 'Titel van je artikel...' }
  },
  {
    type: 'paragraph',
    content: h?.introductionHtml || (h?.introduction ? `<p>${escapeHtml(h.introduction)}</p>` : ''),
    props: { placeholder: 'Schrijf een pakkende introductie van je artikel...' }
  }
]
const headerSlotToSetup = (index, content) => [
  () => ({ coverImage: content?.image || null }),
  () => ({ title: htmlToText(content), titleHtml: content }),
  () => ({ introduction: htmlToText(content), introductionHtml: content })
][index]()

const ArticleCanvas = forwardRef(({
  elements,
  focusedElementId,
  animatingElement,
  scrollToElement,
  isPreviewMode,
  previewAudience = null,
  headerData,
  onSetupChange,
  onFocusElement,
  onUpdateElement,
  onUpdateSlot,
  onMoveElement,
  onDuplicateElement,
  onDeleteElement,
  onSwapDoubleElement,
  onImportDocx: _onImportDocx
}, ref) => {
  const elementRefs = useRef({})

  useEffect(() => {
    if (scrollToElement && elementRefs.current[scrollToElement]) {
      setTimeout(() => {
        elementRefs.current[scrollToElement]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    }
  }, [scrollToElement])

  // Calculate which elements have other text blocks (for Judith AI)
  // An element "hasOtherText" if there are OTHER elements with text content
  const elementsWithText = useMemo(() => {
    return elements.filter(elementHasText)
  }, [elements])

  const handleCanvasClick = (e) => {
    // Only clear focus if clicking directly on the canvas or article-elements container
    if (e.target.classList.contains('article-elements') ||
        e.target.classList.contains('article-canvas')) {
      onFocusElement(null)
    }
  }

  const renderElement = (element, index) => {
    const isFocused = focusedElementId === element.id
    const isFirst = index === 0
    const isLast = index === elements.length - 1
    const isAnimating = animatingElement && animatingElement.id === element.id
    const isEntering = scrollToElement === element.id
    const animationClass = isAnimating ? `moving-${animatingElement.direction}` : (isEntering ? 'element-entering' : '')

    // Check if OTHER elements have text (excluding this element)
    const hasOtherText = elementsWithText.some(el => el.id !== element.id)

    // Check if this is a double-column element type
    const isDoubleColumn = element.type in DOUBLE_ELEMENT_TYPES

    if (isDoubleColumn) {
      // Render double-column element
      return (
        <div
          key={element.id}
          ref={(el) => elementRefs.current[element.id] = el}
          className={`article-element-wrapper ${animationClass}`}
          onClick={(e) => {
            e.stopPropagation()
            onFocusElement(element.id)
          }}
        >
          <DoubleColumnElement
            type={element.type}
            slots={element.slots}
            isFocused={isFocused}
            isFirst={isFirst}
            isLast={isLast}
            hasOtherText={hasOtherText}
            onUpdateSlot={(index, content) => onUpdateSlot(element.id, index, content)}
            onMoveUp={() => onMoveElement(element.id, 'up')}
            onMoveDown={() => onMoveElement(element.id, 'down')}
            onSwap={() => onSwapDoubleElement(element.id)}
            onDuplicate={() => onDuplicateElement(element.id)}
            onDelete={() => onDeleteElement(element.id)}
          />
        </div>
      )
    }

    // Render single-column element
    return (
      <div
        key={element.id}
        ref={(el) => elementRefs.current[element.id] = el}
        className={`article-element-wrapper ${animationClass}`}
        onClick={(e) => {
          e.stopPropagation()
          onFocusElement(element.id)
        }}
      >
        <Element
          type={element.type}
          content={element.content}
          targeting={element.targeting}
          onChange={(content) => onUpdateElement(element.id, { content })}
          onTargetingChange={(targeting) => onUpdateElement(element.id, { targeting: targeting ?? null })}
          isFocused={isFocused}
          isFirst={isFirst}
          isLast={isLast}
          hasOtherText={hasOtherText}
          onMoveUp={() => onMoveElement(element.id, 'up')}
          onMoveDown={() => onMoveElement(element.id, 'down')}
          onDuplicate={() => onDuplicateElement(element.id)}
          onDelete={() => onDeleteElement(element.id)}
        />
      </div>
    )
  }

  if (isPreviewMode) {
    return (
      <div className="article-canvas article-canvas-preview" onClick={handleCanvasClick}>
        {/* The article as the TEAMKPN prototype shows it (its real article page, in a frame). */}
        <TeamkpnPreview headerData={headerData} elements={elements} />
      </div>
    )
  }

  return (
    <div className="article-canvas" onClick={handleCanvasClick}>
      <ErrorNotices />
      {/* The article's cover, title and intro: a fixed block that's always first — not in the sidebar, can't be moved
          or removed (no rail buttons), but it takes focus like any block. */}
      <div
        className="article-header-container"
        onClick={(e) => { e.stopPropagation(); onFocusElement('setup') }}
      >
        {/* "Header": cover, title and intro as three regular blocks under one locked header (no rail).
            Saved as coverImage / title / introduction in articleSetupData (see headerSlots). */}
        <CombinedBlock
          icon="ui-lock"
          label="Header"
          layout="stack"
          className="element-wrapper-setup"
          isFocused={focusedElementId === 'setup'}
          slots={headerSlots(headerData)}
          onUpdateSlot={(i, content) => onSetupChange(headerSlotToSetup(i, content))}
        />
      </div>
      <div className="article-elements">
        {elements.length === 0 ? (
          <div className="article-empty-state">
            <div>
              <Icon name="ui-plus-circle" size={80} color="var(--kpn-blue-200)" />
              <p className="body-l text-blue-200">
                Voeg een blok toe om te beginnen met schrijven
              </p>
            </div>
          </div>
        ) : (
          elements.map(renderElement)
        )}
      </div>
    </div>
  )
})

export default ArticleCanvas

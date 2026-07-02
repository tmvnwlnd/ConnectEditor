import { useState, useRef, useEffect } from 'react'
import { PageHeader, SegmentedControl } from './ds'
import ToggleButton from './ToggleButton'
import ElementSidebar from './ElementSidebar'
import ArticleCanvas from './ArticleCanvas'
import { VISIBILITY_OPTIONS, DEFAULT_VISIBILITY } from './BlockVisibilityButton'
import PencilIcon from '../icons/ui-pencil-line.svg?react'
import EyeIcon from '../icons/ui-eye.svg?react'
import '../styles/ArticleBuilder.css'

// Partner-type views available in preview mode (everything except the default
// "Alle partnertypes"), derived so it stays in sync with the visibility options.
const PARTNER_VIEWS = VISIBILITY_OPTIONS
  .filter(opt => opt.value !== DEFAULT_VISIBILITY)
  .map(opt => ({ id: opt.value, label: opt.label }))

const ArticleBuilder = () => {
  // Load saved elements from localStorage
  const savedElements = JSON.parse(localStorage.getItem('articleElements') || '[]')

  const [elements, setElements] = useState(savedElements)
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [animatingElement, setAnimatingElement] = useState(null)
  const [scrollToElement, setScrollToElement] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [previewAudience, setPreviewAudience] = useState(PARTNER_VIEWS[0].id)
  const canvasRef = useRef(null)

  // Audience targeting is active only when at least one block has a
  // non-default visibility — that's when the preview needs partner-type tabs.
  const hasAudienceTargeting = elements.some(
    el => el.visibility && el.visibility !== DEFAULT_VISIBILITY
  )

  // Load setup data from step 1
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const { title, introduction, coverImage } = savedSetupData

  // Save elements to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('articleElements', JSON.stringify(elements))
    } catch (e) {
      console.warn('Could not save to localStorage (quota exceeded):', e.message)
    }
  }, [elements])

  // Clear scroll/animation state after animation completes
  useEffect(() => {
    if (scrollToElement) {
      const timer = setTimeout(() => {
        setScrollToElement(null)
      }, 300) // Match animation duration (200ms) + small buffer
      return () => clearTimeout(timer)
    }
  }, [scrollToElement])

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type: type,
      content: '',
      visibility: 'all'
    }

    let newElements
    if (focusedElementId) {
      // Insert after the focused element
      const focusedIndex = elements.findIndex(el => el.id === focusedElementId)
      if (focusedIndex !== -1) {
        newElements = [
          ...elements.slice(0, focusedIndex + 1),
          newElement,
          ...elements.slice(focusedIndex + 1)
        ]
      } else {
        // Fallback: add at bottom if focused element not found
        newElements = [...elements, newElement]
      }
    } else {
      // No element focused: add at bottom
      newElements = [...elements, newElement]
    }

    setElements(newElements)
    setFocusedElementId(newElement.id)
    setScrollToElement(newElement.id)
  }

  const addDoubleElement = (type) => {
    const newElement = {
      id: Date.now(),
      type: type,
      leftContent: '',
      rightContent: '',
      swapped: false,
      visibility: 'all'
    }

    let newElements
    if (focusedElementId) {
      // Insert after the focused element
      const focusedIndex = elements.findIndex(el => el.id === focusedElementId)
      if (focusedIndex !== -1) {
        newElements = [
          ...elements.slice(0, focusedIndex + 1),
          newElement,
          ...elements.slice(focusedIndex + 1)
        ]
      } else {
        // Fallback: add at bottom if focused element not found
        newElements = [...elements, newElement]
      }
    } else {
      // No element focused: add at bottom
      newElements = [...elements, newElement]
    }

    setElements(newElements)
    setFocusedElementId(newElement.id)
    setScrollToElement(newElement.id)
  }

  const updateElement = (id, fieldOrData, value) => {
    setElements(prevElements =>
      prevElements.map(el => {
        if (el.id === id) {
          // If value is provided, this is a field-specific update (for double-column elements)
          if (value !== undefined) {
            return {
              ...el,
              [fieldOrData]: value
            }
          }
          // Otherwise, fieldOrData is the full updated element object (for single-column elements)
          return fieldOrData
        }
        return el
      })
    )
  }

  const moveElement = (id, direction) => {
    const index = elements.findIndex(el => el.id === id)
    if (direction === 'up' && index > 0) {
      setAnimatingElement({ id, direction: 'up' })
      setTimeout(() => {
        const newElements = [...elements]
        ;[newElements[index - 1], newElements[index]] = [newElements[index], newElements[index - 1]]
        setElements(newElements)
        setTimeout(() => setAnimatingElement(null), 300)
      }, 0)
    } else if (direction === 'down' && index < elements.length - 1) {
      setAnimatingElement({ id, direction: 'down' })
      setTimeout(() => {
        const newElements = [...elements]
        ;[newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]]
        setElements(newElements)
        setTimeout(() => setAnimatingElement(null), 300)
      }, 0)
    }
  }

  const duplicateElement = (id) => {
    const element = elements.find(el => el.id === id)
    if (element) {
      const newElement = {
        ...element,
        id: Date.now()
      }
      const index = elements.findIndex(el => el.id === id)
      const newElements = [...elements]
      newElements.splice(index + 1, 0, newElement)
      setElements(newElements)
      setFocusedElementId(newElement.id)
    }
  }

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
    if (focusedElementId === id) {
      setFocusedElementId(null)
    }
  }

  const swapDoubleElement = (id) => {
    setElements(prevElements =>
      prevElements.map(el => {
        if (el.id === id) {
          return {
            ...el,
            swapped: !el.swapped
          }
        }
        return el
      })
    )
  }

  // Turn on versioning for a block: seed a single "Algemeen" version from its
  // current content.
  const createVersioning = (id) => {
    setElements(prevElements =>
      prevElements.map(el => {
        if (el.id !== id) return el
        return {
          ...el,
          versions: [
            { id: Date.now(), name: 'Algemeen', autoName: true, doelgroepen: [], type: el.type, content: el.content }
          ]
        }
      })
    )
  }

  // Remove versioning, keeping content per the chosen mode.
  const resolveVersioning = (id, mode) => {
    setElements(prevElements => {
      const index = prevElements.findIndex(el => el.id === id)
      if (index === -1) return prevElements
      const el = prevElements[index]
      const versions = el.versions || []

      if (mode === 'all') {
        // Explode each version into its own standalone block (its own type), in place.
        const blocks = versions.map((v, i) => ({
          id: Date.now() + i,
          type: v.type || el.type,
          content: v.content,
        }))
        const next = [...prevElements]
        next.splice(index, 1, ...blocks)
        return next
      }

      // 'first' keeps the first version's type + content; 'none' clears content.
      const first = versions[0]
      const { versions: _drop, ...rest } = el
      const resolved = mode === 'first'
        ? { ...rest, type: first?.type || el.type, content: first?.content ?? '' }
        : { ...rest, content: '' }
      return prevElements.map(e => (e.id === id ? resolved : e))
    })
  }


  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode)
    if (!isPreviewMode) {
      setFocusedElementId(null)
    }
  }

  return (
    <div className="article-builder">
      <div className="article-builder-container">
        <div className="article-builder-header">
          <div className="article-builder-header-content">
            <PageHeader step="Stap 2 van 3" />
            <div className="article-builder-toggles">
              <ToggleButton
                option1Label="Schrijven"
                option1Icon={PencilIcon}
                option2Label="Voorvertoning"
                option2Icon={EyeIcon}
                isOption2Active={isPreviewMode}
                onToggle={setIsPreviewMode}
              />
              {hasAudienceTargeting && (
                <SegmentedControl
                  className={`preview-audience-switch ${isPreviewMode ? 'is-visible' : ''}`}
                  options={PARTNER_VIEWS}
                  value={previewAudience}
                  onChange={setPreviewAudience}
                />
              )}
            </div>
          </div>
        </div>

        <div className={`article-builder-content ${isPreviewMode ? 'preview-mode' : ''}`}>
          <ElementSidebar
            onAddElement={addElement}
            onAddDoubleElement={addDoubleElement}
            isPreviewMode={isPreviewMode}
          />
          <ArticleCanvas
            ref={canvasRef}
            elements={elements}
            focusedElementId={focusedElementId}
            animatingElement={animatingElement}
            scrollToElement={scrollToElement}
            isPreviewMode={isPreviewMode}
            previewAudience={hasAudienceTargeting ? previewAudience : null}
            headerData={{ title, introduction, coverImage }}
            onFocusElement={setFocusedElementId}
            onUpdateElement={updateElement}
            onMoveElement={moveElement}
            onDuplicateElement={duplicateElement}
            onDeleteElement={deleteElement}
            onSwapDoubleElement={swapDoubleElement}
            onCreateVersioning={createVersioning}
            onResolveVersioning={resolveVersioning}
          />
        </div>
      </div>
    </div>
  )
}

export default ArticleBuilder

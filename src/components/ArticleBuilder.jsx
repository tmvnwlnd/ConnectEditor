import { useState, useRef, useEffect } from 'react'
import { PageHeader } from './ds'
import ToggleButton from './ToggleButton'
import ElementSidebar from './ElementSidebar'
import ArticleCanvas from './ArticleCanvas'
import PencilIcon from '../icons/ui-pencil-line.svg?react'
import EyeIcon from '../icons/ui-eye.svg?react'
import '../styles/ArticleBuilder.css'

const ArticleBuilder = () => {
  // Load saved elements from localStorage
  const savedElements = JSON.parse(localStorage.getItem('articleElements') || '[]')

  const [elements, setElements] = useState(savedElements)
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [animatingElement, setAnimatingElement] = useState(null)
  const [scrollToElement, setScrollToElement] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const canvasRef = useRef(null)

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
      content: ''
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
      swapped: false
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
            <ToggleButton
              option1Label="Schrijven"
              option1Icon={PencilIcon}
              option2Label="Voorvertoning"
              option2Icon={EyeIcon}
              isOption2Active={isPreviewMode}
              onToggle={setIsPreviewMode}
            />
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
            headerData={{ title, introduction, coverImage }}
            onFocusElement={setFocusedElementId}
            onUpdateElement={updateElement}
            onMoveElement={moveElement}
            onDuplicateElement={duplicateElement}
            onDeleteElement={deleteElement}
            onSwapDoubleElement={swapDoubleElement}
          />
        </div>
      </div>
    </div>
  )
}

export default ArticleBuilder

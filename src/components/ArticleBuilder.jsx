import { useState, useRef, useEffect } from 'react'
import ElementSidebar from './ElementSidebar'
import ArticleCanvas from './ArticleCanvas'
import '../styles/ArticleBuilder.css'

const ArticleBuilder = () => {
  const [elements, setElements] = useState([])
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [animatingElement, setAnimatingElement] = useState(null)
  const [scrollToElement, setScrollToElement] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [linkingElementId, setLinkingElementId] = useState(null) // ID of element waiting to be paired
  const canvasRef = useRef(null)

  // Cancel linking when focus changes away from the linking element
  useEffect(() => {
    if (linkingElementId && focusedElementId !== linkingElementId) {
      setLinkingElementId(null)
    }
  }, [focusedElementId, linkingElementId])

  const addElement = (type) => {
    const newElement = {
      id: Date.now(),
      type: type,
      content: ''
    }
    const newElements = [...elements, newElement]
    setElements(newElements)
    setFocusedElementId(newElement.id)
    // Only scroll if adding at the bottom (new element is last)
    if (newElements.length > 0 && newElements[newElements.length - 1].id === newElement.id) {
      setScrollToElement(newElement.id)
    }
  }

  const updateElement = (id, content) => {
    setElements(prevElements =>
      prevElements.map(el => {
        if (el.id === id) {
          // If content is an object with leftElement/rightElement, it's a paired element update
          if (content && typeof content === 'object' && ('leftElement' in content || 'rightElement' in content)) {
            return { ...el, ...content }
          }
          // Otherwise it's a regular content update
          return { ...el, content }
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
    }
  }

  const deleteElement = (id) => {
    setElements(elements.filter(el => el.id !== id))
    if (focusedElementId === id) {
      setFocusedElementId(null)
    }
  }

  const startLinking = (id) => {
    console.log('startLinking called with id:', id)
    setLinkingElementId(id)
    console.log('linkingElementId state should now be:', id)
  }

  const linkElements = (targetId) => {
    if (!linkingElementId) return

    setElements(prevElements => {
      const newElements = [...prevElements]
      const sourceIndex = newElements.findIndex(el => el.id === linkingElementId)
      const targetIndex = newElements.findIndex(el => el.id === targetId)

      if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) {
        return prevElements
      }

      const sourceElement = newElements[sourceIndex]
      const targetElement = newElements[targetIndex]

      // Create a paired element
      const pairedElement = {
        id: Date.now(),
        type: 'pair',
        leftElement: sourceElement,
        rightElement: targetElement
      }

      // Remove both elements and insert the pair at the earlier index
      const insertIndex = Math.min(sourceIndex, targetIndex)
      newElements.splice(Math.max(sourceIndex, targetIndex), 1)
      newElements.splice(Math.min(sourceIndex, targetIndex), 1)
      newElements.splice(insertIndex, 0, pairedElement)

      return newElements
    })

    setLinkingElementId(null)
  }

  const swapPairedElements = (pairId) => {
    setElements(prevElements =>
      prevElements.map(el => {
        if (el.id === pairId && el.type === 'pair') {
          return {
            ...el,
            leftElement: el.rightElement,
            rightElement: el.leftElement
          }
        }
        return el
      })
    )
  }

  const breakLink = (pairId) => {
    setElements(prevElements => {
      const newElements = [...prevElements]
      const pairIndex = newElements.findIndex(el => el.id === pairId)

      if (pairIndex === -1) return prevElements

      const pair = newElements[pairIndex]
      if (pair.type !== 'pair') return prevElements

      // Replace the pair with its two elements
      newElements.splice(pairIndex, 1, pair.leftElement, pair.rightElement)

      return newElements
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
      <div className="article-builder-header">
        <div>
          <h1 className="article-builder-title">Nieuwsartikel maken</h1>
          <p className="article-builder-step">Stap 2 van 3</p>
        </div>
        <button className="btn btn-light preview-button" onClick={togglePreview}>
          {isPreviewMode ? 'Terug naar bewerken' : 'Preview artikel'}
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3c-3.5 0-6.5 2.5-7.5 6 1 3.5 4 6 7.5 6s6.5-2.5 7.5-6c-1-3.5-4-6-7.5-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="article-builder-content">
        <ElementSidebar onAddElement={addElement} isPreviewMode={isPreviewMode} />
        <ArticleCanvas
          ref={canvasRef}
          elements={elements}
          focusedElementId={focusedElementId}
          animatingElement={animatingElement}
          scrollToElement={scrollToElement}
          isPreviewMode={isPreviewMode}
          linkingElementId={linkingElementId}
          onFocusElement={setFocusedElementId}
          onUpdateElement={updateElement}
          onMoveElement={moveElement}
          onDuplicateElement={duplicateElement}
          onDeleteElement={deleteElement}
          onStartLinking={startLinking}
          onLinkElements={linkElements}
          onSwapPairedElements={swapPairedElements}
          onBreakLink={breakLink}
        />
      </div>

      <div className="article-builder-footer">
        <button className="btn btn-outline-primary btn-lg">
          Terug naar stap 1
        </button>
        <button className="btn btn-primary btn-lg">
          Volgende stap: plaatsing
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.5 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ArticleBuilder

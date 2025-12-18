import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from './Button'
import ToggleButton from './ToggleButton'
import ElementSidebar from './ElementSidebar'
import ArticleCanvas from './ArticleCanvas'
import ArticleHeader from './ArticleHeader'
import TemplateModal from './TemplateModal'
import PencilIcon from '../icons/ui-pencil-line.svg?react'
import EyeIcon from '../icons/ui-eye.svg?react'
import ArrowRightIcon from '../icons/ui-arrow-right.svg?react'
import '../styles/ArticleBuilder.css'

const ArticleBuilder = () => {
  const navigate = useNavigate()
  const [elements, setElements] = useState([])
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [animatingElement, setAnimatingElement] = useState(null)
  const [scrollToElement, setScrollToElement] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [linkingElementId, setLinkingElementId] = useState(null) // ID of element waiting to be paired
  const [templateModal, setTemplateModal] = useState(null) // { type, title, description }
  const canvasRef = useRef(null)

  // Load setup data from step 1
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const { title, introduction, coverImage } = savedSetupData

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
    setLinkingElementId(id)
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

  // Template functions
  const handleAddTemplate = (templateId) => {
    if (templateId === 'text-image') {
      // Simple text + image block (no modal needed)
      addTextImageTemplate()
    } else if (templateId === 'pictorial') {
      // Show modal to get number of pairs
      setTemplateModal({
        type: 'pictorial',
        title: 'Pictorial template configureren',
        description: 'Hoeveel tekst + afbeelding blokken wil je toevoegen?'
      })
    } else if (templateId === 'interview') {
      // Show modal to get number of Q&A pairs
      setTemplateModal({
        type: 'interview',
        title: 'Interview template configureren',
        description: 'Hoeveel vraag + antwoord blokken wil je toevoegen?'
      })
    }
  }

  const addTextImageTemplate = () => {
    const baseId = Date.now()
    const paragraphEl = {
      id: baseId,
      type: 'paragraph',
      content: ''
    }
    const imageEl = {
      id: baseId + 1,
      type: 'image',
      content: ''
    }
    const pairedEl = {
      id: baseId + 2,
      type: 'pair',
      leftElement: paragraphEl,
      rightElement: imageEl
    }

    insertTemplateElements([pairedEl])
  }

  const addPictorialTemplate = (count) => {
    const newElements = []
    let baseId = Date.now()

    // Intro paragraph
    newElements.push({
      id: baseId++,
      type: 'paragraph',
      content: ''
    })

    // Alternating text + image pairs
    for (let i = 0; i < count; i++) {
      const paragraphEl = {
        id: baseId++,
        type: 'paragraph',
        content: ''
      }
      const imageEl = {
        id: baseId++,
        type: 'image',
        content: ''
      }

      // Alternate: even = text left, odd = text right
      const pairedEl = {
        id: baseId++,
        type: 'pair',
        leftElement: i % 2 === 0 ? paragraphEl : imageEl,
        rightElement: i % 2 === 0 ? imageEl : paragraphEl
      }
      newElements.push(pairedEl)
    }

    // Closing paragraph
    newElements.push({
      id: baseId++,
      type: 'paragraph',
      content: ''
    })

    insertTemplateElements(newElements)
  }

  const addInterviewTemplate = (count) => {
    const newElements = []
    let baseId = Date.now()

    // Audio element at top
    newElements.push({
      id: baseId++,
      type: 'audio',
      content: ''
    })

    // Q&A pairs with occasional quotes
    for (let i = 0; i < count; i++) {
      const questionEl = {
        id: baseId++,
        type: 'header',
        content: ''
      }
      const answerEl = {
        id: baseId++,
        type: 'paragraph',
        content: ''
      }

      // Alternate sides
      const pairedEl = {
        id: baseId++,
        type: 'pair',
        leftElement: i % 2 === 0 ? questionEl : answerEl,
        rightElement: i % 2 === 0 ? answerEl : questionEl
      }
      newElements.push(pairedEl)

      // Add quote every 3 Q&A pairs
      if ((i + 1) % 3 === 0 && i < count - 1) {
        newElements.push({
          id: baseId++,
          type: 'citation',
          content: ''
        })
      }
    }

    insertTemplateElements(newElements)
  }

  const insertTemplateElements = (newElements) => {
    let insertIndex
    if (focusedElementId) {
      const focusedIndex = elements.findIndex(el => el.id === focusedElementId)
      if (focusedIndex !== -1) {
        insertIndex = focusedIndex + 1
      } else {
        insertIndex = elements.length
      }
    } else {
      insertIndex = elements.length
    }

    const updatedElements = [
      ...elements.slice(0, insertIndex),
      ...newElements,
      ...elements.slice(insertIndex)
    ]
    setElements(updatedElements)

    // Focus the first new element and scroll to it
    if (newElements.length > 0) {
      const firstNewEl = newElements[0]
      setFocusedElementId(firstNewEl.id)
      setScrollToElement(firstNewEl.id)
    }
  }

  const handleTemplateModalConfirm = (value) => {
    if (templateModal.type === 'pictorial') {
      addPictorialTemplate(value)
    } else if (templateModal.type === 'interview') {
      addInterviewTemplate(value)
    }
    setTemplateModal(null)
  }

  const handleTemplateModalCancel = () => {
    setTemplateModal(null)
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
        <ToggleButton
          option1Label="Schrijven"
          option1Icon={PencilIcon}
          option2Label="Voorvertoning"
          option2Icon={EyeIcon}
          isOption2Active={isPreviewMode}
          onToggle={setIsPreviewMode}
        />
      </div>

      <div className="article-builder-content">
        <ElementSidebar
          onAddElement={addElement}
          onAddTemplate={handleAddTemplate}
          isPreviewMode={isPreviewMode}
        />
        <ArticleCanvas
          ref={canvasRef}
          elements={elements}
          focusedElementId={focusedElementId}
          animatingElement={animatingElement}
          scrollToElement={scrollToElement}
          isPreviewMode={isPreviewMode}
          linkingElementId={linkingElementId}
          headerData={{ title, introduction, coverImage }}
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
        <Button
          variant="secondary"
          onClick={() => navigate('/setup')}
        >
          Terug naar stap 1
        </Button>
        <Button
          variant="primary"
          icon={ArrowRightIcon}
          onClick={() => navigate('/settings')}
        >
          Volgende stap: plaatsing
        </Button>
      </div>

      {templateModal && (
        <TemplateModal
          title={templateModal.title}
          description={templateModal.description}
          defaultValue={5}
          min={1}
          max={20}
          onConfirm={handleTemplateModalConfirm}
          onCancel={handleTemplateModalCancel}
        />
      )}
    </div>
  )
}

export default ArticleBuilder

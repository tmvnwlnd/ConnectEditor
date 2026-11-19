import { useState, useRef, useEffect } from 'react'
import { PageHeader } from './ds'
import ToggleButton from './ToggleButton'
import ElementSidebar from './ElementSidebar'
import ArticleCanvas from './ArticleCanvas'
import Modal from './Modal'
import { Button } from './ds'
import { migrateVersions, sanitizeTargeting } from '../config/targeting'
import { isUpdateMode } from '../utils/articleMode'
import PencilIcon from '../icons/ui-pencil-line.svg?react'
import EyeIcon from '../icons/ui-eye.svg?react'
import '../styles/ArticleBuilder.css'

const ArticleBuilder = () => {
  // Load saved elements from localStorage
  // (Blocks saved with the old content versions become plain targeted blocks.)
  const savedElements = JSON.parse(localStorage.getItem('articleElements') || '[]').map(migrateVersions).map(sanitizeTargeting)

  const [elements, setElements] = useState(savedElements)
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [animatingElement, setAnimatingElement] = useState(null)
  const [scrollToElement, setScrollToElement] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const canvasRef = useRef(null)


  // Intro, title and cover — edited in the canvas's fixed top block (SetupFields), mirrored here for the preview.
  const [setup, setSetup] = useState(() => {
    const { title, introduction, coverImage } = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
    return { title, introduction, coverImage }
  })

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
      // The fixed top block ('setup') counts as "before the first block": insert at the top.
      const focusedIndex = focusedElementId === 'setup' ? -1 : elements.findIndex(el => el.id === focusedElementId)
      if (focusedIndex !== -1 || focusedElementId === 'setup') {
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
      // The fixed top block ('setup') counts as "before the first block": insert at the top.
      const focusedIndex = focusedElementId === 'setup' ? -1 : elements.findIndex(el => el.id === focusedElementId)
      if (focusedIndex !== -1 || focusedElementId === 'setup') {
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

  // Word import. On an empty article the document's content goes straight in; when the article already has blocks
  // a modal asks first: REPLACE (blocks, and title/intro/cover where the document has them) or ADD (blocks after what's
  // there; title, intro and cover only fill fields that are still empty — an unused cover goes in as the first image).
  const [pendingImport, setPendingImport] = useState(null)

  const applyImport = ({ title: docTitle, introduction: docIntro, coverImage: docCover, blocks }, mode) => {
    const setup = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
    const replace = mode === 'replace'
    const use = (current, incoming) => incoming && (replace || !current)
    const patch = {
      ...(use(setup.title?.trim(), docTitle) ? { title: docTitle } : {}),
      ...(use(setup.introduction?.trim(), docIntro) ? { introduction: docIntro } : {}),
      ...(use(setup.coverImage, docCover) ? { coverImage: docCover } : {}),
    }
    if (docCover && !patch.coverImage) blocks = [{ id: Date.now(), type: 'image', content: { image: docCover, altText: '', caption: '' } }, ...blocks]
    if (Object.keys(patch).length) localStorage.setItem('articleSetupData', JSON.stringify({ ...setup, ...patch }))
    setElements(prev => (replace ? blocks : [...prev, ...blocks]))
    setFocusedElementId(null)
  }

  const importDocx = (result) => {
    if (elements.length === 0) applyImport(result, 'add')
    else setPendingImport(result)
  }

  const resolveImport = (mode) => {
    if (pendingImport) applyImport(pendingImport, mode)
    setPendingImport(null)
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
            <PageHeader title={isUpdateMode() ? 'Nieuwsartikel updaten' : undefined} step="Stap 1 van 3" />
            <div className="article-builder-toggles">
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
        </div>

        <div className={`article-builder-content ${isPreviewMode ? 'preview-mode' : ''}`}>
          <ElementSidebar
            onAddElement={addElement}
            onAddDoubleElement={addDoubleElement}
            isPreviewMode={isPreviewMode}
            onImportDocx={elements.length > 0 ? importDocx : undefined}
          />
          <ArticleCanvas
            ref={canvasRef}
            elements={elements}
            focusedElementId={focusedElementId}
            animatingElement={animatingElement}
            scrollToElement={scrollToElement}
            isPreviewMode={isPreviewMode}
            headerData={setup}
            onSetupChange={setSetup}
            onFocusElement={setFocusedElementId}
            onUpdateElement={updateElement}
            onMoveElement={moveElement}
            onDuplicateElement={duplicateElement}
            onDeleteElement={deleteElement}
            onSwapDoubleElement={swapDoubleElement}
            onImportDocx={importDocx}
          />
        </div>
      </div>

      <Modal
        isOpen={!!pendingImport}
        onClose={() => setPendingImport(null)}
        title="Document importeren"
        className="docx-import-modal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingImport(null)}>Annuleren</Button>
            <Button variant="secondary" onClick={() => resolveImport('add')}>Toevoegen</Button>
            <Button variant="primary" onClick={() => resolveImport('replace')}>Vervangen</Button>
          </>
        }
      >
        <p className="body-r text-gray-400" style={{ margin: 0 }}>
          Dit artikel heeft al inhoud. Wil je die vervangen door het document, of het document onderaan toevoegen?
        </p>
      </Modal>
    </div>
  )
}

export default ArticleBuilder

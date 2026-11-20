import { useState, useRef, useEffect } from 'react'
import { PageHeader } from './ds'
import ToggleButton from './ToggleButton'
import ElementSidebar from './ElementSidebar'
import ArticleCanvas from './ArticleCanvas'
import Modal from './Modal'
import { Button } from './ds'
import { migrateVersions, sanitizeTargeting } from '../config/targeting'
import { createElement, migrateDoubleColumns } from '../config/elementTypes'
import { isUpdateMode } from '../utils/articleMode'
import '../styles/ArticleBuilder.css'
import * as store from '../store/articleStore'

const ArticleBuilder = () => {
  // Saved blocks (read once; blocks saved with the old content versions become plain targeted blocks).
  const [elements, setElements] = useState(() =>
    store.load(store.KEYS.elements, []).map(migrateDoubleColumns).map(migrateVersions).map(sanitizeTargeting)
  )
  const [focusedElementId, setFocusedElementId] = useState(null)
  const [animatingElement, setAnimatingElement] = useState(null)
  const [scrollToElement, setScrollToElement] = useState(null)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const canvasRef = useRef(null)


  // Intro, title and cover — edited in the canvas's fixed top block (regular image / kop / alinea fields), mirrored here for the preview.
  const [setup, setSetup] = useState(() => {
    const { title, titleHtml, introduction, introductionHtml, coverImage } = store.load(store.KEYS.setup, {})
    return { title, titleHtml, introduction, introductionHtml, coverImage }
  })

  // Save blocks whenever they change
  useEffect(() => {
    store.save(store.KEYS.elements, elements)
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

  // Add a block of `type` (single or double column) after the focused block, or at the bottom.
  // The fixed top block ('setup') counts as "before the first block": insert at the top.
  const addElement = (type) => {
    const newElement = createElement(type)
    setElements(prev => {
      const index = focusedElementId === 'setup' ? 0
        : focusedElementId ? prev.findIndex(el => el.id === focusedElementId) + 1
        : 0
      const at = index > 0 || focusedElementId === 'setup' ? index : prev.length
      return [...prev.slice(0, at), newElement, ...prev.slice(at)]
    })
    setFocusedElementId(newElement.id)
    setScrollToElement(newElement.id)
  }

  // Merge `patch` into one element (e.g. { content }, { targeting }).
  const updateElement = (id, patch) => {
    setElements(prev => prev.map(el => (el.id === id ? { ...el, ...patch } : el)))
  }

  // Replace the content of one inner block (slot) of a combined block.
  const updateSlot = (id, index, content) => {
    setElements(prev => prev.map(el => (el.id === id
      ? { ...el, slots: el.slots.map((slot, i) => (i === index ? { ...slot, content } : slot)) }
      : el)))
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

  // Swap the columns of a double column: its slots are in display order, so reverse them.
  const swapDoubleElement = (id) => {
    setElements(prev => prev.map(el => (el.id === id ? { ...el, slots: [...el.slots].reverse() } : el)))
  }


  // Word import. On an empty article the document's content goes straight in; when the article already has blocks
  // a modal asks first: REPLACE (blocks, and title/intro/cover where the document has them) or ADD (blocks after what's
  // there; title, intro and cover only fill fields that are still empty — an unused cover goes in as the first image).
  const [pendingImport, setPendingImport] = useState(null)

  const applyImport = ({ title: docTitle, introduction: docIntro, coverImage: docCover, blocks }, mode) => {
    const setup = store.load(store.KEYS.setup, {})
    const replace = mode === 'replace'
    const use = (current, incoming) => incoming && (replace || !current)
    const patch = {
      ...(use(setup.title?.trim(), docTitle) ? { title: docTitle, titleHtml: null } : {}),
      ...(use(setup.introduction?.trim(), docIntro) ? { introduction: docIntro, introductionHtml: null } : {}),
      ...(use(setup.coverImage, docCover) ? { coverImage: docCover } : {}),
    }
    if (docCover && !patch.coverImage) blocks = [{ id: Date.now(), type: 'image', content: { image: docCover, altText: '', caption: '' } }, ...blocks]
    if (Object.keys(patch).length) {
      store.save(store.KEYS.setup, { ...setup, ...patch })
      setSetup(prev => ({ ...prev, ...patch }))
    }
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
            <PageHeader title={isUpdateMode() ? 'Nieuwsartikel updaten' : undefined} step="Stap 1 van 3" saveStatus />
            <div className="article-builder-toggles">
              <ToggleButton
                option1Label="Schrijven"
                option1Icon="ui-pencil-line"
                option2Label="Voorvertoning"
                option2Icon="ui-eye"
                isOption2Active={isPreviewMode}
                onToggle={setIsPreviewMode}
              />
            </div>
          </div>
        </div>

        <div className={`article-builder-content ${isPreviewMode ? 'preview-mode' : ''}`}>
          <ElementSidebar
            onAddElement={addElement}
            onAddDoubleElement={addElement}
            isPreviewMode={isPreviewMode}
            onImportDocx={importDocx}
          />
          <ArticleCanvas
            ref={canvasRef}
            elements={elements}
            focusedElementId={focusedElementId}
            animatingElement={animatingElement}
            scrollToElement={scrollToElement}
            isPreviewMode={isPreviewMode}
            headerData={setup}
            onSetupChange={(patch) => setSetup(prev => {
              const next = { ...prev, ...patch }
              store.patch(store.KEYS.setup, patch)
              return next
            })}
            onFocusElement={setFocusedElementId}
            onUpdateElement={updateElement}
            onUpdateSlot={updateSlot}
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

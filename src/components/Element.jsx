import { useEffect, useState } from 'react'
import ElementWrapper from './ElementWrapper'
import VersionTabBar from './VersionTabBar'
import VersionTypePicker from './VersionTypePicker'
import BlockTargetingModal from './BlockTargetingModal'
import RemoveVersioningModal from './RemoveVersioningModal'
import Modal from './Modal'
import { getSingleElementConfig } from '../config/elementTypes'

/**
 * Element Component
 *
 * Unified component for single-column elements.
 *
 * A block can be "versioned" (targeted): the people button in the positioning
 * rail turns on versioning + opens the targeting modal. Each version has its own
 * block type + content — a new version copies the previous one by default, and
 * the type can be changed on demand via the swap button ("Pas blocktype aan").
 *
 * @param {string} type - Element type (used when not versioned)
 * @param {*} content - Element content (used when not versioned)
 * @param {Function} onChange - Content change handler
 * @param {Array} versions - Content versions (when targeted)
 * @param {Function} onCreateVersioning - Turn on versioning for this block
 * @param {Function} onVersionsChange - Update the versions array
 * @param {Function} onResolveVersioning - Remove versioning ('none'|'first'|'all')
 * @param {boolean} isFocused, isFirst, isLast
 * @param {Function} onMoveUp, onMoveDown, onDuplicate, onDelete
 * @param {boolean} hasOtherText - Whether other text blocks exist (Judith)
 */
const Element = ({
  type,
  content,
  onChange,
  versions,
  onCreateVersioning,
  onVersionsChange,
  onResolveVersioning,
  isFocused = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  hasOtherText = false
}) => {
  const [dimPositioningButtons, setDimPositioningButtons] = useState(false)

  const hasVersions = Array.isArray(versions) && versions.length > 0
  const [activeVersionId, setActiveVersionId] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalAddOnOpen, setModalAddOnOpen] = useState(false)
  const [modalInitialSelectedId, setModalInitialSelectedId] = useState(null)
  const [removeOpen, setRemoveOpen] = useState(false)
  const [typePickerOpen, setTypePickerOpen] = useState(false)

  // Keep the active version valid as versions change
  useEffect(() => {
    if (hasVersions && !versions.some(v => v.id === activeVersionId)) {
      setActiveVersionId(versions[0].id)
    }
  }, [versions, hasVersions, activeVersionId])

  const activeVersion = hasVersions
    ? (versions.find(v => v.id === activeVersionId) || versions[0])
    : null

  // The element's own base type must be valid
  const baseConfig = getSingleElementConfig(type)
  if (!baseConfig) {
    console.error(`Unknown element type: ${type}`)
    return null
  }

  // The type the editor is actually rendering (active version's, or the base)
  const effectiveType = hasVersions ? activeVersion?.type : type
  const activeConfig = effectiveType ? getSingleElementConfig(effectiveType) : null

  const label = activeConfig?.label || baseConfig.label
  const icon = activeConfig?.icon || baseConfig.icon
  const ContentComponent = activeConfig?.ContentComponent

  const showJudithButton =
    effectiveType === 'paragraph' || effectiveType === 'header' || effectiveType === 'citation'

  // Content the editor currently acts on (version-aware)
  const editingContent = hasVersions ? activeVersion?.content : content
  const applyContent = hasVersions
    ? (newContent) => onVersionsChange(versions.map(v => (v.id === activeVersion.id ? { ...v, content: newContent } : v)))
    : onChange

  const getJudithContext = () => {
    switch (effectiveType) {
      case 'header': return 'header'
      case 'citation': return 'citation'
      default: return 'paragraph'
    }
  }

  const handleApplySuggestion = (suggestion) => {
    if (effectiveType === 'header') {
      const match = editingContent?.match?.(/<h([1-3])/)
      const level = match ? match[1] : '2'
      applyContent(`<h${level}>${suggestion}</h${level}>`)
    } else if (effectiveType === 'paragraph') {
      applyContent(`<p>${suggestion}</p>`)
    } else if (effectiveType === 'citation') {
      if (typeof editingContent === 'object') applyContent({ ...editingContent, quote: suggestion })
      else applyContent({ quote: suggestion, person: '' })
    }
  }

  // Copy the previous version's block (type + a deep copy of its content)
  const activeIndex = hasVersions ? versions.findIndex(v => v.id === activeVersion.id) : -1
  const previousVersion = activeIndex > 0 ? versions[activeIndex - 1] : null
  const canCopyPrevious = !!(previousVersion && previousVersion.type)

  // Change the active version's block type (clears content — new shape)
  const handleSelectType = (newType) => {
    setTypePickerOpen(false)
    onVersionsChange(versions.map(v => (v.id === activeVersion.id ? { ...v, type: newType, content: '' } : v)))
  }

  const handleCopyPrevious = () => {
    if (!canCopyPrevious) return
    setTypePickerOpen(false)
    const src = previousVersion.content
    const clonedContent = (src && typeof src === 'object') ? JSON.parse(JSON.stringify(src)) : src
    onVersionsChange(versions.map(v => (
      v.id === activeVersion.id ? { ...v, type: previousVersion.type, content: clonedContent } : v
    )))
  }

  // Versioning controls
  const openModal = ({ addOnOpen = false, initialSelectedId = null } = {}) => {
    setModalAddOnOpen(addOnOpen)
    setModalInitialSelectedId(initialSelectedId)
    setModalOpen(true)
  }

  const handleTarget = () => {
    // Turn on versioning if needed, then open the modal on the first version
    if (!hasVersions && onCreateVersioning) onCreateVersioning()
    openModal()
  }
  const handleAddVersion = () => openModal({ addOnOpen: true })
  const handleOpenSettings = () => openModal()
  const handleEditTab = (id) => openModal({ initialSelectedId: id })
  const handleResolve = (mode) => { if (onResolveVersioning) onResolveVersioning(mode) }

  const topBar = hasVersions ? (
    <VersionTabBar
      versions={versions}
      activeId={activeVersion?.id}
      onSelect={setActiveVersionId}
      onEditTab={handleEditTab}
      onAdd={handleAddVersion}
      onSettings={handleOpenSettings}
      onRemove={() => setRemoveOpen(true)}
    />
  ) : null

  const contentEditor = ContentComponent ? (
    <ContentComponent
      key={hasVersions ? `${activeVersion?.id}-${effectiveType}` : 'base'}
      content={editingContent}
      onChange={applyContent}
      isFocused={isFocused}
      onDimPositioningButtons={setDimPositioningButtons}
    />
  ) : (
    <div className="element-placeholder">
      <p className="body-r text-gray-400">Dit element is nog niet beschikbaar</p>
    </div>
  )

  return (
    <>
      <ElementWrapper
        elementType={effectiveType || type}
        label={label}
        icon={icon}
        topBar={topBar}
        isVersioned={hasVersions}
        onTarget={handleTarget}
        onChangeType={hasVersions && effectiveType ? () => setTypePickerOpen(true) : undefined}
        isFocused={isFocused}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        dimPositioningButtons={dimPositioningButtons}
        showJudithButton={showJudithButton && !!ContentComponent}
        onApplySuggestion={handleApplySuggestion}
        judithContext={getJudithContext()}
        currentContent={editingContent}
        hasOtherText={hasOtherText}
      >
        {contentEditor}
      </ElementWrapper>

      <BlockTargetingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        instances={versions || []}
        onSave={onVersionsChange}
        baseContent={content}
        addOnOpen={modalAddOnOpen}
        initialSelectedId={modalInitialSelectedId}
      />

      <RemoveVersioningModal
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        versionCount={hasVersions ? versions.length : 0}
        onResolve={handleResolve}
      />

      <Modal
        isOpen={typePickerOpen}
        onClose={() => setTypePickerOpen(false)}
        title="Pas blocktype aan voor targeting"
        className="version-type-modal"
      >
        <VersionTypePicker
          onSelect={handleSelectType}
          onCopyPrevious={canCopyPrevious ? handleCopyPrevious : undefined}
        />
      </Modal>
    </>
  )
}

export default Element

import { useState } from 'react'
import ElementWrapper from './ElementWrapper'
import AudienceTab from './AudienceTab'
import BlockTargetingModal from './BlockTargetingModal'
import { getSingleElementConfig } from '../config/elementTypes'
import { isTargeted } from '../config/targeting'

/**
 * Element Component
 *
 * Unified component for single-column elements.
 *
 * A block is for everyone, or for one audience (doelgroepen and/or feeds): the people button in the
 * positioning rail opens BlockTargetingModal; a targeted block shows a green AudienceTab above it.
 *
 * @param {string} type - Element type
 * @param {*} content - Element content
 * @param {Function} onChange - Content change handler
 * @param {object} targeting - { doelgroepen, feeds } or undefined (everyone)
 * @param {Function} onTargetingChange - (targeting | undefined) => void
 * @param {boolean} isFocused, isFirst, isLast
 * @param {Function} onMoveUp, onMoveDown, onDuplicate, onDelete
 * @param {boolean} hasOtherText - Whether other text blocks exist (Judith)
 */
const Element = ({
  type,
  content,
  onChange,
  targeting,
  onTargetingChange,
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
  const [modalOpen, setModalOpen] = useState(false)
  const targeted = isTargeted(targeting)

  const config = getSingleElementConfig(type)
  if (!config) {
    console.error(`Unknown element type: ${type}`)
    return null
  }
  const { label, icon, ContentComponent } = config

  const showJudithButton = type === 'paragraph' || type === 'header' || type === 'citation'

  const getJudithContext = () => {
    switch (type) {
      case 'header': return 'header'
      case 'citation': return 'citation'
      default: return 'paragraph'
    }
  }

  const handleApplySuggestion = (suggestion) => {
    if (type === 'header') {
      const match = content?.match?.(/<h([1-3])/)
      const level = match ? match[1] : '2'
      onChange(`<h${level}>${suggestion}</h${level}>`)
    } else if (type === 'paragraph') {
      onChange(`<p>${suggestion}</p>`)
    } else if (type === 'citation') {
      if (typeof content === 'object') onChange({ ...content, quote: suggestion })
      else onChange({ quote: suggestion, person: '' })
    }
  }

  return (
    <>
      <ElementWrapper
        elementType={type}
        label={label}
        icon={icon}
        topBar={targeted ? <AudienceTab targeting={targeting} onEdit={() => setModalOpen(true)} /> : null}
        isTargeted={targeted}
        onTarget={() => setModalOpen(true)}
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
        currentContent={content}
        hasOtherText={hasOtherText}
      >
        {ContentComponent ? (
          <ContentComponent
            content={content}
            onChange={onChange}
            isFocused={isFocused}
            onDimPositioningButtons={setDimPositioningButtons}
          />
        ) : (
          <div className="element-placeholder">
            <p className="body-r text-gray-400">Dit element is nog niet beschikbaar</p>
          </div>
        )}
      </ElementWrapper>

      {modalOpen && (
        <BlockTargetingModal
          isOpen
          onClose={() => setModalOpen(false)}
          targeting={targeting}
          onSave={onTargetingChange}
        />
      )}
    </>
  )
}

export default Element

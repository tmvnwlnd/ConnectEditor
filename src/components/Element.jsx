import { useState } from 'react'
import ElementWrapper from './ElementWrapper'
import { getSingleElementConfig } from '../config/elementTypes'
import { useBlockTargeting } from '../hooks/useBlockTargeting'

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
  const { targeted, openModal, topBar, modal } = useBlockTargeting(targeting, onTargetingChange)

  const config = getSingleElementConfig(type)
  if (!config) {
    console.error(`Unknown element type: ${type}`)
    return null
  }
  const { label, icon, ContentComponent } = config

  // AI button: only for types that define how a suggestion is applied (see elementTypes.js).
  const { judith } = config
  const handleApplySuggestion = (suggestion) => onChange(judith.apply(content, suggestion))

  return (
    <>
      <ElementWrapper
        elementType={type}
        label={label}
        icon={icon}
        topBar={topBar}
        isTargeted={targeted}
        onTarget={openModal}
        isFocused={isFocused}
        isFirst={isFirst}
        isLast={isLast}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        dimPositioningButtons={dimPositioningButtons}
        showJudithButton={!!judith && !!ContentComponent}
        onApplySuggestion={handleApplySuggestion}
        judithContext={judith?.context}
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

      {modal}
    </>
  )
}

export default Element

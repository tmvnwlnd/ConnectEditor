import { Icon, JudithButton } from './ds'
import { getSingleElementConfig } from '../config/elementTypes'
import '../styles/ElementContent.css'

/**
 * ElementContent Component
 *
 * Lightweight content wrapper for nested elements (used in double-column layouts).
 * Provides minimal UI - just a small type badge and the content component.
 * No positioning buttons or heavy chrome - that's handled by the parent wrapper.
 *
 * @param {string} type - Element type (e.g., 'paragraph', 'image', 'citation')
 * @param {*} content - Element content (string or object depending on type)
 * @param {Function} onChange - Content change handler
 * @param {boolean} isFocused - Whether parent element is focused
 * @param {boolean} hasOtherText - Whether other text blocks exist (for Judith AI conditions)
 */
function ElementContent({ type, content, onChange, isFocused = false, hasOtherText = false }) {
  const config = getSingleElementConfig(type)

  if (!config) {
    console.error(`Unknown element type: ${type}`)
    return null
  }

  const { label, icon, ContentComponent } = config

  if (!ContentComponent) {
    return (
      <div className="element-content-minimal">
        <div className="element-type-badge">
          <Icon
            name={icon}
            size={24}
            color={isFocused ? 'var(--kpn-green-500)' : 'var(--gray-400)'}
          />
          <span className={`body-r ${isFocused ? 'text-green' : 'text-gray-400'}`}>{label}</span>
        </div>
        <div className="element-content-placeholder">
          <p className="body-r text-gray-400">Dit element is nog niet beschikbaar</p>
        </div>
      </div>
    )
  }

  // Show Judith button for paragraph type
  const showJudithButton = type === 'paragraph' && isFocused

  // Handler for applying AI suggestion
  const handleApplySuggestion = (suggestion) => {
    const newContent = `<p>${suggestion}</p>`
    onChange(newContent)
  }

  return (
    <div className="element-content-minimal">
      <div className="element-type-badge">
        <Icon
          name={icon}
          size={24}
          color={isFocused ? 'var(--kpn-green-500)' : 'var(--gray-400)'}
        />
        <span className={`body-l ${isFocused ? 'text-green' : 'text-gray-400'}`}>{label}</span>
        {showJudithButton && (
          <JudithButton
            context="paragraph"
            onApplySuggestion={handleApplySuggestion}
            currentContent={content}
            hasOtherText={hasOtherText}
          />
        )}
      </div>
      <div className="element-content-body">
        <ContentComponent
          content={content}
          onChange={onChange}
          isFocused={isFocused}
        />
      </div>
    </div>
  )
}

export default ElementContent

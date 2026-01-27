import { Icon } from './ds'
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
 */
function ElementContent({ type, content, onChange, isFocused = false }) {
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

  return (
    <div className="element-content-minimal">
      <div className="element-type-badge">
        <Icon
          name={icon}
          size={24}
          color={isFocused ? 'var(--kpn-green-500)' : 'var(--gray-400)'}
        />
        <span className={`body-l ${isFocused ? 'text-green' : 'text-gray-400'}`}>{label}</span>
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

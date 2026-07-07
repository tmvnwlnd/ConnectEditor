import SidebarListItem from './SidebarListItem'
import { Button } from './ds'
import { SINGLE_ELEMENT_TYPES } from '../config/elementTypes'
import '../styles/VersionTypePicker.css'

/**
 * VersionTypePicker
 *
 * Shown inside a versioned block when the active version has no block type yet,
 * or when re-choosing the type via the pen icon. The first option copies the
 * previous version's block (type + content) so simple edits are easy; the rest
 * let the version be any single-column type.
 *
 * @param {Function} onSelect - (type) => void
 * @param {Function} [onCopyPrevious] - Copy the previous version's block (omit to hide)
 * @param {Function} [onCancel] - Keep the current block instead of changing it (omit to hide)
 */
const TYPE_ORDER = [
  'header', 'paragraph', 'citation', 'table',
  'image', 'video', 'audio', 'attachment', 'carousel', 'text-graphic',
]

function VersionTypePicker({ onSelect, onCopyPrevious, onCancel }) {
  return (
    <div className="version-type-picker">
      <div className="version-type-picker-header">
        <p className="version-type-picker-title body-r text-gray-400">
          Kies een bloktype voor deze versie
        </p>
        {onCancel && (
          <Button variant="ghost" size="compact" onClick={onCancel}>
            Annuleer
          </Button>
        )}
      </div>
      <div className="version-type-picker-grid">
        {onCopyPrevious && (
          <SidebarListItem
            id="copy-previous"
            label="Kopieer vorige versie"
            iconName="ui-copy"
            onClick={() => onCopyPrevious()}
            className="version-type-copy"
          />
        )}
        {TYPE_ORDER.map(type => {
          const config = SINGLE_ELEMENT_TYPES[type]
          if (!config || !config.enabled) return null
          return (
            <SidebarListItem
              key={type}
              id={type}
              label={config.label}
              iconName={config.icon}
              onClick={(id) => onSelect(id)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default VersionTypePicker

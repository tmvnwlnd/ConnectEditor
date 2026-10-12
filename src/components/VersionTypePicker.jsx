import SidebarListItem from './SidebarListItem'
import { SINGLE_ELEMENT_TYPES } from '../config/elementTypes'
import '../styles/VersionTypePicker.css'

/**
 * VersionTypePicker
 *
 * The block-type chooser shown inside the "Pas blocktype aan" modal. The first
 * option copies the previous version's block (type + content) for quick edits;
 * the rest let the version be any single-column type.
 *
 * @param {Function} onSelect - (type) => void
 * @param {Function} [onCopyPrevious] - Copy the previous version's block (omit to hide)
 */
const TYPE_ORDER = [
  'header', 'paragraph', 'citation', 'table',
  'image', 'video', 'audio', 'attachment', 'carousel', 'text-graphic',
]

function VersionTypePicker({ onSelect, onCopyPrevious }) {
  return (
    <div className="version-type-picker">
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

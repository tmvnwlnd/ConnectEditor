import { Icon } from './ds'
import { versionTitle } from '../config/targeting'
import '../styles/VersionTabBar.css'

/**
 * VersionTabBar
 *
 * The tab bar that "pops out" above a targeted (versioned) block. One tab per
 * version; hovering the active tab reveals a pen that opens the targeting modal
 * for that version. Controls: add a version (+), settings (gear), remove (trash).
 *
 * @param {Array} versions - [{ id, name }]
 * @param {number} activeId - Active version id
 * @param {Function} onSelect - (id) => void
 * @param {Function} onEditTab - (id) => void  open the modal for that version
 * @param {Function} onAdd - Add a version
 * @param {Function} onSettings - Open the targeting modal
 * @param {Function} onRemove - Remove the versioning (confirm modal)
 */
function VersionTabBar({ versions, activeId, onSelect, onEditTab, onAdd, onSettings, onRemove }) {
  return (
    <div className="version-tabbar">
      <div className="version-tabbar-tabs">
        {versions.map(v => {
          const isActive = v.id === activeId
          // Click a tab to select it; click the already-active tab to edit it
          const handleClick = (e) => {
            e.stopPropagation()
            if (isActive && onEditTab) onEditTab(v.id)
            else onSelect(v.id)
          }
          return (
            <button
              key={v.id}
              type="button"
              className={`version-tab body-r ${isActive ? 'is-active' : ''}`}
              onClick={handleClick}
              title={isActive ? 'Bewerk targeting van deze versie' : versionTitle(v)}
            >
              <span className="version-tab-title">{versionTitle(v)}</span>
              {isActive && onEditTab && (
                <span className="version-tab-pen" aria-hidden="true">
                  <Icon name="ui-pencil-line" size={14} color="currentColor" />
                </span>
              )}
            </button>
          )
        })}
        <button
          type="button"
          className="version-tabbar-add"
          onClick={(e) => { e.stopPropagation(); onAdd() }}
          aria-label="Voeg versie toe"
        >
          <Icon name="ui-plus" size={18} color="var(--kpn-blue-500)" />
        </button>
      </div>

      <div className="version-tabbar-controls">
        <button
          type="button"
          className="version-tabbar-control"
          onClick={(e) => { e.stopPropagation(); onSettings() }}
          aria-label="Targeting-instellingen"
        >
          <Icon name="ui-gear" size={18} color="var(--gray-400)" />
        </button>
        <button
          type="button"
          className="version-tabbar-control version-tabbar-control-danger"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          aria-label="Verwijder versioning"
        >
          <Icon name="ui-trash" size={18} color="var(--kpn-red-500)" />
        </button>
      </div>
    </div>
  )
}

export default VersionTabBar

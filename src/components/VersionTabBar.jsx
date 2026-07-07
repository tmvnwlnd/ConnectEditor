import { Icon } from './ds'
import { versionTitle } from '../config/targeting'
import '../styles/VersionTabBar.css'

/**
 * VersionTabBar
 *
 * The tab bar that "pops out" above a targeted (versioned) block. Shows one tab
 * per version, plus controls to add a version (+), open the targeting settings
 * (gear), and remove the versioning (trash).
 *
 * @param {Array} versions - [{ id, name }]
 * @param {number} activeId - Active version id
 * @param {Function} onSelect - (id) => void
 * @param {Function} onAdd - Add a version (opens the modal)
 * @param {Function} onSettings - Open the targeting modal
 * @param {Function} onRemove - Remove the versioning (opens the confirm modal)
 */
function VersionTabBar({ versions, activeId, onSelect, onAdd, onSettings, onRemove }) {
  return (
    <div className="version-tabbar">
      <div className="version-tabbar-tabs">
        {versions.map(v => {
          const isActive = v.id === activeId
          const doelgroepen = v.doelgroepen || []
          return (
            <button
              key={v.id}
              type="button"
              className={`version-tab body-r ${isActive ? 'is-active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onSelect(v.id) }}
              title={versionTitle(v)}
            >
              <span className="version-tab-title">{versionTitle(v)}</span>
              {isActive && doelgroepen.length > 0 && (
                <span className="version-tab-tags">
                  {doelgroepen.map(dg => (
                    <span key={dg} className="version-tab-tag">{dg}</span>
                  ))}
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

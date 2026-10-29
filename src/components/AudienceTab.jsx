import { Icon } from './ds'
import { audienceLabel } from '../config/targeting'
import '../styles/AudienceTab.css'

/** The green tab above a targeted block: who it is for. Click to change. */
const AudienceTab = ({ targeting, onEdit }) => (
  <div className="version-tabbar">
    <div className="version-tabbar-tabs">
      <button
        type="button"
        className="version-tab is-active"
        title="Pas aan voor wie dit blok is"
        onClick={(e) => { e.stopPropagation(); onEdit() }}
      >
        <Icon name="ui-people" size={16} color="var(--gray-000)" />
        <span className="version-tab-title audience-tab-title">Voor {audienceLabel(targeting)}</span>
        <span className="version-tab-pen"><Icon name="ui-pencil-line" size={14} color="currentColor" /></span>
      </button>
    </div>
  </div>
)

export default AudienceTab

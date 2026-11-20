import { Icon } from './ds'

/**
 * BlockHeader — the icon + title row at the top of every block (single, double column, the fixed Header block).
 * Inner blocks of a combined block never get one (see ElementContent).
 * On focus only the icon turns green; the title stays gray.
 *
 * @param {string} icon - Icon name
 * @param {string} label - Block title
 * @param {boolean} isFocused
 * @param {React.ReactNode} right - Right-hand slot (e.g. the AI button)
 */
const BlockHeader = ({ icon, label, isFocused = false, right = null }) => (
  <div className="element-header">
    <div className="element-header-left">
      <Icon name={icon} size={24} color={isFocused ? 'var(--kpn-green-500)' : 'var(--gray-400)'} />
      <span className="body-l">{label}</span>
    </div>
    {right && <div className="element-header-right">{right}</div>}
  </div>
)

export default BlockHeader

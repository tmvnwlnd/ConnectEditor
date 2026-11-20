import { Icon } from './ds'

/**
 * BlockHeader — the icon + title row at the top of every block (single, double column, the fixed Header block).
 * Inner blocks of a combined block never get one (see ElementContent).
 *
 * @param {string} icon - Icon name
 * @param {string} label - Block title
 * @param {boolean} isFocused - Icon (and with greenLabelWhenFocused, the title) turn green
 * @param {boolean} greenLabelWhenFocused - Double columns also colour the TITLE green on focus; single blocks
 *   and the Header block don't. Kept as it was — which one is right is an open design question.
 * @param {React.ReactNode} right - Right-hand slot (e.g. the AI button)
 */
const BlockHeader = ({ icon, label, isFocused = false, greenLabelWhenFocused = false, right = null }) => (
  <div className="element-header">
    <div className="element-header-left">
      <Icon name={icon} size={24} color={isFocused ? 'var(--kpn-green-500)' : 'var(--gray-400)'} />
      <span className={`body-l${greenLabelWhenFocused ? (isFocused ? ' text-green' : ' text-gray-400') : ''}`}>{label}</span>
    </div>
    {right && <div className="element-header-right">{right}</div>}
  </div>
)

export default BlockHeader

import BlockHeader from './BlockHeader'
import ElementContent from './ElementContent'

/**
 * CombinedBlock — one block made of several regular inner blocks ("slots") under ONE header.
 * Used by double columns (layout 'columns') and the fixed Header block (layout 'stack': cover + kop + alinea).
 * Inner blocks are bare editors (ElementContent): no icon, title, rail or AI button of their own.
 *
 * @param {string} icon, label - The block's header
 * @param {boolean} isFocused
 * @param {boolean} greenLabelWhenFocused - See BlockHeader (double columns only, kept as it was)
 * @param {'columns'|'stack'} layout
 * @param {Array<{type, content, props?}>} slots - Display order; `props` go to the editor (placeholder, emptyLabel…)
 * @param {Function} onUpdateSlot - (index, content) => void
 * @param {string} className - Extra classes on the bordered wrapper
 * @param {string} bodyClassName - Extra classes on the slots container
 * @param {boolean} hasOtherText - Passed through to the editors (for the AI button; unused by inner blocks today)
 */
const LAYOUT = {
  columns: { wrapper: 'double-column-wrapper', focused: 'focused', body: 'double-column-grid' },
  stack: { wrapper: 'element-wrapper', focused: 'element-focused', body: 'element-content article-header-stack' }
}

const CombinedBlock = ({
  icon,
  label,
  isFocused = false,
  greenLabelWhenFocused = false,
  layout = 'stack',
  slots = [],
  onUpdateSlot,
  className = '',
  bodyClassName = '',
  hasOtherText = false
}) => {
  const css = LAYOUT[layout]
  return (
    <div className={`${css.wrapper} ${isFocused ? css.focused : ''} ${className}`.trim()}>
      <BlockHeader icon={icon} label={label} isFocused={isFocused} greenLabelWhenFocused={greenLabelWhenFocused} />
      <div className={`${css.body} ${bodyClassName}`.trim()}>
        {slots.map((slot, i) => {
          const editor = (
            <ElementContent
              key={i}
              type={slot.type}
              content={slot.content}
              onChange={(content) => onUpdateSlot?.(i, content)}
              isFocused={isFocused}
              hasOtherText={hasOtherText}
              {...slot.props}
            />
          )
          return layout === 'columns'
            ? <div key={i} className={i === 0 ? 'double-column-left' : 'double-column-right'}>{editor}</div>
            : editor
        })}
      </div>
    </div>
  )
}

export default CombinedBlock

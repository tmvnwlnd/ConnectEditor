import { useRef } from 'react'
import BlockHeader from './BlockHeader'
import ElementContent from './ElementContent'
import { JudithButton } from './ds'
import { getSingleElementConfig } from '../config/elementTypes'

/**
 * CombinedBlock — one block made of several regular inner blocks ("slots") under ONE header.
 * Used by double columns (layout 'columns') and the fixed Header block (layout 'stack': cover + kop + alinea).
 * Inner blocks are bare editors (ElementContent): no icon, title, rail or AI button of their own.
 *
 * AI button: shown in the block's header (like single blocks) when a slot is a text type; a suggestion goes to the
 * text slot last clicked, else the first one. Hidden everywhere while JUDITH_ENABLED is off (ds/JudithButton.jsx).
 *
 * @param {string} icon, label - The block's header
 * @param {boolean} isFocused
 * @param {'columns'|'stack'} layout
 * @param {Array<{type, content, props?}>} slots - Display order; `props` go to the editor (placeholder, emptyLabel…)
 * @param {Function} onUpdateSlot - (index, content) => void
 * @param {string} className - Extra classes on the bordered wrapper
 * @param {string} bodyClassName - Extra classes on the slots container
 * @param {boolean} hasOtherText - For the AI button
 */
const LAYOUT = {
  columns: { wrapper: 'double-column-wrapper', focused: 'focused', body: 'double-column-grid' },
  stack: { wrapper: 'element-wrapper', focused: 'element-focused', body: 'element-content article-header-stack' }
}

const CombinedBlock = ({
  icon,
  label,
  isFocused = false,
  layout = 'stack',
  slots = [],
  onUpdateSlot,
  className = '',
  bodyClassName = '',
  hasOtherText = false
}) => {
  const css = LAYOUT[layout]
  const lastTextSlot = useRef(null)

  const textSlots = slots.map((s, i) => (getSingleElementConfig(s.type)?.judith ? i : -1)).filter((i) => i >= 0)
  const aiSlot = textSlots.includes(lastTextSlot.current) ? lastTextSlot.current : textSlots[0]
  const aiJudith = aiSlot !== undefined ? getSingleElementConfig(slots[aiSlot].type).judith : null

  const aiButton = aiJudith && isFocused ? (
    <JudithButton
      context={aiJudith.context}
      currentContent={slots[aiSlot].content}
      hasOtherText={hasOtherText}
      onApplySuggestion={(suggestion) => onUpdateSlot?.(aiSlot, aiJudith.apply(slots[aiSlot].content, suggestion))}
    />
  ) : null

  return (
    <div className={`${css.wrapper} ${isFocused ? css.focused : ''} ${className}`.trim()}>
      <BlockHeader icon={icon} label={label} isFocused={isFocused} right={aiButton} />
      <div className={`${css.body} ${bodyClassName}`.trim()}>
        {slots.map((slot, i) => {
          const editor = (
            <ElementContent
              key={i}
              type={slot.type}
              content={slot.content}
              onChange={(content) => onUpdateSlot?.(i, content)}
              isFocused={isFocused}
              {...slot.props}
            />
          )
          const remember = textSlots.includes(i) ? () => { lastTextSlot.current = i } : undefined
          return layout === 'columns'
            ? <div key={i} className={i === 0 ? 'double-column-left' : 'double-column-right'} onFocusCapture={remember}>{editor}</div>
            : <div key={i} onFocusCapture={remember}>{editor}</div>
        })}
      </div>
    </div>
  )
}

export default CombinedBlock

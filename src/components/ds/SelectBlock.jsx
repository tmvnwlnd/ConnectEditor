/**
 * SelectBlock Component
 * ONE component for every "selection block" in the publishing steps — a white box with a 1px gray border:
 *
 *   [checkbox | radio]  [icon]  title          [×]
 *                                meta (gray)
 *
 * Settings cover the variations:
 * - control:  'checkbox' | 'radio' | undefined — a choosable block (whole box clickable; checked = blue border). Without a control it's a display block (e.g. a picked item).
 * - layout:   'inline' (default: icon left of the text) | 'stacked' (icon above the title, e.g. channels).
 * - tone:     'green' (default) | 'neutral' | 'orange' | 'red' — the icon colour. Selected = always a BLUE border.
 * - iconBadge: put the icon in a tinted circle (priority levels).
 * - onRemove: shows a × button (picked doelgroepen / feeds).
 * Everything is vertically centred; the title is regular weight (body-r), the meta body-s gray.
 *
 * @param {string}   control
 * @param {string}   name        radio group name
 * @param {boolean}  checked
 * @param {function} onChange    () => void
 * @param {boolean}  disabled
 * @param {string}   icon
 * @param {string}   layout
 * @param {string}   tone
 * @param {boolean}  iconBadge
 * @param {node}     title
 * @param {node}     meta
 * @param {function} onRemove
 * @param {string}   removeLabel
 * @param {string}   className
 */

import Icon from './Icon'
import './SelectBlock.css'

function SelectBlock({
  control,
  name,
  checked = false,
  onChange,
  disabled = false,
  icon,
  layout = 'inline',
  tone = 'green',
  iconBadge = false,
  title,
  meta,
  onRemove,
  removeLabel,
  className = '',
}) {
  const Root = control ? 'label' : 'div'
  const classes = [
    'select-block',
    `select-block--${layout}`,
    `select-block--${tone}`,
    control ? 'is-choosable' : '',
    checked ? 'is-checked' : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Root className={classes}>
      {control && (
        <span className="field-choice select-block-control">
          <input type={control} name={name} checked={checked} disabled={disabled} onChange={() => onChange?.()} />
        </span>
      )}
      <span className="select-block-main">
        {icon && (
          <span className={`select-block-icon ${iconBadge ? 'has-badge' : ''}`}>
            <Icon name={icon} size={iconBadge ? 20 : 24} color="currentColor" />
          </span>
        )}
        <span className="select-block-text">
          <span className="body-r select-block-title">{title}</span>
          {meta && <span className="body-s select-block-meta">{meta}</span>}
        </span>
      </span>
      {onRemove && (
        <button
          type="button"
          className="select-block-remove"
          aria-label={removeLabel || 'Verwijderen'}
          onClick={(e) => {
            e.preventDefault()
            onRemove()
          }}
        >
          <Icon name="ui-x" size={20} color="currentColor" />
        </button>
      )}
    </Root>
  )
}

export default SelectBlock

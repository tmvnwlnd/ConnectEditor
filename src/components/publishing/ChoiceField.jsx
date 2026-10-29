import { Checkbox, RadioButton, Dropdown, Pill } from '../ds'
import '../../styles/PublishingTargeting.css'

// Fewer than this many options → checkboxes / radios; otherwise a dropdown.
const MAX_INLINE = 5

/**
 * ChoiceField — picks one or more options. Fewer than 5 options show as checkboxes (multiple) or radios
 * (single); 5 or more as a dropdown. A multiple dropdown adds each pick as a removable chip.
 *
 * @param {Array}    options  [{ id, name }]
 * @param {*}        value    id (single) or id[] (multiple)
 * @param {boolean}  multiple
 * @param {Function} onChange (value) => void
 * @param {string}   name     form name (radios) / dropdown id
 * @param {string}   placeholder
 * @param {boolean}  disabled
 * @param {number}   max      multiple: at most this many picks
 */
function ChoiceField({ options = [], value, multiple = false, onChange, name, placeholder = 'Kies…', disabled = false, max = Infinity }) {
  const selected = multiple ? value || [] : value
  const nameOf = (id) => options.find((o) => String(o.id) === String(id))?.name || id
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])

  if (options.length < MAX_INLINE) {
    return (
      <div className="choice-inline">
        {options.map((o) =>
          multiple ? (
            <Checkbox key={o.id} label={o.name} checked={selected.includes(o.id)} disabled={disabled} onChange={() => toggle(o.id)} />
          ) : (
            <RadioButton key={o.id} label={o.name} name={name} checked={selected === o.id} disabled={disabled} onChange={() => onChange(o.id)} />
          ),
        )}
      </div>
    )
  }

  if (!multiple) {
    return (
      <Dropdown
        id={name}
        value={selected ?? ''}
        disabled={disabled}
        placeholder={placeholder}
        options={options.map((o) => ({ value: o.id, label: o.name }))}
        onChange={(e) => onChange(options.find((o) => String(o.id) === e.target.value)?.id)}
      />
    )
  }

  const rest = options.filter((o) => !selected.includes(o.id))
  return (
    <div className="choice-multi">
      <Dropdown
        id={name}
        value=""
        disabled={disabled || rest.length === 0 || selected.length >= max}
        placeholder={placeholder}
        options={rest.map((o) => ({ value: o.id, label: o.name }))}
        onChange={(e) => {
          const o = options.find((x) => String(x.id) === e.target.value)
          if (o) onChange([...selected, o.id])
        }}
      />
      {selected.length > 0 && (
        <div className="choice-chips">
          {selected.map((id) => (
            <Pill key={id} isSelected onClick={() => !disabled && toggle(id)} aria-label={`Verwijder ${nameOf(id)}`}>
              {nameOf(id)}
            </Pill>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChoiceField

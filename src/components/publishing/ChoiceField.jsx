import { Checkbox, RadioButton, Dropdown, Pill, Icon, SearchSelect } from '../ds'
import '../../styles/PublishingTargeting.css'

// Fewer than this many options → checkboxes / radios; otherwise a dropdown.
const MAX_INLINE = 5

/**
 * ChoiceField — picks one or more options. Fewer than 5 options show as checkboxes (multiple) or radios
 * (single); 5 or more as a SEARCHABLE dropdown. A multiple dropdown adds each pick as a removable chip.
 * Options that carry an `icon` get the richer look:
 *  - inline checkboxes → CARDS (1px gray border: checkbox left, icon above the title) — e.g. channels;
 *  - picked items → white ITEM boxes (icon left, title body-r bold, `meta` body-s gray, ✕ to remove) — doelgroepen, feeds.
 *
 * @param {Array}    options  [{ id, name, icon?, meta? }]
 * @param {*}        value    id (single) or id[] (multiple)
 * @param {boolean}  multiple
 * @param {Function} onChange (value) => void
 * @param {string}   name     form name (radios) / dropdown id
 * @param {string}   placeholder
 * @param {boolean}  disabled
 * @param {number}   max      multiple: at most this many picks
 * @param {boolean}  searchable  (default) every dropdown is SEARCHABLE (`ds/SearchSelect`); pass false for a plain select
 * @param {Function} renderSelected  multiple dropdown: (ids, remove(id)) => node — replaces the chips / items
 */
function ChoiceField({ options = [], value, multiple = false, onChange, name, placeholder = 'Kies…', disabled = false, max = Infinity, renderSelected, searchable = true }) {
  const selected = multiple ? value || [] : value
  const nameOf = (id) => options.find((o) => String(o.id) === String(id))?.name || id
  const toggle = (id) => onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id])

  const rich = options.some((o) => o.icon)

  if (options.length < MAX_INLINE && multiple && rich) {
    return (
      <div className="choice-cards">
        {options.map((o) => (
          <label key={o.id} className={`choice-card ${selected.includes(o.id) ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}>
            <span className="field-choice">
              <input type="checkbox" checked={selected.includes(o.id)} disabled={disabled} onChange={() => toggle(o.id)} />
            </span>
            <span className="choice-card-text">
              <Icon name={o.icon} size={24} color="var(--kpn-green-500)" />
              <span className="body-r-bold">{o.name}</span>
            </span>
          </label>
        ))}
      </div>
    )
  }

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
      <SearchSelect
        id={name}
        value={selected ?? ''}
        disabled={disabled}
        placeholder={placeholder}
        options={options.map((o) => ({ value: o.id, label: o.name }))}
        onSelect={(v) => onChange(options.find((o) => String(o.id) === String(v))?.id)}
      />
    )
  }

  const rest = options.filter((o) => !selected.includes(o.id))
  return (
    <div className="choice-multi">
      {searchable !== false ? (
        <SearchSelect
          id={name}
          disabled={disabled || rest.length === 0 || selected.length >= max}
          placeholder={placeholder}
          options={rest.map((o) => ({ value: o.id, label: o.name }))}
          onSelect={(v) => onChange([...selected, v])}
        />
      ) : (
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
      )}
      {selected.length > 0 && renderSelected && renderSelected(selected, toggle)}
      {selected.length > 0 && rich && !renderSelected && (
        <div className="choice-items">
          {selected.map((id) => {
            const o = options.find((x) => String(x.id) === String(id)) || { name: id }
            return (
              <div key={id} className="choice-item">
                {o.icon && <Icon name={o.icon} size={24} color="var(--kpn-green-500)" />}
                <span className="choice-item-text">
                  <span className="body-r-bold">{o.name}</span>
                  {o.meta && <span className="body-s text-gray-400">{o.meta}</span>}
                </span>
                {!disabled && (
                  <button type="button" className="choice-item-remove" aria-label={`Verwijder ${o.name}`} onClick={() => toggle(id)}>
                    <Icon name="ui-x" size={20} color="currentColor" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
      {selected.length > 0 && !rich && !renderSelected && (
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

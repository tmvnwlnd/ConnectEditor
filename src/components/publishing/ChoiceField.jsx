import { Checkbox, RadioButton, Dropdown, Pill, SearchSelect, SelectBlock } from '../ds'
import '../../styles/PublishingTargeting.css'

// Fewer than this many options → checkboxes / radios; otherwise a dropdown.
const MAX_INLINE = 5

/**
 * ChoiceField — picks one or more options. Fewer than 5 options show as checkboxes (multiple) or radios
 * (single); 5 or more as a SEARCHABLE dropdown. A multiple dropdown adds each pick as a removable chip.
 * Options that carry an `icon` get the richer look:
 *  - inline checkboxes → `SelectBlock`s with a checkbox, icon above the title — e.g. channels;
 *  - picked items → `SelectBlock`s with icon, title, `meta` and a × to remove — doelgroepen, feeds.
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
      <div className="select-blocks-row">
        {options.map((o) => (
          <SelectBlock
            key={o.id}
            control="checkbox"
            layout="stacked"
            icon={o.icon}
            title={o.name}
            checked={selected.includes(o.id)}
            disabled={disabled}
            onChange={() => toggle(o.id)}
          />
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
        <div className="select-blocks-list choice-picked-grid">
          {selected.map((id) => {
            const o = options.find((x) => String(x.id) === String(id)) || { name: id }
            return (
              <SelectBlock
                key={id}
                icon={o.icon}
                title={o.name}
                meta={o.meta}
                onRemove={disabled ? undefined : () => toggle(id)}
                removeLabel={`Verwijder ${o.name}`}
              />
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

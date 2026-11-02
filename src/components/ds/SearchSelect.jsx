/**
 * SearchSelect Component
 * A SEARCHABLE dropdown that looks like the DS Dropdown (same field + chevron): click or focus opens the list,
 * typing filters it, ↑/↓ + Enter pick, Esc closes. Picking calls `onSelect(value)` and clears the field — so it
 * works as the "add one more" field of a multiple choice (ChoiceField `searchable`).
 *
 * @param {string}   id
 * @param {array}    options      [{ value, label }]
 * @param {function} onSelect     (value) => void
 * @param {*}        value        SINGLE choice: the chosen value — shown in the field while it's closed
 * @param {string}   placeholder
 * @param {boolean}  disabled
 */

import { useEffect, useRef, useState } from 'react'
import './Form.css'

function SearchSelect({ id, options = [], onSelect, value, placeholder = 'Zoek…', disabled = false, className = '' }) {
  const wrapRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [hi, setHi] = useState(0)
  const [up, setUp] = useState(false) // open upwards when there's no room below (e.g. above the sticky footer)

  const q = query.trim().toLowerCase()
  const shown = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options

  // Closing (Esc, click outside, a pick) forgets what was typed.
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  useEffect(() => {
    if (open && wrapRef.current) {
      const r = wrapRef.current.getBoundingClientRect()
      setUp(window.innerHeight - r.bottom < 300 + 96 && r.top > 300)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setOpen(false)
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  const pick = (o) => {
    onSelect?.(o.value)
    setQuery('')
    setHi(0)
    setOpen(false)
  }
  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') setHi((h) => Math.min(h + 1, shown.length - 1))
    else if (e.key === 'ArrowUp') setHi((h) => Math.max(h - 1, 0))
    else if (e.key === 'Enter' && shown[hi]) pick(shown[hi])
    else if (e.key === 'Escape') {
      e.stopPropagation()
      setOpen(false)
    } else return
    e.preventDefault()
  }

  return (
    <div className={`form-field search-select ${className}`} ref={wrapRef}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        autoComplete="off"
        className="field-select search-select-input"
        value={open ? query : String(options.find((o) => String(o.value) === String(value))?.label ?? query)}
        placeholder={open && value != null && value !== '' ? 'Zoek…' : placeholder}
        disabled={disabled}
        onFocus={() => setOpen(true)}
        onClick={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value)
          setHi(0)
          setOpen(true)
        }}
        onKeyDown={onKeyDown}
      />
      {open && !disabled && (
        <ul className={`search-select-list ${up ? 'is-up' : ''}`} role="listbox">
          {shown.length === 0 && <li className="search-select-empty">Geen resultaten</li>}
          {shown.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={i === hi}
              className={`search-select-option ${i === hi ? 'is-hi' : ''} ${String(o.value) === String(value) ? 'is-selected' : ''}`}
              onMouseEnter={() => setHi(i)}
              onMouseDown={(e) => {
                e.preventDefault()
                pick(o)
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchSelect

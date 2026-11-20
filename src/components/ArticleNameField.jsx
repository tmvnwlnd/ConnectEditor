import { useEffect, useRef, useState } from 'react'
import { Icon } from './ds'
import * as store from '../store/articleStore'
import { subscribeSaveStatus } from '../utils/errorReporter'
import '../styles/ArticleNameField.css'

const FALLBACK = 'Nieuwsartikel maken'
const read = () => store.load(store.KEYS.setup, {})

/**
 * ArticleNameField — the article's internal name, as the editor's page title. Saved as `articleSetupData.internalName`.
 * Not set → it shows the article title (follows it live); no title either → the old page title.
 * Shows as a green title; hover adds a field border + blue pen; click turns it into a text field
 * (Enter / leaving the field saves, Escape cancels; saving it empty goes back to following the title).
 */
export default function ArticleNameField() {
  const [data, setData] = useState(read)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef(null)

  // Re-read after every draft save, so an unset name follows the article title as it's typed.
  useEffect(() => subscribeSaveStatus(() => setData(read())), [])
  useEffect(() => { if (editing) inputRef.current?.select() }, [editing])

  const name = data.internalName?.trim() || data.title?.trim() || ''
  const start = () => { setDraft(name); setEditing(true) }
  const commit = () => {
    const internalName = draft.trim()
    store.save(store.KEYS.setup, { ...read(), internalName })
    setData(read())
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="h4 h4-bold article-name-input"
        value={draft}
        placeholder={data.title?.trim() || FALLBACK}
        aria-label="Interne naam van het artikel"
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') setEditing(false)
        }}
      />
    )
  }
  return (
    <button type="button" className="article-name-display" onClick={start} aria-label={`Interne naam: ${name || FALLBACK}. Klik om te wijzigen`}>
      <span className="h4 h4-bold text-heading article-name-text">{name || FALLBACK}</span>
      <Icon name="ui-pencil-line" size={20} color="var(--kpn-blue-500)" className="article-name-pen" />
    </button>
  )
}

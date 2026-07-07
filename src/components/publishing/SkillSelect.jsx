import { useState } from 'react'
import { Icon } from '../ds'
import { SKILLS, skillName } from '../../config/publishingTargeting'
import '../../styles/PublishingTargeting.css'

/**
 * SkillSelect
 *
 * A tag-style picker for skills & interesses — a factor independent of channels.
 * Selected skills sit as removable chips at the top; a search filters a flat
 * cloud of suggestion chips you tap to add.
 *
 * @param {string[]} selected - Selected skill ids
 * @param {Function} onChange - (ids) => void
 */
function SkillSelect({ selected = [], onChange }) {
  const [query, setQuery] = useState('')

  const toggle = (id) =>
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])

  const q = query.trim().toLowerCase()
  const suggestions = SKILLS.filter(
    s => !selected.includes(s.id) && s.name.toLowerCase().includes(q)
  )

  return (
    <div className="tgt-skills">
      {selected.length > 0 && (
        <div className="tgt-skills-selected">
          {selected.map(id => (
            <button
              key={id}
              type="button"
              className="tgt-chip tgt-chip-selected"
              onClick={() => toggle(id)}
              aria-label={`Verwijder ${skillName(id)}`}
            >
              {skillName(id)}
              <Icon name="ui-x" size={12} color="currentColor" />
            </button>
          ))}
        </div>
      )}

      <div className="tgt-search">
        <Icon name="ui-magnifyingglass" size={16} color="var(--gray-400)" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Zoek skills of interesses…"
        />
      </div>

      <div className="tgt-skills-cloud">
        {suggestions.map(s => (
          <button
            key={s.id}
            type="button"
            className="tgt-chip tgt-chip-suggest"
            onClick={() => toggle(s.id)}
          >
            <Icon name="ui-plus" size={12} color="currentColor" />
            {s.name}
          </button>
        ))}
        {suggestions.length === 0 && (
          <p className="tgt-empty body-r text-gray-300">Geen skills gevonden.</p>
        )}
      </div>
    </div>
  )
}

export default SkillSelect

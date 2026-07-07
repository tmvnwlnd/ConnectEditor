import { useState } from 'react'
import { Icon, Pill } from '../ds'
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
            <Pill
              key={id}
              isSelected
              onClick={() => toggle(id)}
              aria-label={`Verwijder ${skillName(id)}`}
            >
              {skillName(id)}
            </Pill>
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
          <Pill
            key={s.id}
            onClick={() => toggle(s.id)}
            aria-label={`Voeg ${s.name} toe`}
          >
            {s.name}
          </Pill>
        ))}
        {suggestions.length === 0 && (
          <p className="tgt-empty body-r text-gray-300">Geen skills gevonden.</p>
        )}
      </div>
    </div>
  )
}

export default SkillSelect

import { useState, useEffect } from 'react'
import { SelectBlock } from './ds'
import SettingsSection from './SettingsSection'
import { PRIORITIES, DEFAULT_PRIORITY } from '../config/publishingTargeting'
import * as store from '../store/articleStore'

// Priority level → SelectBlock tone.
const TONE = { standard: 'neutral', important: 'orange', critical: 'red' }

/**
 * PriorityField — part of the Plaatsing step: 3 standaard · 2 belangrijk · 1 kritiek (SoW F3), saved into
 * `articleTargetingData.priority`. (Doelgroepen are now set per channel in ArticlePlacement.)
 */
export const PriorityField = () => {
  const saved = store.load(store.KEYS.targeting, {})
  const [priority, setPriority] = useState(PRIORITIES.some(p => p.id === saved.priority) ? saved.priority : DEFAULT_PRIORITY)

  useEffect(() => {
    store.save(store.KEYS.targeting, { ...store.load(store.KEYS.targeting, {}), priority })
  }, [priority])

  return (
    <SettingsSection
      label="Prioriteit"
      info="Hogere prioriteit komt eerder in Mijn Feeds, op de feedpagina's en in de AI-samenvatting."
    >
      <div className="select-blocks-row" role="radiogroup" aria-label="Prioriteit">
        {PRIORITIES.map((p) => (
          <SelectBlock
            key={p.id}
            control="radio"
            name="targeting-priority"
            layout="stacked"
            tone={TONE[p.tone]}
            iconBadge
            icon={p.icon}
            title={p.label}
            checked={priority === p.id}
            onChange={() => setPriority(p.id)}
          />
        ))}
      </div>
    </SettingsSection>
  )
}

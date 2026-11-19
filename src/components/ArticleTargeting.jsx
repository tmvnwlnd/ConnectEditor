import { useState, useEffect } from 'react'
import { Switch, SelectBlock } from './ds'

// Priority level → SelectBlock tone.
const TONE = { standard: 'neutral', important: 'orange', critical: 'red' }
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import { CHANNELS, DOELGROEPEN, PRIORITIES, DEFAULT_PRIORITY } from '../config/publishingTargeting'

/**
 * TargetingFields — part of the Plaatsing step, below the feeds: who gets the article, and how important it is.
 * - "Richt aan doelgroep(en)" (switch, off by default): off = everyone in the chosen channels who follows the
 *   feed(s) (SoW F2); on = only members of the doelgroepen picked here (within the step-1 channels) see it.
 * - Prioriteit: 3 standaard · 2 belangrijk · 1 kritiek (SoW F3).
 * (The old "Organisatiebreed" switch is gone — Tom.)
 */
export const TargetingFields = ({ channels = [] }) => {
  const saved = JSON.parse(localStorage.getItem('articleTargetingData') || '{}')
  const setupChannels = channels.filter(id => CHANNELS.some(c => c.id === id))

  // Only the doelgroepen inside the channels picked above (all of them when none is picked yet).
  const options = DOELGROEPEN.filter(d => setupChannels.length === 0 || setupChannels.includes(d.channelId))

  const [doelgroepen, setDoelgroepen] = useState((saved.doelgroepen || []).filter(id => DOELGROEPEN.some(d => d.id === id)))
  // Picks outside the current channels drop out (e.g. after unticking a channel).
  const visibleDoelgroepen = doelgroepen.filter(id => options.some(d => d.id === id))
  const [targeted, setTargeted] = useState(saved.targeted ?? (saved.doelgroepen || []).length > 0)
  const [priority, setPriority] = useState(PRIORITIES.some(p => p.id === saved.priority) ? saved.priority : DEFAULT_PRIORITY)

  // Only an ON switch sends doelgroepen along; switching it off keeps the picks in the form (not saved).
  useEffect(() => {
    localStorage.setItem('articleTargetingData', JSON.stringify({ targeted, doelgroepen: targeted ? visibleDoelgroepen : [], priority }))
  }, [targeted, visibleDoelgroepen.join(), priority]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
          <SettingsSection label="Richt aan doelgroep(en)">
            <div className="pub-switch-row">
              <p className="body-r text-gray-400">
                Een artikel aan bepaalde doelgroepen richten zorgt er voor dat alleen leden van deze doelgroepen de content in hun feeds te zien krijgen.
              </p>
              <Switch checked={targeted} onChange={setTargeted} label="Richt aan doelgroep(en)" />
            </div>
            {targeted && (
              <div className="pub-sub">
                <ChoiceField
                  name="targeting-doelgroepen"
                  multiple
                  options={options}
                  value={visibleDoelgroepen}
                  onChange={setDoelgroepen}
                  placeholder="Voeg een doelgroep toe…"
                />
              </div>
            )}
          </SettingsSection>

          <SettingsSection
            label="Prioriteit"
            description="Artikelen met een hogere prioriteit krijgen voorrang bij het ordenen van artikelen op de channelpaginas van lezers. Dit heeft betrekking op het Mijn Feeds overzicht in Nieuws, de feeds paginas in Mijn Feeds, en de volgorde in de AI samenvatting."
          >
            {/* One card per level, each with its own icon + colour. */}
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
    </>
  )
}

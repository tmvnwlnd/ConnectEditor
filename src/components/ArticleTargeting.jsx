import { useState, useEffect } from 'react'
import { Switch } from './ds'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import { CHANNELS, DOELGROEPEN, PRIORITIES, DEFAULT_PRIORITY } from '../config/publishingTargeting'
import '../styles/ArticleSettings.css'
import '../styles/PublishingTargeting.css'

/**
 * ArticleTargeting — step 3: who gets the article, and how important it is.
 * - Doelgroepen: narrow the article down within its channels (page 1). None = everyone in those
 *   channels who follows the feed(s) (SoW F2).
 * - Organisatiebreed: everyone in the chosen channels, regardless of doelgroep or feed (brief).
 * - Prioriteit: 3 standaard · 2 belangrijk · 1 kritiek (SoW F3).
 */
const ArticleTargeting = () => {
  const saved = JSON.parse(localStorage.getItem('articleTargetingData') || '{}')
  const setup = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const setupChannels = (setup.channels || []).filter(id => CHANNELS.some(c => c.id === id))

  // Only the doelgroepen inside the channels picked on page 1 (all of them when none is picked yet).
  const options = DOELGROEPEN.filter(d => setupChannels.length === 0 || setupChannels.includes(d.channelId))

  const [doelgroepen, setDoelgroepen] = useState((saved.doelgroepen || []).filter(id => options.some(d => d.id === id)))
  const [orgWide, setOrgWide] = useState(!!saved.orgWide)
  const [priority, setPriority] = useState(PRIORITIES.some(p => p.id === saved.priority) ? saved.priority : DEFAULT_PRIORITY)

  useEffect(() => {
    localStorage.setItem('articleTargetingData', JSON.stringify({ doelgroepen, orgWide, priority }))
  }, [doelgroepen, orgWide, priority])

  return (
    <div className="article-settings">
      <div className="article-settings-container">
        <div className="settings-single">
          <SettingsSection label="Organisatiebreed">
            <div className="pub-switch-row">
              <p className="body-r text-gray-400">
                Iedereen in de gekozen channels ziet het artikel, los van doelgroep of feed.
              </p>
              <Switch checked={orgWide} onChange={setOrgWide} label="Organisatiebreed" />
            </div>
          </SettingsSection>

          <SettingsSection
            label="Doelgroepen"
            tag="(optioneel)"
            description={
              orgWide
                ? 'Niet nodig: het artikel is organisatiebreed.'
                : 'Zonder doelgroep krijgt iedereen in de gekozen channels die de feed volgt het artikel.'
            }
          >
            <ChoiceField
              name="targeting-doelgroepen"
              multiple
              options={options}
              value={doelgroepen}
              onChange={setDoelgroepen}
              disabled={orgWide}
              placeholder="Voeg een doelgroep toe…"
            />
          </SettingsSection>

          <SettingsSection label="Prioriteit">
            <ChoiceField name="targeting-priority" options={PRIORITIES} value={priority} onChange={setPriority} />
          </SettingsSection>
        </div>
      </div>
    </div>
  )
}

export default ArticleTargeting

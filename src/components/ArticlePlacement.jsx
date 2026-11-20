import { useState, useEffect } from 'react'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import { PriorityField } from './ArticleTargeting'
import { Switch, Checkbox, Icon } from './ds'
import { GROUPS, DEFAULT_GROUPS, CHANNELS, FEEDS, DOELGROEPEN, doelgroepenForChannel } from '../config/publishingTargeting'
import '../styles/ArticleSettings.css'
import '../styles/PublishingTargeting.css'
import * as store from '../store/articleStore'

/**
 * ArticlePlacement — step 2 "Plaatsing".
 * - Groepen: at least one (preset to the channel group, SoW J5).
 * - Channels: optional. Each channel is a card with a switch; switched on it opens that channel's feeds (at least
 *   one), its doelgroepen (none = everyone in the channel who follows the feed) and "bovenaan carrousel plaatsen".
 * - Prioriteit.
 * Saved: `articleSetupData` { groups, channels, feedsByChannel, feeds (union), carouselTopByChannel } and
 * `articleTargetingData` { doelgroepenByChannel, doelgroepen (union), targeted, priority }. Stale ids are dropped.
 */
const readSetup = () => store.load(store.KEYS.setup, {})
const readTargeting = () => store.load(store.KEYS.targeting, {})
const only = (list) => (ids) => (ids || []).filter(id => list.some(x => x.id === id))
const validGroups = only(GROUPS)
const validFeeds = only(FEEDS)

const ArticlePlacement = () => {
  const saved = readSetup()
  const savedT = readTargeting()

  const [groups, setGroups] = useState(() => {
    if (Array.isArray(saved.groups)) return validGroups(saved.groups)
    const old = validGroups(saved.group ? [saved.group] : []) // older saves: one `group`
    return old.length ? old : DEFAULT_GROUPS
  })
  const [channels, setChannels] = useState(only(CHANNELS)(Array.isArray(saved.channels) ? saved.channels : [CHANNELS[0].id]))
  const [feedsByChannel, setFeedsByChannel] = useState(() => {
    const m = saved.feedsByChannel || {}
    // Older saves had one flat `feeds` list: give it to every saved channel.
    return Object.fromEntries(CHANNELS.map(c => [c.id, validFeeds(m[c.id] || (saved.feedsByChannel ? [] : saved.feeds))]))
  })
  const [doelgroepenByChannel, setDoelgroepenByChannel] = useState(() => {
    const m = savedT.doelgroepenByChannel
    // Older saves had one flat `doelgroepen` list: sort it into the channels.
    return Object.fromEntries(CHANNELS.map(c => [c.id, only(doelgroepenForChannel(c.id))(m ? m[c.id] : savedT.doelgroepen)]))
  })
  const [carouselTop, setCarouselTop] = useState(saved.carouselTopByChannel || {})
  const [touched, setTouched] = useState({})
  const touch = (k) => setTouched(t => ({ ...t, [k]: true }))

  useEffect(() => {
    store.save(store.KEYS.setup, {
      ...readSetup(),
      groups,
      channels,
      feeds: [...new Set(channels.flatMap(id => feedsByChannel[id] || []))],
      feedsByChannel: Object.fromEntries(channels.map(id => [id, feedsByChannel[id] || []])),
      carouselTopByChannel: Object.fromEntries(channels.map(id => [id, !!carouselTop[id]])),
    })
    const byChannel = Object.fromEntries(channels.map(id => [id, doelgroepenByChannel[id] || []]))
    const doelgroepen = Object.values(byChannel).flat()
    store.save(store.KEYS.targeting, { ...readTargeting(), doelgroepenByChannel: byChannel, doelgroepen, targeted: doelgroepen.length > 0 })
  }, [groups, channels, feedsByChannel, doelgroepenByChannel, carouselTop])

  const toggleChannel = (id, on) => setChannels(cs => on ? CHANNELS.map(c => c.id).filter(c => c === id || cs.includes(c)) : cs.filter(c => c !== id))

  return (
    <div className="article-settings">
      <div className="article-settings-container is-plain">
        <div className="settings-main settings-main--single">
          <div className="settings-left-column">
            <SettingsSection
              label="Groepen"
              error={groups.length === 0 ? 'Kies minimaal één groep' : ''}
            >
              <ChoiceField name="setup-groups" multiple options={GROUPS} value={groups} onChange={setGroups} placeholder="Voeg een groep toe…" />
            </SettingsSection>

            <SettingsSection label="Channels" info="Zet een channel aan om het artikel daar te plaatsen. Per channel kies je de feeds en eventueel doelgroepen.">
              <div className="channel-cards">
                {CHANNELS.map((c) => {
                  const on = channels.includes(c.id)
                  const feeds = feedsByChannel[c.id] || []
                  return (
                    <div key={c.id} className={`channel-card ${on ? 'is-on' : ''}`}>
                      <div className="channel-card-head">
                        <span className="channel-card-name">
                          <Icon name={c.icon} size={24} color={on ? 'var(--kpn-green-500)' : 'var(--gray-400)'} />
                          <span className="body-r-bold">{c.name}</span>
                        </span>
                        <Switch checked={on} onChange={(v) => toggleChannel(c.id, v)} label={`Plaats in ${c.name}`} />
                      </div>
                      {on && (
                        <div className="channel-card-body">
                          <SettingsSection
                            label="Feeds"
                            error={touched[`f-${c.id}`] && feeds.length === 0 ? 'Kies minimaal één feed' : ''}
                          >
                            <ChoiceField
                              name={`setup-feeds-${c.id}`}
                              multiple
                              options={FEEDS}
                              value={feeds}
                              onChange={(v) => { setFeedsByChannel(m => ({ ...m, [c.id]: v })); touch(`f-${c.id}`) }}
                              placeholder="Voeg een feed toe…"
                            />
                          </SettingsSection>
                          <SettingsSection
                            label="Doelgroepen"
                            tag="(optioneel)"
                            info="Leeg: iedereen in dit channel die de feed volgt. Gekozen: alleen leden van deze doelgroepen."
                          >
                            <ChoiceField
                              name={`targeting-doelgroepen-${c.id}`}
                              multiple
                              options={doelgroepenForChannel(c.id)}
                              value={doelgroepenByChannel[c.id] || []}
                              onChange={(v) => setDoelgroepenByChannel(m => ({ ...m, [c.id]: v }))}
                              placeholder="Voeg een doelgroep toe…"
                            />
                          </SettingsSection>
                          <Checkbox
                            label="Bovenaan carrousel plaatsen"
                            checked={!!carouselTop[c.id]}
                            onChange={(e) => setCarouselTop(m => ({ ...m, [c.id]: e.target.checked }))}
                          />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </SettingsSection>

            <PriorityField />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlePlacement

import { useState, useEffect } from 'react'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import { TargetingFields } from './ArticleTargeting'
import { GROUPS, DEFAULT_GROUPS, CHANNELS, FEEDS, channelName } from '../config/publishingTargeting'
import '../styles/ArticleSettings.css'
import '../styles/PublishingTargeting.css'

/**
 * ArticlePlacement — step 2 "Plaatsing": the groepen it is posted in (any number, preset to the channel group, SoW J5),
 * the channel(s) it appears in, and PER CHANNEL the feed(s) it is in (at least one per channel, SoW G1) —
 * `feedsByChannel` ({ channelId: [feedIds] }); `feeds` (saved alongside) is their union, for everything downstream.
 * Below them the targeting (doelgroepen + prioriteit, `TargetingFields`, saved in `articleTargetingData`).
 * Saved into `articleSetupData` (merged with step 1's title/intro/cover). Stale ids from older data are dropped.
 */
const read = () => JSON.parse(localStorage.getItem('articleSetupData') || '{}')

const ArticlePlacement = () => {
  const saved = read()
  const validGroups = (ids) => (ids || []).filter(id => GROUPS.some(g => g.id === id))
  const [groups, setGroups] = useState(() => {
    if (Array.isArray(saved.groups)) return validGroups(saved.groups)
    const old = validGroups(saved.group ? [saved.group] : []) // older saves: one `group`
    return old.length ? old : DEFAULT_GROUPS
  })
  const [channels, setChannels] = useState(
    Array.isArray(saved.channels) ? saved.channels.filter(id => CHANNELS.some(c => c.id === id)) : [CHANNELS[0].id]
  )
  const validFeeds = (ids) => (ids || []).filter(id => FEEDS.some(f => f.id === id))
  const [feedsByChannel, setFeedsByChannel] = useState(() => {
    const m = saved.feedsByChannel || {}
    // Older saves had one flat `feeds` list: give it to every saved channel.
    return Object.fromEntries(CHANNELS.map(c => [c.id, validFeeds(m[c.id] || (saved.feedsByChannel ? [] : saved.feeds))]))
  })
  const [touched, setTouched] = useState(false)
  const setChannelFeeds = (channelId, ids) => setFeedsByChannel(m => ({ ...m, [channelId]: ids }))

  useEffect(() => {
    const feeds = [...new Set(channels.flatMap(id => feedsByChannel[id] || []))]
    try {
      localStorage.setItem('articleSetupData', JSON.stringify({
        ...read(),
        groups,
        channels,
        feeds,
        feedsByChannel: Object.fromEntries(channels.map(id => [id, feedsByChannel[id] || []])),
      }))
    } catch (e) {
      console.warn('Could not save placement data:', e.message)
    }
  }, [groups, channels, feedsByChannel])

  return (
    <div className="article-settings">
      <div className="article-settings-container is-plain">
        <div className="settings-main settings-main--single">
          <div className="settings-left-column">
            <SettingsSection label="Groepen">
              <ChoiceField name="setup-groups" multiple options={GROUPS} value={groups} onChange={setGroups} placeholder="Voeg een groep toe…" />
            </SettingsSection>

            <SettingsSection
              label="Channels"
              error={touched && channels.length === 0 ? 'Kies minimaal één channel' : ''}
            >
              <ChoiceField
                name="setup-channels"
                multiple
                options={CHANNELS}
                value={channels}
                onChange={(v) => { setChannels(v); setTouched(true) }}
              />
            </SettingsSection>

            {/* Feeds are set PER CHANNEL: one field for every picked channel. */}
            {channels.map((channelId) => {
              const picked = feedsByChannel[channelId] || []
              return (
                <SettingsSection
                  key={channelId}
                  label={channels.length > 1 ? `Feeds in ${channelName(channelId)}` : 'Feeds'}
                  error={touched && picked.length === 0 ? `Kies minimaal één feed voor ${channelName(channelId)}` : ''}
                >
                  <ChoiceField
                    name={`setup-feeds-${channelId}`}
                    multiple
                    options={FEEDS}
                    value={picked}
                    onChange={(v) => { setChannelFeeds(channelId, v); setTouched(true) }}
                    placeholder="Voeg een feed toe…"
                  />
                </SettingsSection>
              )
            })}

            <TargetingFields channels={channels} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlePlacement

import { useState } from 'react'
import { Switch, SegmentedControl, Icon } from '../ds'
import {
  CHANNELS,
  doelgroepenForChannel,
  PRIORITY_OPTIONS,
  GLOBAL_PRIORITY_OPTIONS,
  DEFAULT_PRIORITY,
  DEFAULT_GLOBAL_PRIORITY,
} from '../../config/publishingTargeting'
import '../../styles/PublishingTargeting.css'

/**
 * ChannelTargeting
 *
 * A list of channels, each with an on/off switch for placement. When on, the
 * channel expands to a priority table: every target audience in the channel
 * gets a priority (Geen / Prioriteit / Must-read). A global control at the top
 * overrides the per-audience settings.
 *
 * value shape: { [channelId]: { enabled, global, audiences: { [doelgroepId]: priority } } }
 *
 * @param {Object} value
 * @param {Function} onChange - (nextValue) => void
 */
function ChannelTargeting({ value = {}, onChange }) {
  // Which channels have their priority accordion open (UI-only state)
  const [expanded, setExpanded] = useState({})

  const getChannel = (id) =>
    value[id] || { enabled: false, global: DEFAULT_GLOBAL_PRIORITY, audiences: {} }

  const setChannel = (id, patch) =>
    onChange({ ...value, [id]: { ...getChannel(id), ...patch } })

  const toggleExpanded = (id) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const handleToggleChannel = (id, on) => {
    setChannel(id, { enabled: on })
    // Open the priorities automatically when a channel is switched on
    if (on) setExpanded(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="tgt-channels">
      {CHANNELS.map(channel => {
        const ch = getChannel(channel.id)
        const audiences = doelgroepenForChannel(channel.id)
        const overridden = ch.global !== 'custom'
        const isOpen = ch.enabled && !!expanded[channel.id]

        return (
          <div key={channel.id} className={`tgt-channel ${ch.enabled ? 'is-on' : ''}`}>
            <div className="tgt-channel-header">
              <span className="tgt-channel-name">{channel.name}</span>
              <div className="tgt-channel-controls">
                {ch.enabled && (
                  <button
                    type="button"
                    className={`tgt-channel-chevron ${isOpen ? 'is-open' : ''}`}
                    onClick={() => toggleExpanded(channel.id)}
                    aria-expanded={isOpen}
                    aria-label={isOpen ? 'Verberg prioriteiten' : 'Toon prioriteiten'}
                  >
                    <Icon name="ui-chevron-down" size={20} color="var(--gray-400)" />
                  </button>
                )}
                <Switch
                  checked={ch.enabled}
                  onChange={(v) => handleToggleChannel(channel.id, v)}
                  label={`Plaats in ${channel.name}`}
                />
              </div>
            </div>

            {isOpen && (
              <div className="tgt-channel-body">
                <div className="tgt-priority-row tgt-priority-global">
                  <span className="tgt-priority-name">Alle doelgroepen</span>
                  <SegmentedControl
                    options={GLOBAL_PRIORITY_OPTIONS}
                    value={ch.global || 'custom'}
                    onChange={(v) => setChannel(channel.id, { global: v })}
                  />
                </div>

                <div className="tgt-priority-table">
                  <div className="tgt-priority-head">
                    <span>Doelgroep</span>
                    <span>Prioriteit</span>
                  </div>
                  {audiences.map(a => {
                    const val = overridden ? ch.global : (ch.audiences[a.id] || DEFAULT_PRIORITY)
                    return (
                      <div key={a.id} className={`tgt-priority-row ${overridden ? 'is-overridden' : ''}`}>
                        <span className="tgt-priority-name">{a.name}</span>
                        <SegmentedControl
                          options={PRIORITY_OPTIONS}
                          value={val}
                          onChange={(v) => {
                            if (overridden) return
                            setChannel(channel.id, { audiences: { ...ch.audiences, [a.id]: v } })
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
                {overridden && (
                  <p className="tgt-override-note body-s text-gray-400">
                    De globale instelling overschrijft de individuele doelgroepen.
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ChannelTargeting

import { Switch, Checkbox } from '../ds'
import PrioritySlider from './PrioritySlider'
import {
  CHANNELS,
  doelgroepenForChannel,
  DEFAULT_PRIORITY,
  PRIORITY_START_LABEL,
  PRIORITY_END_LABEL,
} from '../../config/publishingTargeting'
import '../../styles/PublishingTargeting.css'

/**
 * ChannelTargeting
 *
 * A list of channels, each with an on/off switch for placement. When on, a
 * priority slider sets the placement priority. By default one "Alle doelgroepen"
 * row applies to everyone; ticking "Per doelgroep instellen" replaces it with a
 * row per doelgroep. Priority is a 4-position slider (geen → must-read).
 *
 * value shape:
 *   { [channelId]: { enabled, global, perDoelgroep, audiences: { [doelgroepId]: level } } }
 *
 * @param {Object} value
 * @param {Function} onChange - (nextValue) => void
 */
function ChannelTargeting({ value = {}, onChange }) {
  const getChannel = (id) =>
    value[id] || { enabled: false, global: DEFAULT_PRIORITY, perDoelgroep: false, audiences: {} }

  const setChannel = (id, patch) =>
    onChange({ ...value, [id]: { ...getChannel(id), ...patch } })

  return (
    <div className="tgt-channels">
      {CHANNELS.map(channel => {
        const ch = getChannel(channel.id)
        const audiences = doelgroepenForChannel(channel.id)

        return (
          <div key={channel.id} className={`tgt-channel ${ch.enabled ? 'is-on' : ''}`}>
            <div className="tgt-channel-header">
              <span className="tgt-channel-name">{channel.name}</span>
              <Switch
                checked={ch.enabled}
                onChange={(v) => setChannel(channel.id, { enabled: v })}
                label={`Plaats in ${channel.name}`}
              />
            </div>

            {ch.enabled && (
              <div className="tgt-channel-body">
                <div className="tgt-perdoelgroep-check">
                  <Checkbox
                    label="Per doelgroep instellen"
                    checked={!!ch.perDoelgroep}
                    onChange={() => setChannel(channel.id, { perDoelgroep: !ch.perDoelgroep })}
                  />
                </div>

                <div className={`tgt-priority-table ${ch.perDoelgroep ? 'is-list' : ''}`}>
                  <div className="tgt-slider-head">
                    <span className="tgt-slider-head-name">{ch.perDoelgroep ? 'Doelgroep' : ''}</span>
                    <span className="tgt-slider-scale">
                      <span>{PRIORITY_START_LABEL}</span>
                      <span>{PRIORITY_END_LABEL}</span>
                    </span>
                  </div>

                  {ch.perDoelgroep ? (
                    audiences.map(a => (
                      <div key={a.id} className="tgt-priority-row">
                        <span className="tgt-priority-name">{a.name}</span>
                        <PrioritySlider
                          value={ch.audiences[a.id] ?? DEFAULT_PRIORITY}
                          onChange={(v) =>
                            setChannel(channel.id, { audiences: { ...ch.audiences, [a.id]: v } })
                          }
                        />
                      </div>
                    ))
                  ) : (
                    <div className="tgt-priority-row">
                      <span className="tgt-priority-name">Alle doelgroepen</span>
                      <PrioritySlider
                        value={ch.global ?? DEFAULT_PRIORITY}
                        onChange={(v) => setChannel(channel.id, { global: v })}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ChannelTargeting

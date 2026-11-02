import { useState } from 'react'
import Modal from './Modal'
import { Button, Tabs } from './ds'
import ChoiceField from './publishing/ChoiceField'
import { CHANNELS, DOELGROEPEN as TAXONOMY_DOELGROEPEN, FEEDS as TAXONOMY_FEEDS } from '../config/publishingTargeting'
import '../styles/BlockTargetingModal.css'

// Blocks store their audience by NAME; the options carry the icon + count so picks show as rich item boxes.
const toOptions = (list) => list.map(o => ({ id: o.name, name: o.name, icon: o.icon, meta: o.meta }))
const doelgroepOptions = (channelId) => toOptions(TAXONOMY_DOELGROEPEN.filter(d => !d.broad && d.channelId === channelId))
const FEED_OPTIONS = toOptions(TAXONOMY_FEEDS)
const channelOfDoelgroep = (name) => TAXONOMY_DOELGROEPEN.find(d => d.name === name)?.channelId

/**
 * BlockTargetingModal ("Gerichte content") — the block's audience, PER CHANNEL: one tab for every channel picked
 * on step 1, each with that channel's doelgroepen and any feeds (members of one of the doelgroepen OR followers of
 * one of the feeds). Saving with nothing picked anywhere makes the block for everyone again.
 * Stored as `{ byChannel: { channelId: { doelgroepen, feeds } }, doelgroepen, feeds }` — the flat lists are the
 * union, for the block's tab label and the TEAMKPN preview.
 *
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {object}   targeting  see above, or undefined (older blocks: only the flat lists)
 * @param {Function} onSave     (targeting | undefined) => void
 */
const BlockTargetingModal = ({ isOpen, onClose, targeting, onSave }) => {
  // The channels picked on step 1 (all of them when none is picked yet).
  const setup = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const picked = (setup.channels || []).filter(id => CHANNELS.some(c => c.id === id))
  const channels = CHANNELS.filter(c => (picked.length ? picked : CHANNELS.map(x => x.id)).includes(c.id))

  // Mounted only while open (see Element), so the working copy starts from the block's targeting.
  const [byChannel, setByChannel] = useState(() => {
    const start = Object.fromEntries(channels.map(c => [c.id, { doelgroepen: [], feeds: [] }]))
    if (targeting?.byChannel) {
      channels.forEach(c => { if (targeting.byChannel[c.id]) start[c.id] = { doelgroepen: [], feeds: [], ...targeting.byChannel[c.id] } })
    } else if (targeting) {
      // Older block (flat lists): each doelgroep goes to its own channel's tab, the feeds to the first tab.
      ;(targeting.doelgroepen || []).forEach(n => {
        const id = start[channelOfDoelgroep(n)] ? channelOfDoelgroep(n) : channels[0].id
        start[id].doelgroepen.push(n)
      })
      start[channels[0].id].feeds = [...(targeting.feeds || [])]
    }
    return start
  })
  const [tab, setTab] = useState(channels[0].id)
  const setPart = (key, value) => setByChannel(m => ({ ...m, [tab]: { ...m[tab], [key]: value } }))

  const doelgroepen = [...new Set(channels.flatMap(c => byChannel[c.id].doelgroepen))]
  const feeds = [...new Set(channels.flatMap(c => byChannel[c.id].feeds))]
  const empty = doelgroepen.length === 0 && feeds.length === 0
  const count = (id) => byChannel[id].doelgroepen.length + byChannel[id].feeds.length

  const save = (value) => {
    onSave(value)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Gerichte content"
      className="block-targeting-modal"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuleer</Button>
          <Button variant="primary" onClick={() => save(empty ? undefined : { byChannel, doelgroepen, feeds })}>Opslaan</Button>
        </>
      }
    >
      <div className="block-targeting-body">
        <p className="body-r text-gray-400">
          Richt dit blok aan een bepaalde doelgroep. Voor de doelgroep is het blok zichtbaar, voor anderen is het ingeklapt: ze kunnen dit als ze willen wel uitklappen en lezen.
        </p>
        <Tabs
          tabs={channels.map(c => ({ id: c.id, label: count(c.id) ? `${c.name} (${count(c.id)})` : c.name }))}
          activeTab={tab}
          onChange={setTab}
          className="block-targeting-tabs"
        />
        <div className="block-targeting-fields" key={tab}>
          <div className="block-targeting-field">
            <span className="field-label">Doelgroepen</span>
            <ChoiceField name={`block-doelgroepen-${tab}`} multiple options={doelgroepOptions(tab)} value={byChannel[tab].doelgroepen} onChange={(v) => setPart('doelgroepen', v)} placeholder="Voeg een doelgroep toe…" />
          </div>
          <div className="block-targeting-field">
            <span className="field-label">Feeds</span>
            <ChoiceField name={`block-feeds-${tab}`} multiple options={FEED_OPTIONS} value={byChannel[tab].feeds} onChange={(v) => setPart('feeds', v)} placeholder="Voeg een feed toe…" />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default BlockTargetingModal

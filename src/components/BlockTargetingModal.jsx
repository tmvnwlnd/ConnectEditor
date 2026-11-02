import { useState } from 'react'
import Modal from './Modal'
import { Button } from './ds'
import ChoiceField from './publishing/ChoiceField'
import { DOELGROEPEN as TAXONOMY_DOELGROEPEN, FEEDS as TAXONOMY_FEEDS } from '../config/publishingTargeting'
import '../styles/BlockTargetingModal.css'

// Blocks store their audience by NAME; the options carry the icon + count so picks show as rich item boxes.
const toOptions = (list) => list.map(o => ({ id: o.name, name: o.name, icon: o.icon, meta: o.meta }))
const DOELGROEP_OPTIONS = toOptions(TAXONOMY_DOELGROEPEN.filter(d => !d.broad))
const FEED_OPTIONS = toOptions(TAXONOMY_FEEDS)

/**
 * BlockTargetingModal — the block's audience: doelgroepen and/or feeds (members of one of the
 * doelgroepen OR followers of one of the feeds). Opens straight on the pickers; saving with nothing
 * picked makes the block for everyone again.
 *
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {object}   targeting  { doelgroepen, feeds } or undefined
 * @param {Function} onSave     (targeting | undefined) => void
 */
const BlockTargetingModal = ({ isOpen, onClose, targeting, onSave }) => {
  // Mounted only while open (see Element), so the working copy starts from the block's targeting.
  const [doelgroepen, setDoelgroepen] = useState(targeting?.doelgroepen || [])
  const [feeds, setFeeds] = useState(targeting?.feeds || [])

  const empty = doelgroepen.length === 0 && feeds.length === 0

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
          <Button variant="primary" onClick={() => save(empty ? undefined : { doelgroepen, feeds })}>Opslaan</Button>
        </>
      }
    >
      <div className="block-targeting-body">
        <p className="body-r text-gray-400">
          Richt dit blok aan een bepaalde doelgroep. Voor de doelgroep is het blok zichtbaar, voor anderen is het ingeklapt: ze kunnen dit als ze willen wel uitklappen en lezen.
        </p>
        <div className="block-targeting-fields">
        <div className="block-targeting-field">
          <span className="field-label">Doelgroepen</span>
          <ChoiceField name="block-doelgroepen" multiple options={DOELGROEP_OPTIONS} value={doelgroepen} onChange={setDoelgroepen} placeholder="Voeg een doelgroep toe…" />
        </div>
        <div className="block-targeting-field">
          <span className="field-label">Feeds</span>
          <ChoiceField name="block-feeds" multiple options={FEED_OPTIONS} value={feeds} onChange={setFeeds} placeholder="Voeg een feed toe…" />
        </div>
        </div>
      </div>
    </Modal>
  )
}

export default BlockTargetingModal

import { useState } from 'react'
import Modal from './Modal'
import { Button } from './ds'
import ChoiceField from './publishing/ChoiceField'
import { DOELGROEPEN, FEEDS } from '../config/targeting'
import '../styles/BlockTargetingModal.css'

const toOptions = (names) => names.map(n => ({ id: n, name: n }))
const DOELGROEP_OPTIONS = toOptions(DOELGROEPEN)
const FEED_OPTIONS = toOptions(FEEDS)

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
      title="Doelgroep van dit blok"
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
          Het blok is alleen zichtbaar voor wie in een van de doelgroepen zit óf een van de feeds volgt. Kies je niets, dan is het voor iedereen.
        </p>
        <div className="block-targeting-field">
          <span className="field-label">Doelgroepen</span>
          <ChoiceField name="block-doelgroepen" multiple options={DOELGROEP_OPTIONS} value={doelgroepen} onChange={setDoelgroepen} placeholder="Voeg een doelgroep toe…" />
        </div>
        <div className="block-targeting-field">
          <span className="field-label">Feeds</span>
          <ChoiceField name="block-feeds" multiple options={FEED_OPTIONS} value={feeds} onChange={setFeeds} placeholder="Voeg een feed toe…" />
        </div>
      </div>
    </Modal>
  )
}

export default BlockTargetingModal

import { useState } from 'react'
import Modal from './Modal'
import { Button, RadioButton } from './ds'
import ChoiceField from './publishing/ChoiceField'
import { DOELGROEPEN, FEEDS, isTargeted } from '../config/targeting'
import '../styles/BlockTargetingModal.css'

const toOptions = (names) => names.map(n => ({ id: n, name: n }))
const DOELGROEP_OPTIONS = toOptions(DOELGROEPEN)
const FEED_OPTIONS = toOptions(FEEDS)

/**
 * BlockTargetingModal — who sees this block: everyone, or one audience made of doelgroepen and/or
 * feeds (members of one of the doelgroepen OR followers of one of the feeds).
 *
 * @param {boolean}  isOpen
 * @param {Function} onClose
 * @param {object}   targeting  { doelgroepen, feeds } or undefined
 * @param {Function} onSave     (targeting | undefined) => void
 */
const BlockTargetingModal = ({ isOpen, onClose, targeting, onSave }) => {
  // Mounted only while open (see Element), so the working copy starts from the block's targeting.
  const [forGroup, setForGroup] = useState(isTargeted(targeting))
  const [doelgroepen, setDoelgroepen] = useState(targeting?.doelgroepen || [])
  const [feeds, setFeeds] = useState(targeting?.feeds || [])

  const empty = doelgroepen.length === 0 && feeds.length === 0

  const handleSave = () => {
    onSave(forGroup && !empty ? { doelgroepen, feeds } : undefined)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Voor wie is dit blok?"
      className="block-targeting-modal"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuleer</Button>
          <Button variant="primary" onClick={handleSave} disabled={forGroup && empty}>Opslaan</Button>
        </>
      }
    >
      <div className="block-targeting-body">
        <RadioButton label="Iedereen" name="block-audience" checked={!forGroup} onChange={() => setForGroup(false)} />
        <RadioButton label="Een groep" name="block-audience" checked={forGroup} onChange={() => setForGroup(true)}>
          {forGroup && (
            <div className="block-targeting-group">
              <p className="body-r text-gray-400">
                Het blok is zichtbaar voor wie in een van de doelgroepen zit óf een van de feeds volgt.
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
          )}
        </RadioButton>
      </div>
    </Modal>
  )
}

export default BlockTargetingModal

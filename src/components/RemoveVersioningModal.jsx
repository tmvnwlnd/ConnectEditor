import { useEffect, useState } from 'react'
import Modal from './Modal'
import { Button, RadioButton } from './ds'
import '../styles/RemoveVersioningModal.css'

/**
 * RemoveVersioningModal
 *
 * Confirmation shown before removing a block's versioning. Lets the user choose
 * what to keep of the existing versions via a simple radio group + confirm.
 *
 * @param {boolean} isOpen
 * @param {Function} onClose
 * @param {number} versionCount - Number of versions on the block
 * @param {Function} onResolve - (mode: 'none' | 'first' | 'all') => void
 */
const OPTIONS = [
  { mode: 'first', label: 'Alleen de eerste versie' },
  { mode: 'all', label: 'Alle als losse blokken' },
  { mode: 'none', label: 'Niets behouden' },
]

const RemoveVersioningModal = ({ isOpen, onClose, versionCount = 0, onResolve }) => {
  const [mode, setMode] = useState('first')

  // Default back to the least destructive option each time it opens
  useEffect(() => {
    if (isOpen) setMode('first')
  }, [isOpen])

  const handleConfirm = () => {
    if (onResolve) onResolve(mode)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Versioning verwijderen"
      className="remove-versioning-modal"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuleer</Button>
          <Button variant="primary" onClick={handleConfirm}>Bevestig</Button>
        </>
      }
    >
      <p className="body-r text-gray-400 remove-versioning-intro">
        Dit blok heeft {versionCount} {versionCount === 1 ? 'versie' : 'versies'}. Wat wil je behouden?
      </p>
      <div className="remove-versioning-options">
        {OPTIONS.map(opt => (
          <RadioButton
            key={opt.mode}
            name="remove-versioning-mode"
            label={opt.label}
            checked={mode === opt.mode}
            onChange={() => setMode(opt.mode)}
          />
        ))}
      </div>
    </Modal>
  )
}

export default RemoveVersioningModal

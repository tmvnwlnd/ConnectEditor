import { useEffect, useState } from 'react'
import Modal from './Modal'
import { Button, Icon } from './ds'
import { DOELGROEPEN, versionTitle } from '../config/targeting'
import '../styles/BlockTargetingModal.css'

/**
 * BlockTargetingModal
 *
 * Manages the content instances of a block: each instance is a named version
 * of the block tied to one or more doelgroepen (target groups).
 *
 * Left pane  — list of instances + "add" button.
 * Right pane — the selected instance's name + a searchable doelgroepen list
 *              with checkmarks.
 * Footer     — "Opslaan" commits the working copy back to the block.
 *
 * @param {boolean} isOpen
 * @param {Function} onClose
 * @param {Array} instances - Current instances on the block
 * @param {Function} onSave - Called with the new instances array
 * @param {*} baseContent - The block's existing content; seeds the first instance
 * @param {boolean} addOnOpen - Immediately add (and select) a fresh version on open
 */
const BlockTargetingModal = ({ isOpen, onClose, instances = [], onSave, baseContent, addOnOpen = false }) => {
  const [working, setWorking] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  // Display order of doelgroepen for the current version — selected ones first.
  // Recomputed only when the selected version changes (or on open), so the
  // list doesn't jump around while you're toggling checkboxes.
  const [displayOrder, setDisplayOrder] = useState(DOELGROEPEN)

  const orderFor = (inst) => {
    const selected = (inst?.doelgroepen || []).filter(d => DOELGROEPEN.includes(d))
    return [...selected, ...DOELGROEPEN.filter(d => !selected.includes(d))]
  }

  // Reset the working copy each time the modal opens
  useEffect(() => {
    if (!isOpen) return
    let copy = instances.map(inst => ({
      ...inst,
      doelgroepen: [...(inst.doelgroepen || [])],
    }))
    // When opened via the tab bar "+", start with a fresh version selected.
    if (addOnOpen) {
      copy = [
        ...copy,
        { id: Date.now(), name: '', autoName: true, doelgroepen: [], content: '' },
      ]
    }
    setWorking(copy)
    setSelectedId((addOnOpen ? copy[copy.length - 1] : copy[0])?.id ?? null)
    setQuery('')
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Bring the selected version's doelgroepen to the top whenever we switch to
  // it (or reopen the modal) — but not on every toggle.
  useEffect(() => {
    if (!isOpen || selectedId == null) return
    setDisplayOrder(orderFor(working.find(inst => inst.id === selectedId)))
  }, [selectedId, isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const addInstance = () => {
    const id = Date.now()
    setWorking(prev => [
      ...prev,
      {
        id,
        name: '',
        autoName: true, // title follows the doelgroepen until manually edited
        doelgroepen: [],
        // Seed the very first instance with the block's existing content so
        // nothing the writer already typed is lost.
        content: prev.length === 0 ? (baseContent ?? '') : '',
      },
    ])
    setSelectedId(id)
  }

  const removeInstance = (id) => {
    setWorking(prev => {
      const next = prev.filter(inst => inst.id !== id)
      if (id === selectedId) setSelectedId(next[0]?.id ?? null)
      return next
    })
  }

  const renameInstance = (name) => {
    if (selectedId == null) return
    // A manual edit stops the name from auto-following the doelgroep.
    setWorking(prev => prev.map(inst =>
      (inst.id === selectedId ? { ...inst, name, autoName: false } : inst)
    ))
  }

  const toggleDoelgroep = (doelgroep) => {
    if (selectedId == null) return
    setWorking(prev => prev.map(inst => {
      if (inst.id !== selectedId) return inst
      const has = inst.doelgroepen.includes(doelgroep)
      const doelgroepen = has
        ? inst.doelgroepen.filter(d => d !== doelgroep)
        : [...inst.doelgroepen, doelgroep]
      // Title derives from doelgroepen for auto-named versions — no name change.
      return { ...inst, doelgroepen }
    }))
  }

  const selectedInstance = working.find(inst => inst.id === selectedId) || null

  const filteredDoelgroepen = displayOrder.filter(d =>
    d.toLowerCase().includes(query.trim().toLowerCase())
  )

  const handleSave = () => {
    if (onSave) onSave(working)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Targeting op blok-niveau"
      className="block-targeting-modal"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Annuleer</Button>
          <Button variant="primary" onClick={handleSave}>Opslaan</Button>
        </>
      }
    >
      <div className="targeting-panes">
        {/* Left: versions */}
        <div className="targeting-instances">
          <span className="targeting-pane-label">Versies</span>
          <div className="targeting-instance-list">
            {working.length === 0 ? (
              <p className="body-r text-gray-300 targeting-empty">
                Maak een versie aan om targeting toe te passen.
              </p>
            ) : (
              working.map(inst => (
                <div
                  key={inst.id}
                  className={`targeting-instance ${inst.id === selectedId ? 'is-selected' : ''}`}
                  onClick={() => setSelectedId(inst.id)}
                >
                  <span className="targeting-instance-label">{versionTitle(inst)}</span>
                  <button
                    type="button"
                    className="targeting-instance-remove"
                    onClick={(e) => { e.stopPropagation(); removeInstance(inst.id) }}
                    aria-label="Verwijder versie"
                  >
                    <Icon name="ui-x" size={14} color="var(--gray-400)" />
                  </button>
                </div>
              ))
            )}
          </div>
          <Button
            variant="ghost"
            size="compact"
            iconStart="ui-plus"
            onClick={addInstance}
            className="targeting-instance-add"
          >
            Voeg versie toe
          </Button>
        </div>

        {/* Right: selected instance config */}
        <div className="targeting-config">
          {selectedInstance ? (
            <>
              <label className="targeting-field">
                <span className="targeting-pane-label">Naam</span>
                <input
                  type="text"
                  className="targeting-name-input"
                  value={versionTitle(selectedInstance, '')}
                  onChange={(e) => renameInstance(e.target.value)}
                  placeholder="Volgt de doelgroep"
                />
              </label>

              <span className="targeting-pane-label">Doelgroepen</span>
              <div className="targeting-search">
                <Icon name="ui-magnifyingglass" size={16} color="var(--gray-400)" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Zoek doelgroep…"
                />
              </div>
              <div className="targeting-doelgroep-list">
                {filteredDoelgroepen.map(doelgroep => {
                  const checked = selectedInstance.doelgroepen.includes(doelgroep)
                  return (
                    <button
                      key={doelgroep}
                      type="button"
                      className={`targeting-doelgroep ${checked ? 'is-checked' : ''}`}
                      onClick={() => toggleDoelgroep(doelgroep)}
                    >
                      <span className="targeting-check">
                        {checked && <Icon name="ui-check" size={16} color="var(--kpn-green-700)" />}
                      </span>
                      {doelgroep}
                    </button>
                  )
                })}
                {filteredDoelgroepen.length === 0 && (
                  <p className="body-r text-gray-300 targeting-empty">Geen doelgroep gevonden.</p>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}

export default BlockTargetingModal

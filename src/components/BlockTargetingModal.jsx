import { useEffect, useState } from 'react'
import Modal from './Modal'
import { Button, Icon } from './ds'
import { DOELGROEPEN, FEEDS, versionTitle } from '../config/targeting'
import '../styles/BlockTargetingModal.css'

/**
 * BlockTargetingModal
 *
 * Manages the content instances of a block: each instance is a named version
 * of the block tied to one or more doelgroepen (target groups) and/or feeds
 * (shown to that feed's followers).
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
// Deep-copy a version's content (objects are cloned; strings pass through)
const cloneContent = (c) => (c && typeof c === 'object' ? JSON.parse(JSON.stringify(c)) : c)

// A fresh version copies the previous one's block (type + content) so a new
// version starts as an editable copy rather than empty.
const versionCopiedFrom = (prevInst, baseContent) => ({
  id: Date.now(),
  name: '',
  autoName: true,
  doelgroepen: [],
  feeds: [],
  type: prevInst ? prevInst.type : undefined,
  content: prevInst ? cloneContent(prevInst.content) : (baseContent ?? ''),
})

const BlockTargetingModal = ({ isOpen, onClose, instances = [], onSave, baseContent, addOnOpen = false, initialSelectedId = null }) => {
  const [working, setWorking] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  // Display order of doelgroepen for the current version — selected ones first.
  // Recomputed only when the selected version changes (or on open), so the
  // list doesn't jump around while you're toggling checkboxes.
  const [displayOrder, setDisplayOrder] = useState({ doelgroepen: DOELGROEPEN, feeds: FEEDS })

  const orderList = (all, chosen = []) => {
    const selected = chosen.filter(d => all.includes(d))
    return [...selected, ...all.filter(d => !selected.includes(d))]
  }
  const orderFor = (inst) => ({
    doelgroepen: orderList(DOELGROEPEN, inst?.doelgroepen),
    feeds: orderList(FEEDS, inst?.feeds),
  })

  // Reset the working copy each time the modal opens
  useEffect(() => {
    if (!isOpen) return
    let copy = instances.map(inst => ({
      ...inst,
      doelgroepen: [...(inst.doelgroepen || [])],
      feeds: [...(inst.feeds || [])],
    }))
    // When opened via the tab bar "+", add a fresh version (copied from the
    // previous one) and select it.
    if (addOnOpen) {
      copy = [...copy, versionCopiedFrom(copy[copy.length - 1], baseContent)]
    }
    setWorking(copy)
    setSelectedId(
      addOnOpen
        ? copy[copy.length - 1].id
        : (initialSelectedId ?? copy[0]?.id ?? null)
    )
    setQuery('')
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Bring the selected version's doelgroepen to the top whenever we switch to
  // it (or reopen the modal) — but not on every toggle.
  useEffect(() => {
    if (!isOpen || selectedId == null) return
    setDisplayOrder(orderFor(working.find(inst => inst.id === selectedId)))
  }, [selectedId, isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const addInstance = () => {
    const created = versionCopiedFrom(working[working.length - 1], baseContent)
    setWorking(prev => [...prev, created])
    setSelectedId(created.id)
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

  // Toggle an audience in the selected version — `kind` is 'doelgroepen' or 'feeds'.
  const toggleAudience = (kind, value) => {
    if (selectedId == null) return
    setWorking(prev => prev.map(inst => {
      if (inst.id !== selectedId) return inst
      const list = inst[kind] || []
      const next = list.includes(value) ? list.filter(d => d !== value) : [...list, value]
      // Title derives from the audiences for auto-named versions — no name change.
      return { ...inst, [kind]: next }
    }))
  }

  const selectedInstance = working.find(inst => inst.id === selectedId) || null

  const q = query.trim().toLowerCase()
  const filteredDoelgroepen = displayOrder.doelgroepen.filter(d => d.toLowerCase().includes(q))
  const filteredFeeds = displayOrder.feeds.filter(d => d.toLowerCase().includes(q))

  const renderOption = (kind, value) => {
    const checked = (selectedInstance[kind] || []).includes(value)
    return (
      <button
        key={`${kind}-${value}`}
        type="button"
        className={`targeting-doelgroep ${checked ? 'is-checked' : ''}`}
        onClick={() => toggleAudience(kind, value)}
      >
        <span className="targeting-check">
          {checked && <Icon name="ui-check" size={16} color="var(--kpn-green-700)" />}
        </span>
        {value}
      </button>
    )
  }

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

              <span className="targeting-pane-label">Voor wie is deze versie?</span>
              <p className="body-s text-gray-400 targeting-hint">
                Kies doelgroepen en/of feeds: de versie is zichtbaar voor leden van de doelgroep én voor volgers van de feed.
              </p>
              <div className="targeting-search">
                <Icon name="ui-magnifyingglass" size={16} color="var(--gray-400)" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Zoek doelgroep of feed…"
                />
              </div>
              <div className="targeting-doelgroep-list">
                {filteredDoelgroepen.length > 0 && <span className="targeting-group-label">Doelgroepen</span>}
                {filteredDoelgroepen.map(d => renderOption('doelgroepen', d))}
                {filteredFeeds.length > 0 && <span className="targeting-group-label">Feeds</span>}
                {filteredFeeds.map(f => renderOption('feeds', f))}
                {filteredDoelgroepen.length === 0 && filteredFeeds.length === 0 && (
                  <p className="body-r text-gray-300 targeting-empty">Geen doelgroep of feed gevonden.</p>
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

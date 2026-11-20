import { useState } from 'react'
import AudienceTab from '../components/AudienceTab'
import BlockTargetingModal from '../components/BlockTargetingModal'
import { isTargeted } from '../config/targeting'

/**
 * Block targeting for any block (single or combined; not the fixed Header block).
 * A block is for everyone, or for one audience: the rail's people button opens BlockTargetingModal,
 * a targeted block shows a green AudienceTab above it.
 *
 * Returns { targeted, openModal, topBar, modal } — render topBar above the block and modal anywhere.
 */
export function useBlockTargeting(targeting, onTargetingChange) {
  const [open, setOpen] = useState(false)
  const targeted = isTargeted(targeting)
  return {
    targeted,
    openModal: onTargetingChange ? () => setOpen(true) : undefined,
    topBar: targeted ? <AudienceTab targeting={targeting} onEdit={() => setOpen(true)} /> : null,
    modal: open ? (
      <BlockTargetingModal isOpen onClose={() => setOpen(false)} targeting={targeting} onSave={onTargetingChange} />
    ) : null
  }
}

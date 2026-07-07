import { Fragment } from 'react'
import { PRIORITY_COUNT } from '../../config/publishingTargeting'
import '../../styles/PublishingTargeting.css'

/**
 * PrioritySlider
 *
 * A 4-position snapping slider for a channel priority. Dots are connected by
 * lines; the filled portion (up to the current dot) thickens and takes the
 * level colour — blue (1) → orange (2) → red (3). Level 0 = no priority.
 *
 * @param {number} value - 0..3
 * @param {Function} onChange - (level) => void
 */
const POSITIONS = Array.from({ length: PRIORITY_COUNT }, (_, i) => i)

function PrioritySlider({ value = 0, onChange }) {
  // Clicking anywhere on the slider snaps to the nearest position
  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = rect.width ? (e.clientX - rect.left) / rect.width : 0
    const level = Math.round(ratio * (PRIORITY_COUNT - 1))
    onChange(Math.max(0, Math.min(PRIORITY_COUNT - 1, level)))
  }

  return (
    <div className={`pri-slider pri-level-${value}`} onClick={handleTrackClick}>
      {POSITIONS.map(i => (
        <Fragment key={i}>
          {i > 0 && (
            <span className={`pri-slider-line ${value >= i ? 'is-filled' : ''}`} />
          )}
          <button
            type="button"
            className={`pri-slider-dot ${i === value ? 'is-thumb' : ''} ${value > 0 && i <= value ? 'is-on' : ''}`}
            onClick={(e) => { e.stopPropagation(); onChange(i) }}
            aria-label={`Prioriteitsniveau ${i + 1} van ${PRIORITY_COUNT}`}
            aria-pressed={i === value}
          />
        </Fragment>
      ))}
    </div>
  )
}

export default PrioritySlider

import { Button } from './ds'
import { useTooltip } from '../hooks/useTooltip'
import '../styles/PositioningButtons.css'

/** One icon-only rail button with its tooltip. */
const RailButton = ({ tooltip, label = tooltip, icon, danger = false, disabled = false, onClick }) => {
  const ref = useTooltip(tooltip)
  return (
    <div ref={ref}>
      <Button
        variant="icon-only"
        iconColor={danger ? 'secondary-red' : 'secondary'}
        icon={icon}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) onClick?.()
        }}
        disabled={disabled}
        aria-label={label}
      />
    </div>
  )
}

/**
 * PositioningButtons — the block rail, shared by every block type.
 * Which buttons show is driven by the handlers passed: omit onSwap / onTarget and the button isn't there.
 *
 * @param {boolean} visible - Whether the rail is visible (fades in)
 * @param {boolean} dimmed - Dim the rail (nested focus, e.g. table cell)
 * @param {boolean} isFirst, isLast - Disable move up / down
 * @param {Function} onMoveUp, onMoveDown, onSwap?, onDuplicate, onTarget?, onDelete
 * @param {boolean} isTargeted - Tooltip text of the target button
 */
const PositioningButtons = ({
  visible,
  dimmed,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onSwap,
  onDuplicate,
  onDelete,
  onTarget,
  isTargeted = false
}) => (
  <div className={`positioning-buttons ${visible ? 'visible' : ''} ${dimmed ? 'dimmed' : ''}`}>
    <RailButton tooltip="Verplaats omhoog" icon="ui-arrow-up" disabled={isFirst} onClick={onMoveUp} />
    <RailButton tooltip="Verplaats omlaag" icon="ui-arrow-down" disabled={isLast} onClick={onMoveDown} />
    {onSwap && <RailButton tooltip="Wissel kolommen" icon="ui-arrow-right-arrow-left" onClick={onSwap} />}
    <RailButton tooltip="Dupliceer" icon="ui-copy" onClick={onDuplicate} />
    {onTarget && (
      <RailButton
        tooltip={isTargeted ? 'Doelgroep aanpassen' : 'Doelgroep toewijzen'}
        label="Doelgroep toewijzen"
        icon="ui-people"
        onClick={onTarget}
      />
    )}
    <RailButton tooltip="Verwijder" icon="ui-trash" danger onClick={onDelete} />
  </div>
)

export default PositioningButtons

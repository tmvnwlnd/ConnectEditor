import ArrowUpIcon from '../icons/ui-arrow-up.svg?react'
import ArrowDownIcon from '../icons/ui-arrow-down.svg?react'
import LinkIcon from '../icons/ui-link.svg?react'
import CopyIcon from '../icons/ui-copy.svg?react'
import TrashIcon from '../icons/ui-trash.svg?react'

const PositioningButtons = ({
  visible,
  dimmed,
  isFirst,
  isLast,
  isLinking,
  onMoveUp,
  onMoveDown,
  onLink,
  onDuplicate,
  onDelete
}) => {
  const buttonClass = `btn btn-sm rounded-circle p-2 ${dimmed ? 'dimmed' : ''}`

  return (
    <div className={`positioning-buttons ${visible ? 'visible' : ''}`}>
      <button
        className={`${buttonClass} ${isFirst ? 'dimmed' : ''}`}
        data-tooltip="Verplaats omhoog"
        onClick={(e) => {
          e.stopPropagation()
          if (!isFirst && onMoveUp) onMoveUp()
        }}
        disabled={isFirst}
      >
        <ArrowUpIcon width={16} height={16} />
      </button>
      <button
        className={`${buttonClass} ${isLast ? 'dimmed' : ''}`}
        data-tooltip="Verplaats omlaag"
        onClick={(e) => {
          e.stopPropagation()
          if (!isLast && onMoveDown) onMoveDown()
        }}
        disabled={isLast}
      >
        <ArrowDownIcon width={16} height={16} />
      </button>
      <button
        className={`${buttonClass} ${isLinking ? 'active' : ''}`}
        data-tooltip="Link met ander element"
        onClick={(e) => {
          e.stopPropagation()
          if (onLink) {
            onLink()
          }
        }}
      >
        <LinkIcon width={16} height={16} />
      </button>
      <button
        className={buttonClass}
        data-tooltip="Dupliceer"
        onClick={(e) => {
          e.stopPropagation()
          if (onDuplicate) onDuplicate()
        }}
      >
        <CopyIcon width={16} height={16} />
      </button>
      <button
        className={`${buttonClass} delete-btn`}
        data-tooltip="Verwijder"
        onClick={(e) => {
          e.stopPropagation()
          if (onDelete) onDelete()
        }}
      >
        <TrashIcon width={16} height={16} />
      </button>
    </div>
  )
}

export default PositioningButtons

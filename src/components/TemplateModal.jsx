import { useState } from 'react'
import Icon from './Icon'
import Button from './Button'
import MinusIcon from '../icons/ui-minus.svg?react'
import PlusIcon from '../icons/ui-plus.svg?react'
import CrossIcon from '../icons/ui-cross.svg?react'
import '../styles/TemplateModal.css'

/**
 * TemplateModal Component
 *
 * Modal dialog for configuring template parameters before insertion.
 *
 * @param {string} title - Modal title text
 * @param {string} description - Description of what the number controls
 * @param {number} defaultValue - Default number value
 * @param {number} min - Minimum allowed value (default: 1)
 * @param {number} max - Maximum allowed value (default: 20)
 * @param {Function} onConfirm - Callback when user confirms (receives the number)
 * @param {Function} onCancel - Callback when user cancels
 */
const TemplateModal = ({
  title = 'Template configureren',
  description = 'Aantal elementen',
  defaultValue = 5,
  min = 1,
  max = 20,
  onConfirm,
  onCancel
}) => {
  const [value, setValue] = useState(defaultValue)

  const increment = () => {
    if (value < max) {
      setValue(value + 1)
    }
  }

  const decrement = () => {
    if (value > min) {
      setValue(value - 1)
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(value)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleCancel}>
          <Icon icon={CrossIcon} color="#737373" size={20} />
        </button>

        <h2 className="modal-title">{title}</h2>

        <div className="modal-content">
          <p className="modal-description">{description}</p>

          <div className="number-input-group">
            <button
              className="number-btn"
              onClick={decrement}
              disabled={value <= min}
            >
              <Icon icon={MinusIcon} color={value <= min ? '#d0d0d0' : '#1a1a1a'} size={20} />
            </button>

            <div className="number-display">{value}</div>

            <button
              className="number-btn"
              onClick={increment}
              disabled={value >= max}
            >
              <Icon icon={PlusIcon} color={value >= max ? '#d0d0d0' : '#1a1a1a'} size={20} />
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <Button
            variant="secondary"
            onClick={handleCancel}
          >
            Annuleren
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
          >
            Toevoegen
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TemplateModal

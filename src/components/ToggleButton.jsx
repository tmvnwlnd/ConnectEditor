import { useState } from 'react'
import Icon from './Icon'
import '../styles/ToggleButton.css'

/**
 * ToggleButton - Segmented control for switching between two modes
 *
 * @param {Object} props
 * @param {string} props.option1Label - Label for first option
 * @param {React.ComponentType} props.option1Icon - Icon component for first option
 * @param {string} props.option2Label - Label for second option
 * @param {React.ComponentType} props.option2Icon - Icon component for second option
 * @param {boolean} props.isOption2Active - Whether option 2 is currently active
 * @param {Function} props.onToggle - Callback when toggle changes
 */
const ToggleButton = ({
  option1Label,
  option1Icon: Option1Icon,
  option2Label,
  option2Icon: Option2Icon,
  isOption2Active,
  onToggle
}) => {
  const [hoveredOption, setHoveredOption] = useState(null)

  // Determine icon color based on active state and hover
  const getIconColor = (isActive, optionNumber) => {
    if (isActive) {
      return 'white'
    }
    if (hoveredOption === optionNumber) {
      return '#333'
    }
    return '#737373'
  }

  return (
    <div className="toggle-button">
      <button
        className={`toggle-option ${!isOption2Active ? 'active' : ''}`}
        onClick={() => onToggle(false)}
        onMouseEnter={() => setHoveredOption(1)}
        onMouseLeave={() => setHoveredOption(null)}
      >
        {Option1Icon && (
          <Icon
            icon={Option1Icon}
            color={getIconColor(!isOption2Active, 1)}
            size={24}
          />
        )}
        {option1Label}
      </button>
      <button
        className={`toggle-option ${isOption2Active ? 'active' : ''}`}
        onClick={() => onToggle(true)}
        onMouseEnter={() => setHoveredOption(2)}
        onMouseLeave={() => setHoveredOption(null)}
      >
        {option2Label}
        {Option2Icon && (
          <Icon
            icon={Option2Icon}
            color={getIconColor(isOption2Active, 2)}
            size={24}
          />
        )}
      </button>
    </div>
  )
}

export default ToggleButton

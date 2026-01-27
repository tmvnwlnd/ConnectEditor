import Icon from './Icon'
import StarIcon from '../icons/ui-star.svg?react'
import '../styles/AIButton.css'

/**
 * AIButton Component
 *
 * A button styled like Trumbowyg toolbar buttons for AI features
 * Used in TextFields for AI text generation/improvement
 *
 * @param {string} text - Button text (optional, defaults to just icon)
 * @param {Function} onClick - Click handler
 * @param {string} className - Additional CSS classes
 */
const AIButton = ({ text, onClick, className = '' }) => {
  return (
    <button
      className={`ai-button ${className}`}
      onClick={onClick}
      type="button"
      aria-label={text || 'AI assistant'}
    >
      <Icon icon={StarIcon} color="currentColor" size={16} />
      {text && <span className="ai-button-text">{text}</span>}
    </button>
  )
}

export default AIButton

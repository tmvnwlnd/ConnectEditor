import Button from './Button'
import Icon from './Icon'
import PhotoIcon from '../icons/ui-photo.svg?react'
import '../styles/ArticlePreviewCard.css'

/**
 * ArticlePreviewCard Component
 *
 * Displays a preview of an article with image, title, introduction, and metadata.
 * Reusable across ArticleSetup and ArticleSettings pages.
 *
 * @param {string} title - Article title
 * @param {string} introduction - Article introduction text
 * @param {string} coverImage - Cover image URL/data
 * @param {string} date - Publication date (e.g., "16 januari 2025")
 * @param {string} readTime - Estimated read time (e.g., "5 minuten")
 * @param {Function} onEdit - Optional edit callback
 * @param {string} editButtonLabel - Label for edit button (default: "Aanpassen")
 * @param {React.ComponentType} editButtonIcon - Icon for edit button
 * @param {boolean} showEditButton - Whether to show edit button (default: true)
 * @param {string} className - Additional CSS classes
 */
const ArticlePreviewCard = ({
  title = 'Lancering KPN Ultimate succesvol verlopen',
  introduction = 'De onthulling van het nieuwe, enige echte KPN Frisbee Spel is goed in ontvangst genomen door de werknemers die aanwezig waren bij het release event.',
  coverImage,
  date = '16 januari 2025',
  readTime = '5 minuten',
  onEdit,
  editButtonLabel = 'Aanpassen',
  editButtonIcon,
  showEditButton = true,
  className = ''
}) => {
  return (
    <div className={`article-preview-card ${className}`}>
      {/* Cover Image */}
      <div className="preview-card-image">
        {coverImage ? (
          <img src={coverImage} alt="Cover" />
        ) : (
          <div className="preview-image-placeholder">
            <Icon icon={PhotoIcon} size={60} color="#d0d0d0" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="preview-card-content">
        <div className="preview-card-meta">
          <span>{date}</span>
          <span>{readTime}</span>
        </div>
        <h3 className="preview-card-title">{title}</h3>
        <p className="preview-card-intro">{introduction}</p>
      </div>

      {/* Edit Button */}
      {showEditButton && onEdit && (
        <Button
          variant="outline-secondary"
          icon={editButtonIcon}
          iconPosition="left"
          onClick={onEdit}
        >
          {editButtonLabel}
        </Button>
      )}
    </div>
  )
}

export default ArticlePreviewCard

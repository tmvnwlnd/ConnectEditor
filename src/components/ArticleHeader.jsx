import PhotoIcon from '../icons/ui-photo.svg?react'
import '../styles/ArticleHeader.css'

/**
 * ArticleHeader - Displays title, introduction, and cover image from step 1
 * This is uneditable in the editor and shows a tooltip on hover
 */
const ArticleHeader = ({ title, introduction, coverImage }) => {
  return (
    <div className="article-header-block" data-tooltip="Pas deze gegevens aan in stap 1">
      <div className="article-header-image">
        {coverImage ? (
          <img src={coverImage} alt="Cover" />
        ) : (
          <div className="article-header-image-placeholder">
            <PhotoIcon width={40} height={40} />
          </div>
        )}
      </div>
      <div className="article-header-content">
        <h3 className="article-header-title">
          {title || <span className="article-header-placeholder">Titel van artikel...</span>}
        </h3>
        <p className="article-header-intro">
          {introduction || <span className="article-header-placeholder">Introductie van artikel...</span>}
        </p>
      </div>
    </div>
  )
}

export default ArticleHeader

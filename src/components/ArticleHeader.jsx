import Icon from './Icon'
import PhotoIcon from '../icons/ui-photo.svg?react'
import { stripHtml } from '../utils/stripHtml'
import '../styles/ArticleHeader.css'

/**
 * ArticleHeader — the collapsed (unfocused) state of the editor's fixed top block: small cover image left,
 * title + introduction right. Clicking the block focuses it and opens the fields (SetupFields).
 */
const ArticleHeader = ({ title, introduction, coverImage }) => (
  <div className="article-header-block">
    <div className="article-header-image">
      {coverImage ? (
        <img src={coverImage} alt="Cover" />
      ) : (
        <div className="article-header-image-placeholder">
          <Icon icon={PhotoIcon} color="#d3d3d3" size={48} />
        </div>
      )}
    </div>
    <div className="article-header-content">
      <h3 className="article-header-title">
        {title || <span className="article-header-placeholder">Titel van artikel...</span>}
      </h3>
      <p className="article-header-intro">
        {stripHtml(introduction) || <span className="article-header-placeholder">Introductie van artikel...</span>}
      </p>
    </div>
  </div>
)

export default ArticleHeader

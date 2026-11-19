import { useState, useEffect } from 'react'
import Icon from './Icon'
import PhotoIcon from '../icons/ui-photo.svg?react'
import '../styles/ArticleHeader.css'

/**
 * ArticleHeader — the collapsed (unfocused) state of the editor's fixed "Header" block, shaped like the article's
 * real header: cover on top, then the big green title and the bold intro (as in the preview's .tka-cover /
 * .tka-title / .tka-lead). Clicking the block focuses it and opens the fields (SetupFields).
 */
const ArticleHeader = ({ title, introduction, coverImage }) => {
  // A cover that no longer loads (e.g. an uploaded file's temporary link after a reload) shows the placeholder.
  const [broken, setBroken] = useState(false)
  useEffect(() => setBroken(false), [coverImage])
  const showImage = coverImage && !broken
  return (
  <div className="article-header-preview">
    <div className={`article-header-cover ${showImage ? '' : 'is-empty'}`}>
      {showImage ? <img src={coverImage} alt="" onError={() => setBroken(true)} /> : <Icon icon={PhotoIcon} color="#d3d3d3" size={48} />}
    </div>
    <h1 className={`article-header-title ${title ? '' : 'is-placeholder'}`}>{title || 'Titel van artikel...'}</h1>
    <p className={`article-header-intro ${introduction ? '' : 'is-placeholder'}`}>{introduction || 'Introductie van artikel...'}</p>
  </div>
  )
}

export default ArticleHeader

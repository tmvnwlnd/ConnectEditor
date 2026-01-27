import { useEffect, useRef } from 'react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import Icon from './Icon'
import PhotoIcon from '../icons/ui-photo.svg?react'
import '../styles/ArticleHeader.css'

/**
 * ArticleHeader - Displays title, introduction, and cover image from step 1
 * This is uneditable in the editor and shows a tooltip on hover
 */
const ArticleHeader = ({ title, introduction, coverImage }) => {
  const headerRef = useRef(null)

  // Initialize Tippy tooltip
  useEffect(() => {
    if (headerRef.current) {
      const instance = tippy(headerRef.current, {
        content: 'Pas deze gegevens aan in stap 1',
        arrow: true,
        theme: 'translucent',
        animation: 'fade',
        placement: 'top'
      })
      return () => {
        instance.destroy()
      }
    }
  }, [])

  return (
    <div ref={headerRef} className="article-header-block">
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
          {introduction || <span className="article-header-placeholder">Introductie van artikel...</span>}
        </p>
      </div>
    </div>
  )
}

export default ArticleHeader

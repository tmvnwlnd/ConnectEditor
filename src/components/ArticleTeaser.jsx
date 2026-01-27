/**
 * ArticleTeaser Component
 * Preview component showing article in tegelvariant and row variants
 *
 * @param {string} variant - 'tile' or 'row'
 * @param {object} article - Article data { title, introduction, coverImage, icon }
 * @param {string} className - Additional CSS classes
 */

import { useState } from 'react'
import { Icon } from './ds'
import './ArticleTeaser.css'

function ArticleTeaser({
  variant = 'tile',
  article,
  className = '',
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false)

  const {
    title,
    introduction,
    coverImage,
    icon,
    date,
  } = article || {}

  // Format date and time as "20 januari om 13:30"
  const formatDateTime = (dateValue) => {
    if (!dateValue) return null
    const d = new Date(dateValue)
    const day = d.getDate()
    const month = d.toLocaleDateString('nl-NL', { month: 'long' })
    const time = d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
    return `${day} ${month} om ${time}`
  }

  const formattedDateTime = formatDateTime(date)

  // Render tile variant (tegel)
  if (variant === 'tile') {
    return (
      <article
        className={`article-teaser article-teaser-tile ${isHovered ? 'is-hovered' : ''} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Background Image */}
        <div className="article-teaser-image-wrapper">
          {coverImage ? (
            <img
              src={coverImage}
              alt={title || 'Article preview'}
              className="article-teaser-image"
            />
          ) : (
            <div className="article-teaser-placeholder" />
          )}
          {/* Gradient Overlay */}
          <div className="article-teaser-overlay" />
        </div>

        {/* Content */}
        <div className="article-teaser-content">
          {/* Text Content - bottom */}
          <div className="article-teaser-text">
            {/* Meta */}
            {formattedDateTime && (
              <div className="article-teaser-meta body-r">
                <span>{formattedDateTime}</span>
              </div>
            )}

            {/* Title */}
            <h4 className="article-teaser-title text-truncate-2">{title || 'Titel van jouw artikel'}</h4>

            {/* Introduction */}
            {introduction && (
              <p className="article-teaser-intro body-r text-truncate-2">{introduction}</p>
            )}
          </div>
        </div>
      </article>
    )
  }

  // Render row variant (rij met icoon)
  if (variant === 'row') {
    return (
      <article
        className={`article-teaser-row ${isHovered ? 'is-hovered' : ''} ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {/* Icon */}
        <div className="article-teaser-row-icon">
          <Icon name={icon || 'ui-star'} size={40} />
        </div>

        {/* Text Content */}
        <div className="article-teaser-row-text">
          {/* Title */}
          <h6 className="article-teaser-row-title text-truncate-2">{title || 'Titel van jouw artikel'}</h6>

          {/* Meta */}
          <div className="article-teaser-row-meta body-r">
            {formattedDateTime ? (
              <span className="text-gray-400">{formattedDateTime}</span>
            ) : (
              <span className="text-gray-300">Preview</span>
            )}
          </div>
        </div>
      </article>
    )
  }

  return null
}

export default ArticleTeaser

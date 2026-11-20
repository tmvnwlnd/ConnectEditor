/**
 * ArticleTeaser — how the article shows up in TEAMKPN, mirroring the prototype's ArticleTile:
 *  - "stacked":    image on top, unread dot + bold title (2 lines), intro (2 lines)  — feeds / Voor jou
 *  - "horizontal": text left, small square image right                              — side lists
 *  - "row":        no image, dot + title + chevron                                  — incident / timeline lists
 * An update adds the "Update" tag, a link-tag the platform tag. (No "Belangrijk" tag: priority only affects sorting.)
 *
 * @param {string} variant - 'stacked' | 'horizontal' | 'row'
 * @param {object} article - { title, introduction, coverImage, priority, isUpdate, platformLink (link-tag label) }
 * @param {string} imageTone - 'green': no cover → a plain green image box (stand-in for another article's photo)
 */

import { Icon } from './ds'
import './ArticleTeaser.css'

function ArticleTeaser({ variant = 'stacked', article, imageTone, className = '', ...props }) {
  const { title, introduction, coverImage, isUpdate, platformLink } = article || {}
  const tags = [
    isUpdate && <span key="u" className="tkt-tag tkt-tag-update">Update</span>,
    platformLink && <span key="p" className="tkt-tag tkt-tag-platform"><Icon name="ui-link" size={14} />{platformLink}</span>,
  ].filter(Boolean)

  const titleEl = (
    <h3 className="tkt-title">
      {variant !== 'row' && <span className="tkt-dot" aria-hidden="true" />}
      <span>{title || 'Titel van jouw artikel'}</span>
      {variant !== 'row' && tags}
    </h3>
  )

  if (variant === 'row') {
    return (
      <article className={`tkt tkt-row ${className}`} {...props}>
        <span className="tkt-dot" aria-hidden="true" />
        <div className="tkt-row-text">
          {tags.length > 0 && <div className="tkt-row-tags">{tags}</div>}
          {titleEl}
        </div>
        <Icon name="ui-chevron-right" size={24} color="var(--gray-400)" />
      </article>
    )
  }

  return (
    <article className={`tkt tkt-${variant} ${className}`} {...props}>
      <div className={`tkt-image ${coverImage ? '' : imageTone === 'green' ? 'is-green' : 'is-empty'}`}>
        {coverImage ? (
          <img src={coverImage} alt="" />
        ) : imageTone === 'green' ? null : (
          // No cover yet: a gray placeholder with a photo icon.
          <Icon name="ui-photo" size={variant === 'horizontal' ? 24 : 40} color="var(--gray-400)" />
        )}
      </div>
      <div className="tkt-body">
        {titleEl}
        {introduction && <p className="tkt-intro">{introduction}</p>}
      </div>
    </article>
  )
}

export default ArticleTeaser

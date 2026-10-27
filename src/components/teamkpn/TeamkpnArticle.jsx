import { useState } from 'react'
import { Icon } from '../ds'
import { DOELGROEPEN, FEEDS } from '../../config/publishingTargeting'
import './TeamkpnArticle.css'

/**
 * TeamkpnArticle — the TEAMKPN article page (from the Channel Personalisatie prototype), rebuilt INSIDE
 * this editor on its own design system, for the "Voorvertoning". Close to, not pixel-identical with, the
 * prototype's ArticleDetail. Takes ONE article in the TEAMKPN format (see utils/toTeamkpnArticle.js).
 *
 * Layout: cover (flush to the top) · meta row (date, reading time, publisher, feed chips) · green title ·
 * action bar (static) · intro · body blocks · action bar. Targeted sections are always shown OPEN, each with
 * its green audience label — the preview shows every version as its intended reader sees it.
 */
const feedName = (id) => FEEDS.find((f) => f.id === id)?.name || id
const doelgroepName = (id) => DOELGROEPEN.find((d) => d.id === id)?.name || id
const formatDate = (iso) => new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })

function audienceLabel(t = {}) {
  return [...(t.feeds || []).map(feedName), ...(t.doelgroepen || []).map(doelgroepName)].join(' · ') || 'Specifieke groep'
}

function Actions({ article }) {
  return (
    <div className="tka-actions" aria-hidden="true">
      <div className="tka-actions-side">
        <span className="tka-act"><Icon name="ui-heart" size={20} />{article.likeCount || 0}</span>
        <span className="tka-act"><Icon name="ui-text-bubble" size={20} />0</span>
        <span className="tka-act"><Icon name="ui-share" size={20} /></span>
        <span className="tka-act"><Icon name="ui-eye" size={20} />{article.views || 0}x</span>
      </div>
      <div className="tka-actions-side">
        <span className="tka-act"><Icon name="ui-bookmark" size={20} /></span>
        <span className="tka-act"><Icon name="ui-speaker-high" size={20} /></span>
        <span className="tka-act"><Icon name="ui-dots-3-vertical" size={20} /></span>
      </div>
    </div>
  )
}

function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`tka-acc ${open ? 'is-open' : ''}`}>
      <button type="button" className="tka-acc-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span>{title}</span>
        <Icon name={open ? 'ui-chevron-down' : 'ui-chevron-right'} size={20} />
      </button>
      {open && <div className="tka-acc-body">{children}</div>}
    </div>
  )
}

function Carousel({ images }) {
  const list = (images || []).filter((im) => im?.src)
  const [i, setI] = useState(0)
  if (!list.length) return null
  const cur = list[Math.min(i, list.length - 1)]
  const go = (d) => setI((n) => (n + d + list.length) % list.length)
  return (
    <figure className="tka-figure tka-carousel">
      <div className="tka-carousel-stage">
        <img src={cur.src} alt={cur.alt || cur.caption || ''} />
        {list.length > 1 && (
          <>
            <button type="button" className="tka-carousel-btn is-prev" aria-label="Vorige afbeelding" onClick={() => go(-1)}>
              <Icon name="ui-chevron-left" size={24} />
            </button>
            <button type="button" className="tka-carousel-btn is-next" aria-label="Volgende afbeelding" onClick={() => go(1)}>
              <Icon name="ui-chevron-right" size={24} />
            </button>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="tka-carousel-dots">
          {list.map((_, k) => (
            <button key={k} type="button" className={`tka-carousel-dot ${k === i ? 'is-active' : ''}`} aria-label={`Afbeelding ${k + 1}`} onClick={() => setI(k)} />
          ))}
        </div>
      )}
      {cur.caption && <figcaption>{cur.caption}</figcaption>}
    </figure>
  )
}

function Block({ block }) {
  switch (block.type) {
    case 'heading': {
      const Tag = block.level === 3 ? 'h3' : 'h2'
      return <Tag className={`tka-heading tka-heading-${block.level === 3 ? 3 : 2}`}>{block.text}</Tag>
    }
    case 'paragraph':
    case 'callout':
      return <div className="tka-prose" dangerouslySetInnerHTML={{ __html: block.html }} />
    case 'image':
      return (
        <figure className="tka-figure">
          <img src={block.src} alt={block.caption || ''} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    case 'list': {
      const List = block.ordered ? 'ol' : 'ul'
      return (
        <List className="tka-list">
          {block.items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}
        </List>
      )
    }
    case 'quote':
      return (
        <blockquote className="tka-quote">
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
          {block.cite && <cite>{block.cite}</cite>}
        </blockquote>
      )
    case 'accordion':
      return (
        <div className="tka-accordion">
          {block.items.map((it, i) => (
            <AccordionItem key={i} title={it.title}>
              {it.content.map((b, k) => <Block key={k} block={b} />)}
            </AccordionItem>
          ))}
        </div>
      )
    case 'attachment':
      return (
        <div className="tka-attachment">
          <Icon name="ui-file" size={32} color="var(--kpn-green-500)" />
          <div className="tka-attachment-text">
            <span className="tka-attachment-title">{block.title}</span>
            {block.meta && <span className="tka-attachment-meta">{block.meta}</span>}
          </div>
          <a className="tka-attachment-download" href={block.href} download={block.fileName || true} aria-label={`Download ${block.title}`}>
            <Icon name="ui-arrow-down-to-line" size={24} color="var(--kpn-blue-500)" />
          </a>
        </div>
      )
    case 'carousel':
      return <Carousel images={block.images} />
    case 'banner': {
      const Heading = ['h1', 'h2', 'h3'].includes(block.level) ? block.level : 'h2'
      return (
        <div className={`tka-banner ${block.image ? 'has-image' : ''}`} style={block.image ? undefined : { background: block.bgColor || 'var(--kpn-green-500)' }}>
          {block.image && <img src={block.image} alt="" aria-hidden="true" />}
          <Heading className={`tka-banner-text tka-banner-text--${Heading}`} style={{ color: block.textColor || '#fff' }}>
            {block.text}
          </Heading>
        </div>
      )
    }
    case 'video':
      return (
        <figure className="tka-figure">
          <video className="tka-video" controls src={block.src} />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    case 'audio':
      return (
        <div className="tka-audio">
          {block.title && <p className="tka-audio-title">{block.title}</p>}
          <audio controls src={block.src} />
        </div>
      )
    case 'table':
      return (
        <div className="tka-table-wrap">
          <table className="tka-table">
            <tbody>
              {(block.rows || []).map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => {
                    const Cell = (block.hasColumnHeader && r === 0) || (block.hasRowHeader && c === 0) ? 'th' : 'td'
                    return <Cell key={c} dangerouslySetInnerHTML={{ __html: cell || '' }} />
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    default:
      return null
  }
}

/** Body: untargeted blocks inline; a run of consecutive blocks with the same targeting = one labelled section. */
function Body({ blocks }) {
  const out = []
  for (let i = 0; i < blocks.length; ) {
    const b = blocks[i]
    if (!b.targeting) {
      out.push(<Block key={i} block={b} />)
      i += 1
      continue
    }
    const sig = JSON.stringify(b.targeting)
    const run = []
    while (i < blocks.length && blocks[i].targeting && JSON.stringify(blocks[i].targeting) === sig) run.push(blocks[i++])
    out.push(
      <section key={`t-${i}`} className="tka-target">
        <span className="tka-target-label">{audienceLabel(b.targeting)}</span>
        <div className="tka-target-body">{run.map((x, k) => <Block key={k} block={x} />)}</div>
      </section>,
    )
  }
  return out
}

export default function TeamkpnArticle({ article }) {
  if (!article) return null
  return (
    <article className="tka">
      <div className="tka-cover">{article.coverImage && <img src={article.coverImage} alt="" />}</div>

      <div className="tka-meta">
        <span className="tka-meta-date">{formatDate(article.publishDate)}</span>
        <span className="tka-meta-date">{article.readTimeMinutes} minuten leestijd</span>
        <span className="tka-meta-pub">TEAMKPN Redactie</span>
        {article.feeds?.length > 0 && (
          <span className="tka-chips">
            {article.feeds.map((f) => (
              <span key={f} className="tka-chip">{feedName(f)}</span>
            ))}
          </span>
        )}
      </div>

      <h1 className="tka-title">{article.title}</h1>
      <Actions article={article} />
      <hr className="tka-divider" />

      <div className="tka-body">
        {article.introText && <p className="tka-lead">{article.introText}</p>}
        <Body blocks={article.content || []} />
      </div>

      <Actions article={article} />
    </article>
  )
}

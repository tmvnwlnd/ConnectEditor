/**
 * toTeamkpnArticle — converts what this editor holds (setup + blocks + publishing targeting) into ONE article
 * in the TEAMKPN prototype's format (`src/data/articles.json` there: title, introText, coverImage, feeds,
 * targeting, content blocks…), rendered by `components/teamkpn/TeamkpnArticle` (the Voorvertoning).
 *
 * Block mapping (editor → TEAMKPN):
 *   header → heading (h2) · paragraph → paragraph · citation → quote · image → image · carousel → carousel ·
 *   table → table · video → video · audio → audio · attachment → attachment (title, "PDF · 1,2 MB", href) ·
 *   text-graphic (Tekstbanner) → banner · faq → heading (its title) + accordion · double-column → its halves.
 * A VERSIONED block becomes one block per version; a version aimed at doelgroepen and/or feeds gets
 * `targeting: { doelgroepen, feeds }` (ids), the "Algemeen" version (no audience) stays untargeted.
 */
import { DOUBLE_ELEMENT_TYPES } from '../config/elementTypes'
import { DOELGROEPEN, FEEDS } from '../config/publishingTargeting'

const strip = (html = '') => String(html).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const doelgroepId = (name) => DOELGROEPEN.find((d) => d.name === name || d.id === name)?.id || name
const feedId = (name) => FEEDS.find((f) => f.name === name || f.id === name)?.id || name

// Editor channel → the TEAMKPN taxonomy channels it covers.
const TAXONOMY_CHANNELS = { cco: ['cs', 'retail'], monteurs: ['cd'], zakelijk: ['zm'] }

/** One editor block (type + content) → zero or more TEAMKPN blocks. */
function convertBlock(type, content) {
  if (content == null || content === '') return []
  switch (type) {
    case 'header':
      return strip(content) ? [{ type: 'heading', level: 2, text: strip(content) }] : []
    case 'paragraph':
      return strip(content) ? [{ type: 'paragraph', html: content }] : []
    case 'citation':
      return content.quote ? [{ type: 'quote', html: `<p>${esc(strip(content.quote))}</p>`, cite: content.person || undefined }] : []
    case 'image':
      return content.image ? [{ type: 'image', src: content.image, caption: content.caption || '' }] : []
    case 'carousel':
      return (content.images || []).some((i) => i.image)
        ? [{ type: 'carousel', images: content.images.filter((i) => i.image).map((i) => ({ src: i.image, caption: i.caption || '', alt: i.altText || '' })) }]
        : []
    case 'table': {
      const rows = content.data || []
      if (!rows.length) return []
      return [{ type: 'table', rows, hasColumnHeader: Boolean(content.hasColumnHeader), hasRowHeader: Boolean(content.hasRowHeader) }]
    }
    case 'video':
      return content.video ? [{ type: 'video', src: content.video, caption: content.caption || '' }] : []
    case 'audio':
      return content.audio ? [{ type: 'audio', src: content.audio, title: content.title || '' }] : []
    case 'attachment': {
      if (!content.attachment) return []
      const name = content.fileName || content.originalFileName || 'Bijlage'
      const ext = (content.originalFileName || content.fileName || '').split('.').pop()
      const kind = (content.fileType && !content.fileType.includes('/') ? content.fileType : ext || '').toUpperCase()
      return [{
        type: 'attachment',
        title: name,
        fileName: content.originalFileName || name,
        meta: [kind, content.fileSize].filter(Boolean).join(' · '),
        href: content.attachment,
      }]
    }
    case 'text-graphic':
      return content.text
        ? [{
            type: 'banner',
            text: content.text,
            level: content.level || 'h2',
            ...(content.bgType === 'image' && content.image ? { image: content.image } : { bgColor: content.bgColor || '#00c300' }),
            textColor: content.textColor || '#ffffff',
          }]
        : []
    case 'faq': {
      const items = (content.items || []).filter((it) => it.question?.trim())
      if (!items.length) return []
      const toHtml = (t) => t.split(/\n{2,}/).map((p) => `<p>${esc(p).replace(/\n/g, '<br>')}</p>`).join('')
      return [
        ...(content.title?.trim() ? [{ type: 'heading', level: 2, text: content.title.trim() }] : []),
        { type: 'accordion', items: items.map((it) => ({ title: it.question.trim(), content: [{ type: 'paragraph', html: toHtml(it.answer || '') }] })) },
      ]
    }
    default:
      return []
  }
}

/** One editor element → TEAMKPN blocks (handles double columns and versions). */
function convertElement(el) {
  if (Array.isArray(el.versions) && el.versions.length) {
    return el.versions.flatMap((v) => {
      const blocks = convertBlock(v.type || el.type, v.content)
      const doelgroepen = (v.doelgroepen || []).map(doelgroepId)
      const feeds = (v.feeds || []).map(feedId)
      if (!doelgroepen.length && !feeds.length) return blocks
      const targeting = { ...(doelgroepen.length ? { doelgroepen } : {}), ...(feeds.length ? { feeds } : {}) }
      return blocks.map((b) => ({ ...b, targeting }))
    })
  }
  const double = DOUBLE_ELEMENT_TYPES[el.type]
  if (double) {
    const left = convertBlock(double.leftType, el.leftContent)
    const right = convertBlock(double.rightType, el.rightContent)
    return el.swapped ? [...right, ...left] : [...left, ...right]
  }
  return convertBlock(el.type, el.content)
}

/**
 * @param {object} p
 * @param {object} p.setup      { title, introduction, coverImage }
 * @param {Array}  p.elements   The editor's blocks.
 * @param {object} p.targeting  { skills: feedIds, channels: { [channelId]: { enabled, … } } }
 */
export function toTeamkpnArticle({ setup = {}, elements = [], targeting = {} }) {
  const content = elements.flatMap(convertElement)
  const words = [setup.introduction, ...content.map((b) => b.text || b.html || '')].map(strip).join(' ').split(' ').filter(Boolean).length
  const channels = Object.entries(targeting.channels || {})
    .filter(([, c]) => c?.enabled)
    .flatMap(([id]) => TAXONOMY_CHANNELS[id] || [])
  const feeds = targeting.skills || []
  return {
    id: 'editor-preview',
    title: setup.title || 'Titel van het artikel',
    introText: strip(setup.introduction),
    coverImage: setup.coverImage || null,
    publishDate: new Date().toISOString(),
    updateDate: null,
    publisherId: 'teamkpn-redactie',
    feeds,
    targeting: { channels, doelgroepen: [], feeds, orgWide: false },
    aiSummary: null,
    importance: 'normaal',
    readTimeMinutes: Math.max(1, Math.round(words / 200)),
    likeCount: 0,
    views: 0,
    tags: [],
    content,
  }
}

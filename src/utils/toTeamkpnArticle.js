/**
 * toTeamkpnArticle — converts what this editor holds (setup + blocks + publishing targeting) into ONE article
 * in the TEAMKPN prototype's format (`src/data/articles.json` there: title, introText, coverImage, feeds,
 * targeting, content blocks…), so the prototype's real article page can render it (see TeamkpnPreview).
 *
 * Block mapping (editor → TEAMKPN):
 *   header → heading (h2) · paragraph → paragraph · citation → quote · image → image · carousel → one image
 *   per slide · table → paragraph (an HTML table) · video / audio → paragraph with a player · attachment →
 *   paragraph with a link · text-graphic (Tekstbanner) → callout · double-column → its two halves in order.
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
      return (content.images || []).filter((i) => i.image).map((i) => ({ type: 'image', src: i.image, caption: i.caption || '' }))
    case 'table': {
      const rows = content.data || []
      if (!rows.length) return []
      const html = rows
        .map((row, r) => `<tr>${row.map((cell, c) => {
          const th = (content.hasColumnHeader && r === 0) || (content.hasRowHeader && c === 0)
          return th ? `<th>${cell || ''}</th>` : `<td>${cell || ''}</td>`
        }).join('')}</tr>`)
        .join('')
      return [{ type: 'paragraph', html: `<table>${html}</table>` }]
    }
    case 'video':
      return content.video
        ? [{ type: 'paragraph', html: `<video controls src="${esc(content.video)}" style="width:100%;border-radius:16px"></video>${content.caption ? `<p>${esc(content.caption)}</p>` : ''}` }]
        : []
    case 'audio':
      return content.audio
        ? [{ type: 'paragraph', html: `${content.title ? `<p><strong>${esc(content.title)}</strong></p>` : ''}<audio controls src="${esc(content.audio)}" style="width:100%"></audio>` }]
        : []
    case 'attachment':
      return content.attachment
        ? [{ type: 'paragraph', html: `<p>Bijlage: <a href="${esc(content.attachment)}" target="_blank" rel="noopener">${esc(content.fileName || content.originalFileName || 'bestand')}</a>${content.fileSize ? ` (${esc(content.fileSize)})` : ''}</p>` }]
        : []
    case 'text-graphic':
      return content.text ? [{ type: 'callout', variant: 'info', html: `<p><strong>${esc(content.text)}</strong></p>` }] : []
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

/* ---- Blob URLs (uploads) only work inside THIS page; the preview iframe runs elsewhere, so they are
   inlined as data URLs before sending. Cached per blob URL. ---- */
const dataUrlCache = new Map()
async function toDataUrl(url) {
  if (dataUrlCache.has(url)) return dataUrlCache.get(url)
  const p = fetch(url)
    .then((r) => r.blob())
    .then((blob) => new Promise((resolve) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.onerror = () => resolve(url)
      fr.readAsDataURL(blob)
    }))
    .catch(() => url)
  dataUrlCache.set(url, p)
  return p
}

/** Deep-copies `value`, replacing every blob: URL (also inside html strings) by a data URL. */
export async function inlineBlobUrls(value) {
  if (typeof value === 'string') {
    const blobs = value.match(/blob:[^"'\s)]+/g)
    if (!blobs) return value
    let out = value
    for (const b of blobs) out = out.split(b).join(await toDataUrl(b))
    return out
  }
  if (Array.isArray(value)) return Promise.all(value.map(inlineBlobUrls))
  if (value && typeof value === 'object') {
    const entries = await Promise.all(Object.entries(value).map(async ([k, v]) => [k, await inlineBlobUrls(v)]))
    return Object.fromEntries(entries)
  }
  return value
}

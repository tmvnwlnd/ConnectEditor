/**
 * docxImport — turns a Word document (.docx) into editor blocks, with rules only (no AI).
 *
 * Two stages, so the second can later move to the Java backend unchanged in spirit:
 *  1. mammoth reads the .docx into SEMANTIC html (headings, paragraphs, lists, tables, images, links; visual
 *     formatting dropped). `STYLE_MAP` teaches it the Dutch and English Word style names.
 *  2. `htmlToBlocks` walks that html and applies the rules below to decide what each part becomes.
 *
 * Rules, in order:
 *  - Title: the document's first h1 (Word "Titel"/"Kop 1") becomes the article TITLE, and the paragraph right after
 *    it the INTRODUCTION — only when they're short enough to be one (`TITLE_MAX`, `INTRO_MAX`).
 *  - Headings: h1/h2 → Kop (h2), h3–h6 → Kop (h3).
 *  - Fake headings: a short paragraph that is entirely bold and doesn't end like a sentence (a question is fine) → Kop. When the
 *    document also has real headings, fake ones are a level lower (h3).
 *  - FAQ: two or more question → answer pairs in a row (a short line ending in "?" followed by its answer
 *    paragraphs) → one FAQ block. A heading right before it that mentions vragen/FAQ becomes the FAQ title.
 *  - Quotes: a Word quote style, or a paragraph wholly between quotation marks → Citaat; a following short line
 *    starting with a dash ("— Naam, functie") becomes the person.
 *  - Cover: the document's FIRST image becomes the article's cover image (not a block).
 *  - Images: every other image → Afbeelding (alt text kept). A short line right after it that is italic, or starts with
 *    "Foto"/"Afbeelding"/"Bron"/"Beeld", becomes its caption.
 *  - Tables: → Tabel (cell text); a bold or <th> first row → column header. A 1×1 table (a "box" around text)
 *    becomes plain text instead.
 *  - Dropped: a typed table of contents ("Inhoudsopgave" + "Inleiding <tab> 3" lines), separator lines (-----, ____, ***).
 *  - Hard line breaks (documents converted from PDF): a paragraph that stops mid-sentence and is followed by one
 *    starting in lower case is joined to it.
 *  - Lists: a bullet that only holds a nested list (odd Word numbering) is flattened.
 *  - Paragraphs: every Word paragraph (a full Enter) is its own Alinea block; a line break (Shift+Enter) stays inside
 *    it. A list is its own block too, unless the paragraph before it ends in ":" — then it joins that paragraph.
 *    Only the formatting the Alinea editor supports survives: bold, italic, underline, strikethrough, links, lists.
 */
import mammoth from 'mammoth/mammoth.browser.js'

export const STYLE_MAP = [
  "p[style-name='Title'] => h1:fresh",
  "p[style-name='Titel'] => h1:fresh",
  "p[style-name='Subtitle'] => h2:fresh",
  "p[style-name='Ondertitel'] => h2:fresh",
  "p[style-name='Kop 1'] => h1:fresh",
  "p[style-name='Kop 2'] => h2:fresh",
  "p[style-name='Kop 3'] => h3:fresh",
  "p[style-name='Kop 4'] => h4:fresh",
  "p[style-name='Quote'] => blockquote > p:fresh",
  "p[style-name='Citaat'] => blockquote > p:fresh",
  "p[style-name='Intense Quote'] => blockquote > p:fresh",
  "p[style-name='Duidelijk citaat'] => blockquote > p:fresh",
  // Word's generated table of contents: dropped (the article page builds its own).
  "p[style-name='toc 1'] => !",
  "p[style-name='toc 2'] => !",
  "p[style-name='toc 3'] => !",
  "p[style-name='Inhopg 1'] => !",
  "p[style-name='Inhopg 2'] => !",
  "p[style-name='Inhopg 3'] => !",
  "u => u",
  "strike => s",
]

const TITLE_MAX = 150
const INTRO_MAX = 500
const FAKE_HEADING_MAX = 120
const QUESTION_MAX = 200
const CAPTION_MAX = 200
const ALLOWED_INLINE = new Set(['STRONG', 'B', 'EM', 'I', 'U', 'S', 'DEL', 'A', 'BR'])

const text = (el) => (el?.textContent || '').replace(/\s+/g, ' ').trim()
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Inline html the Alinea editor understands; everything else is unwrapped to its text.
function cleanInline(node) {
  let out = ''
  node.childNodes.forEach((n) => {
    if (n.nodeType === 3) out += esc(n.textContent)
    else if (n.nodeType === 1) {
      const inner = cleanInline(n)
      if (!ALLOWED_INLINE.has(n.tagName)) out += inner
      else if (n.tagName === 'BR') out += '<br>'
      else if (n.tagName === 'A') {
        const href = n.getAttribute('href') || ''
        // Word's internal bookmarks (#_Toc…) mean nothing in the article.
        out += href && !href.startsWith('#') ? `<a href="${esc(href)}">${inner}</a>` : inner
      } else {
        const tag = { B: 'strong', I: 'em', DEL: 's' }[n.tagName] || n.tagName.toLowerCase()
        out += `<${tag}>${inner}</${tag}>`
      }
    }
  })
  return out
}

function cleanList(list) {
  const tag = list.tagName.toLowerCase()
  const items = [...list.children].filter((li) => li.tagName === 'LI').map((li) => {
    // A bullet without text of its own that only wraps a nested list → that list's items, one level up.
    const only = li.children.length === 1 && /^(UL|OL)$/.test(li.children[0].tagName) && !text(li).replace(text(li.children[0]), '').trim()
    if (only) return cleanList(li.children[0]).replace(/^<(ul|ol)>|<\/(ul|ol)>$/g, '')
    const nested = [...li.children].filter((c) => c.tagName === 'UL' || c.tagName === 'OL')
    nested.forEach((c) => c.remove())
    return `<li>${cleanInline(li)}${nested.map(cleanList).join('')}</li>`
  })
  return `<${tag}>${items.join('')}</${tag}>`
}

// The paragraph is ONLY bold text (a bold "heading" typed by hand).
const isAllBold = (p) => {
  const all = text(p)
  if (!all) return false
  const bold = [...p.querySelectorAll('strong, b')].map(text).join(' ').replace(/\s+/g, ' ').trim()
  return bold.length >= all.length - 1
}
const isAllItalic = (p) => {
  const all = text(p)
  const it = [...p.querySelectorAll('em, i')].map(text).join(' ').replace(/\s+/g, ' ').trim()
  return all && it.length >= all.length - 1
}
const onlyImage = (p) => p.querySelector('img') && !text(p)

function isFakeHeading(p) {
  const t = text(p)
  // (A bold question counts too — "Wat verandert er?" — unless it's part of an FAQ run, which is checked first.)
  return t.length > 0 && t.length <= FAKE_HEADING_MAX && isAllBold(p) && !/[.,;:]$/.test(t)
}
const isQuestion = (p) => {
  const t = text(p)
  return t.length > 0 && t.length <= QUESTION_MAX && t.endsWith('?')
}
const QUOTE_PAIRS = [['"', '"'], ['“', '”'], ['„', '”'], ['„', '“'], ['‘', '’'], ["'", "'"], ['«', '»']]
const quotedText = (t) => {
  const pair = QUOTE_PAIRS.find(([a, b]) => t.length > 2 && t.startsWith(a) && t.endsWith(b))
  return pair ? t.slice(pair[0].length, -pair[1].length).trim() : null
}
const attribution = (p) => {
  const m = text(p).match(/^[—–-]\s*(.{2,80})$/)
  return m ? m[1].trim() : null
}
const isCaption = (p) => {
  const t = text(p)
  return t.length > 0 && t.length <= CAPTION_MAX && (isAllItalic(p) || /^(foto|afbeelding|beeld|bron)\b/i.test(t))
}

let nextId = 0
const block = (type, content) => ({ id: Date.now() + nextId++, type, content })

/**
 * html (mammoth output) → { title, introduction, coverImage, blocks }
 */
export function htmlToBlocks(html) {
  const doc = new DOMParser().parseFromString(`<!doctype html><html><body>${html}</body></html>`, 'text/html')
  const all = [...doc.body.children].filter((n) => !(n.tagName === 'P' && !text(n) && !n.querySelector('img')))
  const nodes = []
  for (let k = 0; k < all.length; k++) {
    const n = all[k]
    const t = text(n)
    if (n.tagName === 'P') {
      if (/^[-_*=~.·•\s]{3,}$/.test(t)) continue // separator line
      if (/^(inhoudsopgave|inhoud|table of contents|contents)$/i.test(t)) {
        while (all[k + 1]?.tagName === 'P' && /\s\d{1,3}$/.test(text(all[k + 1])) && /\t/.test(all[k + 1].textContent)) k += 1
        continue
      }
      // Hard line break mid-sentence: glue the next paragraph on.
      const prev = nodes[nodes.length - 1]
      if (prev?.tagName === 'P' && !onlyImage(prev) && !onlyImage(n) && !isFakeHeading(prev)
        && /[\p{L}\d,-]$/u.test(text(prev)) && /^\p{Ll}/u.test(t)) {
        prev.append(doc.createTextNode(' '), ...n.childNodes)
        continue
      }
    }
    nodes.push(n)
  }
  const hasRealHeadings = nodes.some((n) => /^H[2-6]$/.test(n.tagName))

  let title = ''
  let introduction = ''
  let i = 0
  // Title (+ intro): the very first node, when it's a h1 of title length.
  if (nodes[0]?.tagName === 'H1' && text(nodes[0]).length <= TITLE_MAX) {
    title = text(nodes[0])
    i = 1
    const next = nodes[1]
    if (next?.tagName === 'P' && !onlyImage(next) && !isFakeHeading(next) && text(next).length <= INTRO_MAX) {
      introduction = text(next)
      i = 2
    }
  }

  const blocks = []
  let paragraphHtml = []
  const flushParagraph = () => {
    if (paragraphHtml.length) blocks.push(block('paragraph', paragraphHtml.join('')))
    paragraphHtml = []
  }
  const pushHeading = (t, level) => {
    flushParagraph()
    blocks.push(block('header', `<h${level}>${esc(t)}</h${level}>`))
  }

  while (i < nodes.length) {
    const n = nodes[i]
    const tag = n.tagName

    // FAQ: ≥ 2 question → answer pairs in a row.
    if (tag === 'P' && isQuestion(n)) {
      const items = []
      let j = i
      while (j < nodes.length && nodes[j].tagName === 'P' && isQuestion(nodes[j])) {
        const answer = []
        let k = j + 1
        while (k < nodes.length && nodes[k].tagName === 'P' && !isQuestion(nodes[k]) && !isFakeHeading(nodes[k]) && !onlyImage(nodes[k])) {
          answer.push(text(nodes[k]))
          k += 1
        }
        if (!answer.length) break
        items.push({ id: Date.now() + nextId++, question: text(nodes[j]), answer: answer.join('\n\n') })
        j = k
      }
      if (items.length >= 2) {
        flushParagraph()
        // A heading just before it that's about questions becomes the FAQ's own title.
        let faqTitle = ''
        const prev = blocks[blocks.length - 1]
        if (prev?.type === 'header' && /vragen|faq|q\s*&\s*a/i.test(prev.content)) {
          faqTitle = prev.content.replace(/<[^>]+>/g, '')
          blocks.pop()
        }
        blocks.push(block('faq', { title: faqTitle, items }))
        i = j
        continue
      }
    }

    if (/^H[1-6]$/.test(tag)) {
      if (text(n)) pushHeading(text(n), Number(tag[1]) <= 2 ? 2 : 3)
    } else if (tag === 'BLOCKQUOTE') {
      flushParagraph()
      const quote = text(n)
      const person = nodes[i + 1]?.tagName === 'P' ? attribution(nodes[i + 1]) : null
      blocks.push(block('citation', { quote: quotedText(quote) ?? quote, person: person || '' }))
      if (person) i += 1
    } else if (tag === 'TABLE') {
      const rows = [...n.querySelectorAll('tr')].map((tr) => [...tr.children].map((td) => text(td)))
      const columns = Math.max(0, ...rows.map((r) => r.length))
      if (rows.length === 1 && columns === 1) {
        // A one-cell table is a box drawn around text: keep the text.
        const cell = n.querySelector('td, th')
        ;[...cell.children].forEach((c) => {
          paragraphHtml.push(c.tagName === 'UL' || c.tagName === 'OL' ? cleanList(c) : `<p>${cleanInline(c)}</p>`)
          flushParagraph()
        })
      } else if (rows.length) {
        flushParagraph()
        const firstRow = n.querySelector('tr')
        const hasColumnHeader = !!firstRow?.querySelector('th') || [...(firstRow?.children || [])].every((c) => !text(c) || isAllBold(c))
        blocks.push(block('table', {
          rows: rows.length,
          columns,
          data: rows.map((r) => [...r, ...Array(columns - r.length).fill('')]),
          hasColumnHeader,
          hasRowHeader: false,
        }))
      }
    } else if (tag === 'UL' || tag === 'OL') {
      // A list sticks to the paragraph that introduces it ("…de volgende onderdelen:").
      if (!paragraphHtml.length && blocks[blocks.length - 1]?.type === 'paragraph' && /:\s*<\/p>$/.test(blocks[blocks.length - 1].content)) {
        blocks[blocks.length - 1].content += cleanList(n)
      } else {
        paragraphHtml.push(cleanList(n))
        flushParagraph()
      }
    } else if (tag === 'P') {
      if (onlyImage(n)) {
        flushParagraph()
        const imgs = [...n.querySelectorAll('img')]
        const next = nodes[i + 1]
        const caption = imgs.length === 1 && next?.tagName === 'P' && isCaption(next) ? text(next) : ''
        imgs.forEach((img) => blocks.push(block('image', { image: img.getAttribute('src'), altText: img.getAttribute('alt') || '', caption })))
        if (caption) i += 1
      } else if (isFakeHeading(n)) {
        pushHeading(text(n), hasRealHeadings ? 3 : 2)
      } else if (quotedText(text(n)) && text(n).length > 20) {
        flushParagraph()
        const person = nodes[i + 1]?.tagName === 'P' ? attribution(nodes[i + 1]) : null
        blocks.push(block('citation', { quote: quotedText(text(n)), person: person || '' }))
        if (person) i += 1
      } else {
        // Images inside a text paragraph: text stays here, the images follow as their own blocks.
        const imgs = [...n.querySelectorAll('img')]
        imgs.forEach((img) => img.remove())
        if (text(n)) {
          paragraphHtml.push(`<p>${cleanInline(n)}</p>`)
          flushParagraph()
        }
        if (imgs.length) {
          flushParagraph()
          imgs.forEach((img) => blocks.push(block('image', { image: img.getAttribute('src'), altText: img.getAttribute('alt') || '', caption: '' })))
        }
      }
    }
    i += 1
  }
  flushParagraph()
  // The first image is the cover.
  const coverIndex = blocks.findIndex((b) => b.type === 'image')
  const coverImage = coverIndex >= 0 ? blocks.splice(coverIndex, 1)[0].content.image : null
  return { title, introduction, coverImage, blocks }
}

/**
 * File → { title, introduction, coverImage, blocks, warnings }. Images become object URLs (PROTOTYPE: nothing is uploaded;
 * the real app would upload them to the media store here).
 */
export async function importDocx(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: STYLE_MAP,
      convertImage: mammoth.images.imgElement(async (image) => {
        const buffer = await image.read()
        return { src: URL.createObjectURL(new Blob([buffer], { type: image.contentType })) }
      }),
    },
  )
  return { ...htmlToBlocks(result.value), warnings: result.messages.map((m) => m.message) }
}

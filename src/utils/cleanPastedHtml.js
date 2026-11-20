/**
 * Clean pasted HTML down to the formatting our text fields support.
 *
 * Used for EVERY paste into a Trumbowyg field — from our own fields, Word, Google Docs, websites, mail:
 * - kept: bold, italic, underline, strikethrough, links (href only); in text fields also paragraphs and lists
 * - Kop fields (`inline: true`) keep only the inline styles; paragraphs/list items become line breaks
 * - styling done with CSS (Google Docs, some sites: <span style="font-weight:700">) becomes the matching tag
 * - everything else (classes, colours, fonts, sizes, Word's <o:p>, comments, scripts…) is dropped
 */

const INLINE = ['STRONG', 'B', 'EM', 'I', 'U', 'DEL', 'S', 'STRIKE', 'A', 'BR']
const BLOCK = ['P', 'UL', 'OL', 'LI']
const DROP = ['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE', 'HEAD', 'IMG', 'SVG', 'IFRAME', 'OBJECT']
// Block-ish tags that become a paragraph in text fields
const AS_PARAGRAPH = /^(DIV|H[1-6]|BLOCKQUOTE|PRE|TR)$/

/** Turn CSS-based styling into tags, so it survives the attribute strip below. */
function styleToTags(el) {
  const s = el.style
  if (!s) return el
  let node = el
  const wrap = (tag) => {
    const w = document.createElement(tag)
    w.append(...node.childNodes)
    node.append(w)
  }
  const weight = s.fontWeight
  const isBoldTag = el.tagName === 'B' || el.tagName === 'STRONG'
  // Google Docs wraps the whole paste in <b style="font-weight:normal">: that's NOT bold.
  if (isBoldTag && (weight === 'normal' || weight === '400')) {
    const span = document.createElement('span')
    span.append(...el.childNodes)
    el.replaceWith(span)
    node = span
  }
  if (!isBoldTag && (weight === 'bold' || parseInt(weight, 10) >= 600)) wrap('strong')
  if (s.fontStyle === 'italic' && !/^(I|EM)$/.test(el.tagName)) wrap('em')
  const deco = `${s.textDecoration} ${s.textDecorationLine}`
  if (deco.includes('underline') && el.tagName !== 'U' && el.tagName !== 'A') wrap('u')
  if (deco.includes('line-through') && !/^(DEL|S|STRIKE)$/.test(el.tagName)) wrap('del')
  return node
}

export function cleanPastedHtml(html, { inline = false } = {}) {
  const allowed = inline ? INLINE : [...INLINE, ...BLOCK]
  const root = document.createElement('div')
  root.innerHTML = html

  const walk = (parent) => {
    for (let child of [...parent.childNodes]) {
      if (child.nodeType === 3) continue // text
      if (child.nodeType !== 1 || DROP.includes(child.tagName)) { child.remove(); continue } // comments etc.

      child = styleToTags(child)
      walk(child)

      let tag = child.tagName
      if (!inline && AS_PARAGRAPH.test(tag)) {
        const p = document.createElement('p')
        p.append(...child.childNodes)
        child.replaceWith(p)
        child = p
        tag = 'P'
      }

      if (!allowed.includes(tag)) {
        // Unwrap; in a Kop, a block that ends keeps a line break
        const isBlock = /^(P|DIV|LI|UL|OL|H[1-6]|BLOCKQUOTE|TR)$/.test(tag)
        const tail = inline && isBlock && child.nextSibling ? [document.createElement('br')] : []
        child.replaceWith(...child.childNodes, ...tail)
        continue
      }

      for (const attr of [...child.attributes]) {
        if (!(tag === 'A' && attr.name === 'href')) child.removeAttribute(attr.name)
      }
    }
  }
  walk(root)

  // Drop empty paragraphs Word/Docs leave behind
  root.querySelectorAll('p').forEach((p) => { if (!p.textContent.trim() && !p.querySelector('br')) p.remove() })
  return root.innerHTML
}

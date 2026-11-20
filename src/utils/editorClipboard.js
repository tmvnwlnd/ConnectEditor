/**
 * Copy/paste BETWEEN our text editors keeps its formatting.
 *
 * The Trumbowyg editors use removeformatPasted, which strips all styling from every paste — good for text from Word
 * or websites, but it also stripped bold/italic/links/lists copied from one of our own fields. So:
 * - copy/cut inside a .trumbowyg-editor marks the clipboard with EDITOR_TYPE (plus normal text/html + text/plain),
 *   and also remembers the copied html in memory: not every browser hands custom clipboard types back on a real
 *   paste (Safari), so a paste whose plain text equals the last copy counts as ours too;
 * - a paste into a .trumbowyg-editor that carries that mark is inserted with its formatting, cleaned to the tags the
 *   editors support (inline only in a Kop field). Any other paste goes to Trumbowyg as before (formatting removed).
 *
 * installEditorClipboard() is called once from main.jsx.
 */

const EDITOR_TYPE = 'application/x-article-editor'
const INLINE = ['B', 'STRONG', 'I', 'EM', 'U', 'DEL', 'S', 'STRIKE', 'A', 'BR']
const BLOCK = ['P', 'UL', 'OL', 'LI']

const editorOf = (node) => (node?.nodeType === 1 ? node : node?.parentElement)?.closest?.('.trumbowyg-editor')

const selectionHtml = (sel) => {
  const div = document.createElement('div')
  for (let i = 0; i < sel.rangeCount; i++) div.appendChild(sel.getRangeAt(i).cloneContents())
  return div.innerHTML
}

/** Keep only supported tags (unwrap the rest); links keep only href. */
function clean(html, allowed) {
  const root = document.createElement('div')
  root.innerHTML = html
  const walk = (el) => {
    for (const child of [...el.childNodes]) {
      if (child.nodeType === 3) continue
      if (child.nodeType !== 1) { child.remove(); continue }
      walk(child)
      if (!allowed.includes(child.tagName)) {
        // unwrap; keep a line break between unwrapped blocks
        const isBlock = /^(P|DIV|LI|H[1-6]|BLOCKQUOTE)$/.test(child.tagName)
        child.replaceWith(...child.childNodes, ...(isBlock && child.nextSibling ? [document.createElement('br')] : []))
        continue
      }
      for (const attr of [...child.attributes]) {
        if (!(child.tagName === 'A' && attr.name === 'href')) child.removeAttribute(attr.name)
      }
    }
  }
  walk(root)
  return root.innerHTML
}

// Last copy from one of our editors (fallback when the browser drops EDITOR_TYPE)
let lastCopy = null
const norm = (t) => (t || '').replace(/\s+/g, ' ').trim()

function onCopy(e) {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed || !editorOf(sel.anchorNode) || !e.clipboardData) return
  const html = selectionHtml(sel)
  lastCopy = { html, text: norm(sel.toString()) }
  e.clipboardData.setData('text/html', html)
  e.clipboardData.setData('text/plain', sel.toString())
  e.clipboardData.setData(EDITOR_TYPE, '1')
  e.preventDefault()
  if (e.type === 'cut') document.execCommand('delete')
}

function onPaste(e) {
  const editor = editorOf(e.target)
  const data = e.clipboardData
  if (!editor || !data) return
  const marked = data.types.includes(EDITOR_TYPE)
  const remembered = !marked && lastCopy && lastCopy.text && norm(data.getData('text/plain')) === lastCopy.text
  if (!marked && !remembered) return // not ours → Trumbowyg strips formatting as before
  e.preventDefault()
  e.stopImmediatePropagation()
  const inKop = !!editor.closest('.header-content-editor')
  const source = marked ? data.getData('text/html') || lastCopy?.html || '' : lastCopy.html
  const html = clean(source, inKop ? INLINE : [...INLINE, ...BLOCK])
  document.execCommand('insertHTML', false, html)
  // Trumbowyg saves on keyup; a menu paste has none, so nudge it (it then fires tbwchange → onChange).
  editor.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }))
}

let installed = false
export function installEditorClipboard() {
  if (installed) return
  installed = true
  document.addEventListener('copy', onCopy, true)
  document.addEventListener('cut', onCopy, true)
  document.addEventListener('paste', onPaste, true)
}

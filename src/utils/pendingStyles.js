/**
 * Toolbar state for styles that are "armed" but not yet in the text.
 *
 * With nothing selected, clicking Vet/Cursief/… makes the browser type the NEXT characters in that style, but there
 * is no <strong> in the DOM yet. Trumbowyg derives its active buttons only from the DOM around the caret, so the button
 * stayed off. This asks the browser (document.queryCommandState) and marks those buttons with `persistent-active`
 * (styled like `trumbowyg-active` in Trumbowyg.css). Once you type, the DOM has the tag and Trumbowyg takes over.
 *
 * installPendingStyles() is called once from main.jsx.
 */

const COMMANDS = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  del: 'strikeThrough',
  strikethrough: 'strikeThrough'
}

function update() {
  const sel = window.getSelection()
  const node = sel?.anchorNode
  const el = node?.nodeType === 1 ? node : node?.parentElement
  const box = el?.closest?.('.trumbowyg-box')
  // Clear everywhere first (only one editor has the caret)
  document.querySelectorAll('.trumbowyg-button-pane .persistent-active').forEach((b) => b.classList.remove('persistent-active'))
  if (!box || !el.closest('.trumbowyg-editor')) return
  for (const [btn, cmd] of Object.entries(COMMANDS)) {
    const button = box.querySelector(`.trumbowyg-${btn}-button`)
    if (!button) continue
    let on = false
    try { on = document.queryCommandState(cmd) } catch { /* unsupported */ }
    button.classList.toggle('persistent-active', on)
  }
}

// After Trumbowyg's own handlers (which reset the buttons from the DOM) have run
const later = () => setTimeout(update, 0)

let installed = false
export function installPendingStyles() {
  if (installed) return
  installed = true
  document.addEventListener('selectionchange', later)
  document.addEventListener('keyup', later, true)
  document.addEventListener('mouseup', later, true)
  // Toolbar clicks don't move the caret, so selectionchange doesn't fire for them
  document.addEventListener('click', (e) => { if (e.target.closest?.('.trumbowyg-button-pane')) later() }, true)
}

import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import tippy from 'tippy.js'
import { useToolbarFlip } from '../../hooks/useToolbarFlip'
import { cleanPastedHtml } from '../../utils/cleanPastedHtml'
import '../../styles/ContentEditor.css'

const NS = '.rte' // our jQuery event namespace, so cleanup removes exactly our handlers

/**
 * RichTextEditor — the ONE Trumbowyg wrapper. Kop, Alinea and Citaat configure it; nothing else talks to Trumbowyg.
 *
 * Handles: setup in Dutch, KPN tooltips (tippy), placeholder (sized like the field's heading), floating toolbar
 * state (`editing` / `toolbar-below` classes), paste cleaning (cleanPastedHtml), content sync both ways, and a full
 * cleanup (Trumbowyg, our event handlers, tooltips) — React StrictMode mounts every effect twice in development.
 *
 * @param {string} value - HTML
 * @param {Function} onChange - (html) => void
 * @param {Array} buttons - Trumbowyg `btns`
 * @param {object} buttonDefs - Trumbowyg `btnsDef` (custom buttons)
 * @param {string} placeholder
 * @param {string} className - The editor's style hook: 'header-content-editor' | 'paragraph-content-editor' | 'citation-content-editor'
 * @param {Function} prepare - html → html before it goes into the field (e.g. old <h1> → <h2>)
 * @param {string} emptyHtml - What an empty field holds (a Kop keeps an empty <h2> so the caret types a heading)
 * @param {boolean} inline - Paste keeps inline styling only (Kop)
 */
const RichTextEditor = ({
  value,
  onChange,
  buttons,
  buttonDefs,
  placeholder = 'Start met schrijven…',
  className,
  prepare = (html) => html,
  emptyHtml = '',
  inline = false
}) => {
  const textareaRef = useRef(null)
  const editorRef = useRef(null) // the jQuery-wrapped textarea once Trumbowyg runs
  const lastEmitted = useRef(value) // what this field last sent out — anything else in `value` came from outside
  // Handlers are bound once; read the latest props through refs (a stale onChange wrote to the wrong column after a swap)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const prepareRef = useRef(prepare)
  prepareRef.current = prepare

  const [isEditing, setIsEditing] = useState(false)
  const rootRef = useRef(null)
  const toolbarBelow = useToolbarFlip(rootRef, isEditing)

  useEffect(() => {
    const $editor = $(textareaRef.current)
    $editor.trumbowyg({
      lang: 'nl',
      btns: buttons,
      btnsDef: buttonDefs,
      semantic: false,
      removeformatPasted: false, // we clean pastes ourselves (keeps basic formatting)
      autogrow: true
    })
    editorRef.current = $editor
    const t = $editor.data('trumbowyg')
    const $ed = t.$ed
    const box = t.$box[0]

    // Content
    $editor.trumbowyg('html', value ? prepareRef.current(value) : emptyHtml)

    // Placeholder: shown while the field has no text; takes the size of the field's (empty) heading
    $ed.attr('data-placeholder', placeholder)
    const updatePlaceholder = () => {
      const empty = $ed.text().trim() === ''
      $ed.toggleClass('is-empty', empty)
      const heading = empty && $ed.children().first().prop('tagName')
      if (heading && /^H[1-4]$/.test(heading)) $ed.attr('data-heading-type', heading.toLowerCase())
      else $ed.removeAttr('data-heading-type')
    }
    updatePlaceholder()

    const emit = () => {
      t.syncTextarea() // the getter reads Trumbowyg's hidden textarea, which only it syncs on its own events
      const html = $editor.trumbowyg('html')
      lastEmitted.current = html
      onChangeRef.current?.(html)
    }

    $editor.on(`tbwchange${NS}`, () => { updatePlaceholder(); emit() })
    $editor.on(`tbwfocus${NS}`, () => { updatePlaceholder(); setIsEditing(true) })
    $editor.on(`tbwblur${NS}`, () => { updatePlaceholder(); setIsEditing(false) })
    $ed.on(`input${NS} keyup${NS}`, updatePlaceholder)

    // Paste: clean it to our formatting and insert it ourselves. Capture on the box so we run before Trumbowyg.
    const onPaste = (e) => {
      const html = e.clipboardData?.getData('text/html')
      if (!html) return // plain text: let the browser/Trumbowyg insert it
      e.preventDefault()
      e.stopImmediatePropagation()
      document.execCommand('insertHTML', false, cleanPastedHtml(html, { inline }))
      updatePlaceholder()
      emit()
    }
    box.addEventListener('paste', onPaste, true)

    // Tooltips in the KPN style instead of the native title
    const buttonEls = t.$btnPane.find('button[title]').toArray()
    buttonEls.forEach((b) => {
      const label = b.getAttribute('title')
      b.dataset.tooltip = label
      b.removeAttribute('title') // no native tooltip on top of tippy's
    })
    const tips = tippy(buttonEls, {
      content: (b) => b.dataset.tooltip,
      arrow: true,
      theme: 'translucent',
      animation: 'fade',
      placement: 'top'
    })
    // The button's name for screen readers (set after tippy, which manages aria on its references)
    buttonEls.forEach((b) => b.setAttribute('aria-label', b.dataset.tooltip))

    return () => {
      tips.forEach((tip) => tip.destroy())
      box.removeEventListener('paste', onPaste, true)
      $ed.off(NS)
      $editor.off(NS)
      if ($editor.data('trumbowyg')) $editor.trumbowyg('destroy')
      editorRef.current = null
    }
    // Set up once; props are read through refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A change from outside (Word import, swap, undo, AI suggestion…) replaces the field's content,
  // also while it has focus. Our own edits come back as `value === lastEmitted` and are left alone.
  useEffect(() => {
    const $editor = editorRef.current
    if (!$editor || value === undefined || value === lastEmitted.current) return
    const next = value ? prepareRef.current(value) : emptyHtml
    if ($editor.trumbowyg('html') !== next) $editor.trumbowyg('html', next)
    lastEmitted.current = value
  }, [value, emptyHtml])

  return (
    <div
      ref={rootRef}
      className={`${className} ${isEditing ? 'editing' : ''} ${toolbarBelow ? 'toolbar-below' : ''}`.trim()}
    >
      <textarea ref={textareaRef} />
    </div>
  )
}

export default RichTextEditor

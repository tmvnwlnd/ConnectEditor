import { useEffect, useRef, useState } from 'react'
import { useToolbarFlip } from '../../hooks/useToolbarFlip'
import $ from 'jquery'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import '../../styles/ContentEditor.css'

/**
 * HeaderContent Component
 *
 * Pure Trumbowyg editor for header elements.
 * Returns only the Trumbowyg editor (no wrapper, no border).
 * ElementWrapper handles all chrome (border, title, positioning buttons).
 */
const toH2 = (html) => html.replace(/<(\/?)h1(\s|>)/g, '<$1h2$2')

const HeaderContent = ({ content, onChange, isFocused, placeholder = 'Start met schrijven…' }) => {
  // The editor's change handler is bound once at mount: read the LATEST onChange through a ref
  // (a stale one wrote to the wrong column after a swap).
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const editorRef = useRef(null)
  const trumbowygInstance = useRef(null)
  const [isEditing, setIsEditing] = useState(false)
  // Floating toolbar: above the field, or below it when there's no room at the top of the canvas.
  const toolbarRootRef = useRef(null)
  const toolbarBelow = useToolbarFlip(toolbarRootRef, isEditing)

  useEffect(() => {
    const $editor = $(editorRef.current)

    // Custom button definitions for H2, H3 and H4 — the heading sizes a TEAMKPN article has (32 / 22 / 18px)
    const buttonDefinitions = {
      h2: {
        fn: 'formatBlock',
        param: 'h2',
        title: 'Kop 2',
        text: 'H2',
        ico: 'h2',
        class: 'h2-button',
        tag: 'h2'
      },
      h3: {
        fn: 'formatBlock',
        param: 'h3',
        title: 'Kop 3',
        text: 'H3',
        ico: 'h3',
        class: 'h3-button',
        tag: 'h3'
      },
      h4: {
        fn: 'formatBlock',
        param: 'h4',
        title: 'Kop 4',
        text: 'H4',
        ico: 'h4',
        class: 'h4-button',
        tag: 'h4'
      }
    }

    // Initialize Trumbowyg
    $editor.trumbowyg({
      lang: 'nl',
      btns: [
        ['h2', 'h3', 'h4'],
        ['link']
      ],
      btnsDef: buttonDefinitions,
      semantic: false,
      removeformatPasted: true,
      autogrow: true,
    })

    trumbowygInstance.current = $editor

    // Initialize Tippy tooltips for toolbar buttons
    setTimeout(() => {
      const buttons = $editor.parent().find('.trumbowyg-button-pane button[title]').toArray()
      tippy(buttons, {
        content: (reference) => reference.getAttribute('title'),
        arrow: true,
        theme: 'translucent',
        animation: 'fade',
        placement: 'top',
        onShow(instance) {
          // Remove title to prevent native tooltip
          instance.reference.setAttribute('data-original-title', instance.reference.getAttribute('title'))
          instance.reference.removeAttribute('title')
        },
        onHidden(instance) {
          // Restore title for next show
          if (instance.reference.hasAttribute('data-original-title')) {
            instance.reference.setAttribute('title', instance.reference.getAttribute('data-original-title'))
          }
        }
      })
    }, 0)

    // Set placeholder
    const trumbowygData = $editor.data('trumbowyg')
    if (trumbowygData && trumbowygData.$ed) {
      trumbowygData.$ed.attr('data-placeholder', placeholder)

      // Placeholder management
      const updatePlaceholder = () => {
        const text = trumbowygData.$ed.text().trim()
        const html = trumbowygData.$ed.html()

        if (text === '') {
          trumbowygData.$ed.addClass('is-empty')
          if (html.includes('<h2>') || html.includes('<h2 ')) {
            trumbowygData.$ed.attr('data-heading-type', 'h2')
          } else if (html.includes('<h3>') || html.includes('<h3 ')) {
            trumbowygData.$ed.attr('data-heading-type', 'h3')
          } else if (html.includes('<h4>') || html.includes('<h4 ')) {
            trumbowygData.$ed.attr('data-heading-type', 'h4')
          } else {
            trumbowygData.$ed.removeAttr('data-heading-type')
          }
        } else {
          trumbowygData.$ed.removeClass('is-empty')
          trumbowygData.$ed.removeAttr('data-heading-type')
        }
      }

      $editor.on('tbwchange tbwblur tbwfocus', updatePlaceholder)
      trumbowygData.$ed.on('input keydown keyup', updatePlaceholder)
      updatePlaceholder()
    }

    // Set initial content
    // (Older drafts may hold an <h1>: it shows — and publishes — as H2.)
    if (content) {
      $editor.trumbowyg('html', toH2(content))
    } else {
      $editor.trumbowyg('html', '<h2><br></h2>')
    }

    // Handle content changes
    $editor.on('tbwchange', () => {
      if (onChangeRef.current) {
        onChangeRef.current($editor.trumbowyg('html'))
      }
    })

    // Handle focus/blur for toolbar visibility
    $editor.on('tbwfocus', () => {
      setIsEditing(true)
    })

    $editor.on('tbwblur', () => {
      setIsEditing(false)
    })

    // Cleanup
    return () => {
      const data = $editor.data('trumbowyg')
      if (data) {
        $editor.trumbowyg('destroy')
      }
    }
  }, [])

  // Update content externally if it changes
  useEffect(() => {
    if (trumbowygInstance.current && content !== undefined) {
      const currentHtml = trumbowygInstance.current.trumbowyg('html')
      if (currentHtml !== content && !isEditing) {
        trumbowygInstance.current.trumbowyg('html', content ? toH2(content) : '<h2><br></h2>')
      }
    }
  }, [content, isEditing])

  return (
    <div ref={toolbarRootRef} className={`header-content-editor ${isEditing ? 'editing' : ''} ${toolbarBelow ? 'toolbar-below' : ''}`}>
      <textarea ref={editorRef}></textarea>
    </div>
  )
}

export default HeaderContent

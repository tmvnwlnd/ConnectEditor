import { useEffect, useRef, useState } from 'react'
import { useToolbarFlip } from '../../hooks/useToolbarFlip'
import $ from 'jquery'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import { getRandomPlaceholder } from '../../utils/placeholders'
import '../../styles/ContentEditor.css'

/**
 * ParagraphContent Component
 *
 * Pure Trumbowyg editor for paragraph elements.
 * Returns only the Trumbowyg editor (no wrapper, no border).
 * ElementWrapper handles all chrome (border, title, positioning buttons).
 */
const ParagraphContent = ({ content, onChange, isFocused, placeholder: placeholderProp }) => {
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
  const [placeholder] = useState(() => placeholderProp || getRandomPlaceholder('content'))

  useEffect(() => {
    const $editor = $(editorRef.current)

    // Initialize Trumbowyg
    $editor.trumbowyg({
      lang: 'nl',
      btns: [
        ['bold', 'italic', 'underline', 'del'],
        ['removeformat'],
        ['link'],
        ['unorderedList', 'orderedList']
      ],
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
          instance.reference.setAttribute('data-original-title', instance.reference.getAttribute('title'))
          instance.reference.removeAttribute('title')
        },
        onHidden(instance) {
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
        if (text === '') {
          trumbowygData.$ed.addClass('is-empty')
        } else {
          trumbowygData.$ed.removeClass('is-empty')
        }
      }

      $editor.on('tbwchange tbwblur tbwfocus', updatePlaceholder)
      trumbowygData.$ed.on('input keydown keyup', updatePlaceholder)
      updatePlaceholder()
    }

    // Set initial content
    if (content) {
      $editor.trumbowyg('html', content)
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
        trumbowygInstance.current.trumbowyg('html', content || '')
      }
    }
  }, [content, isEditing])

  return (
    <div ref={toolbarRootRef} className={`paragraph-content-editor ${isEditing ? 'editing' : ''} ${toolbarBelow ? 'toolbar-below' : ''}`}>
      <textarea ref={editorRef}></textarea>
    </div>
  )
}

export default ParagraphContent

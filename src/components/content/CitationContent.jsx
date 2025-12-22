import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import tippy from 'tippy.js'

/**
 * CitationContent Component
 *
 * Pure Trumbowyg editor for citation/quote elements.
 * Returns only the Trumbowyg editor (no wrapper, no border).
 * ElementWrapper handles all chrome (border, title, positioning buttons).
 */
const CitationContent = ({ content, onChange, isFocused }) => {
  const editorRef = useRef(null)
  const trumbowygInstance = useRef(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const $editor = $(editorRef.current)

    // Initialize Trumbowyg
    $editor.trumbowyg({
      btns: [
        ['bold', 'italic'],
        ['link']
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
        theme: 'dark',
        duration: [50, 0],
        placement: 'top',
        offset: [0, 8],
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
      trumbowygData.$ed.attr('data-placeholder', 'Start met schrijven…')

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
      if (onChange) {
        onChange($editor.trumbowyg('html'))
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
    <div className={`citation-content-editor ${isEditing ? 'editing' : ''}`}>
      <textarea ref={editorRef}></textarea>
    </div>
  )
}

export default CitationContent

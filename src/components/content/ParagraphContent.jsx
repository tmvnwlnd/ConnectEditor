import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'

/**
 * ParagraphContent Component
 *
 * Pure Trumbowyg editor for paragraph elements.
 * Returns only the Trumbowyg editor (no wrapper, no border).
 * ElementWrapper handles all chrome (border, title, positioning buttons).
 */
const ParagraphContent = ({ content, onChange, isFocused }) => {
  const editorRef = useRef(null)
  const trumbowygInstance = useRef(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const $editor = $(editorRef.current)

    // Initialize Trumbowyg
    $editor.trumbowyg({
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
    <div className={`paragraph-content-editor ${isEditing ? 'editing' : ''}`}>
      <textarea ref={editorRef}></textarea>
    </div>
  )
}

export default ParagraphContent

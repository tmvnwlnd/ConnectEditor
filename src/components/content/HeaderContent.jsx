import { useEffect, useRef, useState } from 'react'
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
const HeaderContent = ({ content, onChange, isFocused }) => {
  const editorRef = useRef(null)
  const trumbowygInstance = useRef(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const $editor = $(editorRef.current)

    // Custom button definitions for H1, H2, H3
    const buttonDefinitions = {
      h1: {
        fn: 'formatBlock',
        param: 'h1',
        title: 'Heading 1',
        text: 'H1',
        ico: 'h1',
        class: 'h1-button',
        tag: 'h1'
      },
      h2: {
        fn: 'formatBlock',
        param: 'h2',
        title: 'Heading 2',
        text: 'H2',
        ico: 'h2',
        class: 'h2-button',
        tag: 'h2'
      },
      h3: {
        fn: 'formatBlock',
        param: 'h3',
        title: 'Heading 3',
        text: 'H3',
        ico: 'h3',
        class: 'h3-button',
        tag: 'h3'
      }
    }

    // Initialize Trumbowyg
    $editor.trumbowyg({
      btns: [
        ['h1', 'h2', 'h3'],
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
      trumbowygData.$ed.attr('data-placeholder', 'Start met schrijven…')

      // Placeholder management
      const updatePlaceholder = () => {
        const text = trumbowygData.$ed.text().trim()
        const html = trumbowygData.$ed.html()

        if (text === '') {
          trumbowygData.$ed.addClass('is-empty')
          if (html.includes('<h1>') || html.includes('<h1 ')) {
            trumbowygData.$ed.attr('data-heading-type', 'h1')
          } else if (html.includes('<h2>') || html.includes('<h2 ')) {
            trumbowygData.$ed.attr('data-heading-type', 'h2')
          } else if (html.includes('<h3>') || html.includes('<h3 ')) {
            trumbowygData.$ed.attr('data-heading-type', 'h3')
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
    if (content) {
      $editor.trumbowyg('html', content)
    } else {
      $editor.trumbowyg('html', '<h1><br></h1>')
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
        trumbowygInstance.current.trumbowyg('html', content || '<h1><br></h1>')
      }
    }
  }, [content, isEditing])

  return (
    <div className={`header-content-editor ${isEditing ? 'editing' : ''}`}>
      <textarea ref={editorRef}></textarea>
    </div>
  )
}

export default HeaderContent

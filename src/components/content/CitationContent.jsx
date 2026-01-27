import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import { TextField } from '../ds'
import '../../styles/ContentEditor.css'
import '../../styles/CitationContent.css'

/**
 * CitationContent Component
 *
 * Citation editor with quote text (Trumbowyg) and person attribution field.
 * Returns the editor and person field (no wrapper, no border).
 * ElementWrapper handles all chrome (border, title, positioning buttons).
 */
const CitationContent = ({ content, onChange, isFocused }) => {
  const editorRef = useRef(null)
  const trumbowygInstance = useRef(null)
  const [isEditing, setIsEditing] = useState(false)

  // Parse content - support both old string format and new object format
  const parsedContent = typeof content === 'object' && content !== null
    ? content
    : { quote: content || '', person: '' }

  const [quote, setQuote] = useState(parsedContent.quote || '')
  const [person, setPerson] = useState(parsedContent.person || '')

  // Use refs to track latest values for onChange callbacks
  const quoteRef = useRef(quote)
  const personRef = useRef(person)

  useEffect(() => {
    quoteRef.current = quote
    personRef.current = person
  }, [quote, person])

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
    if (quote) {
      $editor.trumbowyg('html', quote)
    }

    // Handle content changes
    $editor.on('tbwchange', () => {
      const newQuote = $editor.trumbowyg('html')
      setQuote(newQuote)
      if (onChange) {
        onChange({ quote: newQuote, person: personRef.current })
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

  // Update quote externally if it changes (but not person - we manage that internally)
  useEffect(() => {
    if (trumbowygInstance.current && content !== undefined) {
      const newParsedContent = typeof content === 'object' && content !== null
        ? content
        : { quote: content || '', person: '' }

      const currentHtml = trumbowygInstance.current.trumbowyg('html')
      if (currentHtml !== newParsedContent.quote && !isEditing) {
        trumbowygInstance.current.trumbowyg('html', newParsedContent.quote || '')
        setQuote(newParsedContent.quote || '')
      }

      // Don't sync person from external changes - we manage it internally
      // This prevents infinite loops when we call onChange
    }
  }, [content, isEditing])

  // Handle person field change
  const handlePersonChange = (e) => {
    const newPerson = e.target.value
    setPerson(newPerson)
    if (onChange) {
      onChange({ quote: quoteRef.current, person: newPerson })
    }
  }

  return (
    <div className="citation-content-wrapper">
      <div className={`citation-content-editor ${isEditing ? 'editing' : ''}`}>
        <textarea ref={editorRef}></textarea>
      </div>
      <div className="citation-person-field">
        <TextField
          label="Persoon"
          value={person}
          onChange={handlePersonChange}
          placeholder="Naam van de persoon"
        />
      </div>
    </div>
  )
}

export default CitationContent

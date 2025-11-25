import { useEffect, useRef, useState } from 'react'
import $ from 'jquery'
import PositioningButtons from './PositioningButtons'

const TrumbowygEditor = ({
  label,
  icon,
  placeholder = 'Start met schrijven…',
  buttons = [],
  buttonDefinitions = {},
  onChange,
  initialContent = '',
  className = '',
  isFocused,
  isFirst,
  isLast,
  isLinking,
  onMoveUp,
  onMoveDown,
  onLink,
  onDuplicate,
  onDelete
}) => {
  const editorRef = useRef(null)
  const trumbowygInstance = useRef(null)
  const wrapperRef = useRef(null)
  const [elementFocused, setElementFocused] = useState(false)
  const [textareaFocused, setTextareaFocused] = useState(false)

  // Use external isFocused if provided, otherwise use internal state
  const isElementFocused = isFocused !== undefined ? isFocused : elementFocused

  useEffect(() => {
    const $editor = $(editorRef.current)

    // Initialize Trumbowyg
    $editor.trumbowyg({
      btns: buttons,
      btnsDef: buttonDefinitions,
      semantic: false,
      removeformatPasted: true,
      autogrow: true,
    })

    trumbowygInstance.current = $editor

    // Set placeholder manually on the editor div
    const trumbowygData = $editor.data('trumbowyg')
    if (trumbowygData && trumbowygData.$ed) {
      trumbowygData.$ed.attr('data-placeholder', placeholder)

      // Function to check if editor is empty and add/remove placeholder class
      const updatePlaceholder = () => {
        const text = trumbowygData.$ed.text().trim()
        const html = trumbowygData.$ed.html()

        if (text === '') {
          trumbowygData.$ed.addClass('is-empty')

          // Detect the current heading type from the HTML structure
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

      // Update placeholder on various events for instant response
      $editor.on('tbwchange tbwblur tbwfocus', updatePlaceholder)

      // Listen directly on the contenteditable div for instant response to typing
      trumbowygData.$ed.on('input keydown keyup', updatePlaceholder)

      // Initial check
      updatePlaceholder()
    }

    // Function to maintain button states even when unfocused
    const maintainButtonStates = () => {
      const trumbowygData = $editor.data('trumbowyg')
      if (!trumbowygData) return

      const $buttonPane = trumbowygData.$btnPane

      // Check what formatting is currently applied
      const html = $editor.trumbowyg('html')
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const firstElement = doc.body.firstElementChild

      // Remove all persistent active states first
      $buttonPane.find('button').removeClass('persistent-active')

      // Add persistent active state based on current formatting
      if (firstElement) {
        const tagName = firstElement.tagName.toLowerCase()
        if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
          // Find the button by checking the button name attribute
          const $targetButton = $buttonPane.find(`button.${tagName}-button`)
          if ($targetButton.length === 0) {
            // Fallback: try to find by title or other attributes
            $buttonPane.find('button').each(function() {
              const $btn = $(this)
              const title = $btn.attr('title')
              if (title && title.toLowerCase().includes(tagName)) {
                $btn.addClass('persistent-active')
              }
            })
          } else {
            $targetButton.addClass('persistent-active')
          }
        }
      }
    }

    // Set initial content if provided
    if (initialContent) {
      $editor.trumbowyg('html', initialContent)

      // Force the editor to recognize the current format and update button states
      setTimeout(() => {
        const editorElement = $editor.data('trumbowyg').$ed[0]
        if (editorElement) {
          // Place cursor at the end and trigger a selection change
          const range = document.createRange()
          const sel = window.getSelection()
          const lastNode = editorElement.firstChild || editorElement

          range.setStart(lastNode, 0)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)

          // Trigger button state update
          $editor.trigger('tbwchange')
          maintainButtonStates()
        }
      }, 0)
    }

    // Listen for content changes
    $editor.on('tbwchange', () => {
      if (onChange) {
        onChange($editor.trumbowyg('html'))
      }
      maintainButtonStates()
    })

    // Maintain button states on blur
    $editor.on('tbwblur', () => {
      setTimeout(maintainButtonStates, 10)
      setTextareaFocused(false)
    })

    // Also maintain on focus to ensure it's correct
    $editor.on('tbwfocus', () => {
      setTimeout(maintainButtonStates, 10)
      setTextareaFocused(true)
      setElementFocused(true)
    })

    // Use MutationObserver to watch for class changes and reapply persistent state
    if (trumbowygData && trumbowygData.$btnPane) {
      const observer = new MutationObserver(() => {
        // Small delay to let Trumbowyg do its thing first
        setTimeout(maintainButtonStates, 5)
      })

      const buttonPane = trumbowygData.$btnPane[0]
      if (buttonPane) {
        observer.observe(buttonPane, {
          attributes: true,
          attributeFilter: ['class'],
          subtree: true
        })

        // Store observer for cleanup
        trumbowygData._customObserver = observer
      }
    }

    // Cleanup
    return () => {
      const data = $editor.data('trumbowyg')
      if (data) {
        if (data._customObserver) {
          data._customObserver.disconnect()
        }
        $editor.trumbowyg('destroy')
      }
    }
  }, [])

  const handleWrapperClick = () => {
    if (!textareaFocused) {
      setElementFocused(true)
    }
  }

  const wrapperClasses = `editor-wrapper ${className} ${
    isElementFocused ? 'element-focused' : ''
  } ${textareaFocused ? 'textarea-focused' : ''}`

  return (
    <div className="editor-section-container" ref={wrapperRef}>
      <PositioningButtons
        visible={isElementFocused}
        dimmed={textareaFocused}
        isFirst={isFirst}
        isLast={isLast}
        isLinking={isLinking}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onLink={onLink}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />
      <div
        className={wrapperClasses}
        onClick={handleWrapperClick}
      >
        <div className="editor-content">
          {label && (
            <div className="editor-label">
              {icon && <span className="editor-label-icon">{icon}</span>}
              <span className="editor-label-text">{label}</span>
            </div>
          )}
          <textarea ref={editorRef} placeholder={placeholder}></textarea>
        </div>
      </div>
    </div>
  )
}

export default TrumbowygEditor

import { useState, useEffect, useRef } from 'react'
import tippy from 'tippy.js'
import ArrowSwapIcon from '../icons/ui-arrow-right-arrow-left.svg?react'
import LinkSlashIcon from '../icons/ui-link-slash.svg?react'
import ArrowUpIcon from '../icons/ui-arrow-up.svg?react'
import ArrowDownIcon from '../icons/ui-arrow-down.svg?react'
import CopyIcon from '../icons/ui-copy.svg?react'
import '../styles/TwoColumnWrapper.css'

const TwoColumnWrapper = ({
  leftElement,
  rightElement,
  isFocused,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onSwap,
  onBreakLink,
  onUpdateLeft,
  onUpdateRight,
  renderElement
}) => {
  const buttonClass = 'btn btn-sm rounded-circle p-2'
  const buttonsRef = useRef(null)

  // Initialize Tippy tooltips for positioning buttons
  useEffect(() => {
    if (buttonsRef.current) {
      const buttons = buttonsRef.current.querySelectorAll('button[data-tooltip]')
      if (buttons.length > 0) {
        const instances = tippy(Array.from(buttons), {
          content: (reference) => reference.getAttribute('data-tooltip'),
          arrow: true,
          theme: 'dark',
          duration: [50, 0],
          placement: 'left',
          offset: [0, 8]
        })
        return () => {
          instances.forEach(instance => instance.destroy())
        }
      }
    }
  }, [isFocused])

  return (
    <div className="two-column-container">
      <div ref={buttonsRef} className={`positioning-buttons ${isFocused ? 'visible' : ''}`}>
        <button
          className={`${buttonClass} ${isFirst ? 'dimmed' : ''}`}
          data-tooltip="Verplaats omhoog"
          onClick={(e) => {
            e.stopPropagation()
            if (!isFirst && onMoveUp) onMoveUp()
          }}
          disabled={isFirst}
        >
          <ArrowUpIcon width={16} height={16} />
        </button>
        <button
          className={`${buttonClass} ${isLast ? 'dimmed' : ''}`}
          data-tooltip="Verplaats omlaag"
          onClick={(e) => {
            e.stopPropagation()
            if (!isLast && onMoveDown) onMoveDown()
          }}
          disabled={isLast}
        >
          <ArrowDownIcon width={16} height={16} />
        </button>
        <button
          className={buttonClass}
          data-tooltip="Wissel links en rechts"
          onClick={(e) => {
            e.stopPropagation()
            if (onSwap) onSwap()
          }}
        >
          <ArrowSwapIcon width={16} height={16} />
        </button>
        <button
          className={buttonClass}
          data-tooltip="Dupliceer"
          onClick={(e) => {
            e.stopPropagation()
            if (onDuplicate) onDuplicate()
          }}
        >
          <CopyIcon width={16} height={16} />
        </button>
        <button
          className={`${buttonClass} delete-btn`}
          data-tooltip="Verbreek link"
          onClick={(e) => {
            e.stopPropagation()
            if (onBreakLink) onBreakLink()
          }}
        >
          <LinkSlashIcon width={16} height={16} />
        </button>
      </div>

      <div className={`two-column-wrapper ${isFocused ? 'element-focused' : ''}`}>
        <div className="two-column-left">
          {renderElement(leftElement, onUpdateLeft, false, isFocused)}
        </div>
        <div className="two-column-right">
          {renderElement(rightElement, onUpdateRight, false, isFocused)}
        </div>
      </div>
    </div>
  )
}

export default TwoColumnWrapper

import { useEffect, useRef, forwardRef } from 'react'
import Element from './Element'
import DoubleColumnElement from './DoubleColumnElement'
import ArticlePreview from './ArticlePreview'
import ArticleHeader from './ArticleHeader'
import { Icon } from './ds'
import { isValidElementType, DOUBLE_ELEMENT_TYPES } from '../config/elementTypes'

const ArticleCanvas = forwardRef(({
  elements,
  focusedElementId,
  animatingElement,
  scrollToElement,
  isPreviewMode,
  headerData,
  onFocusElement,
  onUpdateElement,
  onMoveElement,
  onDuplicateElement,
  onDeleteElement,
  onSwapDoubleElement
}, ref) => {
  const elementRefs = useRef({})

  useEffect(() => {
    if (scrollToElement && elementRefs.current[scrollToElement]) {
      setTimeout(() => {
        elementRefs.current[scrollToElement]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }, 100)
    }
  }, [scrollToElement])

  const handleCanvasClick = (e) => {
    // Only clear focus if clicking directly on the canvas or article-elements container
    if (e.target.classList.contains('article-elements') ||
        e.target.classList.contains('article-canvas')) {
      onFocusElement(null)
    }
  }

  const renderElement = (element, index) => {
    const isFocused = focusedElementId === element.id
    const isFirst = index === 0
    const isLast = index === elements.length - 1
    const isAnimating = animatingElement && animatingElement.id === element.id
    const isEntering = scrollToElement === element.id
    const animationClass = isAnimating ? `moving-${animatingElement.direction}` : (isEntering ? 'element-entering' : '')

    // Check if this is a double-column element type
    const isDoubleColumn = element.type in DOUBLE_ELEMENT_TYPES

    if (isDoubleColumn) {
      // Render double-column element
      return (
        <div
          key={element.id}
          ref={(el) => elementRefs.current[element.id] = el}
          className={`article-element-wrapper ${animationClass}`}
          onClick={(e) => {
            e.stopPropagation()
            onFocusElement(element.id)
          }}
        >
          <DoubleColumnElement
            elementId={element.id}
            type={element.type}
            leftContent={element.leftContent}
            rightContent={element.rightContent}
            swapped={element.swapped || false}
            isFocused={isFocused}
            isFirst={isFirst}
            isLast={isLast}
            onUpdateLeft={(content) => {
              onUpdateElement(element.id, 'leftContent', content)
            }}
            onUpdateRight={(content) => {
              onUpdateElement(element.id, 'rightContent', content)
            }}
            onMoveUp={() => onMoveElement(element.id, 'up')}
            onMoveDown={() => onMoveElement(element.id, 'down')}
            onSwap={() => onSwapDoubleElement(element.id)}
            onDuplicate={() => onDuplicateElement(element.id)}
            onDelete={() => onDeleteElement(element.id)}
          />
        </div>
      )
    }

    // Render single-column element
    return (
      <div
        key={element.id}
        ref={(el) => elementRefs.current[element.id] = el}
        className={`article-element-wrapper ${animationClass}`}
        onClick={(e) => {
          e.stopPropagation()
          onFocusElement(element.id)
        }}
      >
        <Element
          type={element.type}
          content={element.content}
          onChange={(content) => onUpdateElement(element.id, { ...element, content })}
          isFocused={isFocused}
          isFirst={isFirst}
          isLast={isLast}
          onMoveUp={() => onMoveElement(element.id, 'up')}
          onMoveDown={() => onMoveElement(element.id, 'down')}
          onDuplicate={() => onDuplicateElement(element.id)}
          onDelete={() => onDeleteElement(element.id)}
        />
      </div>
    )
  }

  if (isPreviewMode) {
    return (
      <div className="article-canvas article-canvas-preview" onClick={handleCanvasClick}>
        <ArticlePreview
          headerData={headerData}
          elements={elements}
        />
      </div>
    )
  }

  return (
    <div className="article-canvas" onClick={handleCanvasClick}>
      <div className="article-header-container">
        <ArticleHeader {...headerData} />
      </div>
      <div className="article-elements">
        {elements.length === 0 ? (
          <div className="article-empty-state">
            <div>
              <Icon name="ui-plus-circle" size={80} color="var(--kpn-blue-200)" />
              <p className="body-l text-blue-200">
                Voeg een blok toe om te beginnen met schrijven
              </p>
            </div>
          </div>
        ) : (
          elements.map(renderElement)
        )}
      </div>
    </div>
  )
})

export default ArticleCanvas

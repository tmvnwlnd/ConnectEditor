import { useEffect, useRef, forwardRef } from 'react'
import HeaderElement from './HeaderElement'
import ParagraphElement from './ParagraphElement'
import CitationElement from './CitationElement'
import ImageElement from './ImageElement'
import TableElement from './TableElement'
import AudioElement from './AudioElement'
import TwoColumnWrapper from './TwoColumnWrapper'
import ArticlePreview from './ArticlePreview'
import ArticleHeader from './ArticleHeader'
import LinkIcon from '../icons/ui-link.svg?react'

const ArticleCanvas = forwardRef(({
  elements,
  focusedElementId,
  animatingElement,
  scrollToElement,
  isPreviewMode,
  linkingElementId,
  headerData,
  onFocusElement,
  onUpdateElement,
  onMoveElement,
  onDuplicateElement,
  onDeleteElement,
  onStartLinking,
  onLinkElements,
  onSwapPairedElements,
  onBreakLink
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

  // Helper function to render a single element component
  const renderSingleElement = (element, onUpdate, showButtons = true, isFocused = false) => {
    const ElementComponent = {
      header: HeaderElement,
      paragraph: ParagraphElement,
      citation: CitationElement,
      image: ImageElement,
      table: TableElement
    }[element.type]

    if (!ElementComponent) return null

    return (
      <ElementComponent
        onChange={(content) => onUpdate(content)}
        initialContent={element.content}
        isFocused={isFocused}
        isFirst={false}
        isLast={false}
        onMoveUp={() => {}}
        onMoveDown={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
      />
    )
  }

  const renderElement = (element, index) => {
    const isFocused = focusedElementId === element.id
    const isFirst = index === 0
    const isLast = index === elements.length - 1
    const isAnimating = animatingElement && animatingElement.id === element.id
    const animationClass = isAnimating ? `moving-${animatingElement.direction}` : ''
    const isLinkingTarget = linkingElementId && linkingElementId !== element.id
    const isLinkingSource = linkingElementId === element.id
    const linkingSourceClass = isLinkingSource ? 'linking-source' : ''

    // Handle paired elements
    if (element.type === 'pair') {
      return (
        <div
          key={element.id}
          ref={(el) => elementRefs.current[element.id] = el}
          className={`article-element-wrapper ${animationClass} ${linkingSourceClass}`}
          onClick={(e) => {
            e.stopPropagation()
            if (isLinkingSource) {
              // Cancel linking by clicking source element again
              onStartLinking(null)
            } else if (isLinkingTarget) {
              onLinkElements(element.id)
            } else {
              onFocusElement(element.id)
            }
          }}
        >
          <TwoColumnWrapper
            leftElement={element.leftElement}
            rightElement={element.rightElement}
            isFocused={isFocused}
            isFirst={isFirst}
            isLast={isLast}
            onMoveUp={() => onMoveElement(element.id, 'up')}
            onMoveDown={() => onMoveElement(element.id, 'down')}
            onDuplicate={() => onDuplicateElement(element.id)}
            onSwap={() => onSwapPairedElements(element.id)}
            onBreakLink={() => onBreakLink(element.id)}
            onUpdateLeft={(content) => {
              onUpdateElement(element.id, {
                leftElement: { ...element.leftElement, content },
                rightElement: element.rightElement
              })
            }}
            onUpdateRight={(content) => {
              onUpdateElement(element.id, {
                leftElement: element.leftElement,
                rightElement: { ...element.rightElement, content }
              })
            }}
            renderElement={renderSingleElement}
          />
        </div>
      )
    }

    // Handle regular elements
    const ElementComponent = {
      header: HeaderElement,
      paragraph: ParagraphElement,
      citation: CitationElement,
      image: ImageElement,
      table: TableElement,
      audio: AudioElement
    }[element.type]

    if (!ElementComponent) return null

    return (
      <div
        key={element.id}
        ref={(el) => elementRefs.current[element.id] = el}
        className={`article-element-wrapper ${animationClass} ${isLinkingTarget ? 'linking-target' : ''} ${linkingSourceClass}`}
        onClick={(e) => {
          e.stopPropagation()
          if (isLinkingSource) {
            // Cancel linking by clicking source element again
            onStartLinking(null)
          } else if (isLinkingTarget) {
            onLinkElements(element.id)
          } else {
            onFocusElement(element.id)
          }
        }}
      >
        <ElementComponent
          onChange={(content) => onUpdateElement(element.id, content)}
          initialContent={element.content}
          isFocused={isFocused}
          isFirst={isFirst}
          isLast={isLast}
          isLinking={isLinkingSource}
          onMoveUp={() => onMoveElement(element.id, 'up')}
          onMoveDown={() => onMoveElement(element.id, 'down')}
          onLink={() => onStartLinking(element.id)}
          onDuplicate={() => onDuplicateElement(element.id)}
          onDelete={() => onDeleteElement(element.id)}
        />
        {isLinkingTarget && (
          <>
            <div className="hover-link-icon">
              <LinkIcon width={32} height={32} />
            </div>
            <div className="hover-link-text">link met dit element</div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="article-canvas" ref={ref} onClick={handleCanvasClick}>
      {isPreviewMode ? (
        <ArticlePreview elements={elements} headerData={headerData} />
      ) : (
        <>
          {headerData && (
            <div className="article-header-container">
              <ArticleHeader
                title={headerData.title}
                introduction={headerData.introduction}
                coverImage={headerData.coverImage}
              />
            </div>
          )}
          {elements.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-text">
                Selecteer een type blok uit de lijst<br />
                om te beginnen met schrijven.
              </p>
            </div>
          ) : (
            <div className="article-elements" onClick={handleCanvasClick}>
              {elements.map(renderElement)}
            </div>
          )}
        </>
      )}
      {linkingElementId && (
        <div className="linking-tooltip">
          klik op element om een twee-koloms layout te maken
        </div>
      )}
    </div>
  )
})

ArticleCanvas.displayName = 'ArticleCanvas'

export default ArticleCanvas

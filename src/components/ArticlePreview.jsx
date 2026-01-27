import { useState, useRef } from 'react'
import DOMPurify from 'dompurify'
import { DOUBLE_ELEMENT_TYPES, getDoubleElementConfig } from '../config/elementTypes'
import { Icon } from './ds'
import '../styles/ArticlePreview.css'

const ArticlePreview = ({ elements, headerData = {} }) => {
  const { title, introduction, coverImage } = headerData

  const renderElement = (element) => {
    // Handle double-column elements
    const isDoubleColumn = element.type in DOUBLE_ELEMENT_TYPES

    if (isDoubleColumn) {
      const config = getDoubleElementConfig(element.type)
      const leftType = config.leftType
      const rightType = config.rightType

      // Determine actual order based on swapped state
      const leftContentActual = element.swapped ? element.rightContent : element.leftContent
      const rightContentActual = element.swapped ? element.leftContent : element.rightContent
      const leftTypeActual = element.swapped ? rightType : leftType
      const rightTypeActual = element.swapped ? leftType : rightType

      return (
        <div key={element.id} className="preview-two-column">
          <div className="preview-column-left">
            {renderSingleElement({
              id: `${element.id}-left`,
              type: leftTypeActual,
              content: leftContentActual
            })}
          </div>
          <div className="preview-column-right">
            {renderSingleElement({
              id: `${element.id}-right`,
              type: rightTypeActual,
              content: rightContentActual
            })}
          </div>
        </div>
      )
    }

    return renderSingleElement(element)
  }

  const renderSingleElement = (element) => {
    // Skip empty elements
    if (!element.content) {
      return null
    }

    // For string content (text elements), skip if empty
    if (typeof element.content === 'string' && element.content.trim() === '') {
      return null
    }

    // For object content, check if it has any meaningful data
    if (typeof element.content === 'object') {
      const hasImage = !!element.content.image
      const hasTableData = !!element.content.data
      const hasAudio = !!element.content.audio
      const hasVideo = !!element.content.video
      const hasAttachment = !!element.content.fileName || !!element.content.originalFileName
      const hasCarouselImages = !!element.content.images && element.content.images.length > 0
      const hasQuote = !!element.content.quote && element.content.quote.trim() !== ''

      if (!hasImage && !hasTableData && !hasAudio && !hasVideo && !hasAttachment && !hasCarouselImages && !hasQuote) {
        return null
      }
    }

    switch (element.type) {
      case 'header':
        return (
          <div
            key={element.id}
            className="preview-header"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(element.content) }}
          />
        )

      case 'paragraph':
        return (
          <div
            key={element.id}
            className="preview-paragraph"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(element.content) }}
          />
        )

      case 'citation':
        return renderCitation(element)

      case 'image':
        return renderImage(element)

      case 'table':
        return renderTable(element)

      case 'audio':
        return renderAudio(element)

      case 'video':
        return renderVideo(element)

      case 'attachment':
        return renderAttachment(element)

      case 'carousel':
        return renderCarousel(element)

      default:
        return null
    }
  }

  const renderImage = (element) => {
    if (!element.content?.image) {
      return null
    }

    return (
      <div key={element.id} className="preview-image-container">
        <img
          src={element.content.image}
          alt={element.content.altText || ''}
          title={element.content.altText || ''}
          className="preview-image"
        />
      </div>
    )
  }

  const renderTable = (element) => {
    const { data, hasColumnHeader, hasRowHeader } = element.content

    if (!data || data.length === 0) {
      return null
    }

    return (
      <div key={element.id} className="preview-table-container">
        <table className="preview-table">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isColumnHeader = hasColumnHeader && rowIndex === 0
                  const isRowHeader = hasRowHeader && colIndex === 0
                  const Tag = isColumnHeader || isRowHeader ? 'th' : 'td'

                  return (
                    <Tag key={colIndex}>
                      {cell}
                    </Tag>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  const renderCitation = (element) => {
    // Handle both old string format and new object format
    const isObjectContent = typeof element.content === 'object' && element.content !== null
    const quote = isObjectContent ? element.content.quote : element.content
    const person = isObjectContent ? element.content.person : ''

    // Skip if quote is empty
    if (!quote || (typeof quote === 'string' && quote.trim() === '')) {
      return null
    }

    return (
      <div key={element.id} className="preview-citation-container">
        <blockquote
          className="preview-citation"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(quote) }}
        />
        {person && (
          <p className="preview-citation-person">— {person}</p>
        )}
      </div>
    )
  }

  const renderAudio = (element) => {
    const { audio, title } = element.content

    if (!audio) {
      return null
    }

    return (
      <div key={element.id} className="preview-audio-container">
        {title && (
          <p className="preview-audio-title">{title}</p>
        )}
        <audio controls preload="metadata" className="preview-audio">
          <source src={audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    )
  }

  const renderVideo = (element) => {
    const { video, caption } = element.content

    if (!video) {
      return null
    }

    return (
      <div key={element.id} className="preview-video-container">
        <video controls className="preview-video">
          <source src={video} type="video/mp4" />
          Your browser does not support the video element.
        </video>
        {caption && (
          <p className="preview-video-caption">{caption}</p>
        )}
      </div>
    )
  }

  const renderAttachment = (element) => {
    const { fileName, originalFileName, fileType } = element.content

    if (!fileName && !originalFileName) {
      return null
    }

    return (
      <div key={element.id} className="preview-attachment-container">
        <div className="preview-attachment">
          <span className="preview-attachment-icon">📎</span>
          <span className="preview-attachment-name">
            {fileName || originalFileName}
          </span>
          {fileType && (
            <span className="preview-attachment-type">.{fileType.toLowerCase()}</span>
          )}
        </div>
      </div>
    )
  }

  const renderCarousel = (element) => {
    const { images } = element.content

    if (!images || images.length === 0) {
      return null
    }

    return <CarouselPreview key={element.id} images={images} />
  }

  const CarouselPreview = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isInView, setIsInView] = useState(false)
    const carouselRef = useRef(null)
    const intervalRef = useRef(null)

    // Intersection Observer for auto-play when in view
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting)
        },
        { threshold: 0.5 }
      )

      if (carouselRef.current) {
        observer.observe(carouselRef.current)
      }

      return () => {
        if (carouselRef.current) {
          observer.unobserve(carouselRef.current)
        }
      }
    }, [])

    // Auto-scroll when in view
    useEffect(() => {
      if (isInView && images.length > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) => (prev + 1) % images.length)
        }, 4000)
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, [isInView, images.length])

    const goToPrevious = () => {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    }

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }

    const goToSlide = (index) => {
      setCurrentIndex(index)
    }

    const currentImage = images[currentIndex]

    return (
      <div ref={carouselRef} className="preview-carousel-container">
        <div className="preview-carousel">
          <div className="preview-carousel-image-container">
            <img
              key={currentIndex}
              src={currentImage.image}
              alt={currentImage.caption || `Slide ${currentIndex + 1}`}
              className="preview-carousel-image"
            />

            {images.length > 1 && (
              <>
                <button
                  className="preview-carousel-nav preview-carousel-nav-prev"
                  onClick={goToPrevious}
                  aria-label="Vorige afbeelding"
                >
                  <Icon name="ui-chevron-left" size={24} />
                </button>
                <button
                  className="preview-carousel-nav preview-carousel-nav-next"
                  onClick={goToNext}
                  aria-label="Volgende afbeelding"
                >
                  <Icon name="ui-chevron-right" size={24} />
                </button>
              </>
            )}
          </div>

          {currentImage.caption && (
            <p className="preview-carousel-caption">{currentImage.caption}</p>
          )}

          {images.length > 1 && (
            <div className="preview-carousel-dots">
              {images.map((_, index) => (
                <button
                  key={index}
                  className={`preview-carousel-dot ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ga naar afbeelding ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Format current date/time in Dutch format
  const formatDate = () => {
    const now = new Date()
    const day = now.getDate()
    const months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december']
    const month = months[now.getMonth()]
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')

    return `Vandaag om ${hours}:${minutes}`
  }

  return (
    <div className="article-preview">
      <div className="article-preview-wrapper">
        {/* Cover Image Section with Overlay */}
        {coverImage && (
          <div className="article-cover">
            <img src={coverImage} alt="Cover" className="article-cover-image" />
            <div className="article-cover-overlay"></div>
            <div className="article-cover-content">
              <span className="article-cover-date">{formatDate()}</span>
              {title && <h1 className="article-cover-title">{title}</h1>}
            </div>
          </div>
        )}

        <div className="article-preview-content">
          {/* Introduction */}
          {introduction && (
            <p className="preview-introduction">{introduction}</p>
          )}

          {/* Article Elements */}
          {elements.map(element => renderElement(element))}
        </div>
      </div>
    </div>
  )
}

export default ArticlePreview

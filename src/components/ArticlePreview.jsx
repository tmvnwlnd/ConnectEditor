import { useState, useEffect } from 'react'
import { cropImage } from '../utils/imageCropper'
import '../styles/ArticlePreview.css'

const ArticlePreview = ({ elements }) => {
  const [croppedImages, setCroppedImages] = useState({})

  // Crop all images when elements change
  useEffect(() => {
    const cropAllImages = async () => {
      const imageElements = elements.filter(el => el.type === 'image' && el.content?.image)
      const newCroppedImages = {}

      for (const element of imageElements) {
        try {
          const maxSize = element.content.aspectRatio === 'small-square' ? 300 : 600
          const croppedUrl = await cropImage(
            element.content.image,
            element.content.aspectRatio || 'large-square',
            maxSize
          )
          newCroppedImages[element.id] = croppedUrl
        } catch (error) {
          console.error('Failed to crop image:', error)
          // Fallback to original image
          newCroppedImages[element.id] = element.content.image
        }
      }

      setCroppedImages(newCroppedImages)
    }

    cropAllImages()
  }, [elements])

  const renderElement = (element) => {
    // Handle paired elements
    if (element.type === 'pair') {
      return (
        <div key={element.id} className="preview-two-column">
          <div className="preview-column-left">
            {renderSingleElement(element.leftElement)}
          </div>
          <div className="preview-column-right">
            {renderSingleElement(element.rightElement)}
          </div>
        </div>
      )
    }

    return renderSingleElement(element)
  }

  const renderSingleElement = (element) => {
    // Skip empty elements
    const isEmpty = !element.content ||
      (typeof element.content === 'string' && element.content.trim() === '') ||
      (typeof element.content === 'object' && !element.content.image && !element.content.data)

    if (isEmpty) {
      return null
    }

    switch (element.type) {
      case 'header':
        return (
          <div
            key={element.id}
            className="preview-header"
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        )

      case 'paragraph':
        return (
          <div
            key={element.id}
            className="preview-paragraph"
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        )

      case 'citation':
        return (
          <blockquote
            key={element.id}
            className="preview-citation"
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        )

      case 'image':
        return renderImage(element)

      case 'table':
        return renderTable(element)

      default:
        return null
    }
  }

  const renderImage = (element) => {
    const croppedSrc = croppedImages[element.id]

    // Don't render until image is cropped
    if (!croppedSrc) {
      return null
    }

    return (
      <div key={element.id} className="preview-image-container">
        <img
          src={croppedSrc}
          alt={element.content.altText || ''}
          title={element.content.altText || ''}
          className={`preview-image preview-image-${element.content.aspectRatio || 'large-square'}`}
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

  return (
    <div className="article-preview">
      <div className="article-preview-content">
        {elements.map(element => renderElement(element))}
      </div>
    </div>
  )
}

export default ArticlePreview

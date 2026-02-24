import { useState, useRef, useEffect } from 'react'
import { Icon } from '../ds'
import IconButton from '../IconButton'
import TextField from '../TextField'
import { Button } from '../ds'
import TrashIcon from '../../icons/ui-trash.svg?react'
import { validateFileType, validateFileSize } from '../../utils/validation'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import '../../styles/CarouselContent.css'

// Mock AI alt text generator
const MOCK_ALT_TEXTS = [
  'Een groep collega\'s werkt samen aan een project in een moderne kantoorruimte',
  'Zonnige dag in het park met spelende kinderen op de achtergrond',
  'Close-up van een laptop met grafieken en data op het scherm',
  'Teamvergadering in een vergaderruimte met grote ramen',
  'Moderne stadsgezicht met hoge gebouwen en blauwe lucht',
  'Twee mensen schudden handen tijdens een zakelijke bijeenkomst',
  'Kleurrijke abstracte vormen die innovatie en creativiteit uitbeelden',
  'Natuurlandschap met groene heuvels en een rivier',
]

const getRandomAltText = () => {
  return MOCK_ALT_TEXTS[Math.floor(Math.random() * MOCK_ALT_TEXTS.length)]
}

/**
 * CarouselContent Component
 *
 * Content renderer for Carousel elements.
 * Handles multiple image upload with captions and AI-generated alt text.
 */
const CarouselContent = ({ content, onChange, isFocused }) => {
  const [images, setImages] = useState(content?.images || [])
  const [selectedImageId, setSelectedImageId] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [generatingAltFor, setGeneratingAltFor] = useState(new Set()) // Track which images are generating alt text
  const [fileError, setFileError] = useState('')
  const fileInputRef = useRef(null)

  // Auto-select first image when images are added
  const selectedImage = images.find(img => img.id === selectedImageId) || images[0]

  // Initialize tooltips for thumbnail items
  useEffect(() => {
    const thumbnails = document.querySelectorAll('.carousel-thumbnail-item')
    if (thumbnails.length > 0) {
      const instances = tippy(Array.from(thumbnails), {
        content: 'Sleep om de volgorde te bepalen',
        placement: 'top',
        theme: 'translucent',
        arrow: true,
        animation: 'fade',
        delay: [2000, 0] // 2 second delay on show, instant hide
      })

      return () => {
        instances.forEach(instance => instance.destroy())
      }
    }
  }, [images.length])

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    setFileError('')
    const errors = []

    const newImages = []
    for (const file of files) {
      const typeError = validateFileType(file, ['image/jpeg', 'image/png', 'image/gif'], '.jpeg, .png of .gif')
      if (typeError) {
        errors.push(`${file.name}: ${typeError}`)
        continue
      }

      const sizeError = validateFileSize(file, 10)
      if (sizeError) {
        errors.push(`${file.name}: ${sizeError}`)
        continue
      }

      newImages.push({
        id: Date.now() + Math.random(),
        image: URL.createObjectURL(file),
        caption: ''
      })
    }

    if (errors.length > 0) {
      setFileError(errors.join('. '))
    }

    if (newImages.length > 0) {
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)

      // Auto-select first image if none selected
      if (!selectedImageId && updatedImages.length > 0) {
        setSelectedImageId(updatedImages[0].id)
      }

      if (onChange) {
        onChange({ images: updatedImages })
      }

      // Generate alt text for each new image
      newImages.forEach(img => {
        setGeneratingAltFor(prev => new Set([...prev, img.id]))
        setTimeout(() => {
          const altText = getRandomAltText()
          setImages(currentImages => {
            const updated = currentImages.map(i =>
              i.id === img.id ? { ...i, altText } : i
            )
            if (onChange) {
              onChange({ images: updated })
            }
            return updated
          })
          setGeneratingAltFor(prev => {
            const newSet = new Set(prev)
            newSet.delete(img.id)
            return newSet
          })
        }, 2000)
      })
    }

    // Reset input
    event.target.value = ''
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleCaptionChange = (e) => {
    if (!selectedImage) return

    const newCaption = e.target.value
    const updatedImages = images.map(img =>
      img.id === selectedImage.id ? { ...img, caption: newCaption } : img
    )
    setImages(updatedImages)
    if (onChange) {
      onChange({ images: updatedImages })
    }
  }

  const handleRegenerateAltText = (imageId) => {
    setGeneratingAltFor(prev => new Set([...prev, imageId]))
    setTimeout(() => {
      const altText = getRandomAltText()
      setImages(currentImages => {
        const updated = currentImages.map(img =>
          img.id === imageId ? { ...img, altText } : img
        )
        if (onChange) {
          onChange({ images: updated })
        }
        return updated
      })
      setGeneratingAltFor(prev => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }, 2000)
  }

  const handleDeleteImage = () => {
    if (!selectedImage) return

    // Revoke blob URL for deleted image
    if (selectedImage.image && selectedImage.image.startsWith('blob:')) {
      URL.revokeObjectURL(selectedImage.image)
    }
    const updatedImages = images.filter(img => img.id !== selectedImage.id)
    setImages(updatedImages)

    // Select next image or first image
    if (updatedImages.length > 0) {
      const currentIndex = images.findIndex(img => img.id === selectedImage.id)
      const nextImage = updatedImages[currentIndex] || updatedImages[0]
      setSelectedImageId(nextImage.id)
    } else {
      setSelectedImageId(null)
    }

    if (onChange) {
      onChange({ images: updatedImages })
    }
  }

  const getImageFilename = (image) => {
    return `Foto ${images.indexOf(image) + 1}`
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)

    setImages(newImages)
    setDraggedIndex(index)

    if (onChange) {
      onChange({ images: newImages })
    }
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  return (
    <div className="carousel-content">
      {images.length === 0 ? (
        // Empty state
        <div className="carousel-empty">
          <span className="empty-icon">
            <Icon name="ui-carousel" color="#d0d0d0" size={80} />
          </span>
          <div className="empty-text-group">
            <p className="body-r text-gray-400">Sleep foto's naar dit veld om een carousel te maken</p>
            <p className="body-r text-gray-300">.jpeg, .png of .gif · max 10 MB per foto</p>
          </div>

          <div className="carousel-upload-buttons">
            <Button variant="secondary" onClick={handleBrowseClick}>
              Browse mijn computer
            </Button>
            <Button variant="secondary" disabled>
              Open de beeldbank
            </Button>
            <Button variant="secondary" disabled>
              Gebruik een URL
            </Button>
          </div>

          {fileError && (
            <p className="body-r field-error-message">{fileError}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : isFocused ? (
        // Focused state - full editing layout
        <div className="carousel-filled focused">
          <div className="carousel-layout">
            {/* Left: Thumbnail List */}
            <div className="carousel-sidebar">
              <div className="carousel-sidebar-header">
                <p className="body-r text-gray-400" style={{ margin: 0 }}>
                  {images.length} {images.length === 1 ? 'foto' : "foto's"}
                </p>
                <Button
                  variant="secondary"
                  iconStart="ui-plus"
                  onClick={handleBrowseClick}
                >
                  Voeg toe
                </Button>
              </div>

              <div className="carousel-thumbnail-list">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    className={`carousel-thumbnail-item ${selectedImage?.id === image.id ? 'selected' : ''} ${draggedIndex === index ? 'dragging' : ''}`}
                    onClick={() => setSelectedImageId(image.id)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="carousel-thumbnail-image">
                      <img src={image.image} alt={image.altText || getImageFilename(image)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Selected Image Preview */}
            {selectedImage && (
              <div className="carousel-preview">
                <div className="carousel-preview-header">
                  <h3 className="h6" style={{ margin: 0 }}>{getImageFilename(selectedImage)}</h3>
                  <IconButton
                    variant="delete"
                    icon={TrashIcon}
                    size={20}
                    onClick={handleDeleteImage}
                    aria-label="Verwijder foto"
                  />
                </div>

                <div className="carousel-preview-image">
                  <img src={selectedImage.image} alt={selectedImage.altText || selectedImage.caption || getImageFilename(selectedImage)} />
                </div>

                {/* AI-generated alt text */}
                <div className="carousel-alt-text-container">
                  {generatingAltFor.has(selectedImage.id) ? (
                    <p className="body-r text-gray-400 carousel-alt-generating">
                      alt tekst aan het genereren…
                    </p>
                  ) : selectedImage.altText ? (
                    <div className="carousel-alt-text-row">
                      <p className="body-r text-gray-400">
                        <span className="text-gray-300">alt tekst: </span>
                        {selectedImage.altText}
                      </p>
                      <button
                        type="button"
                        className="carousel-alt-regenerate"
                        onClick={() => handleRegenerateAltText(selectedImage.id)}
                        title="Genereer nieuwe alt tekst"
                      >
                        <Icon name="ui-arrow-clockwise" size={16} color="var(--gray-400)" />
                      </button>
                    </div>
                  ) : null}
                </div>

                <div className="carousel-preview-caption">
                  <TextField
                    label="Bijschrift"
                    value={selectedImage.caption}
                    onChange={handleCaptionChange}
                    placeholder="Voeg een bijschrift toe..."
                  />
                </div>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        // Collapsed state - horizontal thumbnails
        <div className="carousel-collapsed">
          <div className="carousel-collapsed-header">
            <p className="body-r text-gray-400" style={{ margin: 0 }}>
              {images.length} {images.length === 1 ? 'foto' : "foto's"}
            </p>
          </div>
          <div className="carousel-horizontal-thumbnails">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="carousel-horizontal-thumbnail"
              >
                <img src={image.image} alt={image.altText || `Foto ${index + 1}`} />
              </div>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  )
}

export default CarouselContent

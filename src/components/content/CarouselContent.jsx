import { useState, useRef, useEffect } from 'react'
import { Icon } from '../ds'
import IconButton from '../IconButton'
import TextField from '../TextField'
import { Button } from '../ds'
import TrashIcon from '../../icons/ui-trash.svg?react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import '../../styles/CarouselContent.css'

/**
 * CarouselContent Component
 *
 * Content renderer for Carousel elements.
 * Handles multiple image upload with captions.
 */
const CarouselContent = ({ content, onChange, isFocused }) => {
  const [images, setImages] = useState(content?.images || [])
  const [selectedImageId, setSelectedImageId] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
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

    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB

    const promises = files.map(file => {
      return new Promise((resolve, reject) => {
        if (!validTypes.includes(file.type)) {
          alert(`${file.name}: Alleen .jpeg, .png of .gif bestanden zijn toegestaan`)
          reject()
          return
        }

        if (file.size > maxSize) {
          alert(`${file.name}: Bestand is te groot. Maximum grootte is 10 MB`)
          reject()
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          resolve({
            id: Date.now() + Math.random(),
            image: e.target.result,
            caption: ''
          })
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    Promise.all(promises).then(newImages => {
      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)

      // Auto-select first image if none selected
      if (!selectedImageId && updatedImages.length > 0) {
        setSelectedImageId(updatedImages[0].id)
      }

      if (onChange) {
        onChange({ images: updatedImages })
      }
    }).catch(() => {
      // Errors already shown via alerts
    })

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

  const handleDeleteImage = () => {
    if (!selectedImage) return

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
        // Filled state
        <div className={`carousel-filled ${isFocused ? 'focused' : ''}`}>
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
                      <img src={image.image} alt={getImageFilename(image)} />
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
                  <img src={selectedImage.image} alt={selectedImage.caption || getImageFilename(selectedImage)} />
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
      )}
    </div>
  )
}

export default CarouselContent

import { useState, useRef } from 'react'
import Icon from '../Icon'
import TextField from '../TextField'
import Button from '../Button'
import PhotoIcon from '../../icons/ui-photo.svg?react'
import '../../styles/ImageContent.css'

/**
 * ImageContent Component
 *
 * Content renderer for Image elements.
 * Handles image upload, cropping, and alt text.
 */
const ImageContent = ({ content, onChange, isFocused }) => {
  const [image, setImage] = useState(content?.image || null)
  const [altText, setAltText] = useState(content?.altText || '')
  const [aspectRatio, setAspectRatio] = useState(content?.aspectRatio || 'large-square')
  const [showReplaceMenu, setShowReplaceMenu] = useState(false)
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Alleen .jpeg, .png of .gif bestanden zijn toegestaan')
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Bestand is te groot. Maximum grootte is 10 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = e.target.result
      setImage(imageData)
      if (onChange) {
        onChange({ image: imageData, altText, aspectRatio })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
    setShowReplaceMenu(false)
  }

  const handleAltTextChange = (e) => {
    const newAltText = e.target.value
    setAltText(newAltText)
    if (onChange) {
      onChange({ image, altText: newAltText, aspectRatio })
    }
  }

  const handleAspectRatioChange = (ratio) => {
    setAspectRatio(ratio)
    if (onChange) {
      onChange({ image, altText, aspectRatio: ratio })
    }
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'vertical': return 'aspect-9-16'
      case 'horizontal': return 'aspect-16-9'
      case 'large-square': return 'aspect-square-large'
      default: return 'aspect-square-large'
    }
  }

  return (
    <div className="image-content">
      {!image ? (
        // Empty state
        <div className="image-empty">
          <span className="empty-icon">
            <Icon icon={PhotoIcon} color="#d0d0d0" size={80} />
          </span>
          <p className="empty-text">Sleep een foto naar dit veld om toe te voegen</p>
          <p className="empty-subtext">.jpeg, .png of .gif</p>
          <p className="empty-subtext">max 10 MB</p>

          <div className="image-upload-buttons">
            <Button variant="outline-primary" onClick={handleBrowseClick}>
              Browse mijn computer
            </Button>
            <Button variant="outline-primary" disabled>
              Open de beeldbank
            </Button>
          </div>
          <Button variant="outline-primary" className="btn-full-width" disabled>
            Gebruik een URL
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        // Filled state
        <div className="image-filled">
          <div className={`image-toolbar ${isFocused ? 'visible' : ''}`}>
            <div className="toolbar-group">
              <button
                className={`toolbar-btn ${aspectRatio === 'vertical' ? 'active' : ''}`}
                onClick={() => handleAspectRatioChange('vertical')}
                data-tooltip="Verticaal 9:16"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="7" y="3" width="6" height="14" stroke="currentColor" strokeWidth="2" rx="1"/>
                </svg>
              </button>
              <button
                className={`toolbar-btn ${aspectRatio === 'horizontal' ? 'active' : ''}`}
                onClick={() => handleAspectRatioChange('horizontal')}
                data-tooltip="Horizontaal 16:9"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="7" width="14" height="6" stroke="currentColor" strokeWidth="2" rx="1"/>
                </svg>
              </button>
              <button
                className={`toolbar-btn ${aspectRatio === 'large-square' ? 'active' : ''}`}
                onClick={() => handleAspectRatioChange('large-square')}
                data-tooltip="Groot vierkant"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="2" rx="1"/>
                </svg>
              </button>
            </div>

            <div className="toolbar-group toolbar-dropdown">
              <button
                className={`btn btn-sm btn-outline-secondary ${showReplaceMenu ? 'active' : ''}`}
                onClick={() => setShowReplaceMenu(!showReplaceMenu)}
              >
                vervang
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showReplaceMenu && (
                <div className="toolbar-menu">
                  <button className="toolbar-menu-item" onClick={handleBrowseClick}>
                    Browse mijn computer
                  </button>
                  <button className="toolbar-menu-item disabled" disabled>
                    Open de beeldbank
                  </button>
                  <button className="toolbar-menu-item disabled" disabled>
                    Gebruik een URL
                  </button>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div className="image-preview-container">
            <div className={`image-preview ${getAspectRatioClass()}`}>
              <img src={image} alt={altText || 'Uploaded image'} />
              <div className={`crop-overlay ${getAspectRatioClass()}`}></div>
            </div>
          </div>

          <TextField
            label="Alt tekst"
            value={altText}
            onChange={handleAltTextChange}
            placeholder="Beschrijf de afbeelding voor mensen met een screenreader..."
            tooltipText="Alt tekst is een tekstuele beschrijving van de afbeelding. Dit helpt mensen met een screenreader om de afbeelding te begrijpen."
          />
        </div>
      )}
    </div>
  )
}

export default ImageContent

import { useState, useRef, useEffect } from 'react'
import Icon from '../Icon'
import TextField from '../TextField'
import { Button } from '../ds'
import DropdownMenu from '../DropdownMenu'
import PhotoIcon from '../../icons/ui-photo.svg?react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
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
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')
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
        onChange({ image: imageData, altText })
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
      onChange({ image, altText: newAltText })
    }
  }

  const handleShowUrlInput = () => {
    setShowUrlInput(true)
    setShowReplaceMenu(false)
    setUrlValue('')
    setUrlError('')
  }

  const handleCancelUrl = () => {
    setShowUrlInput(false)
    setUrlValue('')
    setUrlError('')
  }

  const handleLoadUrl = () => {
    if (!urlValue.trim()) {
      setUrlError('Voer een geldige URL in')
      return
    }

    // Basic URL validation
    try {
      new URL(urlValue)
    } catch (e) {
      setUrlError('Ongeldige URL')
      return
    }

    // Load image from URL
    const img = new Image()
    // Try without CORS first
    img.onload = () => {
      setImage(urlValue)
      setShowUrlInput(false)
      setUrlValue('')
      setUrlError('')
      if (onChange) {
        onChange({ image: urlValue, altText, sourceType: 'url' })
      }
    }
    img.onerror = () => {
      setUrlError('Ongeldige URL')
    }
    img.src = urlValue
  }

  return (
    <div className="image-content">
      {!image ? (
        showUrlInput ? (
          // URL Input Mode
          <div className="image-empty">
            <span className="empty-icon">
              <Icon icon={PhotoIcon} color="#d0d0d0" size={80} />
            </span>
            <div className="empty-text-group">
              <p className="body-r text-gray-400">Voer de URL van de afbeelding in</p>
            </div>

            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <TextField
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://voorbeeld.nl/afbeelding.jpg"
                error={urlError}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLoadUrl()
                  if (e.key === 'Escape') handleCancelUrl()
                }}
                autoFocus
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button variant="secondary" onClick={handleCancelUrl}>
                  Annuleer
                </Button>
                <Button variant="primary" onClick={handleLoadUrl}>
                  Laad afbeelding
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Empty state
          <div className="image-empty">
            <span className="empty-icon">
              <Icon icon={PhotoIcon} color="#d0d0d0" size={80} />
            </span>
            <div className="empty-text-group">
              <p className="body-r text-gray-400">Sleep een foto naar dit veld om toe te voegen</p>
              <p className="body-r text-gray-300">.jpeg, .png of .gif · max 10 MB</p>
            </div>

            <div className="image-upload-buttons">
              <Button variant="secondary" onClick={handleBrowseClick}>
                Browse mijn computer
              </Button>
              <Button variant="secondary" disabled>
                Open de beeldbank
              </Button>
              <Button variant="secondary" onClick={handleShowUrlInput}>
                Gebruik een URL
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        )
      ) : (
        // Filled state
        <div className="image-filled">
          {showUrlInput && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '40px',
              zIndex: 10,
              borderRadius: '8px'
            }}>
              <p className="body-r text-gray-400">Voer de nieuwe URL in</p>
              <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <TextField
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="https://voorbeeld.nl/afbeelding.jpg"
                  error={urlError}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLoadUrl()
                    if (e.key === 'Escape') handleCancelUrl()
                  }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <Button variant="secondary" onClick={handleCancelUrl}>
                    Annuleer
                  </Button>
                  <Button variant="primary" onClick={handleLoadUrl}>
                    Laad afbeelding
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DropdownMenu
            visible={isFocused}
            trigger={
              <Button variant="ghost" icon="ui-chevron-down">
                vervang
              </Button>
            }
            items={[
              { label: 'Browse mijn computer', onClick: handleBrowseClick },
              { label: 'Open de beeldbank', disabled: true },
              { label: 'Gebruik een URL', onClick: handleShowUrlInput }
            ]}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div className="image-preview-container">
            <img src={image} alt={altText || 'Uploaded image'} className="image-preview" />
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

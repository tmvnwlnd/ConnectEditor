import { useState, useRef, useEffect } from 'react'
import Icon from '../Icon'
import TextField from '../TextField'
import { Button, Icon as DSIcon } from '../ds'
import DropdownMenu from '../DropdownMenu'
import PhotoIcon from '../../icons/ui-photo.svg?react'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import '../../styles/ImageContent.css'

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
 * ImageContent Component
 *
 * Content renderer for Image elements.
 * Handles image upload, AI-generated alt text, and caption.
 */
const ImageContent = ({ content, onChange, isFocused }) => {
  const [image, setImage] = useState(content?.image || null)
  const [altText, setAltText] = useState(content?.altText || '')
  const [caption, setCaption] = useState(content?.caption || '')
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')
  const fileInputRef = useRef(null)

  // Generate alt text when image is first uploaded
  const generateAltText = () => {
    setIsGeneratingAlt(true)
    setTimeout(() => {
      const newAltText = getRandomAltText()
      setAltText(newAltText)
      setIsGeneratingAlt(false)
      if (onChange) {
        onChange({ image, altText: newAltText, caption })
      }
    }, 2000)
  }

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
        onChange({ image: imageData, altText: '', caption })
      }
      // Start AI alt text generation
      setIsGeneratingAlt(true)
      setTimeout(() => {
        const newAltText = getRandomAltText()
        setAltText(newAltText)
        setIsGeneratingAlt(false)
        if (onChange) {
          onChange({ image: imageData, altText: newAltText, caption })
        }
      }, 2000)
    }
    reader.readAsDataURL(file)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
    setShowReplaceMenu(false)
  }

  const handleCaptionChange = (e) => {
    const newCaption = e.target.value
    setCaption(newCaption)
    if (onChange) {
      onChange({ image, altText, caption: newCaption })
    }
  }

  const handleRegenerateAltText = () => {
    setIsGeneratingAlt(true)
    setTimeout(() => {
      const newAltText = getRandomAltText()
      setAltText(newAltText)
      setIsGeneratingAlt(false)
      if (onChange) {
        onChange({ image, altText: newAltText, caption })
      }
    }, 2000)
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
        onChange({ image: urlValue, altText: '', caption, sourceType: 'url' })
      }
      // Start AI alt text generation
      setIsGeneratingAlt(true)
      setTimeout(() => {
        const newAltText = getRandomAltText()
        setAltText(newAltText)
        setIsGeneratingAlt(false)
        if (onChange) {
          onChange({ image: urlValue, altText: newAltText, caption, sourceType: 'url' })
        }
      }, 2000)
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
          {isFocused && (
            <DropdownMenu
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
          )}

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

          {/* AI-generated alt text */}
          <div className="image-alt-text-container">
            {isGeneratingAlt ? (
              <p className="body-r text-gray-400 image-alt-generating">
                alt tekst aan het genereren…
              </p>
            ) : altText ? (
              <div className="image-alt-text-row">
                <p className="body-r text-gray-400">
                  <span className="text-gray-300">alt tekst: </span>
                  {altText}
                </p>
                <button
                  type="button"
                  className="image-alt-regenerate"
                  onClick={handleRegenerateAltText}
                  title="Genereer nieuwe alt tekst"
                >
                  <DSIcon name="ui-arrow-clockwise" size={16} color="var(--gray-400)" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Caption field */}
          <div className="image-caption-container">
            <TextField
              label="Bijschrift"
              value={caption}
              onChange={handleCaptionChange}
              placeholder="Voeg een bijschrift toe..."
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageContent

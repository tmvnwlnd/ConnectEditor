import { useState, useRef } from 'react'
import PositioningButtons from './PositioningButtons'
import Icon from './Icon'
import TextField from './TextField'
import PhotoIcon from '../icons/ui-photo.svg?react'
import '../styles/ImageElement.css'

const ImageElement = ({
  onChange,
  initialContent,
  isFocused,
  isFirst,
  isLast,
  isLinking,
  onMoveUp,
  onMoveDown,
  onLink,
  onDuplicate,
  onDelete
}) => {
  const [image, setImage] = useState(initialContent?.image || null)
  const [altText, setAltText] = useState(initialContent?.altText || '')
  const [aspectRatio, setAspectRatio] = useState(initialContent?.aspectRatio || 'large-square')
  const [showReplaceMenu, setShowReplaceMenu] = useState(false)
  const fileInputRef = useRef(null)
  const replaceMenuRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Alleen .jpeg, .png of .gif bestanden zijn toegestaan')
      return
    }

    // Validate file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Bestand is te groot. Maximum grootte is 10 MB')
      return
    }

    // Read file and convert to data URL
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
    <div className="editor-section-container">
      <PositioningButtons
        visible={isFocused}
        dimmed={false}
        isFirst={isFirst}
        isLast={isLast}
        isLinking={isLinking}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onLink={onLink}
        onDuplicate={onDuplicate}
        onDelete={onDelete}
      />

      <div className={`image-element-wrapper ${isFocused ? 'element-focused' : ''}`}>
        <div className="image-element-header">
          <span className="element-header-icon">
            <Icon
              icon={PhotoIcon}
              color={isFocused ? '#00c300' : '#737373'}
              size={24}
            />
          </span>
          <span className="element-header-text">Afbeelding</span>
        </div>

        {!image ? (
          // Empty state
          <div className="image-element-empty">
            <span className="empty-state-icon">
              <Icon icon={PhotoIcon} color="#d0d0d0" size={80} />
            </span>
            <p className="empty-state-text">Sleep een foto naar dit veld om toe te voegen</p>
            <p className="empty-state-subtext">.jpeg, .png of .gif</p>
            <p className="empty-state-subtext">max 10 MB</p>

            <div className="image-upload-buttons">
              <button
                className="btn btn-outline-primary"
                onClick={handleBrowseClick}
              >
                Browse mijn computer
              </button>
              <button
                className="btn btn-outline-primary"
                disabled
              >
                Open de beeldbank
              </button>
            </div>
            <button
              className="btn btn-outline-primary btn-full-width"
              disabled
            >
              Gebruik een URL
            </button>

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
          <div className="image-element-filled">
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
                  <div className="toolbar-menu" ref={replaceMenuRef}>
                    <button
                      className="toolbar-menu-item"
                      onClick={handleBrowseClick}
                    >
                      Browse mijn computer
                    </button>
                    <button
                      className="toolbar-menu-item disabled"
                      disabled
                    >
                      Open de beeldbank
                    </button>
                    <button
                      className="toolbar-menu-item disabled"
                      disabled
                    >
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
    </div>
  )
}

export default ImageElement

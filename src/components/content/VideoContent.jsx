import { useState, useRef } from 'react'
import { Icon } from '../ds'
import TextField from '../TextField'
import { Button } from '../ds'
import DropdownMenu from '../DropdownMenu'
import '../../styles/VideoContent.css'

/**
 * VideoContent Component
 *
 * Content renderer for Video elements.
 * Handles video upload and playback.
 */
const VideoContent = ({ content, onChange, isFocused }) => {
  const [video, setVideo] = useState(content?.video || null)
  const [caption, setCaption] = useState(content?.caption || '')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validTypes = ['video/mp4', 'video/webm', 'video/ogg']
    if (!validTypes.includes(file.type)) {
      alert('Alleen .mp4, .webm of .ogg bestanden zijn toegestaan')
      return
    }

    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      alert('Bestand is te groot. Maximum grootte is 100 MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const videoData = e.target.result
      setVideo(videoData)
      if (onChange) {
        onChange({ video: videoData, caption })
      }
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
      onChange({ video, caption: newCaption })
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
      setUrlError('Ongeldige URL. Zorg ervoor dat de URL begint met http:// of https://')
      return
    }

    // For videos, we'll just trust the URL and load it
    setVideo(urlValue)
    setShowUrlInput(false)
    setUrlValue('')
    setUrlError('')
    if (onChange) {
      onChange({ video: urlValue, caption, sourceType: 'url' })
    }
  }

  return (
    <div className="video-content">
      {!video ? (
        showUrlInput ? (
          // URL Input Mode
          <div className="video-empty">
            <span className="empty-icon">
              <Icon name="ui-play-square" color="#d0d0d0" size={80} />
            </span>
            <div className="empty-text-group">
              <p className="body-r text-gray-400">Voer de URL van de video in</p>
            </div>

            <div style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <TextField
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                placeholder="https://voorbeeld.nl/video.mp4"
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
                  Laad video
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Empty state
          <div className="video-empty">
            <span className="empty-icon">
              <Icon name="ui-play-square" color="#d0d0d0" size={80} />
            </span>
            <div className="empty-text-group">
              <p className="body-r text-gray-400">Sleep een video naar dit veld om toe te voegen</p>
              <p className="body-r text-gray-300">.mp4, .webm of .ogg · max 100 MB</p>
            </div>

            <div className="video-upload-buttons">
              <Button variant="secondary" onClick={handleBrowseClick}>
                Browse mijn computer
              </Button>
              <Button variant="secondary" disabled>
                Gebruik een URL
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        )
      ) : (
        // Filled state
        <div className="video-filled">
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
                  placeholder="https://voorbeeld.nl/video.mp4"
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
                    Laad video
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
              { label: 'Gebruik een URL', disabled: true }
            ]}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div className="video-player-container">
            <video controls className="video-player">
              <source src={video} type="video/mp4" />
              Your browser does not support the video element.
            </video>
          </div>

          <TextField
            label="Bijschrift"
            value={caption}
            onChange={handleCaptionChange}
            placeholder="Voeg een bijschrift toe aan de video..."
            tooltipText="Een bijschrift helpt lezers om de context van de video te begrijpen."
          />
        </div>
      )}
    </div>
  )
}

export default VideoContent

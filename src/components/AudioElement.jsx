import { useState, useRef } from 'react'
import PositioningButtons from './PositioningButtons'
import Icon from './Icon'
import SpeakerIcon from '../icons/ui-speaker-high.svg?react'
import '../styles/AudioElement.css'

const AudioElement = ({
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
  const [audio, setAudio] = useState(initialContent?.audio || null)
  const [showReplaceMenu, setShowReplaceMenu] = useState(false)
  const fileInputRef = useRef(null)
  const replaceMenuRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg']
    if (!validTypes.includes(file.type)) {
      alert('Alleen .mp3, .wav of .ogg bestanden zijn toegestaan')
      return
    }

    // Validate file size (50MB = 50 * 1024 * 1024 bytes)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Bestand is te groot. Maximum grootte is 50 MB')
      return
    }

    // Read file and convert to data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      const audioData = e.target.result
      setAudio(audioData)
      if (onChange) {
        onChange({ audio: audioData })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
    setShowReplaceMenu(false)
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

      <div className={`audio-element-wrapper ${isFocused ? 'element-focused' : ''}`}>
        <div className="audio-element-header">
          <span className="element-header-icon">
            <Icon
              icon={SpeakerIcon}
              color={isFocused ? '#00c300' : '#737373'}
              size={24}
            />
          </span>
          <span className="element-header-text">Audiofragment</span>
        </div>

        {!audio ? (
          // Empty state
          <div className="audio-element-empty">
            <span className="empty-state-icon">
              <Icon icon={SpeakerIcon} color="#d0d0d0" size={80} />
            </span>
            <p className="empty-state-text">Sleep een audiobestand naar dit veld om toe te voegen</p>
            <p className="empty-state-subtext">.mp3, .wav of .ogg</p>
            <p className="empty-state-subtext">max 50 MB</p>

            <div className="audio-upload-buttons">
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
                Open de mediabank
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
              accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        ) : (
          // Filled state
          <div className="audio-element-filled">
            <div className={`audio-toolbar ${isFocused ? 'visible' : ''}`}>
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
                      Open de mediabank
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
                accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </div>

            <div className="audio-player-container">
              <audio controls className="audio-player">
                <source src={audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AudioElement

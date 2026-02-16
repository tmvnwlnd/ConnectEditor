import { useState, useRef, useEffect } from 'react'
import Icon from '../Icon'
import { Button } from '../ds'
import TextField from '../TextField'
import SpeakerIcon from '../../icons/ui-speaker-high.svg?react'
import '../../styles/AudioContent.css'

/**
 * AudioContent Component
 *
 * Content renderer for Audio elements.
 * Handles audio upload and playback.
 */
const AudioContent = ({ content, onChange, isFocused }) => {
  const [audio, setAudio] = useState(content?.audio || null)
  const [title, setTitle] = useState(content?.title || '')
  const [fileName, setFileName] = useState(content?.fileName || '')
  const [fileType, setFileType] = useState(content?.fileType || '')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const fileInputRef = useRef(null)
  const audioRef = useRef(null)

  // Force audio element to load metadata when audio source changes
  useEffect(() => {
    if (audioRef.current && audio) {
      const handleLoadedMetadata = () => {
        // Force a re-render after metadata loads
        if (audioRef.current) {
          audioRef.current.currentTime = 0
        }
      }

      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.load()

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata)
        }
      }
    }
  }, [audio])

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

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    // Extract file metadata
    const name = file.name
    const extension = name.split('.').pop().toLowerCase()

    // Set metadata immediately
    setFileName(name)
    setFileType(extension)
    setIsLoading(true)
    setLoadingProgress(0)

    // Revoke previous blob URL to free memory
    if (audio && audio.startsWith('blob:')) {
      URL.revokeObjectURL(audio)
    }

    const audioUrl = URL.createObjectURL(file)

    // Simulate upload progress for prototype
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setLoadingProgress(100)
        setAudio(audioUrl)
        setIsLoading(false)
        if (onChange) {
          onChange({
            audio: audioUrl,
            title,
            fileName: name,
            fileType: extension,
            sourceType: 'blob'
          })
        }
      } else {
        setLoadingProgress(Math.round(progress))
      }
    }, 300)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    if (onChange) {
      onChange({ audio, title: newTitle, fileName, fileType })
    }
  }

  return (
    <div className="audio-content">
      {!audio ? (
        // Empty state
        <div className="audio-empty">
          <span className="empty-icon">
            <Icon icon={SpeakerIcon} color="#d0d0d0" size={80} />
          </span>
          <div className="empty-text-group">
            <p className="body-r text-gray-400">Sleep een audiobestand naar dit veld om toe te voegen</p>
            <p className="body-r text-gray-300">.mp3, .wav of .ogg · max 50 MB</p>
          </div>

          <Button
            variant="secondary"
            onClick={handleBrowseClick}
          >
            Browse mijn computer
          </Button>

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
        <div className="audio-filled">
          <div style={{
            position: 'relative',
            opacity: isFocused ? 1 : 0,
            transition: 'opacity 0.2s ease',
            marginBottom: '20px',
            width: 'fit-content'
          }}>
            <Button
              variant="ghost"
              onClick={handleBrowseClick}
              disabled={isLoading}
            >
              vervang
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div className="audio-card">
            <div className="audio-card-header">
              <Icon icon={SpeakerIcon} color="var(--kpn-green-500)" size={24} />
              <div className="audio-card-info">
                <p className="audio-card-filename">{fileName}</p>
                {fileType && (
                  <p className="audio-card-filetype">.{fileType}</p>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="audio-loading">
                <div className="audio-loading-bar">
                  <div
                    className="audio-loading-progress"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="audio-loading-text">{loadingProgress}%</p>
              </div>
            ) : (
              <>
                <div className="audio-player-container">
                  <audio key={audio} ref={audioRef} controls preload="metadata" className="audio-player">
                    <source src={audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>

                <TextField
                  label="Titel audiofragment"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Geef het audiofragment een titel..."
                  tooltipText="Deze titel wordt getoond bij het audiofragment in de preview."
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioContent

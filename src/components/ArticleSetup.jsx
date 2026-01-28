import { useState, useRef, useEffect } from 'react'
import { Button, TextField, TextArea, JudithButton, IconPicker } from './ds'
import Icon from './Icon'
import ArticleTeaser from './ArticleTeaser'
import DropdownMenu from './DropdownMenu'
import PhotoIcon from '../icons/ui-photo.svg?react'
import { getRandomPlaceholder } from '../utils/placeholders'
import '../styles/ArticleSetup.css'

const ArticleSetup = () => {
  const fileInputRef = useRef(null)

  // Load from localStorage if available
  const savedData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')

  const [title, setTitle] = useState(savedData.title || '')
  const [introduction, setIntroduction] = useState(savedData.introduction || '')
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null)
  const [icon, setIcon] = useState(savedData.icon || 'ui-star')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')

  // Random placeholders - set once on mount
  const [titlePlaceholder] = useState(() => getRandomPlaceholder('title'))
  const [introPlaceholder] = useState(() => getRandomPlaceholder('introduction'))

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Alleen .jpeg, .png of .gif bestanden zijn toegestaan')
      return
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      alert('Bestand is te groot. Maximum grootte is 10 MB')
      return
    }

    // Read file and convert to data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      setCoverImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleShowUrlInput = () => {
    setShowUrlInput(true)
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

    // Set the image
    setCoverImage(urlValue)
    setShowUrlInput(false)
    setUrlValue('')
    setUrlError('')
  }

  // Auto-save to localStorage on changes
  useEffect(() => {
    const setupData = {
      title,
      introduction,
      coverImage,
      icon
    }
    localStorage.setItem('articleSetupData', JSON.stringify(setupData))
  }, [title, introduction, coverImage, icon])

  return (
    <div className="article-setup">
      <div className="article-setup-container">
        <div className="setup-main">
          <div className="setup-left-column">
            {/* 1. Introduction */}
            <TextArea
              label="Introductie van jouw artikel"
              value={introduction}
              onChange={(e) => setIntroduction(e.target.value)}
              placeholder={introPlaceholder}
              rows={5}
              endButton={<JudithButton variant="blue" context="introduction" onApplySuggestion={(suggestion) => setIntroduction(suggestion)} />}
            />

            {/* 2. Title */}
            <TextField
              label="Titel van jouw artikel"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={titlePlaceholder}
              endButton={<JudithButton variant="blue" context="title" onApplySuggestion={(suggestion) => setTitle(suggestion)} />}
            />

            {/* 3. Icon Picker */}
            <IconPicker
              label="Icoon voor rij-variant"
              value={icon}
              onChange={setIcon}
            />

            {/* 4. Cover Image */}
            <div className="setup-field">
              <label className="field-label">Omslagfoto</label>
              <div className="cover-image-upload">
                {!coverImage ? (
                  <div className="cover-image-empty">
                    {showUrlInput && (
                      <div className="cover-url-overlay">
                        <div className="cover-url-content">
                          <h3 className="body-l" style={{ margin: '0 0 16px 0', fontWeight: 600 }}>
                            Gebruik een URL
                          </h3>
                          <TextField
                            value={urlValue}
                            onChange={(e) => setUrlValue(e.target.value)}
                            placeholder="https://voorbeeld.nl/afbeelding.jpg"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleLoadUrl()
                              if (e.key === 'Escape') handleCancelUrl()
                            }}
                            autoFocus
                          />
                          {urlError && (
                            <p style={{ color: 'var(--kpn-red-500)', fontSize: '14px', margin: '8px 0 0 0' }}>
                              {urlError}
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
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
                    <span className="empty-icon">
                      <Icon icon={PhotoIcon} color="#d0d0d0" size={80} />
                    </span>
                    <div className="empty-text-group">
                      <p className="body-r text-gray-400">Sleep een foto naar dit veld om toe te voegen</p>
                      <p className="body-r text-gray-300">.jpeg, .png of .gif · max 10 MB</p>
                    </div>

                    <div className="cover-upload-buttons">
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
                ) : (
                  <div className="cover-image-preview">
                    {showUrlInput && (
                      <div className="cover-url-overlay">
                        <div className="cover-url-content">
                          <h3 className="body-l" style={{ margin: '0 0 16px 0', fontWeight: 600 }}>
                            Gebruik een URL
                          </h3>
                          <TextField
                            value={urlValue}
                            onChange={(e) => setUrlValue(e.target.value)}
                            placeholder="https://voorbeeld.nl/afbeelding.jpg"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleLoadUrl()
                              if (e.key === 'Escape') handleCancelUrl()
                            }}
                            autoFocus
                          />
                          {urlError && (
                            <p style={{ color: 'var(--kpn-red-500)', fontSize: '14px', margin: '8px 0 0 0' }}>
                              {urlError}
                            </p>
                          )}
                          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
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
                    <img src={coverImage} alt="Cover" className="preview-image" />
                    <DropdownMenu
                      trigger={
                        <Button variant="secondary">
                          Wijzig afbeelding
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview in Right Column */}
          <div className="setup-right-column">
            <div className="preview-section">
              <div className="preview-variants">
                {coverImage && (
                  <>
                    <div className="preview-variant-label body-r text-gray-400">Tegel</div>
                    <div className="preview-fade-in">
                      <ArticleTeaser
                        variant="tile"
                        article={{
                          title: title,
                          introduction: introduction,
                          coverImage: coverImage,
                          date: new Date(),
                        }}
                      />
                    </div>
                  </>
                )}

                {title && (
                  <>
                    <div className="preview-variant-label body-r text-gray-400">Rij met icoon</div>
                    <div className="preview-fade-in">
                      <ArticleTeaser
                        variant="row"
                        article={{
                          title: title,
                          icon: icon,
                          date: new Date(),
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleSetup

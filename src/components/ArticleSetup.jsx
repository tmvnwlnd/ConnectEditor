import { useState, useRef, useEffect } from 'react'
import { Button, TextField, TextArea, JudithButton } from './ds'
import Icon from './Icon'
import ArticleTeaser from './ArticleTeaser'
import DropdownMenu from './DropdownMenu'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import { GROUPS, DEFAULT_GROUP, CHANNELS, FEEDS } from '../config/publishingTargeting'
import PhotoIcon from '../icons/ui-photo.svg?react'
import { getRandomPlaceholder } from '../utils/placeholders'
import { validateRequired, validateUrl, validateFileType, validateFileSize, warnLength } from '../utils/validation'
import '../styles/ArticleSetup.css'

// The article as it shows up in TEAMKPN: the feed tile, the side-list tile and the list row.
export const TeaserPreviews = ({ article }) => (
  <>
    <div className="preview-variant-label body-r text-gray-400">Tegel in een feed</div>
    <div className="preview-fade-in"><ArticleTeaser variant="stacked" article={article} /></div>
    <div className="preview-variant-label body-r text-gray-400">Tegel in een lijst</div>
    <div className="preview-fade-in"><ArticleTeaser variant="horizontal" article={article} /></div>
    <div className="preview-variant-label body-r text-gray-400">Rij</div>
    <div className="preview-fade-in"><ArticleTeaser variant="row" article={article} /></div>
  </>
)

const ArticleSetup = () => {
  const fileInputRef = useRef(null)

  // Load from localStorage if available
  const savedData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')

  const [title, setTitle] = useState(savedData.title || '')
  const [introduction, setIntroduction] = useState(savedData.introduction || '')
  const [coverImage, setCoverImage] = useState(savedData.coverImage || null)
  // Plaatsing: the group it is posted in (preset to the channel group, SoW J5), the channel(s) it
  // appears in, and the feed(s) it is in (at least one, SoW G1). Stale ids from older data are dropped.
  const [group, setGroup] = useState(GROUPS.some(g => g.id === savedData.group) ? savedData.group : DEFAULT_GROUP)
  const [channels, setChannels] = useState(
    Array.isArray(savedData.channels) ? savedData.channels.filter(id => CHANNELS.some(c => c.id === id)) : [CHANNELS[0].id]
  )
  const [feeds, setFeeds] = useState((savedData.feeds || []).filter(id => FEEDS.some(f => f.id === id)))
  const [placementTouched, setPlacementTouched] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlValue, setUrlValue] = useState('')
  const [urlError, setUrlError] = useState('')

  // Validation state
  const [titleError, setTitleError] = useState('')
  const [titleWarning, setTitleWarning] = useState('')
  const [introWarning, setIntroWarning] = useState('')
  const [coverImageError, setCoverImageError] = useState('')
  const [titleTouched, setTitleTouched] = useState(false)

  // Random placeholders - set once on mount
  const [titlePlaceholder] = useState(() => getRandomPlaceholder('title'))
  const [introPlaceholder] = useState(() => getRandomPlaceholder('introduction'))

  // Title validation on blur
  const handleTitleBlur = () => {
    setTitleTouched(true)
    const error = validateRequired(title, 'Titel')
    setTitleError(error || '')
    if (!error) {
      setTitleWarning(warnLength(title, 10, 100, 'Titel') || '')
    } else {
      setTitleWarning('')
    }
  }

  // Update title warning as user types (only if already touched)
  const handleTitleChange = (e) => {
    const val = e.target.value
    setTitle(val)
    // Clear error as soon as user starts typing
    if (titleError && val.trim()) {
      setTitleError('')
    }
    // Update warning live once the field has been touched
    if (titleTouched && !validateRequired(val, 'Titel')) {
      setTitleWarning(warnLength(val, 10, 100, 'Titel') || '')
    }
  }

  // Introduction warning on blur
  const handleIntroBlur = () => {
    setIntroWarning(warnLength(introduction, 0, 500, 'Introductie') || '')
  }

  // Update intro warning as user types
  const handleIntroChange = (e) => {
    const val = e.target.value
    setIntroduction(val)
    if (introWarning) {
      setIntroWarning(warnLength(val, 0, 500, 'Introductie') || '')
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Clear previous error
    setCoverImageError('')

    // Validate file type
    const typeError = validateFileType(file, ['image/jpeg', 'image/png', 'image/gif'], '.jpeg, .png of .gif')
    if (typeError) {
      setCoverImageError(typeError)
      return
    }

    // Validate file size (10MB)
    const sizeError = validateFileSize(file, 10)
    if (sizeError) {
      setCoverImageError(sizeError)
      return
    }

    // Revoke previous blob URL to free memory
    if (coverImage && coverImage.startsWith('blob:')) {
      URL.revokeObjectURL(coverImage)
    }

    setCoverImage(URL.createObjectURL(file))
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
    const error = validateUrl(urlValue)
    if (error) {
      setUrlError(error)
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
      group,
      channels,
      feeds
    }
    try {
      localStorage.setItem('articleSetupData', JSON.stringify(setupData))
    } catch (e) {
      console.warn('Could not save setup data to localStorage (quota exceeded):', e.message)
    }
  }, [title, introduction, coverImage, group, channels, feeds])

  return (
    <div className="article-setup">
      <div className="article-setup-container">
        <div className="setup-main">
          <div className="setup-left-column">
            {/* 1. Introduction */}
            <div className="field-with-ai-button">
              <div className="field-label-row">
                <label className="field-label">Introductie van jouw artikel</label>
                <JudithButton
                  variant="blue"
                  context="introduction"
                  onApplySuggestion={(suggestion) => setIntroduction(suggestion)}
                  currentContent={introduction}
                  hasOtherText={title.trim().length > 0}
                />
              </div>
              <TextArea
                value={introduction}
                onChange={handleIntroChange}
                onBlur={handleIntroBlur}
                placeholder={introPlaceholder}
                rows={5}
                warning={introWarning}
              />
            </div>

            {/* 2. Title */}
            <div className="field-with-ai-button">
              <div className="field-label-row">
                <label className="field-label">Titel van jouw artikel</label>
                <JudithButton
                  variant="blue"
                  context="title"
                  onApplySuggestion={(suggestion) => setTitle(suggestion)}
                  currentContent={title}
                  hasOtherText={introduction.trim().length > 0}
                />
              </div>
              <TextField
                value={title}
                onChange={handleTitleChange}
                onBlur={handleTitleBlur}
                placeholder={titlePlaceholder}
                error={titleError}
                warning={titleWarning}
              />
            </div>

            {/* 3. Cover Image */}
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
                            error={urlError}
                            autoFocus
                          />
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

                    {coverImageError && (
                      <p className="body-r field-error-message">{coverImageError}</p>
                    )}

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
                            error={urlError}
                            autoFocus
                          />
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

            {/* 4. Plaatsing */}
            <SettingsSection label="Groep" description="De groep waarin het artikel geplaatst wordt.">
              <ChoiceField name="setup-group" options={GROUPS} value={group} onChange={setGroup} placeholder="Kies een groep…" />
            </SettingsSection>

            <SettingsSection
              label="Channels"
              tag="(minimaal één)"
              error={placementTouched && channels.length === 0 ? 'Kies minimaal één channel' : ''}
            >
              <ChoiceField
                name="setup-channels"
                multiple
                options={CHANNELS}
                value={channels}
                onChange={(v) => { setChannels(v); setPlacementTouched(true) }}
              />
            </SettingsSection>

            <SettingsSection
              label="Feeds"
              tag="(minimaal één)"
              description="Een artikel staat altijd in minimaal één feed."
              error={placementTouched && feeds.length === 0 ? 'Kies minimaal één feed' : ''}
            >
              <ChoiceField
                name="setup-feeds"
                multiple
                options={FEEDS}
                value={feeds}
                onChange={(v) => { setFeeds(v); setPlacementTouched(true) }}
                placeholder="Voeg een feed toe…"
              />
            </SettingsSection>
          </div>

          {/* Preview in Right Column */}
          <div className="setup-right-column">
            <div className="preview-section">
              <div className="preview-variants">
                {(title || coverImage) && (
                  <TeaserPreviews article={{ title, introduction, coverImage }} />
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

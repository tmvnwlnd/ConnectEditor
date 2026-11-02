import { useState, useRef, useEffect } from 'react'
import { Button, TextField, TextArea, JudithButton } from './ds'
import Icon from './Icon'
import ArticleTeaser from './ArticleTeaser'
import DropdownMenu from './DropdownMenu'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import { GROUPS, DEFAULT_GROUP, CHANNELS, FEEDS, channelName } from '../config/publishingTargeting'
import PhotoIcon from '../icons/ui-photo.svg?react'
import { getRandomPlaceholder } from '../utils/placeholders'
import { validateRequired, validateUrl, validateFileType, validateFileSize, warnLength } from '../utils/validation'
import '../styles/ArticleSetup.css'

// The article as it shows up in TEAMKPN: the feed tile and the side-list tile.
export const TeaserPreviews = ({ article }) => (
  <>
    <div className="preview-variant-label body-r text-gray-400">Tegel in een feed</div>
    <div className="preview-fade-in"><ArticleTeaser variant="stacked" article={article} /></div>
    <div className="preview-variant-label body-r text-gray-400">Tegel in een lijst</div>
    <div className="preview-fade-in"><ArticleTeaser variant="horizontal" article={article} /></div>
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
  // appears in, and PER CHANNEL the feed(s) it is in (at least one per channel, SoW G1) — `feedsByChannel`
  // ({ channelId: [feedIds] }); `feeds` (saved alongside) is their union, for everything downstream.
  // Stale ids from older data are dropped.
  const [group, setGroup] = useState(GROUPS.some(g => g.id === savedData.group) ? savedData.group : DEFAULT_GROUP)
  const [channels, setChannels] = useState(
    Array.isArray(savedData.channels) ? savedData.channels.filter(id => CHANNELS.some(c => c.id === id)) : [CHANNELS[0].id]
  )
  const validFeeds = (ids) => (ids || []).filter(id => FEEDS.some(f => f.id === id))
  const [feedsByChannel, setFeedsByChannel] = useState(() => {
    const saved = savedData.feedsByChannel || {}
    // Older saves had one flat `feeds` list: give it to every saved channel.
    return Object.fromEntries(CHANNELS.map(c => [c.id, validFeeds(saved[c.id] || (savedData.feedsByChannel ? [] : savedData.feeds))]))
  })
  const setChannelFeeds = (channelId, ids) => setFeedsByChannel(m => ({ ...m, [channelId]: ids }))
  // Only the picked channels count; their feeds together are the article's feeds.
  const feeds = [...new Set(channels.flatMap(id => feedsByChannel[id] || []))]
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
      feeds,
      feedsByChannel: Object.fromEntries(channels.map(id => [id, feedsByChannel[id] || []]))
    }
    try {
      localStorage.setItem('articleSetupData', JSON.stringify(setupData))
    } catch (e) {
      console.warn('Could not save setup data to localStorage (quota exceeded):', e.message)
    }
  }, [title, introduction, coverImage, group, channels, feedsByChannel]) // eslint-disable-line react-hooks/exhaustive-deps

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
            <SettingsSection label="Groep">
              <ChoiceField name="setup-group" options={GROUPS} value={group} onChange={setGroup} placeholder="Kies een groep…" />
            </SettingsSection>

            <SettingsSection
              label="Channels"
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

            {/* Feeds are set PER CHANNEL: one field for every picked channel. */}
            {channels.map((channelId) => {
              const picked = feedsByChannel[channelId] || []
              return (
                <SettingsSection
                  key={channelId}
                  label={channels.length > 1 ? `Feeds in ${channelName(channelId)}` : 'Feeds'}
                  error={placementTouched && picked.length === 0 ? `Kies minimaal één feed voor ${channelName(channelId)}` : ''}
                >
                  <ChoiceField
                    name={`setup-feeds-${channelId}`}
                    multiple
                    options={FEEDS}
                    value={picked}
                    onChange={(v) => { setChannelFeeds(channelId, v); setPlacementTouched(true) }}
                    placeholder="Voeg een feed toe…"
                  />
                </SettingsSection>
              )
            })}
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

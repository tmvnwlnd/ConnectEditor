import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Button from './Button'
import IconButton from './IconButton'
import Icon from './Icon'
import RadioGroup from './RadioGroup'
import SettingsSection from './SettingsSection'
import ArticlePreviewCard from './ArticlePreviewCard'
import Tag from './Tag'
import Tooltip from './Tooltip'
import Dropdown from './Dropdown'
import Modal from './Modal'
import TextField from './TextField'
import PencilIcon from '../icons/ui-pencil-line.svg?react'
import CalendarIcon from '../icons/ui-calendar.svg?react'
import InfoIcon from '../icons/ui-info.svg?react'
import PlusIcon from '../icons/ui-plus.svg?react'
import TrashIcon from '../icons/ui-trash.svg?react'
import ArrowRightIcon from '../icons/ui-arrow-right.svg?react'
import '../styles/ArticleSettings.css'

const ArticleSettings = () => {
  const navigate = useNavigate()

  // Load from localStorage if available
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const savedSettingsData = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')

  // State management
  const [groups, setGroups] = useState(savedSettingsData.groups || ['KPN Ultimate'])
  const [groupSearch, setGroupSearch] = useState('')
  const [postToProfile, setPostToProfile] = useState(savedSettingsData.postToProfile || false)

  const [scheduleType, setScheduleType] = useState(savedSettingsData.scheduleType || 'immediate')
  const [startDate, setStartDate] = useState(savedSettingsData.startDate ? new Date(savedSettingsData.startDate) : null)
  const [endDate, setEndDate] = useState(savedSettingsData.endDate ? new Date(savedSettingsData.endDate) : null)

  const [commentsEnabled, setCommentsEnabled] = useState(savedSettingsData.commentsEnabled ?? true)

  const [hrChatbotEnabled, setHrChatbotEnabled] = useState(savedSettingsData.hrChatbotEnabled ?? true)

  // Optional settings state
  const [selectedOptionalSettings, setSelectedOptionalSettings] = useState(savedSettingsData.selectedOptionalSettings || [])

  // Tags
  const [tags, setTags] = useState(savedSettingsData.tags || [])
  const [tagInput, setTagInput] = useState('')

  // Community
  const [community, setCommunity] = useState(savedSettingsData.community || '')

  // Channel placements
  const [channelPlacements, setChannelPlacements] = useState(savedSettingsData.channelPlacements || [{ channel: '', page: '', audience: '' }])

  // Calendar event
  const [calendarEventModalOpen, setCalendarEventModalOpen] = useState(false)
  const [calendarEvent, setCalendarEvent] = useState({
    channels: savedSettingsData.calendarEvent?.channels || '',
    activityType: savedSettingsData.calendarEvent?.activityType || '',
    title: savedSettingsData.calendarEvent?.title || '',
    startDate: savedSettingsData.calendarEvent?.startDate ? new Date(savedSettingsData.calendarEvent.startDate) : new Date(),
    endDate: savedSettingsData.calendarEvent?.endDate ? new Date(savedSettingsData.calendarEvent.endDate) : null,
    startTime: savedSettingsData.calendarEvent?.startTime || '09:00',
    endTime: savedSettingsData.calendarEvent?.endTime || '17:00',
    isMultiday: savedSettingsData.calendarEvent?.isMultiday || false
  })

  const removeGroup = (groupToRemove) => {
    setGroups(groups.filter(g => g !== groupToRemove))
  }

  // Optional settings functions
  const toggleOptionalSetting = (settingId) => {
    setSelectedOptionalSettings(prev => {
      if (prev.includes(settingId)) {
        return prev.filter(id => id !== settingId)
      } else {
        return [...prev, settingId]
      }
    })
  }

  const removeOptionalSetting = (settingId) => {
    setSelectedOptionalSettings(prev => prev.filter(id => id !== settingId))
    // Clear the data for the removed setting
    if (settingId === 'tags') {
      setTags([])
      setTagInput('')
    } else if (settingId === 'community') {
      setCommunity('')
    } else if (settingId === 'channels') {
      setChannelPlacements([{ channel: '', page: '', audience: '' }])
    } else if (settingId === 'calendar') {
      setCalendarEvent({
        channels: '',
        activityType: '',
        title: '',
        startDate: null,
        endDate: null
      })
    }
  }

  // Tags functions
  const addTag = () => {
    if (tagInput.trim()) {
      // Split by comma and add all tags
      const newTags = tagInput.split(',').map(t => t.trim()).filter(t => t)
      setTags(prev => [...new Set([...prev, ...newTags])])
      setTagInput('')
    }
  }

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  // Channel placements functions
  const addChannelPlacement = () => {
    setChannelPlacements([...channelPlacements, { channel: '', page: '', audience: '' }])
  }

  const removeChannelPlacement = (index) => {
    if (channelPlacements.length === 1) {
      // If this is the last placement, remove the whole channels setting
      removeOptionalSetting('channels')
    } else {
      setChannelPlacements(channelPlacements.filter((_, i) => i !== index))
    }
  }

  const updateChannelPlacement = (index, field, value) => {
    const updated = [...channelPlacements]
    updated[index][field] = value
    setChannelPlacements(updated)
  }

  // Calendar event functions
  const handleSaveCalendarEvent = () => {
    setCalendarEventModalOpen(false)
  }

  // Generate time options (00:00 to 23:45 in 15-minute intervals)
  const generateTimeOptions = () => {
    const times = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        times.push({ value: timeString, label: timeString })
      }
    }
    return times
  }

  const handleBackToEditor = () => {
    // Save settings before navigating
    saveSettings()
    navigate('/editor')
  }

  const handleSaveDraft = () => {
    saveSettings()
    alert('Artikel opgeslagen als draft')
  }

  const handlePublish = () => {
    saveSettings()
    alert('Artikel gepubliceerd!')
  }

  const saveSettings = () => {
    const settingsData = {
      groups,
      postToProfile,
      scheduleType,
      startDate: startDate ? startDate.toISOString() : null,
      endDate: endDate ? endDate.toISOString() : null,
      commentsEnabled,
      hrChatbotEnabled,
      selectedOptionalSettings,
      tags,
      community,
      channelPlacements,
      calendarEvent: {
        ...calendarEvent,
        startDate: calendarEvent.startDate ? calendarEvent.startDate.toISOString() : null,
        endDate: calendarEvent.endDate ? calendarEvent.endDate.toISOString() : null,
        startTime: calendarEvent.startTime,
        endTime: calendarEvent.endTime,
        isMultiday: calendarEvent.isMultiday
      }
    }
    localStorage.setItem('articleSettingsData', JSON.stringify(settingsData))
  }

  return (
    <div className="article-settings">
      <div className="article-settings-container">
        <header className="settings-header">
          <h1 className="settings-title">Nieuwsartikel maken</h1>
          <p className="settings-step">Stap 3 van 3</p>
        </header>

        <div className="settings-main">
          <div className="settings-left-column">
            <div className="preview-section">
              <label className="preview-label">Preview van jouw artikel</label>
              <ArticlePreviewCard
                title={savedSetupData.title}
                introduction={savedSetupData.introduction}
                coverImage={savedSetupData.coverImage}
                onEdit={handleBackToEditor}
                editButtonIcon={PencilIcon}
              />
            </div>
          </div>

          <div className="settings-right-column">
            {/* Groups Section */}
            <SettingsSection label="Selecteer groep(en) voor plaatsing">
              <div className="group-selection">
                <div className="selected-groups">
                  {groups.map(group => (
                    <Tag
                      key={group}
                      label={group}
                      onRemove={() => removeGroup(group)}
                    />
                  ))}
                  <input
                    type="text"
                    className="group-search-input"
                    placeholder="Typ om groepen te zoeken..."
                    value={groupSearch}
                    onChange={(e) => setGroupSearch(e.target.value)}
                  />
                </div>
                <label className="settings-checkbox">
                  <input
                    type="checkbox"
                    checked={postToProfile}
                    onChange={(e) => setPostToProfile(e.target.checked)}
                  />
                  <span>Plaats het artikel op mijn profiel</span>
                </label>
              </div>
            </SettingsSection>

            {/* Schedule Section */}
            <SettingsSection label="Wanneer wil je je artikel plaatsen?">
              <RadioGroup
                name="schedule"
                options={[
                  { value: 'immediate', label: 'Direct publiceren' },
                  { value: 'periodic', label: 'Periodiek tonen (selecteer periode)' }
                ]}
                value={scheduleType}
                onChange={setScheduleType}
              />
              {scheduleType === 'periodic' && (
                <div className="date-inputs">
                  <div className="date-input-wrapper">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      placeholderText="Startdatum"
                      dateFormat="dd/MM/yyyy"
                      className="date-input"
                    />
                    <Icon icon={CalendarIcon} size={20} className="date-icon" />
                  </div>
                  <div className="date-input-wrapper">
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      placeholderText="Einddatum"
                      dateFormat="dd/MM/yyyy"
                      minDate={startDate}
                      className="date-input"
                    />
                    <Icon icon={CalendarIcon} size={20} className="date-icon" />
                  </div>
                </div>
              )}
            </SettingsSection>

            {/* Comments Section */}
            <SettingsSection label="Reacties toestaan?">
              <RadioGroup
                name="comments"
                options={[
                  { value: true, label: 'Ja, lezers kunnen reageren' },
                  { value: false, label: 'Nee, reacties zijn uitgeschakeld' }
                ]}
                value={commentsEnabled}
                onChange={setCommentsEnabled}
              />
            </SettingsSection>

            {/* HR Chatbot Section */}
            <SettingsSection
              label="HR chatbot kennisbank"
              tooltip={
                <Tooltip
                  icon={InfoIcon}
                  iconColor="#0066EE"
                  text="De HR chatbot is een AI chatbot die vragen over HR beantwoordt. Met deze functie ingeschakeld kan deze chatbot jouw artikel lezen en de informatie die hierin vermeld wordt meenemen in antwoorden."
                  className="info-tooltip"
                />
              }
            >
              <RadioGroup
                name="hrChatbot"
                options={[
                  { value: true, label: 'Ja, gebruik dit artikel als bron' },
                  { value: false, label: 'Nee, niet toevoegen aan kennisbank' }
                ]}
                value={hrChatbotEnabled}
                onChange={setHrChatbotEnabled}
              />
            </SettingsSection>

            {/* Optional Settings Section */}
            <SettingsSection label="Optionele instellingen">
              <div className="optional-buttons">
                {!selectedOptionalSettings.includes('tags') && (
                  <Button
                    variant="secondary"
                    icon={PlusIcon}
                    onClick={() => toggleOptionalSetting('tags')}
                  >
                    Tags
                  </Button>
                )}
                {!selectedOptionalSettings.includes('community') && (
                  <Button
                    variant="secondary"
                    icon={PlusIcon}
                    onClick={() => toggleOptionalSetting('community')}
                  >
                    Plaats in communities
                  </Button>
                )}
                {!selectedOptionalSettings.includes('channels') && (
                  <Button
                    variant="secondary"
                    icon={PlusIcon}
                    onClick={() => toggleOptionalSetting('channels')}
                  >
                    Plaats in channels
                  </Button>
                )}
                {!selectedOptionalSettings.includes('calendar') && (
                  <Button
                    variant="secondary"
                    icon={PlusIcon}
                    onClick={() => toggleOptionalSetting('calendar')}
                  >
                    Maak kalenderevent
                  </Button>
                )}
              </div>

              {/* Tags Card */}
              {selectedOptionalSettings.includes('tags') && (
                <div className="optional-setting-card">
                  <div className="optional-setting-header">
                    <h3 className="optional-setting-title">Tags</h3>
                    <IconButton
                      variant="delete"
                      icon={TrashIcon}
                      size={20}
                      onClick={() => removeOptionalSetting('tags')}
                      aria-label="Verwijder tags"
                    />
                  </div>
                  <div className="optional-setting-fields">
                    <div className="tags-input-container">
                      <div className="selected-tags">
                        {tags.map(tag => (
                          <Tag
                            key={tag}
                            label={tag}
                            variant="success"
                            onRemove={() => removeTag(tag)}
                          />
                        ))}
                        <input
                          type="text"
                          className="tag-input"
                          placeholder="Typ tags gescheiden door komma's..."
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagInputKeyDown}
                          onBlur={addTag}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Community Card */}
              {selectedOptionalSettings.includes('community') && (
                <div className="optional-setting-card">
                  <div className="optional-setting-header">
                    <h3 className="optional-setting-title">Plaats in community</h3>
                    <IconButton
                      variant="delete"
                      icon={TrashIcon}
                      size={20}
                      onClick={() => removeOptionalSetting('community')}
                      aria-label="Verwijder community"
                    />
                  </div>
                  <div className="optional-setting-fields">
                    <Dropdown
                      value={community}
                      onChange={setCommunity}
                      options={[
                        { value: 'epi', label: 'EPI' },
                        { value: 'navigator', label: 'Navigator' },
                        { value: 'innovation-hub', label: 'Innovation Hub' },
                        { value: 'digital-workspace', label: 'Digital Workspace' },
                        { value: 'customer-first', label: 'Customer First' }
                      ]}
                      placeholder="Selecteer community..."
                    />
                  </div>
                </div>
              )}

              {/* Channels Card */}
              {selectedOptionalSettings.includes('channels') && (
                <div className="optional-setting-card">
                  <div className="optional-setting-header">
                    <h3 className="optional-setting-title">Plaats in channels</h3>
                  </div>
                  <div className="optional-setting-fields">
                    {channelPlacements.map((placement, index) => (
                      <div key={index} className="channel-placement-row">
                        <div className="channel-placement-fields">
                          <div className="channel-field">
                            <label>Channel</label>
                            <Dropdown
                              value={placement.channel}
                              onChange={(value) => updateChannelPlacement(index, 'channel', value)}
                              options={[
                                { value: 'news', label: 'Nieuws' },
                                { value: 'updates', label: 'Updates' },
                                { value: 'events', label: 'Events' },
                                { value: 'hr', label: 'HR & Personeelszaken' },
                                { value: 'tech', label: 'Tech & Innovation' }
                              ]}
                              placeholder="Selecteer channel..."
                            />
                          </div>
                          <div className="channel-field">
                            <label>Pagina</label>
                            <Dropdown
                              value={placement.page}
                              onChange={(value) => updateChannelPlacement(index, 'page', value)}
                              options={[
                                { value: 'home', label: 'Home' },
                                { value: 'featured', label: 'Featured' },
                                { value: 'archive', label: 'Archief' },
                                { value: 'trending', label: 'Trending' }
                              ]}
                              placeholder="Selecteer pagina..."
                            />
                          </div>
                          <div className="channel-field">
                            <label>Doelgroep</label>
                            <Dropdown
                              value={placement.audience}
                              onChange={(value) => updateChannelPlacement(index, 'audience', value)}
                              options={[
                                { value: 'all', label: 'Iedereen' },
                                { value: 'employees', label: 'Werknemers' },
                                { value: 'managers', label: 'Managers' },
                                { value: 'leadership', label: 'Leadership' },
                                { value: 'new-hires', label: 'Nieuwe medewerkers' }
                              ]}
                              placeholder="Selecteer doelgroep..."
                            />
                          </div>
                          <div className="channel-field-delete">
                            <IconButton
                              variant="delete"
                              icon={TrashIcon}
                              size={20}
                              onClick={() => removeChannelPlacement(index)}
                              aria-label="Verwijder plaatsing"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="channel-add-button">
                      <IconButton
                        variant="secondary"
                        icon={PlusIcon}
                        size={20}
                        onClick={addChannelPlacement}
                        aria-label="Voeg plaatsing toe"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Calendar Event Card */}
              {selectedOptionalSettings.includes('calendar') && (
                <div className="optional-setting-card">
                  <div className="optional-setting-header">
                    <h3 className="optional-setting-title">Kalenderevent</h3>
                    <IconButton
                      variant="delete"
                      icon={TrashIcon}
                      size={20}
                      onClick={() => removeOptionalSetting('calendar')}
                      aria-label="Verwijder kalenderevent"
                    />
                  </div>
                  <div className="optional-setting-fields">
                    <div className="calendar-event-display">
                      <div className="calendar-event-info">
                        {calendarEvent.title ? (
                          <>
                            <h4 className="calendar-event-title">{calendarEvent.title}</h4>
                            <p className="calendar-event-time">
                              {calendarEvent.startDate &&
                                new Date(calendarEvent.startDate).toLocaleDateString('nl-NL', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })
                              }
                              {calendarEvent.startTime && ` ${calendarEvent.startTime}`}
                              {calendarEvent.endTime && ` - ${calendarEvent.endTime}`}
                              {calendarEvent.isMultiday && calendarEvent.endDate && (
                                <>
                                  {' tot '}
                                  {new Date(calendarEvent.endDate).toLocaleDateString('nl-NL', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </>
                              )}
                            </p>
                          </>
                        ) : (
                          <p className="calendar-event-empty">Geen event geconfigureerd</p>
                        )}
                      </div>
                      <IconButton
                        variant="secondary"
                        icon={PencilIcon}
                        size={20}
                        onClick={() => setCalendarEventModalOpen(true)}
                        aria-label="Bewerk kalenderevent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </SettingsSection>
          </div>
        </div>

        <footer className="settings-footer">
          <Button
            variant="outline-secondary"
            onClick={handleSaveDraft}
          >
            Artikel opslaan als draft
          </Button>
          <Button
            variant="secondary"
            onClick={handleBackToEditor}
          >
            Terug naar stap 2: inhoud
          </Button>
          <Button
            variant="primary"
            icon={ArrowRightIcon}
            onClick={handlePublish}
          >
            Publiceren
          </Button>
        </footer>
      </div>

      {/* Calendar Event Modal */}
      <Modal
        isOpen={calendarEventModalOpen}
        onClose={() => setCalendarEventModalOpen(false)}
        title="Kalenderevent configureren"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setCalendarEventModalOpen(false)}
            >
              Annuleren
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveCalendarEvent}
            >
              Opslaan
            </Button>
          </>
        }
      >
        <div className="modal-field">
          <label>Selecteer channels</label>
          <Dropdown
            value={calendarEvent.channels}
            onChange={(value) => setCalendarEvent({ ...calendarEvent, channels: value })}
            options={[
              { value: 'news', label: 'Nieuws' },
              { value: 'events', label: 'Events' },
              { value: 'hr', label: 'HR & Personeelszaken' },
              { value: 'all', label: 'Alle channels' }
            ]}
            placeholder="Selecteer channel..."
          />
        </div>

        <div className="modal-field">
          <label>Selecteer type activiteit</label>
          <Dropdown
            value={calendarEvent.activityType}
            onChange={(value) => setCalendarEvent({ ...calendarEvent, activityType: value })}
            options={[
              { value: 'meeting', label: 'Vergadering' },
              { value: 'training', label: 'Training' },
              { value: 'workshop', label: 'Workshop' },
              { value: 'presentation', label: 'Presentatie' },
              { value: 'social', label: 'Sociaal event' }
            ]}
            placeholder="Selecteer activiteit type..."
          />
        </div>

        <div className="modal-field">
          <label>Titel van event</label>
          <TextField
            value={calendarEvent.title}
            onChange={(e) => setCalendarEvent({ ...calendarEvent, title: e.target.value })}
            placeholder="Bijvoorbeeld: KPN Jaarcongres 2025"
          />
        </div>

        {!calendarEvent.isMultiday ? (
          <div className="modal-field">
            <div className="datetime-grid-single">
              <div className="date-picker-column">
                <label>Startdatum</label>
                <DatePicker
                  selected={calendarEvent.startDate}
                  onChange={(date) => setCalendarEvent({ ...calendarEvent, startDate: date })}
                  inline
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <div className="time-picker-column">
                <label className="modal-checkbox">
                  <input
                    type="checkbox"
                    checked={calendarEvent.isMultiday}
                    onChange={(e) => setCalendarEvent({
                      ...calendarEvent,
                      isMultiday: e.target.checked,
                      endDate: e.target.checked ? (calendarEvent.endDate || new Date()) : null
                    })}
                  />
                  <span>Meerdaags event</span>
                </label>
                <div className="time-field">
                  <label>Starttijd</label>
                  <Dropdown
                    value={calendarEvent.startTime}
                    onChange={(value) => setCalendarEvent({ ...calendarEvent, startTime: value })}
                    options={generateTimeOptions()}
                    placeholder="Selecteer tijd..."
                  />
                </div>
                <div className="time-field">
                  <label>Eindtijd</label>
                  <Dropdown
                    value={calendarEvent.endTime}
                    onChange={(value) => setCalendarEvent({ ...calendarEvent, endTime: value })}
                    options={generateTimeOptions()}
                    placeholder="Selecteer tijd..."
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="modal-field">
            <label className="modal-checkbox" style={{ marginBottom: '12px' }}>
              <input
                type="checkbox"
                checked={calendarEvent.isMultiday}
                onChange={(e) => setCalendarEvent({
                  ...calendarEvent,
                  isMultiday: e.target.checked,
                  endDate: e.target.checked ? (calendarEvent.endDate || new Date()) : null
                })}
              />
              <span>Meerdaags event</span>
            </label>
            <div className="datetime-grid-multi">
              <div className="date-time-group">
                <label>Startdatum</label>
                <DatePicker
                  selected={calendarEvent.startDate}
                  onChange={(date) => setCalendarEvent({ ...calendarEvent, startDate: date })}
                  inline
                  dateFormat="dd/MM/yyyy"
                />
                <div className="time-field">
                  <label>Starttijd</label>
                  <Dropdown
                    value={calendarEvent.startTime}
                    onChange={(value) => setCalendarEvent({ ...calendarEvent, startTime: value })}
                    options={generateTimeOptions()}
                    placeholder="Selecteer tijd..."
                  />
                </div>
              </div>
              <div className="date-time-group">
                <label>Einddatum</label>
                <DatePicker
                  selected={calendarEvent.endDate}
                  onChange={(date) => setCalendarEvent({ ...calendarEvent, endDate: date })}
                  inline
                  minDate={calendarEvent.startDate}
                  dateFormat="dd/MM/yyyy"
                />
                <div className="time-field">
                  <label>Eindtijd</label>
                  <Dropdown
                    value={calendarEvent.endTime}
                    onChange={(value) => setCalendarEvent({ ...calendarEvent, endTime: value })}
                    options={generateTimeOptions()}
                    placeholder="Selecteer tijd..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default ArticleSettings

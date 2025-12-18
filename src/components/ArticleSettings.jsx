import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Button from './Button'
import Icon from './Icon'
import RadioGroup from './RadioGroup'
import SettingsSection from './SettingsSection'
import ArticlePreviewCard from './ArticlePreviewCard'
import Tag from './Tag'
import Tooltip from './Tooltip'
import PencilIcon from '../icons/ui-pencil-line.svg?react'
import CalendarIcon from '../icons/ui-calendar.svg?react'
import InfoIcon from '../icons/ui-info.svg?react'
import PlusIcon from '../icons/ui-plus.svg?react'
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

  const removeGroup = (groupToRemove) => {
    setGroups(groups.filter(g => g !== groupToRemove))
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
      hrChatbotEnabled
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
                <Button variant="secondary" icon={PlusIcon}>
                  Tags
                </Button>
                <Button variant="secondary" icon={PlusIcon}>
                  Plaats in communities
                </Button>
                <Button variant="secondary" icon={PlusIcon}>
                  Plaats in channels
                </Button>
                <Button variant="secondary" icon={PlusIcon}>
                  Maak kalenderevent
                </Button>
              </div>
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
    </div>
  )
}

export default ArticleSettings

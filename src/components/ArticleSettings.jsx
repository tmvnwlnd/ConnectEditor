import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { TextField, Tabs, Icon } from './ds'
import SettingsSection from './SettingsSection'
import ArticleTeaser from './ArticleTeaser'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import '../styles/ArticleSettings.css'

// Tooltip icon component
const InfoTooltip = ({ text }) => {
  const iconRef = useRef(null)

  useEffect(() => {
    if (text && iconRef.current) {
      const instance = tippy(iconRef.current, {
        content: text,
        placement: 'top',
        theme: 'translucent',
        arrow: true,
        animation: 'fade',
        maxWidth: 280
      })

      return () => {
        instance.destroy()
      }
    }
  }, [text])

  return (
    <span ref={iconRef} className="settings-info-icon">
      <Icon name="ui-info" size={16} color="var(--kpn-blue-500)" />
    </span>
  )
}

const ArticleSettings = () => {

  // Load from localStorage if available
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const savedSettingsData = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')

  // Active tab
  const [activeTab, setActiveTab] = useState('basis')

  // Doelgroepen (Target Groups)
  const [doelgroepen, setDoelgroepen] = useState(savedSettingsData.doelgroepen || [])

  // Dossiers
  const [dossiers, setDossiers] = useState(savedSettingsData.dossiers || [])

  // Zichtbaar voor partners
  const [partners, setPartners] = useState(savedSettingsData.partners || [])

  // Plaatsen (Publish)
  const [publishType, setPublishType] = useState(savedSettingsData.publishType || 'now')
  const [publishDate, setPublishDate] = useState(savedSettingsData.publishDate ? new Date(savedSettingsData.publishDate) : null)

  // Sluiten (Close/Archive)
  const [closeType, setCloseType] = useState(savedSettingsData.closeType || 'no')
  const [closeDate, setCloseDate] = useState(savedSettingsData.closeDate ? new Date(savedSettingsData.closeDate) : null)

  const doelgroepenOptions = ['Commercieel', 'Operationeel']
  const dossiersOptions = ['Connectivity', 'Security', 'Datacenter', 'Internet', 'Cloud', 'VoIP', 'Mobile', '24/7Services']
  const partnersOptions = ['KPN Excellence', 'RoutIT']

  const tabs = [
    { id: 'basis', label: 'Basis' },
    { id: 'extra', label: 'Extra' }
  ]

  // Simple checkbox handler (no "Alle" logic)
  const handleCheckboxToggle = (value, currentList, setList) => {
    if (currentList.includes(value)) {
      setList(currentList.filter(item => item !== value))
    } else {
      setList([...currentList, value])
    }
  }

  // Auto-save to localStorage on changes
  useEffect(() => {
    const settingsData = {
      doelgroepen,
      dossiers,
      partners,
      publishType,
      publishDate: publishDate ? publishDate.toISOString() : null,
      closeType,
      closeDate: closeDate ? closeDate.toISOString() : null,
    }
    localStorage.setItem('articleSettingsData', JSON.stringify(settingsData))
  }, [doelgroepen, dossiers, partners, publishType, publishDate, closeType, closeDate])

  return (
    <div className="article-settings">
      <div className="article-settings-container">
        <div className="settings-main">
          <div className="settings-left-column">
            {/* Page description */}
            <p className="body-r text-gray-400">
              Onderstaande opties bepalen de plaatsing en vertoning van een artikel. Dossiers, doelgroepen en partnergroepen zijn categoriseringen die in de beheeromgeving kunnen worden aangepast om aan wensen te voldoen.
            </p>

            {/* Tabs */}
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {/* Basis Tab Content */}
            {activeTab === 'basis' && (
              <>
                {/* 1. Doelgroepen */}
                <SettingsSection
                  label="Doelgroepen"
                  tooltip={<InfoTooltip text="Geef aan of een artikel bij een bepaalde doelgroep hoort. Dit heeft gevolgen voor de plaatsing van het artikel op de voorpagina." />}
                >
                  <div className="checkbox-group">
                    {doelgroepenOptions.map(option => (
                      <label key={option} className="settings-checkbox">
                        <input
                          type="checkbox"
                          checked={doelgroepen.includes(option)}
                          onChange={() => handleCheckboxToggle(option, doelgroepen, setDoelgroepen)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  <p className="body-s text-gray-400">Kies minimaal 1 om door te gaan</p>
                </SettingsSection>

                {/* 2. Dossiers */}
                <SettingsSection
                  label="Dossiers"
                  tag="(optioneel)"
                  tooltip={<InfoTooltip text="Geef aan of een artikel over een bepaald product gaat. Het artikel wordt dan aan dit dossier toegevoegd." />}
                >
                  <div className="checkbox-group checkbox-group-two-columns">
                    {dossiersOptions.map(option => (
                      <label key={option} className="settings-checkbox">
                        <input
                          type="checkbox"
                          checked={dossiers.includes(option)}
                          onChange={() => handleCheckboxToggle(option, dossiers, setDossiers)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </SettingsSection>

                {/* 3. Plaatsen */}
                <SettingsSection label="Plaatsen">
                  <div className="scheduling-options">
                    <div className="scheduling-option-row">
                      <label className="scheduling-option">
                        <input
                          type="radio"
                          name="publish"
                          checked={publishType === 'now'}
                          onChange={() => setPublishType('now')}
                        />
                        <span className="scheduling-option-label">Nu plaatsen</span>
                      </label>
                    </div>

                    <div className="scheduling-option-row">
                      <label className="scheduling-option">
                        <input
                          type="radio"
                          name="publish"
                          checked={publishType === 'schedule'}
                          onChange={() => setPublishType('schedule')}
                        />
                        <span className="scheduling-option-label">Plaatsing inplannen</span>
                      </label>
                      <div className={`scheduling-date-picker ${publishType !== 'schedule' ? 'disabled' : ''}`}>
                        <DatePicker
                          selected={publishDate}
                          onChange={(date) => setPublishDate(date)}
                          disabled={publishType !== 'schedule'}
                          popperPlacement="top-start"
                          customInput={
                            <TextField
                              value={publishDate ? publishDate.toLocaleDateString('nl-NL') : ''}
                              placeholder="Selecteer datum"
                              endIcon="ui-calendar"
                              readOnly
                              disabled={publishType !== 'schedule'}
                            />
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                        />
                      </div>
                    </div>

                    <div className="scheduling-option-row">
                      <label className="scheduling-option">
                        <input
                          type="radio"
                          name="publish"
                          checked={publishType === 'draft'}
                          onChange={() => setPublishType('draft')}
                        />
                        <span className="scheduling-option-label">Opslaan als draft</span>
                      </label>
                    </div>
                  </div>
                </SettingsSection>

                {/* 4. Sluiten */}
                <SettingsSection label="Automatisch sluiten">
                  <div className="scheduling-options">
                    <div className="scheduling-option-row">
                      <label className="scheduling-option">
                        <input
                          type="radio"
                          name="close"
                          checked={closeType === 'no'}
                          onChange={() => setCloseType('no')}
                        />
                        <span className="scheduling-option-label">Nee, artikel blijft open</span>
                      </label>
                    </div>

                    <div className="scheduling-option-row">
                      <label className="scheduling-option">
                        <input
                          type="radio"
                          name="close"
                          checked={closeType === 'yes'}
                          onChange={() => setCloseType('yes')}
                        />
                        <span className="scheduling-option-label">Ja, sluit automatisch op</span>
                      </label>
                      <div className={`scheduling-date-picker ${closeType !== 'yes' ? 'disabled' : ''}`}>
                        <DatePicker
                          selected={closeDate}
                          onChange={(date) => setCloseDate(date)}
                          disabled={closeType !== 'yes'}
                          popperPlacement="top-start"
                          customInput={
                            <TextField
                              value={closeDate ? closeDate.toLocaleDateString('nl-NL') : ''}
                              placeholder="Selecteer datum"
                              endIcon="ui-calendar"
                              readOnly
                              disabled={closeType !== 'yes'}
                            />
                          }
                          dateFormat="dd/MM/yyyy"
                          minDate={new Date()}
                        />
                      </div>
                    </div>
                  </div>
                </SettingsSection>
              </>
            )}

            {/* Extra Tab Content */}
            {activeTab === 'extra' && (
              <>
                {/* Zichtbaar voor partners */}
                <SettingsSection
                  label="Zichtbaar voor partners"
                  tooltip={<InfoTooltip text="Indien een artikel alleen zichtbaar mag worden voor bepaalde partnergroepen." />}
                >
                  <div className="checkbox-group">
                    {partnersOptions.map(option => (
                      <label key={option} className="settings-checkbox">
                        <input
                          type="checkbox"
                          checked={partners.includes(option)}
                          onChange={() => handleCheckboxToggle(option, partners, setPartners)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  <p className="body-s text-gray-400">Kies minimaal 1 om door te gaan</p>
                </SettingsSection>
              </>
            )}
          </div>

          <div className="settings-right-column">
            <div className="preview-section">
              <div className="preview-variants">
                <div className="preview-variant-label body-r text-gray-400">Tegel</div>
                <ArticleTeaser
                  variant="tile"
                  article={{
                    title: savedSetupData.title,
                    introduction: savedSetupData.introduction,
                    coverImage: savedSetupData.coverImage,
                    date: new Date(),
                  }}
                />

                <div className="preview-variant-label body-r text-gray-400">Rij met icoon</div>
                <ArticleTeaser
                  variant="row"
                  article={{
                    title: savedSetupData.title,
                    icon: savedSetupData.icon,
                    date: new Date(),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticleSettings

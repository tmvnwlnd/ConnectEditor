import { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { TextField, Tabs, Icon, Dropdown } from './ds'
import SettingsSection from './SettingsSection'
import ArticleTeaser from './ArticleTeaser'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import { validateMinSelection, validateDateRequired, validateDateAfter } from '../utils/validation'
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

  // Zichtbaar voor partners (default: all selected on first visit)
  const [partners, setPartners] = useState(
    savedSettingsData.partners !== undefined
      ? savedSettingsData.partners
      : ['KPN Excellence', 'RoutIT']
  )

  // Plaatsen (Publish)
  const [publishType, setPublishType] = useState(savedSettingsData.publishType || 'now')
  const [publishDate, setPublishDate] = useState(savedSettingsData.publishDate ? new Date(savedSettingsData.publishDate) : null)

  // Sluiten (Close/Archive)
  const [closeType, setCloseType] = useState(savedSettingsData.closeType || 'no')
  const [closeDate, setCloseDate] = useState(savedSettingsData.closeDate ? new Date(savedSettingsData.closeDate) : null)

  // Pagina plaatsing (Page placement)
  const [paginaPlaatsing, setPaginaPlaatsing] = useState(savedSettingsData.paginaPlaatsing || {
    voorpagina: { enabled: false, position: '' },
    commercieel: { enabled: false, position: '' },
    operationeel: { enabled: false, position: '' },
  })

  const PLACEHOLDER_ARTICLE_COUNT = 20

  const placementOptions = [
    { value: '1', label: 'Bovenaan (1)' },
    ...Array.from({ length: PLACEHOLDER_ARTICLE_COUNT - 1 }, (_, i) => ({
      value: String(i + 2),
      label: String(i + 2),
    })),
    { value: String(PLACEHOLDER_ARTICLE_COUNT + 1), label: `Onderaan (${PLACEHOLDER_ARTICLE_COUNT + 1})` },
  ]

  const paginaOptions = [
    { key: 'voorpagina', label: 'Voorpagina' },
    { key: 'commercieel', label: 'Commercieel' },
    { key: 'operationeel', label: 'Operationeel' },
  ]

  const handlePaginaToggle = (key) => {
    setPaginaPlaatsing(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled,
        position: !prev[key].enabled ? prev[key].position : '',
      },
    }))
  }

  const handlePaginaPosition = (key, value) => {
    setPaginaPlaatsing(prev => ({
      ...prev,
      [key]: { ...prev[key], position: value },
    }))
  }

  // Validation state
  const [doelgroepenError, setDoelgroepenError] = useState('')
  const [partnersError, setPartnersError] = useState('')
  const [publishDateError, setPublishDateError] = useState('')
  const [closeDateError, setCloseDateError] = useState('')
  const [doelgroepenTouched, setDoelgroepenTouched] = useState(false)
  const [partnersTouched, setPartnersTouched] = useState(false)

  const doelgroepenOptions = ['Commercieel', 'Operationeel']
  const dossiersOptions = ['Connectivity', 'Security', 'Datacenter', 'Internet', 'Cloud', 'VoIP', 'Mobile', '24/7Services']
  const partnersOptions = ['KPN Excellence', 'RoutIT']

  const tabs = [
    { id: 'basis', label: 'Basis' },
    { id: 'extra', label: 'Extra' }
  ]

  // Generic checkbox toggle that returns the new list
  const toggleCheckbox = (value, currentList, setList) => {
    const newList = currentList.includes(value)
      ? currentList.filter(item => item !== value)
      : [...currentList, value]
    setList(newList)
    return newList
  }

  // Doelgroepen change with validation
  const handleDoelgroepenToggle = (value) => {
    setDoelgroepenTouched(true)
    const newList = toggleCheckbox(value, doelgroepen, setDoelgroepen)
    setDoelgroepenError(validateMinSelection(newList, 1, 'doelgroep') || '')
  }

  // Partners change with validation
  const handlePartnersToggle = (value) => {
    setPartnersTouched(true)
    const newList = toggleCheckbox(value, partners, setPartners)
    setPartnersError(validateMinSelection(newList, 1, 'partnergroep') || '')
  }

  // Publish type change with date validation
  const handlePublishTypeChange = (type) => {
    setPublishType(type)
    if (type === 'schedule' && !publishDate) {
      setPublishDateError(validateDateRequired(null, 'publicatiedatum') || '')
    } else {
      setPublishDateError('')
    }
  }

  // Publish date change with validation
  const handlePublishDateChange = (date) => {
    setPublishDate(date)
    setPublishDateError('')
    // Re-validate close date if it exists
    if (closeType === 'yes' && closeDate) {
      setCloseDateError(validateDateAfter(closeDate, date) || '')
    }
  }

  // Close type change with date validation
  const handleCloseTypeChange = (type) => {
    setCloseType(type)
    if (type === 'yes' && !closeDate) {
      setCloseDateError(validateDateRequired(null, 'sluitdatum') || '')
    } else {
      setCloseDateError('')
    }
  }

  // Close date change with validation
  const handleCloseDateChange = (date) => {
    setCloseDate(date)
    const effectivePublishDate = publishType === 'schedule' ? publishDate : new Date()
    const afterError = validateDateAfter(date, effectivePublishDate)
    setCloseDateError(afterError || '')
  }

  // Validate all fields on publish (triggered by Layout via custom event)
  useEffect(() => {
    const handleValidateForPublish = () => {
      let hasErrors = false

      const dError = validateMinSelection(doelgroepen, 1, 'doelgroep')
      if (dError) {
        setDoelgroepenError(dError)
        setDoelgroepenTouched(true)
        hasErrors = true
      }

      const pError = validateMinSelection(partners, 1, 'partnergroep')
      if (pError) {
        setPartnersError(pError)
        setPartnersTouched(true)
        hasErrors = true
      }

      if (publishType === 'schedule' && !publishDate) {
        setPublishDateError(validateDateRequired(null, 'publicatiedatum') || '')
        hasErrors = true
      }

      if (closeType === 'yes') {
        if (!closeDate) {
          setCloseDateError(validateDateRequired(null, 'sluitdatum') || '')
          hasErrors = true
        } else {
          const effectivePublishDate = publishType === 'schedule' ? publishDate : new Date()
          const afterError = validateDateAfter(closeDate, effectivePublishDate)
          if (afterError) {
            setCloseDateError(afterError)
            hasErrors = true
          }
        }
      }

      // Store validation result for Layout to read
      localStorage.setItem('articleSettingsValid', JSON.stringify(!hasErrors))
    }

    window.addEventListener('validateSettings', handleValidateForPublish)
    return () => window.removeEventListener('validateSettings', handleValidateForPublish)
  }, [doelgroepen, partners, publishType, publishDate, closeType, closeDate])

  // Broadcast state to Layout for button text/disabled logic
  useEffect(() => {
    const isFormValid =
      doelgroepen.length >= 1 &&
      partners.length >= 1 &&
      !(publishType === 'schedule' && !publishDate) &&
      !(closeType === 'yes' && !closeDate) &&
      !(closeType === 'yes' && closeDate && publishType === 'schedule' && publishDate && closeDate <= publishDate)

    window.dispatchEvent(new CustomEvent('settingsStateChanged', {
      detail: { publishType, isFormValid }
    }))
  }, [doelgroepen, partners, publishType, publishDate, closeType, closeDate])

  // Auto-save to localStorage on changes
  useEffect(() => {
    const settingsData = {
      doelgroepen,
      dossiers,
      partners,
      paginaPlaatsing,
      publishType,
      publishDate: publishDate ? publishDate.toISOString() : null,
      closeType,
      closeDate: closeDate ? closeDate.toISOString() : null,
    }
    localStorage.setItem('articleSettingsData', JSON.stringify(settingsData))
  }, [doelgroepen, dossiers, partners, paginaPlaatsing, publishType, publishDate, closeType, closeDate])

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
                  error={doelgroepenTouched ? doelgroepenError : ''}
                >
                  <div className="checkbox-group">
                    {doelgroepenOptions.map(option => (
                      <label key={option} className="settings-checkbox">
                        <input
                          type="checkbox"
                          checked={doelgroepen.includes(option)}
                          onChange={() => handleDoelgroepenToggle(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {!(doelgroepenTouched && doelgroepenError) && (
                    <p className="body-s text-gray-400">Kies minimaal 1 om door te gaan</p>
                  )}
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
                          onChange={() => toggleCheckbox(option, dossiers, setDossiers)}
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
                          onChange={() => handlePublishTypeChange('now')}
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
                          onChange={() => handlePublishTypeChange('schedule')}
                        />
                        <span className="scheduling-option-label">Plaatsing inplannen</span>
                      </label>
                      <div className={`scheduling-date-picker ${publishType !== 'schedule' ? 'disabled' : ''}`}>
                        <DatePicker
                          selected={publishDate}
                          onChange={handlePublishDateChange}
                          disabled={publishType !== 'schedule'}
                          popperPlacement="top-start"
                          customInput={
                            <TextField
                              value={publishDate ? publishDate.toLocaleDateString('nl-NL') : ''}
                              placeholder="Selecteer datum"
                              endIcon="ui-calendar"
                              readOnly
                              disabled={publishType !== 'schedule'}
                              error={publishDateError}
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
                          onChange={() => handlePublishTypeChange('draft')}
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
                          onChange={() => handleCloseTypeChange('no')}
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
                          onChange={() => handleCloseTypeChange('yes')}
                        />
                        <span className="scheduling-option-label">Ja, sluit automatisch op</span>
                      </label>
                      <div className={`scheduling-date-picker ${closeType !== 'yes' ? 'disabled' : ''}`}>
                        <DatePicker
                          selected={closeDate}
                          onChange={handleCloseDateChange}
                          disabled={closeType !== 'yes'}
                          popperPlacement="top-start"
                          customInput={
                            <TextField
                              value={closeDate ? closeDate.toLocaleDateString('nl-NL') : ''}
                              placeholder="Selecteer datum"
                              endIcon="ui-calendar"
                              readOnly
                              disabled={closeType !== 'yes'}
                              error={closeDateError}
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
                  error={partnersTouched ? partnersError : ''}
                >
                  <div className="checkbox-group">
                    {partnersOptions.map(option => (
                      <label key={option} className="settings-checkbox">
                        <input
                          type="checkbox"
                          checked={partners.includes(option)}
                          onChange={() => handlePartnersToggle(option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {!(partnersTouched && partnersError) && (
                    <p className="body-s text-gray-400">Kies minimaal 1 om door te gaan</p>
                  )}
                </SettingsSection>

                {/* Pagina plaatsing */}
                <SettingsSection
                  label="Pagina plaatsing"
                  tag="(optioneel)"
                  tooltip={<InfoTooltip text="Kies op welke pagina's dit artikel getoond wordt en bepaal de positie in de lijst." />}
                >
                  <div className="placement-grid">
                    {paginaOptions.map(({ key, label }) => (
                      <div key={key} className="placement-row">
                        <label className="settings-checkbox placement-checkbox">
                          <input
                            type="checkbox"
                            checked={paginaPlaatsing[key].enabled}
                            onChange={() => handlePaginaToggle(key)}
                          />
                          <span>{label}</span>
                        </label>
                        <div className={`placement-dropdown ${!paginaPlaatsing[key].enabled ? 'disabled' : ''}`}>
                          <Dropdown
                            id={`placement-${key}`}
                            value={paginaPlaatsing[key].position}
                            onChange={(e) => handlePaginaPosition(key, e.target.value)}
                            options={placementOptions}
                            placeholder="Positie..."
                            disabled={!paginaPlaatsing[key].enabled}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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

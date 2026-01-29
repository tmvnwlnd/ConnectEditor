import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { TextField } from './ds'
import SettingsSection from './SettingsSection'
import ArticleTeaser from './ArticleTeaser'
import '../styles/ArticleSettings.css'

const ArticleSettings = () => {

  // Load from localStorage if available
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const savedSettingsData = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')

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

  const doelgroepenOptions = ['Alle', 'Commercieel', 'Operationeel']
  const dossiersOptions = ['Connectivity', 'Security', 'Datacenter', 'Internet', 'Cloud', 'VoIP', 'Mobile', '24/7Services']
  const partnersOptions = ['Alle', 'KPN Excellence', 'RoutIT']

  // Checkbox handlers with "Alle" logic
  const handleCheckboxToggle = (value, currentList, setList, allOptions) => {
    if (value === 'Alle') {
      if (currentList.includes('Alle')) {
        setList([])
      } else {
        setList(allOptions)
      }
    } else {
      let newList
      if (currentList.includes(value)) {
        newList = currentList.filter(item => item !== value && item !== 'Alle')
      } else {
        newList = [...currentList.filter(item => item !== 'Alle'), value]
        // Check if all non-"Alle" options are selected
        const nonAlleOptions = allOptions.filter(opt => opt !== 'Alle')
        if (nonAlleOptions.every(opt => newList.includes(opt))) {
          newList = allOptions
        }
      }
      setList(newList)
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
            {/* 1. Doelgroepen */}
            <SettingsSection label="Doelgroepen">
              <div className="checkbox-group">
                {doelgroepenOptions.map(option => (
                  <label key={option} className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={doelgroepen.includes(option)}
                      onChange={() => handleCheckboxToggle(option, doelgroepen, setDoelgroepen, doelgroepenOptions)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <p className="body-s text-gray-400">Kies minimaal 1 om door te gaan</p>
            </SettingsSection>

            {/* 2. Dossiers */}
            <SettingsSection label="Dossiers" tag="(optioneel)">
              <div className="checkbox-group">
                <label className="settings-checkbox">
                  <input
                    type="checkbox"
                    checked={dossiersOptions.every(opt => dossiers.includes(opt))}
                    onChange={() => {
                      if (dossiersOptions.every(opt => dossiers.includes(opt))) {
                        setDossiers([])
                      } else {
                        setDossiers([...dossiersOptions])
                      }
                    }}
                  />
                  <span>Alle</span>
                </label>
                {dossiersOptions.map(option => (
                  <label key={option} className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={dossiers.includes(option)}
                      onChange={() => {
                        if (dossiers.includes(option)) {
                          setDossiers(dossiers.filter(item => item !== option))
                        } else {
                          const newList = [...dossiers, option]
                          setDossiers(newList)
                        }
                      }}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </SettingsSection>

            {/* 3. Zichtbaar voor partners */}
            <SettingsSection label="Zichtbaar voor partners">
              <div className="checkbox-group">
                {partnersOptions.map(option => (
                  <label key={option} className="settings-checkbox">
                    <input
                      type="checkbox"
                      checked={partners.includes(option)}
                      onChange={() => handleCheckboxToggle(option, partners, setPartners, partnersOptions)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <p className="body-s text-gray-400">Kies minimaal 1 om door te gaan</p>
            </SettingsSection>

            {/* 4. Plaatsen */}
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

            {/* 5. Sluiten */}
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

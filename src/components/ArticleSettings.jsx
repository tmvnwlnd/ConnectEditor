import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { TextField, RadioButton } from './ds'
import SettingsSection from './SettingsSection'
import ArticleTeaser from './ArticleTeaser'
import { validateDateRequired, validateDateAfter } from '../utils/validation'
import '../styles/ArticleSettings.css'

/**
 * ArticleSettings — step 4: publishing.
 * Publish timing ("Plaatsen") and automatic closing, with the teaser preview.
 */
const ArticleSettings = () => {
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const saved = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')

  const [publishType, setPublishType] = useState(saved.publishType || 'now')
  const [publishDate, setPublishDate] = useState(saved.publishDate ? new Date(saved.publishDate) : null)
  const [closeType, setCloseType] = useState(saved.closeType || 'no')
  const [closeDate, setCloseDate] = useState(saved.closeDate ? new Date(saved.closeDate) : null)
  const [publishDateError, setPublishDateError] = useState('')
  const [closeDateError, setCloseDateError] = useState('')

  const handlePublishTypeChange = (type) => {
    setPublishType(type)
    if (type === 'schedule' && !publishDate) {
      setPublishDateError(validateDateRequired(null, 'publicatiedatum') || '')
    } else {
      setPublishDateError('')
    }
  }

  const handlePublishDateChange = (date) => {
    setPublishDate(date)
    setPublishDateError('')
    if (closeType === 'yes' && closeDate) {
      setCloseDateError(validateDateAfter(closeDate, date) || '')
    }
  }

  const handleCloseTypeChange = (type) => {
    setCloseType(type)
    if (type === 'yes' && !closeDate) {
      setCloseDateError(validateDateRequired(null, 'sluitdatum') || '')
    } else {
      setCloseDateError('')
    }
  }

  const handleCloseDateChange = (date) => {
    setCloseDate(date)
    const effectivePublishDate = publishType === 'schedule' ? publishDate : new Date()
    setCloseDateError(validateDateAfter(date, effectivePublishDate) || '')
  }

  const isFormValid =
    !(publishType === 'schedule' && !publishDate) &&
    !(closeType === 'yes' && !closeDate) &&
    !(closeType === 'yes' && closeDate && publishType === 'schedule' && publishDate && closeDate <= publishDate)

  // Persist
  useEffect(() => {
    localStorage.setItem('articleSettingsData', JSON.stringify({
      publishType,
      publishDate: publishDate ? publishDate.toISOString() : null,
      closeType,
      closeDate: closeDate ? closeDate.toISOString() : null,
    }))
  }, [publishType, publishDate, closeType, closeDate])

  // Publish-button state for the Layout
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('settingsStateChanged', {
      detail: { publishType, isFormValid },
    }))
  }, [publishType, isFormValid])

  // Validation on publish (triggered by Layout)
  useEffect(() => {
    const handleValidate = () => {
      let hasErrors = false
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
      localStorage.setItem('articleSettingsValid', JSON.stringify(!hasErrors))
    }
    window.addEventListener('validateSettings', handleValidate)
    return () => window.removeEventListener('validateSettings', handleValidate)
  }, [publishType, publishDate, closeType, closeDate])

  return (
    <div className="article-settings">
      <div className="article-settings-container">
        <div className="settings-main">
          <div className="settings-left-column">
            <p className="body-r text-gray-400">
              Bepaal wanneer het artikel geplaatst wordt en of het automatisch weer sluit.
            </p>

            {/* Plaatsen */}
            <SettingsSection label="Plaatsen">
              <div className="scheduling-options">
                <RadioButton
                  label="Nu plaatsen"
                  name="publish"
                  checked={publishType === 'now'}
                  onChange={() => handlePublishTypeChange('now')}
                />

                <RadioButton
                  label="Plaatsing inplannen"
                  name="publish"
                  checked={publishType === 'schedule'}
                  onChange={() => handlePublishTypeChange('schedule')}
                >
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
                </RadioButton>

                <RadioButton
                  label="Opslaan als draft"
                  name="publish"
                  checked={publishType === 'draft'}
                  onChange={() => handlePublishTypeChange('draft')}
                />
              </div>
            </SettingsSection>

            {/* Automatisch sluiten */}
            <SettingsSection label="Automatisch sluiten">
              <div className="scheduling-options">
                <RadioButton
                  label="Nee, artikel blijft open"
                  name="close"
                  checked={closeType === 'no'}
                  onChange={() => handleCloseTypeChange('no')}
                />

                <RadioButton
                  label="Ja, sluit automatisch op"
                  name="close"
                  checked={closeType === 'yes'}
                  onChange={() => handleCloseTypeChange('yes')}
                >
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
                </RadioButton>
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

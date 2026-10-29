import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { TextField, TextArea, RadioButton, Switch } from './ds'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import { TeaserPreviews } from './ArticleSetup'
import articlesIndex from '../data/teamkpn/articles-index.json'
import { validateDateRequired, validateDateAfter } from '../utils/validation'
import '../styles/ArticleSettings.css'
import '../styles/PublishingTargeting.css'

const MAX_RELATED = 3
const ARTICLES = articlesIndex.map(a => ({ id: a.id, name: a.title }))

/**
 * ArticleSettings — step 4: publishing.
 * New article or update (SoW B4), publish timing ("Plaatsen"), automatic closing, the AI summary (E1),
 * voorlezen (E6) and related articles (B3), with the teaser preview.
 */
const ArticleSettings = () => {
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}')
  const saved = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')
  const savedTargeting = JSON.parse(localStorage.getItem('articleTargetingData') || '{}')

  const [publishType, setPublishType] = useState(saved.publishType || 'now')
  const [publishDate, setPublishDate] = useState(saved.publishDate ? new Date(saved.publishDate) : null)
  const [closeType, setCloseType] = useState(saved.closeType || 'no')
  const [closeDate, setCloseDate] = useState(saved.closeDate ? new Date(saved.closeDate) : null)
  const [isUpdate, setIsUpdate] = useState(!!saved.isUpdate)
  const [updateMode, setUpdateMode] = useState(saved.updateMode || 'unread')
  // PROTOTYPE: the "generated" summary starts as the article's introduction — the editor reviews and edits it.
  const [aiSummaryOn, setAiSummaryOn] = useState(saved.aiSummaryOn !== false)
  const [aiSummary, setAiSummary] = useState(saved.aiSummary ?? (savedSetupData.introduction || ''))
  const [readAloud, setReadAloud] = useState(saved.readAloud !== false)
  const [related, setRelated] = useState((saved.related || []).filter(id => ARTICLES.some(a => a.id === id)))
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
      isUpdate,
      updateMode,
      aiSummaryOn,
      aiSummary,
      readAloud,
      related,
    }))
  }, [publishType, publishDate, closeType, closeDate, isUpdate, updateMode, aiSummaryOn, aiSummary, readAloud, related])

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
            {/* Nieuw of update */}
            <SettingsSection label="Soort plaatsing">
              <div className="scheduling-options">
                <RadioButton label="Nieuw artikel" name="kind" checked={!isUpdate} onChange={() => setIsUpdate(false)} />
                <RadioButton label="Update van dit artikel" name="kind" checked={isUpdate} onChange={() => setIsUpdate(true)}>
                  {isUpdate && (
                    <div className="pub-sub">
                      <p className="body-r text-gray-400" style={{ margin: 0 }}>
                        Het artikel krijgt het label Update. Volgers van het artikel krijgen een melding.
                      </p>
                      <RadioButton
                        label="Opnieuw als ongelezen tonen en bovenaan zetten"
                        name="update-mode"
                        checked={updateMode === 'unread'}
                        onChange={() => setUpdateMode('unread')}
                      />
                      <RadioButton
                        label="Alleen het label Update tonen"
                        name="update-mode"
                        checked={updateMode === 'tag'}
                        onChange={() => setUpdateMode('tag')}
                      />
                    </div>
                  )}
                </RadioButton>
              </div>
            </SettingsSection>

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

            {/* AI-samenvatting */}
            <SettingsSection label="AI-samenvatting">
              <div className="pub-switch-row">
                <p className="body-r text-gray-400">
                  Judith maakt een samenvatting die bovenaan het artikel staat. Controleer en pas hem aan.
                </p>
                <Switch checked={aiSummaryOn} onChange={setAiSummaryOn} label="AI-samenvatting" />
              </div>
              {aiSummaryOn && (
                <div className="pub-sub">
                  <TextArea value={aiSummary} onChange={(e) => setAiSummary(e.target.value)} rows={4} />
                </div>
              )}
            </SettingsSection>

            {/* Voorlezen */}
            <SettingsSection label="Voorlezen">
              <div className="pub-switch-row">
                <p className="body-r text-gray-400">Lezers kunnen het artikel laten voorlezen.</p>
                <Switch checked={readAloud} onChange={setReadAloud} label="Voorlezen" />
              </div>
            </SettingsSection>

            {/* Bekijk ook */}
            <SettingsSection
              label="Gerelateerde artikelen"
              tag="(optioneel, maximaal 3)"
              description="Verschijnen onder het artikel bij Bekijk ook."
            >
              <ChoiceField
                name="settings-related"
                multiple
                options={ARTICLES}
                value={related}
                onChange={setRelated}
                max={MAX_RELATED}
                placeholder={related.length >= MAX_RELATED ? 'Maximaal 3 artikelen' : 'Voeg een artikel toe…'}
              />
            </SettingsSection>
          </div>

          <div className="settings-right-column">
            <div className="preview-section">
              <div className="preview-variants">
                <TeaserPreviews
                  article={{
                    title: savedSetupData.title,
                    introduction: savedSetupData.introduction,
                    coverImage: savedSetupData.coverImage,
                    priority: savedTargeting.priority,
                    isUpdate,
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

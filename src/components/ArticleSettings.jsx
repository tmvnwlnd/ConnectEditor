import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { TextField, TextArea, RadioButton, Switch, Button } from './ds'
import { usePublishTab } from '../utils/publishTab'
import { TargetingFields } from './ArticleTargeting'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import ArticleTeaser from './ArticleTeaser'
import articlesIndex from '../data/teamkpn/articles-index.json'
import { validateDateRequired, validateDateAfter, validateUrl } from '../utils/validation'
import '../styles/ArticleSettings.css'
import '../styles/PublishingTargeting.css'

const MAX_RELATED = 3
const ARTICLES = articlesIndex.map(a => ({ id: a.id, name: a.title }))

/**
 * ArticleSettings — step 3: Publiceren, in two tabs:
 *  - Publiceren: publish timing ("Plaatsen"), automatic closing, the AI summary (E1), voorlezen (E6) and related
 *    articles (B3);
 *  - Targeting: organisatiebreed, doelgroepen and prioriteit (`TargetingFields`, was its own step).
 */
// The two tabs themselves sit in the sticky page header (Layout); the open one is shared via `usePublishTab`.
const ArticleSettings = () => {
  const savedSetupData = JSON.parse(localStorage.getItem('articleSetupData') || '{}') // the intro seeds the AI summary
  const saved = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')

  const [publishType, setPublishType] = useState(saved.publishType || 'now')
  const [publishDate, setPublishDate] = useState(saved.publishDate ? new Date(saved.publishDate) : null)
  const [closeType, setCloseType] = useState(saved.closeType || 'no')
  const [closeDate, setCloseDate] = useState(saved.closeDate ? new Date(saved.closeDate) : null)
  const [tab] = usePublishTab()
  // PROTOTYPE: the "generated" summary starts as the article's introduction — the editor reviews and edits it.
  const [aiSummaryOn, setAiSummaryOn] = useState(saved.aiSummaryOn !== false)
  const [aiSummary, setAiSummary] = useState(saved.aiSummary ?? (savedSetupData.introduction || ''))
  const [readAloud, setReadAloud] = useState(saved.readAloud !== false)
  // Link-tag: the article points to another platform — a tag at the title that opens this link.
  const [linkTagOn, setLinkTagOn] = useState(!!saved.linkTagOn)
  const [linkTagUrl, setLinkTagUrl] = useState(saved.linkTagUrl || '')
  const [linkTagError, setLinkTagError] = useState('')
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
      aiSummaryOn,
      aiSummary,
      readAloud,
      linkTagOn,
      linkTagUrl,
      related,
    }))
  }, [publishType, publishDate, closeType, closeDate, aiSummaryOn, aiSummary, readAloud, linkTagOn, linkTagUrl, related])

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
        <div className="settings-main settings-main--single">
          <div className="settings-left-column">
            {tab === 'targeting' ? (
              <TargetingFields />
            ) : (
            <>
            {/* Plaatsen + Automatisch sluiten, side by side */}
            <div className="settings-pair">
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

            {/* AI-samenvatting */}
            <SettingsSection label="AI-samenvatting">
              <div className="pub-switch-row">
                <p className="body-r text-gray-400">
                  AI maakt een samenvatting die bovenaan het artikel staat. Controleer en pas hem aan.
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

            {/* Link-tag */}
            <SettingsSection label="Link-tag">
              <div className="pub-switch-row">
                <p className="body-r text-gray-400">
                  Voeg een link-tag toe aan het artikel. De tag staat bij de titel en opent de link in een nieuw tabblad.
                </p>
                <Switch checked={linkTagOn} onChange={setLinkTagOn} label="Link-tag" />
              </div>
              {linkTagOn && (
                <div className="pub-sub">
                  <TextField
                    value={linkTagUrl}
                    onChange={(e) => {
                      setLinkTagUrl(e.target.value)
                      if (linkTagError) setLinkTagError('')
                    }}
                    onBlur={() => setLinkTagError(linkTagUrl.trim() ? validateUrl(linkTagUrl.trim()) || '' : '')}
                    placeholder="https://"
                    startIcon="ui-link"
                    error={linkTagError}
                  />
                </div>
              )}
            </SettingsSection>

            {/* Bekijk ook */}
            <SettingsSection
              label="Gerelateerde artikelen"
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
                renderSelected={(ids, remove) => (
                  // Each picked article as a row tile ("Tegel in een lijst"), green stand-in image, red trash to remove.
                  <div className="related-items">
                    {ids.map((id) => (
                      <div key={id} className="related-item">
                        <ArticleTeaser variant="horizontal" imageTone="green" article={{ title: ARTICLES.find((a) => a.id === id)?.name }} />
                        <Button variant="icon-only" iconColor="red" icon="ui-trash" aria-label="Verwijder uit Bekijk ook" onClick={() => remove(id)} />
                      </div>
                    ))}
                  </div>
                )}
              />
            </SettingsSection>
            </>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ArticleSettings

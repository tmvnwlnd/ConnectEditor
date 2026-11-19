import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { TextField, TextArea, RadioButton, Switch, Button, Tag } from './ds'
import { usePublishTab } from '../utils/publishTab'
import { isUpdateMode, UPDATE_PUBLISH_DATE } from '../utils/articleMode'
import SettingsSection from './SettingsSection'
import ChoiceField from './publishing/ChoiceField'
import ArticleTeaser from './ArticleTeaser'
import articlesIndex from '../data/teamkpn/articles-index.json'
import { CONTACTS } from '../config/publishingTargeting'
import { validateDateRequired, validateDateAfter, validateUrl } from '../utils/validation'
import '../styles/ArticleSettings.css'
import '../styles/PublishingTargeting.css'

const MAX_RELATED = 3
const MAX_CONTACTS = 5
// Contactpersonen in the dropdown as "Naam — rol".
const CONTACT_OPTIONS = CONTACTS.map(c => ({ id: c.id, name: `${c.name} — ${c.role}` }))
const ARTICLES = articlesIndex.map(a => ({ id: a.id, name: a.title }))

/**
 * ArticleSettings — step 3: Publiceren (an "Update" tab first when updating an existing article):
 *  - Publiceren: publish timing ("Plaatsen"), automatic closing, the AI summary (E1), voorlezen (E6) and related
 *    articles (B3) and contactpersonen (max 5). Targeting moved to the Plaatsing step.
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
  const [contacts, setContacts] = useState((saved.contacts || []).filter(id => CONTACTS.some(c => c.id === id)))
  const [related, setRelated] = useState((saved.related || []).filter(id => ARTICLES.some(a => a.id === id)))
  // Update: an "Update" tag on the article, and/or pushing it back to the top of the feeds on an update date.
  // The Update tab only exists on the "Nieuwsartikel updaten" path — there the update always applies.
  const updateOn = isUpdateMode()
  const [updateTagOn, setUpdateTagOn] = useState(!!saved.updateTagOn)
  const [updatePushOn, setUpdatePushOn] = useState(!!saved.updatePushOn)
  // The update moment (date + time) — always settable, prefilled with right now.
  const [updateDate, setUpdateDate] = useState(() => (saved.updateDate ? new Date(saved.updateDate) : new Date()))
  const [updateNote, setUpdateNote] = useState(saved.updateNote || '') // internal only, never shown to readers
  const [updateDateError, setUpdateDateError] = useState('')
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

  // The update moment must come after the article's recorded publish date.
  const originalPublishDate = UPDATE_PUBLISH_DATE
  const UPDATE_DATE_ERROR = 'Kies een moment na de publicatiedatum'
  const updateDateValid = !updateOn || (!!updateDate && updateDate > originalPublishDate)

  const handleUpdateDateChange = (date) => {
    setUpdateDate(date)
    setUpdateDateError(date && date <= originalPublishDate ? UPDATE_DATE_ERROR : '')
  }

  const isFormValid =
    updateDateValid &&
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
      contacts,
      updateTagOn,
      updatePushOn,
      updateDate: updateDate ? updateDate.toISOString() : null,
      updateNote,
    }))
  }, [publishType, publishDate, closeType, closeDate, aiSummaryOn, aiSummary, readAloud, linkTagOn, linkTagUrl, related, contacts, updateTagOn, updatePushOn, updateDate, updateNote])

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
      if (!updateDateValid) {
        setUpdateDateError(updateDate ? UPDATE_DATE_ERROR : validateDateRequired(null, 'updatedatum') || '')
        hasErrors = true
      }
      localStorage.setItem('articleSettingsValid', JSON.stringify(!hasErrors))
    }
    window.addEventListener('validateSettings', handleValidate)
    return () => window.removeEventListener('validateSettings', handleValidate)
  }, [publishType, publishDate, closeType, closeDate, updateDate, updateDateValid])

  return (
    <div className="article-settings">
      <div className="article-settings-container">
        <div className="settings-main settings-main--single">
          <div className="settings-left-column">
            {tab === 'update' ? (
            <>
            {/* Updatedatum — its own setting, independent of the switches below: an update is always possible. */}
            <SettingsSection
              label="Updatedatum"
              description="Kies een datum en tijd na de publicatiedatum."
            >
              <div className="update-datetime">
                <DatePicker
                  selected={updateDate}
                  onChange={handleUpdateDateChange}
                  popperPlacement="bottom-start"
                  customInput={
                    <TextField
                      label="Datum"
                      value={updateDate ? updateDate.toLocaleDateString('nl-NL') : ''}
                      placeholder="Selecteer datum"
                      endIcon="ui-calendar"
                      readOnly
                    />
                  }
                  dateFormat="dd/MM/yyyy"
                  minDate={originalPublishDate}
                />
                <DatePicker
                  selected={updateDate}
                  onChange={handleUpdateDateChange}
                  popperPlacement="bottom-start"
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Tijd"
                  dateFormat="HH:mm"
                  timeFormat="HH:mm"
                  customInput={
                    <TextField
                      label="Tijd"
                      value={updateDate ? updateDate.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }) : ''}
                      placeholder="Selecteer tijd"
                      endIcon="ui-clock"
                      readOnly
                    />
                  }
                />
              </div>
              {updateDateError && <p className="field-error-message update-datetime-error">{updateDateError}</p>}
            </SettingsSection>

            {/* Update-tag */}
            <SettingsSection label="Update-tag">
              <div className="pub-switch-row">
                <p className="body-r text-gray-400">
                  Toon een Update-tag bij het artikel.
                  {/* Preview of the tag itself */}
                  <Tag variant="lime" className={`update-tag-preview${updateTagOn ? '' : ' is-off'}`}>Update</Tag>
                </p>
                <Switch checked={updateTagOn} onChange={setUpdateTagOn} label="Update-tag" />
              </div>
            </SettingsSection>

            {/* Bovenaan plaatsen */}
            <SettingsSection label="Bovenaan plaatsen">
              <div className="pub-switch-row">
                <p className="body-r text-gray-400">Zet het artikel op de updatedatum opnieuw bovenaan in de feeds.</p>
                <Switch checked={updatePushOn} onChange={setUpdatePushOn} label="Bovenaan plaatsen" />
              </div>
            </SettingsSection>

            {/* Updatenotitie — internal only */}
            <SettingsSection label="Updatenotitie" description="Alleen voor intern gebruik.">
              <div className="pub-sub">
                <TextArea value={updateNote} onChange={(e) => setUpdateNote(e.target.value)} rows={4} />
              </div>
            </SettingsSection>
            </>
            ) : (
            <>
            {/* Plaatsen + Automatisch sluiten, side by side */}
            <div className="settings-pair">
            {/* Plaatsen */}
            <SettingsSection label="Plaatsen">
              {updateOn ? (
                // Updating an existing article: it's already placed — nothing to choose.
                <p className="body-r text-gray-400">Artikel is al geplaatst.</p>
              ) : (
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
                  label="Opslaan als concept"
                  name="publish"
                  checked={publishType === 'draft'}
                  onChange={() => handlePublishTypeChange('draft')}
                />
              </div>
              )}
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

            {/* Contactpersonen */}
            <SettingsSection
              label="Contactpersonen"
              description="Verschijnen bij het artikel als aanspreekpunt."
            >
              <ChoiceField
                name="settings-contacts"
                multiple
                options={CONTACT_OPTIONS}
                value={contacts}
                onChange={setContacts}
                max={MAX_CONTACTS}
                placeholder={contacts.length >= MAX_CONTACTS ? 'Maximaal 5 contactpersonen' : 'Voeg een contactpersoon toe…'}
                renderSelected={(ids, remove) => (
                  <div className="related-items">
                    {ids.map((id) => {
                      const c = CONTACTS.find((x) => x.id === id)
                      if (!c) return null
                      return (
                        <div key={id} className="related-item">
                          <div className="contact-item">
                            <img className="contact-item-avatar" src={c.avatar} alt="" />
                            <div className="contact-item-text">
                              <span className="contact-item-name">{c.name}</span>
                              <span className="contact-item-role">{c.role}</span>
                            </div>
                          </div>
                          <Button variant="icon-only" iconColor="red" icon="ui-trash" aria-label={`Verwijder ${c.name}`} onClick={() => remove(id)} />
                        </div>
                      )
                    })}
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

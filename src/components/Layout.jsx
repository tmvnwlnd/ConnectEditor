import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader, Button, Tabs } from './ds'
import { PUBLISH_TABS, UPDATE_PUBLISH_TABS, usePublishTab } from '../utils/publishTab'
import { isUpdateMode } from '../utils/articleMode'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/themes/translucent.css'
import '../styles/Layout.css'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const publishButtonRef = useRef(null)
  const tippyInstanceRef = useRef(null)

  // Determine which page we're on
  const isPlacement = location.pathname === '/plaatsing'
  const isEditor = location.pathname === '/editor'
  const isSettings = location.pathname === '/settings'
  const [publishTab, setPublishTab] = usePublishTab()
  const isUpdate = isUpdateMode() // "Nieuwsartikel updaten" path
  const tabs = isUpdate ? UPDATE_PUBLISH_TABS : PUBLISH_TABS
  // A lone tab isn't a choice: the tab bar only shows when updating (Update + Publicatie).
  const showTabs = isSettings && tabs.length > 1

  // Arriving on the last step: open its first tab (Update when updating). Also never leave a tab that isn't there.
  useEffect(() => {
    if (isSettings) setPublishTab(tabs[0].id)
  }, [isSettings, isUpdate]) // eslint-disable-line react-hooks/exhaustive-deps

  // Track settings state reactively (updated by ArticleSettings via storage events)
  const [settingsState, setSettingsState] = useState(() => {
    const data = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')
    return {
      publishType: data.publishType || 'now',
      isFormValid: false,
    }
  })

  // Listen for settings changes from ArticleSettings
  useEffect(() => {
    const handleSettingsChange = (e) => {
      setSettingsState({
        publishType: e.detail?.publishType || 'now',
        isFormValid: e.detail?.isFormValid || false,
      })
    }
    window.addEventListener('settingsStateChanged', handleSettingsChange)
    return () => window.removeEventListener('settingsStateChanged', handleSettingsChange)
  }, [])

  const isDraft = isSettings && !isUpdate && settingsState.publishType === 'draft' // an update is never a concept
  const needsValidation = isSettings && !isDraft
  const isPublishDisabled = needsValidation && !settingsState.isFormValid

  // Manage tippy tooltip on the publish button
  useEffect(() => {
    if (tippyInstanceRef.current) {
      tippyInstanceRef.current.destroy()
      tippyInstanceRef.current = null
    }

    if (isPublishDisabled && publishButtonRef.current) {
      tippyInstanceRef.current = tippy(publishButtonRef.current, {
        content: 'Vul eerst alle verplichte velden in',
        placement: 'top',
        theme: 'translucent',
        arrow: true,
        animation: 'fade',
      })
    }

    return () => {
      if (tippyInstanceRef.current) {
        tippyInstanceRef.current.destroy()
        tippyInstanceRef.current = null
      }
    }
  }, [isPublishDisabled])

  // Get step text
  const getStep = () => {
    // Three steps: 1 inhoud (editor, incl. title/intro/cover), 2 plaatsing, 3 publicatie.
    if (isPlacement) return 'Stap 2 van 3'
    if (isSettings) return 'Stap 3 van 3'
    return ''
  }

  // Get button props based on page
  const getBackButtonProps = () => {
    if (isEditor) {
      return {
        onClick: () => {
          if (isUpdate) return navigate('/') // updating: leave without touching the article
          localStorage.removeItem('articleSetupData')
          localStorage.removeItem('articleElements')
          window.location.reload()
        },
        children: 'Annuleren'
      }
    }
    if (isPlacement) {
      return {
        onClick: () => navigate('/editor'),
        children: 'Terug naar stap 1: inhoud'
      }
    }
    if (isSettings) {
      return {
        onClick: () => navigate('/plaatsing'),
        children: 'Terug naar stap 2: plaatsing'
      }
    }
    return { onClick: () => {}, children: '' }
  }

  const getForwardButtonProps = () => {
    if (isEditor) {
      return {
        onClick: () => navigate('/plaatsing'),
        children: 'Volgende stap: plaatsing'
      }
    }
    if (isPlacement) {
      return {
        onClick: () => navigate('/settings'),
        children: 'Volgende stap: publiceren'
      }
    }
    if (isDraft) {
      return {
        onClick: () => alert('Artikel opgeslagen als concept!'),
        children: 'Opslaan'
      }
    }
    if (isSettings) {
      return {
        onClick: () => {
          if (isPublishDisabled) return

          // Trigger inline validation in ArticleSettings via custom event
          localStorage.removeItem('articleSettingsValid')
          window.dispatchEvent(new Event('validateSettings'))

          // Read the validation result (set synchronously by the event handler)
          const isValid = JSON.parse(localStorage.getItem('articleSettingsValid') || 'false')
          if (!isValid) return

          if (isUpdate) return alert('Artikel geüpdatet!')
          alert(settingsState.publishType === 'schedule' ? 'Artikel ingepland!' : 'Artikel gepubliceerd!')
        },
        children: isUpdate ? 'Artikel updaten' : settingsState.publishType === 'schedule' ? 'Inplannen' : 'Publiceren',
      }
    }
    return { onClick: () => {}, children: '' }
  }

  const renderFooterContent = () => {
    const backProps = getBackButtonProps()
    const forwardProps = getForwardButtonProps()

    return (
      <>
        {/* Save the article as a concept from steps 1–3 (prototype: nothing is really saved).
            The last step has none: Plaatsen = "Opslaan als concept" turns the primary button into "Opslaan". */}
        {!isSettings && !isUpdate && <Button
          key="concept-button"
          variant="secondary"
          className="layout-footer-concept"
          onClick={() => alert('Artikel opgeslagen als concept!')}
        >
          Opslaan als concept
        </Button>}
        <Button
          key="back-button"
          variant="secondary"
          {...backProps}
        />
        <span ref={publishButtonRef}>
            <Button
              key="forward-button"
              variant="primary"
              icon="ui-arrow-right"
              disabled={isPublishDisabled}
              {...forwardProps}
            />
          </span>
      </>
    )
  }

  return (
    <div className="layout">
      {/* Persistent Header - only for setup and settings, not editor */}
      {!isEditor && (
        // On Publiceren the header carries the page's tabs, so it's SOLID white (a fade would cut hard at the tabs).
        <header className={`layout-header ${showTabs ? 'layout-header--solid' : ''}`}>
          <div className="layout-header-content">
            <PageHeader title={isUpdate ? 'Nieuwsartikel updaten' : undefined} step={getStep()} />
          </div>
          {showTabs && (
            <div className="layout-header-tabs">
              <div className="layout-header-tabs-col">
                <Tabs tabs={tabs} activeTab={publishTab} onChange={setPublishTab} />
              </div>
            </div>
          )}
        </header>
      )}

      {/* Main Content Area (with transitions) */}
      <main className="layout-main">
        {children}
      </main>

      {/* Persistent Footer */}
      <footer className="layout-footer">
        <div className="layout-footer-content">
          {renderFooterContent()}
        </div>
      </footer>
    </div>
  )
}

export default Layout

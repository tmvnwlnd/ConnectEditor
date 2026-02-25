import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader, Button } from './ds'
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
  const isSetup = location.pathname === '/setup'
  const isEditor = location.pathname === '/editor'
  const isSettings = location.pathname === '/settings'

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

  const isDraft = isSettings && settingsState.publishType === 'draft'
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
    if (isSetup) return 'Stap 1 van 3'
    if (isSettings) return 'Stap 3 van 3'
    return ''
  }

  // Get button props based on page
  const getBackButtonProps = () => {
    if (isSetup) {
      return {
        onClick: () => {
          localStorage.removeItem('articleSetupData')
          window.location.reload()
        },
        children: 'Annuleren'
      }
    }
    if (isEditor) {
      return {
        onClick: () => navigate('/setup'),
        children: 'Terug naar stap 1: setup'
      }
    }
    if (isSettings) {
      return {
        onClick: () => navigate('/editor'),
        children: 'Terug naar stap 2: inhoud'
      }
    }
    return { onClick: () => {}, children: '' }
  }

  const getForwardButtonProps = () => {
    if (isSetup) {
      return {
        onClick: () => navigate('/editor'),
        children: 'Volgende stap: inhoud'
      }
    }
    if (isEditor) {
      return {
        onClick: () => navigate('/settings'),
        children: 'Volgende stap: instellingen'
      }
    }
    if (isSettings) {
      if (isDraft) {
        return {
          onClick: () => alert('Artikel opgeslagen als draft!'),
          children: 'Opslaan als draft',
        }
      }
      return {
        onClick: () => {
          if (isPublishDisabled) return

          // Trigger inline validation in ArticleSettings via custom event
          localStorage.removeItem('articleSettingsValid')
          window.dispatchEvent(new Event('validateSettings'))

          // Read the validation result (set synchronously by the event handler)
          const isValid = JSON.parse(localStorage.getItem('articleSettingsValid') || 'false')
          if (!isValid) return

          alert('Artikel gepubliceerd!')
        },
        children: 'Publiceren',
      }
    }
    return { onClick: () => {}, children: '' }
  }

  const renderFooterContent = () => {
    const backProps = getBackButtonProps()
    const forwardProps = getForwardButtonProps()

    return (
      <>
        <Button
          key="back-button"
          variant="secondary"
          {...backProps}
        />
        <span ref={publishButtonRef}>
          <Button
            key="forward-button"
            variant="primary"
            icon={isDraft ? undefined : 'ui-arrow-right'}
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
        <header className="layout-header">
          <div className="layout-header-content">
            <PageHeader step={getStep()} />
          </div>
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

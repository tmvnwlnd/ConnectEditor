import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader, Button } from './ds'
import '../styles/Layout.css'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine which page we're on
  const isSetup = location.pathname === '/setup'
  const isEditor = location.pathname === '/editor'
  const isSettings = location.pathname === '/settings'

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
      return {
        onClick: () => {
          const settingsData = JSON.parse(localStorage.getItem('articleSettingsData') || '{}')
          if (!settingsData.doelgroepen || settingsData.doelgroepen.length === 0) {
            alert('Selecteer minimaal 1 doelgroep om door te gaan')
            return
          }
          if (!settingsData.partners || settingsData.partners.length === 0) {
            alert('Selecteer minimaal 1 zichtbaar voor partners optie om door te gaan')
            return
          }
          alert('Artikel gepubliceerd!')
        },
        children: 'Publiceren'
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
        <Button
          key="forward-button"
          variant="primary"
          icon="ui-arrow-right"
          {...forwardProps}
        />
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

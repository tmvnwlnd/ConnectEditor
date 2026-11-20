import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import PageTransition from './components/PageTransition'
import ArticlePlacement from './components/ArticlePlacement'
import ArticleBuilder from './components/ArticleBuilder'
import ArticleSettings from './components/ArticleSettings'
import Showcase from './components/Showcase'
import BlockShowcase from './components/BlockShowcase'
import AIShowcase from './components/AIShowcase'
import StartChoice from './components/StartChoice'
import { installErrorReporting } from './utils/errorReporter'
import './App.css'

installErrorReporting()

function AppRoutes() {
  const location = useLocation()

  // Check if we're on a showcase route
  const isShowcaseRoute = ['/showcase', '/block-showcase', '/ai-showcase'].includes(location.pathname)

  // Start page: choose "Nieuwsartikel maken" or "Nieuwsartikel updaten" (no step layout around it)
  if (location.pathname === '/') return <StartChoice />

  if (isShowcaseRoute) {
    // Render showcase routes without Layout
    return (
      <Routes>
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/block-showcase" element={<BlockShowcase />} />
        <Route path="/ai-showcase" element={<AIShowcase />} />
      </Routes>
    )
  }

  // Main workflow routes with Layout
  return (
    <Layout>
      <PageTransition>
        <Routes>
          <Route path="/setup" element={<Navigate to="/editor" replace />} />
          <Route path="/plaatsing" element={<ArticlePlacement />} />
          <Route path="/editor" element={<ArticleBuilder />} />
          {/* Targeting is a tab on Publiceren now; old links land there. */}
          <Route path="/targeting" element={<Navigate to="/settings" replace />} />
          <Route path="/settings" element={<ArticleSettings />} />
        </Routes>
      </PageTransition>
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App

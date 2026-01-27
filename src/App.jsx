import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import PageTransition from './components/PageTransition'
import ArticleSetup from './components/ArticleSetup'
import ArticleBuilder from './components/ArticleBuilder'
import ArticleSettings from './components/ArticleSettings'
import Showcase from './components/Showcase'
import ShowcaseSimple from './components/ShowcaseSimple'
import BlockShowcase from './components/BlockShowcase'
import './App.css'

function AppRoutes() {
  const location = useLocation()

  // Check if we're on a main workflow route (setup/editor/settings)
  const isMainRoute = ['/setup', '/editor', '/settings'].includes(location.pathname)

  if (!isMainRoute) {
    // Render showcase routes without Layout
    return (
      <Routes>
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/block-showcase" element={<BlockShowcase />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <PageTransition>
        <Routes>
          <Route path="/" element={<Navigate to="/setup" replace />} />
          <Route path="/setup" element={<ArticleSetup />} />
          <Route path="/editor" element={<ArticleBuilder />} />
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

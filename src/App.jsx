import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import PageTransition from './components/PageTransition'
import ArticleSetup from './components/ArticleSetup'
import ArticleBuilder from './components/ArticleBuilder'
import ArticleSettings from './components/ArticleSettings'
import Showcase from './components/Showcase'
import BlockShowcase from './components/BlockShowcase'
import AIShowcase from './components/AIShowcase'
import './App.css'

function AppRoutes() {
  const location = useLocation()

  // Check if we're on a showcase route
  const isShowcaseRoute = ['/showcase', '/block-showcase', '/ai-showcase'].includes(location.pathname)

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

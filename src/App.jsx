import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PageTransition from './components/PageTransition'
import ArticleSetup from './components/ArticleSetup'
import ArticleBuilder from './components/ArticleBuilder'
import ArticleSettings from './components/ArticleSettings'
import Showcase from './components/Showcase'
import ShowcaseSimple from './components/ShowcaseSimple'
import BlockShowcase from './components/BlockShowcase'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/setup" replace />} />
          <Route path="/setup" element={<PageTransition><ArticleSetup /></PageTransition>} />
          <Route path="/editor" element={<PageTransition><ArticleBuilder /></PageTransition>} />
          <Route path="/settings" element={<PageTransition><ArticleSettings /></PageTransition>} />
          <Route path="/showcase" element={<Showcase />} />
          <Route path="/block-showcase" element={<BlockShowcase />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ArticleSetup from './components/ArticleSetup'
import ArticleBuilder from './components/ArticleBuilder'
import ArticleSettings from './components/ArticleSettings'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/setup" replace />} />
          <Route path="/setup" element={<ArticleSetup />} />
          <Route path="/editor" element={<ArticleBuilder />} />
          <Route path="/settings" element={<ArticleSettings />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

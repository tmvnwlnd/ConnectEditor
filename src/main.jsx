import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Import jQuery and make it global
import $ from 'jquery'
window.jQuery = $
window.$ = $

// Dynamically import Trumbowyg after jQuery is set up
async function initApp() {
  // Import Trumbowyg
  await import('trumbowyg/dist/trumbowyg.min.js')
  await import('trumbowyg/dist/ui/trumbowyg.min.css')

  // Configure SVG path for icons
  $.trumbowyg.svgPath = '/trumbowyg-icons.svg'

  // Import App after Trumbowyg is loaded
  const { default: App } = await import('./App')

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

initApp()

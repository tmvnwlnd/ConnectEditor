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
  // Dutch toolbar tooltips and link dialog (editors use lang: 'nl')
  await import('trumbowyg/dist/langs/nl.min.js')
  Object.assign($.trumbowyg.langs.nl, {
    underline: 'Onderstrepen', // the pack says 'Onderlijnen'
    del: 'Doorhalen', // our strikethrough button is 'del' (the pack says 'Verwijderd')
    removeformat: 'Opmaak verwijderen' // the button key is lowercase; the pack only has removeFormat
  })

  // Configure SVG path for icons
  $.trumbowyg.svgPath = '/trumbowyg-icons.svg'

  // Copy/paste between our editors keeps bold, italic, links, lists (other pastes are still stripped)
  const { installEditorClipboard } = await import('./utils/editorClipboard')
  installEditorClipboard()
  // A style switched on with nothing selected shows as active until you type
  const { installPendingStyles } = await import('./utils/pendingStyles')
  installPendingStyles()

  // Import App after Trumbowyg is loaded
  const { default: App } = await import('./App')

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

initApp()

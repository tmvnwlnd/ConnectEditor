/**
 * errorReporter — one place to tell the user something went wrong (shown by <ErrorNotices />).
 *
 *   reportError({ key, title, detail })   key de-duplicates: the same problem shows once until dismissed.
 *
 * installErrorReporting() also catches, app-wide:
 *  - failed saves: any localStorage.setItem that throws (e.g. storage full) — reported, not re-thrown
 *  - images that can't be loaded (dead upload links, broken URLs)
 *  - uncaught errors and rejected promises
 */
const listeners = new Set()
let notices = []

const emit = () => listeners.forEach((fn) => fn(notices))

export function reportError({ key, title, detail = '' }) {
  const k = key || `${title}|${detail}`
  if (notices.some((n) => n.key === k)) return
  notices = [...notices, { key: k, title, detail }]
  console.warn('[error]', title, detail)
  emit()
}

export function dismissError(key) {
  notices = notices.filter((n) => n.key !== key)
  emit()
}

export function subscribeErrors(fn) {
  listeners.add(fn)
  fn(notices)
  return () => listeners.delete(fn)
}

const STORAGE_LABELS = {
  articleElements: 'de blokken',
  articleSetupData: 'de header en plaatsing',
  articleTargetingData: 'de targeting',
  articleSettingsData: 'de publicatie-instellingen',
}

let installed = false
export function installErrorReporting() {
  if (installed) return
  installed = true

  // Failed saves
  const setItem = Storage.prototype.setItem
  Storage.prototype.setItem = function (key, value) {
    try {
      setItem.call(this, key, value)
      dismissError(`save:${key}`)
    } catch (e) {
      const full = e?.name === 'QuotaExceededError' || /quota/i.test(e?.message || '')
      reportError({
        key: `save:${key}`,
        title: `Opslaan van ${STORAGE_LABELS[key] || key} is mislukt`,
        detail: full ? 'De opslag van de browser is vol, waarschijnlijk door grote afbeeldingen.' : e?.message || '',
      })
    }
  }

  // Images that can't be loaded (error events don't bubble: listen in the capture phase)
  window.addEventListener('error', (e) => {
    const el = e.target
    if (el && el.tagName === 'IMG') {
      const src = el.getAttribute('src') || ''
      if (!src) return
      reportError({
        key: `img:${src}`,
        title: 'Een afbeelding kan niet worden geladen',
        detail: src.startsWith('blob:')
          ? 'Geüploade afbeeldingen blijven niet bewaard na het herladen van de pagina. Upload de afbeelding opnieuw.'
          : src,
      })
    } else if (e.message && el === window) {
      reportError({ title: 'Er ging iets mis', detail: e.message })
    }
  }, true)

  window.addEventListener('unhandledrejection', (e) => {
    reportError({ title: 'Er ging iets mis', detail: e.reason?.message || String(e.reason || '') })
  })
}

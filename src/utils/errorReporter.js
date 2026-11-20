/**
 * errorReporter — one place to tell the user something went wrong (shown by <ErrorNotices />).
 *
 *   reportError({ key, message })   key de-duplicates: the same problem shows once until dismissed.
 *
 * installErrorReporting() also catches, app-wide:
 *  - saves of the draft: drive the header's save status (saving / saved / failed)
 *  - images that can't be loaded (dead upload links, broken URLs)
 *  - uncaught errors and rejected promises
 */
export const IMAGE_LOST = 'De eerder geüploade afbeelding kon niet geladen worden. Upload de afbeelding opnieuw.'

const listeners = new Set()
let notices = []

const emit = () => listeners.forEach((fn) => fn(notices))

export function reportError({ key, message }) {
  const k = key || message
  if (notices.some((n) => n.key === k)) return
  notices = [...notices, { key: k, message }]
  console.warn('[error]', message)
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

/* Save status (mocked timing) for the page header: 'saving' → 'saved', or 'failed'. Only the draft's keys count. */
const DRAFT_KEYS = ['articleElements', 'articleSetupData', 'articleTargetingData', 'articleSettingsData']
const statusListeners = new Set()
let saveStatus = null
let saveTimer = null
const failedKeys = new Set() // stays 'failed' until each of these saves again
const setSaveStatus = (s) => { saveStatus = s; statusListeners.forEach((fn) => fn(s)) }
export function subscribeSaveStatus(fn) {
  statusListeners.add(fn)
  fn(saveStatus)
  return () => statusListeners.delete(fn)
}

let installed = false
export function installErrorReporting() {
  if (installed) return
  installed = true

  // Saves: drive the save status; a failed save is reported there, not re-thrown
  const setItem = Storage.prototype.setItem
  Storage.prototype.setItem = function (key, value) {
    const draft = this === window.localStorage && DRAFT_KEYS.includes(key)
    try {
      setItem.call(this, key, value)
      if (draft) failedKeys.delete(key)
      if (draft && !failedKeys.size) {
        setSaveStatus('saving')
        clearTimeout(saveTimer)
        saveTimer = setTimeout(() => setSaveStatus('saved'), 700)
      }
    } catch (e) {
      console.warn('[save failed]', key, e?.message)
      if (draft) { failedKeys.add(key); clearTimeout(saveTimer); setSaveStatus('failed') }
    }
  }

  // Images that can't be loaded (error events don't bubble: listen in the capture phase)
  window.addEventListener('error', (e) => {
    const el = e.target
    if (el && el.tagName === 'IMG') {
      const src = el.getAttribute('src') || ''
      if (!src) return
      reportError({ key: `img:${src}`, message: IMAGE_LOST })
    } else if (e.message && el === window) {
      reportError({ message: `Er ging iets mis: ${e.message}` })
    }
  }, true)

  window.addEventListener('unhandledrejection', (e) => {
    reportError({ message: `Er ging iets mis: ${e.reason?.message || String(e.reason || '')}` })
  })
}

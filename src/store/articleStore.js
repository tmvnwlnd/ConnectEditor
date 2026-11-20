/**
 * The article draft in localStorage — the ONE place components read and write it.
 *
 * Keys: articleSetupData (cover/title/intro + placement), articleElements (blocks), articleTargetingData,
 * articleSettingsData, articleSettingsValid. utils/articleMode.js swaps whole drafts (it copies raw strings);
 * utils/errorReporter.js watches localStorage.setItem for the save status, so writes still go through it.
 */

export const KEYS = {
  setup: 'articleSetupData',
  elements: 'articleElements',
  targeting: 'articleTargetingData',
  settings: 'articleSettingsData',
  settingsValid: 'articleSettingsValid'
}

/** Parsed value of a key, or `fallback` when missing or unreadable. */
export function load(key, fallback = {}) {
  try {
    const raw = localStorage.getItem(key)
    return raw == null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

/** Store a value as JSON. Returns false (and warns) when the browser refuses, e.g. quota exceeded. */
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage:`, e.message)
    return false
  }
}

/** Merge `partial` into the object stored under `key`. Returns the merged object. */
export function patch(key, partial) {
  const next = { ...load(key, {}), ...partial }
  save(key, next)
  return next
}

export function remove(key) {
  localStorage.removeItem(key)
}

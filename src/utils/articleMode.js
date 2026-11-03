import updateArticle from '../data/updateArticle.json'

/* Which prototype path is running: 'new' (Nieuwsartikel maken) or 'update' (Nieuwsartikel updaten — an existing,
   already placed article, prefilled from data/updateArticle.json). Chosen on the start page ("/").
   The update path writes its prefill into the SAME draft keys every step reads; the new-article draft is parked
   under BACKUP_KEY meanwhile and comes back when you start a new article again. */
const MODE_KEY = 'articleMode'
const BACKUP_KEY = 'newArticleDraftBackup'
const DRAFT_KEYS = ['articleSetupData', 'articleTargetingData', 'articleSettingsData', 'articleElements']

export const getArticleMode = () => localStorage.getItem(MODE_KEY) || 'new'
export const isUpdateMode = () => getArticleMode() === 'update'
export const UPDATE_PUBLISH_DATE = new Date(updateArticle.publishDate)

export function startNewArticle() {
  if (getArticleMode() === 'update') {
    const backup = JSON.parse(localStorage.getItem(BACKUP_KEY) || 'null')
    DRAFT_KEYS.forEach((k) => (backup?.[k] != null ? localStorage.setItem(k, backup[k]) : localStorage.removeItem(k)))
    localStorage.removeItem(BACKUP_KEY)
  }
  localStorage.setItem(MODE_KEY, 'new')
}

export function startUpdateArticle() {
  if (getArticleMode() !== 'update') {
    localStorage.setItem(BACKUP_KEY, JSON.stringify(Object.fromEntries(DRAFT_KEYS.map((k) => [k, localStorage.getItem(k)]))))
  }
  // Always start from the article as published (edits from an earlier update run are dropped).
  localStorage.setItem('articleSetupData', JSON.stringify(updateArticle.setup))
  localStorage.setItem('articleTargetingData', JSON.stringify(updateArticle.targeting))
  localStorage.setItem('articleSettingsData', JSON.stringify(updateArticle.settings))
  localStorage.setItem('articleElements', JSON.stringify(updateArticle.elements))
  localStorage.setItem(MODE_KEY, 'update')
}

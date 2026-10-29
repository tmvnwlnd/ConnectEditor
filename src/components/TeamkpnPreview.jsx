import { useMemo } from 'react'
import TeamkpnArticle from './teamkpn/TeamkpnArticle'
import { toTeamkpnArticle } from '../utils/toTeamkpnArticle'

/**
 * TeamkpnPreview — the editor's "Voorvertoning": the article as it will look on TEAMKPN. Converts the
 * editor's state to the TEAMKPN article format (`toTeamkpnArticle`) and renders it with `TeamkpnArticle`,
 * a rebuild of the TEAMKPN article page inside this app (no other app, no hosting involved).
 */
export default function TeamkpnPreview({ headerData = {}, elements = [] }) {
  const contentKey = JSON.stringify({ headerData, elements })
  const article = useMemo(() => {
    const read = (key) => JSON.parse(localStorage.getItem(key) || '{}')
    const setup = { ...read('articleSetupData'), ...headerData }
    return toTeamkpnArticle({ setup, elements, targeting: read('articleTargetingData'), settings: read('articleSettingsData') })
  }, [contentKey]) // eslint-disable-line react-hooks/exhaustive-deps
  return <TeamkpnArticle article={article} />
}

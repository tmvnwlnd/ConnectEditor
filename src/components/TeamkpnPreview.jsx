import { useEffect, useRef, useState } from 'react'
import { toTeamkpnArticle, inlineBlobUrls } from '../utils/toTeamkpnArticle'
import '../styles/TeamkpnPreview.css'

/**
 * TeamkpnPreview — the editor's "Voorvertoning": the article exactly as the TEAMKPN prototype shows it.
 * An iframe loads the prototype's `/preview` page (its real ArticleDetail); this component converts the
 * editor's state to the prototype's article format and posts it in (`teamkpn:preview`), again on every
 * change and whenever the page says it's ready (`teamkpn:preview-ready`).
 *
 * The prototype's address: VITE_TEAMKPN_URL, else localhost:5174 in dev / the hosted demo in production.
 */
export const TEAMKPN_URL =
  import.meta.env.VITE_TEAMKPN_URL || (import.meta.env.DEV ? 'http://localhost:5174' : 'https://9rn52lc6.netlify.app')

export default function TeamkpnPreview({ headerData = {}, elements = [] }) {
  const frameRef = useRef(null)
  // Bumped on every `teamkpn:preview-ready` (the page re-announces itself on each load), so the article is
  // re-sent after a reload too.
  const [readyTick, setReadyTick] = useState(0)

  // The page announces itself on (every) load.
  useEffect(() => {
    const onMessage = (e) => {
      if (e.source === frameRef.current?.contentWindow && e.data?.type === 'teamkpn:preview-ready') setReadyTick((n) => n + 1)
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Convert + send whenever the article changes (or the page became ready). Keyed on the CONTENT, not the
  // object identity — the builder passes a fresh `headerData` object on every render.
  const contentKey = JSON.stringify({ headerData, elements })
  useEffect(() => {
    if (!readyTick) return undefined
    let cancelled = false
    const targeting = JSON.parse(localStorage.getItem('articleTargetingData') || '{}')
    const article = toTeamkpnArticle({ setup: headerData, elements, targeting })
    inlineBlobUrls(article).then((inlined) => {
      if (!cancelled) frameRef.current?.contentWindow?.postMessage({ type: 'teamkpn:preview', article: inlined }, '*')
    })
    return () => {
      cancelled = true
    }
  }, [readyTick, contentKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="teamkpn-preview">
      <iframe
        ref={frameRef}
        className="teamkpn-preview-frame"
        src={`${TEAMKPN_URL}/preview`}
        title="Voorvertoning in TEAMKPN"
      />
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Icon } from './ds'
import { subscribeErrors, dismissError } from '../utils/errorReporter'
import '../styles/ErrorNotices.css'

/** Error messages, inline at the top of the editor stack: one red line each, closed with the x. */
export default function ErrorNotices() {
  const [notices, setNotices] = useState([])
  useEffect(() => subscribeErrors(setNotices), [])
  if (!notices.length) return null
  return (
    <div className="error-notices" role="alert">
      {notices.map((n) => (
        <div key={n.key} className="error-notice">
          <p className="body-r error-notice-text">{n.message}</p>
          <button type="button" className="error-notice-close" aria-label="Melding sluiten" onClick={(e) => { e.stopPropagation(); dismissError(n.key) }}>
            <Icon name="ui-close" size={20} color="var(--color-error)" />
          </button>
        </div>
      ))}
    </div>
  )
}

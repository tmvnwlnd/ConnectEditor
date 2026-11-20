import { useEffect, useState } from 'react'
import { Icon } from './ds'
import { subscribeErrors, dismissError } from '../utils/errorReporter'
import '../styles/ErrorNotices.css'

/** The stack of error notices (bottom right). They stay until closed. */
export default function ErrorNotices() {
  const [notices, setNotices] = useState([])
  useEffect(() => subscribeErrors(setNotices), [])
  if (!notices.length) return null
  return (
    <div className="error-notices" role="alert" aria-live="assertive">
      {notices.map((n) => (
        <div key={n.key} className="error-notice">
          <Icon name="ui-exclamationmark-triangle" size={24} color="var(--color-error)" />
          <div className="error-notice-text">
            <div className="body-r error-notice-title">{n.title}</div>
            {n.detail && <div className="body-s error-notice-detail">{n.detail}</div>}
          </div>
          <button type="button" className="error-notice-close" aria-label="Sluiten" onClick={() => dismissError(n.key)}>
            <Icon name="ui-close" size={20} color="var(--gray-500)" />
          </button>
        </div>
      ))}
    </div>
  )
}

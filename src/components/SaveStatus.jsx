import { useEffect, useState } from 'react'
import { Icon } from './ds'
import { subscribeSaveStatus } from '../utils/errorReporter'

/** "• opslaan… / • zojuist opgeslagen ✓ / • opslaan mislukt", after the step in the page header. Mock timing. */
export default function SaveStatus() {
  const [status, setStatus] = useState(null)
  useEffect(() => subscribeSaveStatus(setStatus), [])
  if (!status) return null
  if (status === 'saving') return <span className="save-status"> • opslaan…</span>
  if (status === 'failed') return <span className="save-status is-failed"> • opslaan mislukt</span>
  return (
    <span className="save-status"> • zojuist opgeslagen <Icon name="ui-check" size={16} color="var(--gray-400)" /></span>
  )
}

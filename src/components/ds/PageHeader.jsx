/**
 * PageHeader Component
 * Page header with title and step indicator
 *
 * @param {string} chapeau - Green lead-in at the start of the step line (optional)
 * @param {React.ReactNode} title - Page title (default: 'Nieuwsartikel maken'); may be a node, e.g. an editable name
 * @param {string} step - Step indicator (e.g., 'Stap 1 van 3')
 * @param {boolean} saveStatus - Show the draft's save status after the step
 * @param {string} className - Additional CSS classes
 */

import SaveStatus from '../SaveStatus'
import './PageHeader.css'

function PageHeader({
  chapeau,
  title = 'Nieuwsartikel maken',
  step,
  saveStatus = false,
  className = ''
}) {
  return (
    <header className={`page-header ${className}`}>
      {typeof title === 'string' ? <h3 className="h3-bold text-heading">{title}</h3> : title}
      {(step || chapeau) && (
        <p className="body-r text-gray-400 page-header-step">
          {chapeau && <span className="page-header-chapeau">{chapeau}</span>}
          {chapeau && step && ' • '}
          {step}{saveStatus && <SaveStatus />}
        </p>
      )}
    </header>
  )
}

export default PageHeader

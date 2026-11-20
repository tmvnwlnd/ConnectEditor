/**
 * PageHeader Component
 * Page header with title and step indicator
 *
 * @param {string} chapeau - Small green line above the title (optional)
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
      {chapeau && <p className="body-r page-header-chapeau">{chapeau}</p>}
      {typeof title === 'string' ? <h3 className="h3-bold text-heading">{title}</h3> : title}
      {step && <p className="body-r text-gray-400 page-header-step">{step}{saveStatus && <SaveStatus />}</p>}
    </header>
  )
}

export default PageHeader

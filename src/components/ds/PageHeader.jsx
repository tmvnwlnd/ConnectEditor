/**
 * PageHeader Component
 * Page header with title and step indicator
 *
 * @param {string} title - Page title (default: 'Nieuwsartikel maken')
 * @param {string} step - Step indicator (e.g., 'Stap 1 van 3')
 * @param {boolean} saveStatus - Show the draft's save status after the step
 * @param {string} className - Additional CSS classes
 */

import SaveStatus from '../SaveStatus'
import './PageHeader.css'

function PageHeader({
  title = 'Nieuwsartikel maken',
  step,
  saveStatus = false,
  className = ''
}) {
  return (
    <header className={`page-header ${className}`}>
      <h3 className="h3-bold text-heading">{title}</h3>
      {step && <p className="body-r text-gray-400 page-header-step">{step}{saveStatus && <SaveStatus />}</p>}
    </header>
  )
}

export default PageHeader

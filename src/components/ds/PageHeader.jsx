/**
 * PageHeader Component
 * Page header with title and step indicator
 *
 * @param {string} title - Page title (default: 'Nieuwsartikel maken')
 * @param {string} step - Step indicator (e.g., 'Stap 1 van 3')
 * @param {string} className - Additional CSS classes
 */

import './PageHeader.css'

function PageHeader({
  title = 'Nieuwsartikel maken',
  step,
  className = ''
}) {
  return (
    <header className={`page-header ${className}`}>
      <h3 className="h3-bold text-green">{title}</h3>
      {step && <p className="body-r text-gray-400">{step}</p>}
    </header>
  )
}

export default PageHeader

import '../styles/SettingsSection.css'

/**
 * SettingsSection Component
 *
 * A flexible container for settings sections with optional label, description, and tooltip.
 * Provides consistent spacing and styling for form sections.
 *
 * @param {string} label - Section label/heading
 * @param {string} description - Optional description text below label
 * @param {React.ReactNode} tooltip - Optional tooltip content (usually an Icon with tooltip wrapper)
 * @param {React.ReactNode} children - Section content
 * @param {string} className - Additional CSS classes
 */
const SettingsSection = ({
  label,
  description,
  tooltip,
  children,
  className = ''
}) => {
  return (
    <div className={`settings-section ${className}`}>
      {(label || tooltip) && (
        <div className="settings-section-header">
          <label className="settings-section-label">
            {label}
            {tooltip}
          </label>
          {description && (
            <p className="settings-section-description">{description}</p>
          )}
        </div>
      )}
      <div className="settings-section-content">
        {children}
      </div>
    </div>
  )
}

export default SettingsSection

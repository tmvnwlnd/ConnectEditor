import { InfoTip } from './ds'
import '../styles/SettingsSection.css'
import './ds/Form.css'

/**
 * SettingsSection — a labelled settings block.
 *
 * @param {string} label - Section label
 * @param {string} tag - Optional tag text after the label (e.g. "(optioneel)")
 * @param {string} info - Explanation, shown as an info icon + tooltip inside the label
 * @param {React.ReactNode} action - Control on the right of the label row (e.g. a Switch)
 * @param {string} description - Short text below the label (use sparingly; prefer `info`)
 * @param {string} error - Error message below the header
 * @param {React.ReactNode} children - Section content
 */
const SettingsSection = ({
  label,
  tag,
  info,
  action,
  description,
  tooltip,
  error,
  children,
  className = ''
}) => {
  return (
    <div className={`settings-section ${className}`}>
      {(label || tooltip || action) && (
        <div className="settings-section-header">
          <div className="settings-section-label-row">
            <label className="field-label">
              {label}
              {tag && <span className="settings-section-tag body-s text-gray-400">{tag}</span>}
              {info && <InfoTip text={info} />}
              {tooltip}
            </label>
            {action && <div className="settings-section-action">{action}</div>}
          </div>
          {description && (
            <p className="settings-section-description">{description}</p>
          )}
          {error && (
            <p className="body-r settings-section-error" role="alert">{error}</p>
          )}
        </div>
      )}
      {children && (
        <div className="settings-section-content">
          {children}
        </div>
      )}
    </div>
  )
}

export default SettingsSection

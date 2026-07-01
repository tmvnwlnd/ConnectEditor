/**
 * ColorPicker Component
 * A compact swatch-based colour selector with a custom-colour option.
 *
 * @param {string} value - Currently selected colour (hex)
 * @param {function} onChange - Called with the selected hex colour
 * @param {string[]} swatches - Preset colours to show (falls back to a brand palette)
 * @param {boolean} allowCustom - Show the custom-colour picker (default true)
 * @param {string} className - Additional CSS classes
 */

import Icon from './Icon'
import './ColorPicker.css'

const DEFAULT_SWATCHES = [
  '#ffffff', // white
  '#131313', // near-black
  '#0066ee', // KPN blue
  '#00c300', // KPN green
  '#ddff44', // KPN lime
  '#e22e22', // KPN red
  '#737373', // gray
]

function ColorPicker({ value, onChange, swatches = DEFAULT_SWATCHES, allowCustom = true, className = '' }) {
  const normalized = (value || '').toLowerCase()
  const isCustom = normalized && !swatches.map(s => s.toLowerCase()).includes(normalized)

  return (
    <div className={`color-picker ${className}`}>
      {swatches.map(color => (
        <button
          key={color}
          type="button"
          className={`color-swatch ${normalized === color.toLowerCase() ? 'active' : ''}`}
          style={{ '--swatch-color': color }}
          onClick={() => onChange(color)}
          aria-label={`Kies kleur ${color}`}
          aria-pressed={normalized === color.toLowerCase()}
        />
      ))}

      {/* Custom colour — native picker behind a swatch-shaped trigger */}
      {allowCustom && (
        <label
          className={`color-swatch color-swatch-custom ${isCustom ? 'active' : ''}`}
          style={isCustom ? { '--swatch-color': value } : undefined}
          title="Eigen kleur"
        >
          {!isCustom && <Icon name="ui-plus" size={16} color="var(--gray-400)" />}
          <input
            type="color"
            value={isCustom ? value : '#000000'}
            onChange={e => onChange(e.target.value)}
            aria-label="Kies een eigen kleur"
          />
        </label>
      )}
    </div>
  )
}

export default ColorPicker

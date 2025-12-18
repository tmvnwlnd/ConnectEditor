import '../styles/Icon.css'

/**
 * Standardized Icon Component
 *
 * Ensures all icons render consistently across the app with:
 * - Consistent sizing (default 24x24)
 * - Proper fill color inheritance
 * - No unwanted strokes
 * - Automatic transparent layer handling
 *
 * @param {React.ComponentType} icon - The SVG icon component to render
 * @param {number} size - Icon size in pixels (default: 24)
 * @param {string} color - Icon color (default: currentColor)
 * @param {string} className - Additional CSS classes
 */
const Icon = ({
  icon: IconComponent,
  size = 24,
  color = 'currentColor',
  className = '',
  ...props
}) => {
  return (
    <span
      className={`icon-wrapper ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: size,
        height: size,
        color: color
      }}
      {...props}
    >
      <IconComponent
        width={size}
        height={size}
        style={{
          display: 'block',
          fill: 'none'
        }}
      />
    </span>
  )
}

export default Icon

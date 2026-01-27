/**
 * Icon Component
 * Loads and displays SVG icons from the /public/icons folder
 *
 * @param {string} name - Icon filename without extension (e.g., 'ui-check')
 * @param {number|string} size - Icon size in pixels (default: 24)
 * @param {string} color - Icon color as CSS value (default: currentColor)
 * @param {string} className - Additional CSS classes
 */

import { useState, useEffect } from 'react'
import './Icon.css'
import { getIconName } from './iconNames'

function Icon({ name, size = 24, color = 'currentColor', className = '', ...props }) {
  const [svgContent, setSvgContent] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!name) {
      setError(true)
      return
    }

    // Validate and resolve icon name
    const validatedName = getIconName(name)
    if (!validatedName) {
      setError(true)
      return
    }

    // Load SVG file
    fetch(`/icons/${validatedName}.svg`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Icon not found: ${validatedName}`)
        }
        return res.text()
      })
      .then(svg => {
        setSvgContent(svg)
        setError(false)
      })
      .catch((err) => {
        console.error(`Icon error for "${validatedName}":`, err)
        setError(true)
      })
  }, [name])

  if (error) {
    return (
      <span
        className={`icon icon-error ${className}`}
        style={{ width: size, height: size }}
        {...props}
      >
        ?
      </span>
    )
  }

  if (!svgContent) {
    return (
      <span
        className={`icon icon-loading ${className}`}
        style={{ width: size, height: size }}
        {...props}
      />
    )
  }

  return (
    <span
      className={`icon ${className}`}
      style={{
        width: size,
        height: size,
        color: color,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
      {...props}
    />
  )
}

export default Icon

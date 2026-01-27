/**
 * Tag Component
 * Small text in a colored box for labels and categories
 *
 * @param {string} variant - 'lime', 'white-outline', or 'white'
 * @param {string} children - Tag text content
 * @param {string} className - Additional CSS classes
 */

import './Tag.css'

function Tag({ variant = 'lime', children, className = '', ...props }) {
  return (
    <span className={`tag tag-${variant} ${className}`} {...props}>
      {children}
    </span>
  )
}

export default Tag

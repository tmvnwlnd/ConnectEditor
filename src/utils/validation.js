/**
 * Validation Utilities
 *
 * Reusable validation functions for form fields.
 * Each function returns null (valid) or a Dutch error/warning string.
 */

/**
 * Validates that a value is not empty.
 * @param {string} value
 * @param {string} fieldName - Dutch field name (e.g. "Titel")
 * @returns {string|null}
 */
export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) {
    return `${fieldName} is verplicht`
  }
  return null
}

/**
 * Validates URL format.
 * @param {string} value
 * @returns {string|null}
 */
export function validateUrl(value) {
  if (!value || !value.trim()) {
    return 'Voer een geldige URL in'
  }
  try {
    new URL(value)
  } catch {
    return 'Ongeldige URL'
  }
  return null
}

/**
 * Validates that a minimum number of items are selected.
 * @param {Array} list - Currently selected items
 * @param {number} min - Minimum required
 * @param {string} fieldName - Dutch field name (e.g. "doelgroep")
 * @returns {string|null}
 */
export function validateMinSelection(list, min, fieldName) {
  if (!list || list.length < min) {
    return `Selecteer minimaal ${min} ${fieldName}`
  }
  return null
}

/**
 * Validates that a date is selected.
 * @param {Date|null} date
 * @param {string} fieldName - Dutch description (e.g. "publicatiedatum")
 * @returns {string|null}
 */
export function validateDateRequired(date, fieldName) {
  if (!date) {
    return `Selecteer een ${fieldName}`
  }
  return null
}

/**
 * Validates that a date comes after another date.
 * @param {Date|null} date
 * @param {Date|null} afterDate
 * @returns {string|null}
 */
export function validateDateAfter(date, afterDate) {
  if (date && afterDate && date <= afterDate) {
    return 'Sluitdatum moet na de publicatiedatum liggen'
  }
  return null
}

/**
 * Returns a length warning (not an error) for text fields.
 * @param {string} value
 * @param {number} min - Recommended minimum (0 to skip)
 * @param {number} max - Recommended maximum (0 to skip)
 * @param {string} fieldName - Dutch field name (e.g. "Titel")
 * @returns {string|null}
 */
export function warnLength(value, min, max, fieldName) {
  if (!value || !value.trim()) return null

  const length = value.trim().length

  if (min > 0 && length < min) {
    return `${fieldName} is erg kort (minimaal ${min} tekens aanbevolen)`
  }
  if (max > 0 && length > max) {
    return `${fieldName} is erg lang (maximaal ${max} tekens aanbevolen)`
  }
  return null
}

/**
 * Validates file type against an allowed list.
 * @param {File} file
 * @param {string[]} allowedTypes - e.g. ['image/jpeg', 'image/png']
 * @param {string} description - Dutch description of allowed types (e.g. ".jpeg, .png of .gif")
 * @returns {string|null}
 */
export function validateFileType(file, allowedTypes, description) {
  if (!allowedTypes.includes(file.type)) {
    return `Alleen ${description} bestanden zijn toegestaan`
  }
  return null
}

/**
 * Validates file size.
 * @param {File} file
 * @param {number} maxMB - Maximum size in megabytes
 * @returns {string|null}
 */
export function validateFileSize(file, maxMB) {
  const maxBytes = maxMB * 1024 * 1024
  if (file.size > maxBytes) {
    return `Bestand is te groot. Maximum grootte is ${maxMB} MB`
  }
  return null
}

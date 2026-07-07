/**
 * Targeting configuration
 *
 * Shared constants + helpers for block-level content targeting.
 * A targeted block holds multiple "instances" — one content version per
 * audience — each tied to one or more doelgroepen (target groups).
 */

// Selectable target groups (doelgroepen). Placeholder set for the
// content-targeting exploration — adjust to the real audience taxonomy.
export const DOELGROEPEN = [
  'Commercieel',
  'Operationeel',
  'Directie',
  'Sales',
  'Marketing',
  'ICT-beheer',
  'Inkoop',
  'Finance',
  'Klantenservice',
  'Technisch beheer',
]

// Human label for an instance based on its target groups.
export function instanceAudienceLabel(instance) {
  const groups = instance?.doelgroepen || []
  if (groups.length === 0) return 'Algemeen'
  return groups.join(', ')
}

// Title shown on a version tab. Follows the target audience by default,
// unless the user has overridden the name.
export function versionTitle(version, fallback = 'Nieuwe versie') {
  if (!version) return fallback
  if (version.autoName === false) return version.name || fallback
  if (version.doelgroepen && version.doelgroepen.length) return version.doelgroepen.join(', ')
  return version.name || fallback
}

// Whether a block is targeted (has content instances).
export function hasInstances(element) {
  return Array.isArray(element?.instances) && element.instances.length > 0
}

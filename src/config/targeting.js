/**
 * Targeting configuration
 *
 * Shared constants + helpers for block-level content targeting.
 * A targeted block holds multiple "instances" — one content version per
 * audience — each tied to one or more doelgroepen (target groups).
 */

import { DOELGROEPEN as TAXONOMY_DOELGROEPEN } from './publishingTargeting'

// Selectable target groups (doelgroepen) — the real audience taxonomy,
// shared with the publishing targeting page (referenced here by name).
export const DOELGROEPEN = TAXONOMY_DOELGROEPEN.map(d => d.name)

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

/**
 * Targeting configuration
 *
 * Shared constants + helpers for block-level content targeting.
 * A targeted block holds multiple "instances" — one content version per
 * audience — each tied to one or more doelgroepen (target groups).
 */

import { DOELGROEPEN as TAXONOMY_DOELGROEPEN, FEEDS as TAXONOMY_FEEDS } from './publishingTargeting'

// Selectable audiences for a block version — the TEAMKPN taxonomy, shared with the publishing targeting
// page (referenced here by NAME): doelgroepen (org units) and feeds (followers of a feed).
export const DOELGROEPEN = TAXONOMY_DOELGROEPEN.filter(d => !d.broad).map(d => d.name)
export const FEEDS = TAXONOMY_FEEDS.map(f => f.name)

// Everything a version targets: its doelgroepen + its feeds.
export const versionAudiences = (v) => [...(v?.doelgroepen || []), ...(v?.feeds || [])]

// Human label for an instance based on its target groups.
export function instanceAudienceLabel(instance) {
  const groups = versionAudiences(instance)
  if (groups.length === 0) return 'Algemeen'
  return groups.join(', ')
}

// Title shown on a version tab. Follows the target audience by default,
// unless the user has overridden the name.
export function versionTitle(version, fallback = 'Nieuwe versie') {
  if (!version) return fallback
  if (version.autoName === false) return version.name || fallback
  const audiences = versionAudiences(version)
  if (audiences.length) return audiences.join(', ')
  return version.name || fallback
}

// Whether a block is targeted (has content instances).
export function hasInstances(element) {
  return Array.isArray(element?.instances) && element.instances.length > 0
}

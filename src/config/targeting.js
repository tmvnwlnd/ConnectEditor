/**
 * Block-level targeting
 *
 * A block is either for everyone, or for ONE audience: a set of doelgroepen and/or feeds.
 * Within that audience the parts add up with OR — you see the block when you are in one of the
 * doelgroepen OR follow one of the feeds (SoW F1). Stored on the block as
 * `targeting: { doelgroepen: [names], feeds: [names] }`; absent or empty = everyone.
 */

import { DOELGROEPEN as TAXONOMY_DOELGROEPEN, FEEDS as TAXONOMY_FEEDS } from './publishingTargeting'

// The TEAMKPN taxonomy, referenced here by NAME.
export const DOELGROEPEN = TAXONOMY_DOELGROEPEN.filter(d => !d.broad).map(d => d.name)
export const FEEDS = TAXONOMY_FEEDS.map(f => f.name)

export const isTargeted = (t) => !!(t && ((t.doelgroepen || []).length || (t.feeds || []).length))

// "Hoorn, Sales" — every doelgroep and feed of the audience.
export const audienceLabel = (t) => [...(t?.doelgroepen || []), ...(t?.feeds || [])].join(', ')

// Old data: a block with content VERSIONS becomes a plain block — the first targeted version's
// type + content + audience, else the first version's.
export function migrateVersions(el) {
  if (!Array.isArray(el?.versions)) return el
  const { versions, ...rest } = el
  const v = versions.find(isTargeted) || versions[0]
  if (!v) return rest
  const targeting = isTargeted(v) ? { doelgroepen: v.doelgroepen || [], feeds: v.feeds || [] } : undefined
  return { ...rest, type: v.type || el.type, content: v.content, ...(targeting ? { targeting } : {}) }
}

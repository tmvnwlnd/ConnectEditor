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

// Every doelgroep and feed of the audience, in full ("KPN Retail, Sales, TV+").
export const audienceNames = (t) => [...(t?.doelgroepen || []), ...(t?.feeds || [])]
export const audienceLabel = (t) => audienceNames(t).join(', ')
// Short form for the block's tab: the first two, then "+N" for the rest ("KPN Retail, Sales +3").
export const audienceShort = (t) => {
  const names = audienceNames(t)
  return names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', ')
}

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

// Drop doelgroepen/feeds that aren't in the taxonomy (e.g. test data like "Hoorn" left in a saved draft);
// a block whose audience ends up empty is for everyone again.
export function sanitizeTargeting(el) {
  if (!el?.targeting) return el
  const clean = (t) => ({
    doelgroepen: (t?.doelgroepen || []).filter((n) => DOELGROEPEN.includes(n)),
    feeds: (t?.feeds || []).filter((n) => FEEDS.includes(n)),
  })
  const { doelgroepen, feeds } = clean(el.targeting)
  const { targeting, ...rest } = el
  if (!doelgroepen.length && !feeds.length) return rest
  const byChannel = targeting.byChannel
    ? Object.fromEntries(Object.entries(targeting.byChannel).map(([id, t]) => [id, clean(t)]))
    : undefined
  return { ...rest, targeting: { ...(byChannel ? { byChannel } : {}), doelgroepen, feeds } }
}

/**
 * Publishing targeting taxonomy — the TEAMKPN prototype's OWN set (synced into src/data/teamkpn/ by
 * scripts/sync-teamkpn-data.mjs), so an article targeted here can land exactly where the prototype shows it.
 *
 * Channels are the three of the prototype's channel menu (CCO · Monteurs · Zakelijke markt). The taxonomy's
 * org channels map onto them: Customer Service + Retail → CCO, Customer Delivery → Monteurs, Zakelijke Markt
 * → Zakelijke markt. Feeds = the prototype's subscribable topic feeds.
 */
import taxonomy from '../data/teamkpn/taxonomy.json'
import feedsData from '../data/teamkpn/feeds.json'

export const CHANNELS = [
  { id: 'cco', name: 'CCO' },
  { id: 'monteurs', name: 'Monteurs' },
  { id: 'zakelijk', name: 'Zakelijke markt' },
]

// Taxonomy channel → editor channel.
const CHANNEL_OF = { cs: 'cco', retail: 'cco', cd: 'monteurs', zm: 'zakelijk' }

export const DOELGROEPEN = [
  // Broad groupings first — the org channels inside CCO (Customer Service, Retail).
  ...taxonomy.channels
    .filter((c) => CHANNEL_OF[c.id] === 'cco')
    .map((c) => ({ id: `broad-${c.id}`, name: c.name, channelId: 'cco', taxonomyChannel: c.id, broad: true })),
  // Every doelgroep (real TEAMKPN org units), under its channel.
  ...taxonomy.channels.flatMap((c) =>
    (c.doelgroepen || []).map((d) => ({ id: d.id, name: d.name, channelId: CHANNEL_OF[c.id], taxonomyChannel: c.id })),
  ),
]

// Feeds — the prototype's subscribable topic feeds (auto/org feeds aren't chosen by an editor).
// (Still exported as SKILLS: "skills" is the brief's old word for feeds and the name the pickers use.)
export const SKILLS = feedsData.feeds
  .filter((f) => f.type === 'topic')
  .map((f) => ({ id: f.id, name: f.name, icon: f.icon }))
export const FEEDS = SKILLS

// Per-audience priority within a channel — a 0..3 level shown as a 4-position
// snapping slider. Level 0 = no priority; the fill runs blue → orange → red.
export const PRIORITY_COUNT = 4
export const DEFAULT_PRIORITY = 0
export const PRIORITY_START_LABEL = 'Geen prioriteit'
export const PRIORITY_END_LABEL = 'Must-read'

export const channelName = (id) => CHANNELS.find(c => c.id === id)?.name || id
export const doelgroepName = (id) => DOELGROEPEN.find(d => d.id === id)?.name || id
export const skillName = (id) => SKILLS.find(s => s.id === id)?.name || id

export const doelgroepenForChannel = (channelId) =>
  DOELGROEPEN.filter(d => d.channelId === channelId)

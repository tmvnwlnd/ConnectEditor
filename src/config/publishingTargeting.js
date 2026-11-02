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
  { id: 'cco', name: 'CCO', icon: 'ui-shoppingbag' },
  { id: 'monteurs', name: 'Monteurs', icon: 'ui-wrench' },
  { id: 'zakelijk', name: 'Zakelijke markt', icon: 'ui-graph-up' },
]

// MOCK member / follower counts (the taxonomy has none): stable per id, so a doelgroep or feed always shows the same number.
const mockCount = (id, min, max) => {
  let h = 0
  for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return min + (h % (max - min))
}
const nl = (n) => n.toLocaleString('nl-NL')

// Taxonomy channel → editor channel.
const CHANNEL_OF = { cs: 'cco', retail: 'cco', cd: 'monteurs', zm: 'zakelijk' }

export const DOELGROEPEN = [
  // Broad groupings first — the org channels inside CCO (Customer Service, Retail).
  ...taxonomy.channels
    .filter((c) => CHANNEL_OF[c.id] === 'cco')
    .map((c) => ({ id: `broad-${c.id}`, name: c.name, channelId: 'cco', taxonomyChannel: c.id, broad: true, icon: 'ui-people', meta: `${nl(mockCount(c.id, 1200, 4800))} leden` })),
  // Every doelgroep (real TEAMKPN org units), under its channel.
  ...taxonomy.channels.flatMap((c) =>
    (c.doelgroepen || []).map((d) => ({ id: d.id, name: d.name, channelId: CHANNEL_OF[c.id], taxonomyChannel: c.id, icon: 'ui-people', meta: `${nl(mockCount(d.id, 40, 900))} leden` })),
  ),
]

// Feeds — the prototype's subscribable topic feeds (auto/org feeds aren't chosen by an editor).
// (Still exported as SKILLS: "skills" is the brief's old word for feeds and the name the pickers use.)
export const SKILLS = feedsData.feeds
  .filter((f) => f.type === 'topic')
  .map((f) => ({ id: f.id, name: f.name, icon: f.icon, meta: `${nl(mockCount(f.id, 150, 3200))} abonnees` }))
export const FEEDS = SKILLS

// Article priority (SoW F3): 3 = default, 2 = belangrijk, 1 = kritiek. 1 and 2 show the "Belangrijk" tag.
// Each level has its own icon + colour (the priority cards on the Targeting tab).
export const PRIORITIES = [
  { id: 3, name: '3 · Standaard', label: 'Standaard', icon: 'ui-line-3-horizontal', tone: 'standard' },
  { id: 2, name: '2 · Belangrijk', label: 'Belangrijk', icon: 'ui-arrow-up', tone: 'important' },
  { id: 1, name: '1 · Kritiek', label: 'Kritiek', icon: 'ui-exclamationmark-triangle', tone: 'critical' },
]
export const DEFAULT_PRIORITY = 3

// The group an article is posted in (SoW J5): the channel group first, then every doelgroep — the same
// list as the prototype's "Voeg toe" modal, preset to CCO.
export const GROUPS = [
  { id: 'cco', name: 'CCO' },
  ...taxonomy.channels.flatMap((c) => (c.doelgroepen || []).map((d) => ({ id: d.id, name: d.name }))),
]
export const DEFAULT_GROUP = 'cco'

export const channelName = (id) => CHANNELS.find(c => c.id === id)?.name || id
export const doelgroepName = (id) => DOELGROEPEN.find(d => d.id === id)?.name || id
export const groupName = (id) => GROUPS.find(g => g.id === id)?.name || id
export const skillName = (id) => SKILLS.find(s => s.id === id)?.name || id

export const doelgroepenForChannel = (channelId) =>
  DOELGROEPEN.filter(d => d.channelId === channelId)

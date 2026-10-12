/**
 * Publishing targeting taxonomy
 *
 * Audience targeting for the publishing page: channels, doelgroepen and skills.
 * Doelgroepen and skills are organised under channels/domains.
 * (Real KPN taxonomy — swap out if it changes.)
 */

export const CHANNELS = [
  { id: 'cs-retail', name: 'CS & Retail' },
  { id: 'cd', name: 'Customer Delivery' },
  { id: 'zm', name: 'Zakelijke Markt' },
]

export const DOELGROEPEN = [
  // Broad groupings — shown at the top of the CS & Retail doelgroep list
  { id: 'broad-cs', name: 'Customer Service', channelId: 'cs-retail' },
  { id: 'broad-retail', name: 'Retail', channelId: 'cs-retail' },
  // Customer Service (specific)
  { id: 'cs-groningen', name: 'KPN CS Vestiging Groningen', channelId: 'cs-retail' },
  { id: 'cs-enschede', name: 'KPN CS Vestiging Enschede', channelId: 'cs-retail' },
  { id: 'cs-amsterdam', name: 'KPN Vestiging Amsterdam', channelId: 'cs-retail' },
  { id: 'cs-totaal', name: 'KPN CS Totaal', channelId: 'cs-retail' },
  { id: 'cs-support-levering', name: 'KPN CS - Support Levering', channelId: 'cs-retail' },
  { id: 'cs-support-service', name: 'KPN CS - Support Service', channelId: 'cs-retail' },
  { id: 'cs-outbound-2contact', name: 'KPN Outbound Partners (2contact)', channelId: 'cs-retail' },
  { id: 'cs-partners', name: 'KPN CS Partners', channelId: 'cs-retail' },
  { id: 'cs-oe-staf', name: 'KPN OE/CS Staf', channelId: 'cs-retail' },
  // Retail (specific)
  { id: 'retail-kpn', name: 'KPN Retail', channelId: 'cs-retail' },
  { id: 'retail-xl', name: 'KPN XL Retail', channelId: 'cs-retail' },
  { id: 'retail-hoofdkantoor', name: 'Hoofdkantoor Retail (KPN)', channelId: 'cs-retail' },
  // Customer Delivery
  { id: 'cd-een-monteurs', name: 'KPN EEN Monteurs', channelId: 'cd' },
  { id: 'cd-value-monteurs', name: 'Value Monteurs', channelId: 'cd' },
  { id: 'cd-ep-monteurs', name: 'EP Monteurs', channelId: 'cd' },
  { id: 'cd-ap-monteurs', name: 'AP Monteurs', channelId: 'cd' },
  { id: 'cd-ep-ap', name: 'Monteurs EP + AP', channelId: 'cd' },
  { id: 'cd-teammanagers', name: 'CD - Monteurs Teammanagers', channelId: 'cd' },
  { id: 'cd-plankamers', name: 'Plankamers monteurs', channelId: 'cd' },
  { id: 'cd-ondersteunende', name: 'Monteurs ondersteunde afdelingen', channelId: 'cd' },
  { id: 'cd-regionaal-cm', name: 'Regionaal CM', channelId: 'cd' },
  // Zakelijke Markt
  { id: 'zm-account', name: 'Account Management', channelId: 'zm' },
  { id: 'zm-inside-sales', name: 'Inside Sales', channelId: 'zm' },
  { id: 'zm-partnerdesk', name: 'Partnerdesk', channelId: 'zm' },
]

// Feeds — categories of information the article can be published into.
// A cross-cutting mix of product domains, topics and news types.
export const SKILLS = [
  // Product domains
  { id: 'tv-bellen', name: 'TV & Bellen' },
  { id: 'internet', name: 'Internet' },
  { id: 'mobiel', name: 'Mobiel' },
  { id: 'glasvezel', name: 'Glasvezel' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'zakelijke-markt', name: 'Zakelijke markt' },
  { id: 'cloud-security', name: 'Cloud & Security' },
  { id: 'iot', name: 'IoT & Connectiviteit' },
  // Topics
  { id: 'opzeggen', name: 'Opzeggen' },
  { id: 'service-aanbod', name: 'Service & Aanbod' },
  { id: 'nabestaandenzorg', name: 'Nabestaandenzorg' },
  { id: 'facturatie-betalen', name: 'Facturatie & Betalen' },
  { id: 'storingen-onderhoud', name: 'Storingen & Onderhoud' },
  { id: 'aanbiedingen-acties', name: 'Aanbiedingen & Acties' },
  { id: 'retail-winkels', name: 'Retail & Winkels' },
  { id: 'klantenservice', name: 'Klantenservice' },
  // News & info types
  { id: 'productnieuws', name: 'Productnieuws' },
  { id: 'beleid-procedures', name: 'Beleid & Procedures' },
  { id: 'trainingen-opleidingen', name: 'Trainingen & Opleidingen' },
  { id: 'organisatie-hr', name: 'Organisatie & HR' },
  { id: 'veiligheid-privacy', name: 'Veiligheid & Privacy' },
  { id: 'duurzaamheid', name: 'Duurzaamheid' },
  { id: 'klantverhalen', name: 'Klantverhalen' },
  { id: 'technische-updates', name: 'Technische updates' },
]

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

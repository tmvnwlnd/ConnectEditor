/**
 * Publishing targeting taxonomy
 *
 * Audience targeting for the publishing page: channels, doelgroepen and skills.
 * Doelgroepen and skills are organised under the same four channels/domains.
 * (Real KPN taxonomy — swap out if it changes.)
 */

export const CHANNELS = [
  { id: 'cs', name: 'Customer Service' },
  { id: 'retail', name: 'Retail' },
  { id: 'cd', name: 'Customer Delivery' },
  { id: 'zm', name: 'Zakelijke Markt' },
]

export const DOELGROEPEN = [
  // Customer Service
  { id: 'cs-groningen', name: 'KPN CS Vestiging Groningen', channelId: 'cs' },
  { id: 'cs-enschede', name: 'KPN CS Vestiging Enschede', channelId: 'cs' },
  { id: 'cs-amsterdam', name: 'KPN Vestiging Amsterdam', channelId: 'cs' },
  { id: 'cs-totaal', name: 'KPN CS Totaal', channelId: 'cs' },
  { id: 'cs-support-levering', name: 'KPN CS - Support Levering', channelId: 'cs' },
  { id: 'cs-support-service', name: 'KPN CS - Support Service', channelId: 'cs' },
  { id: 'cs-outbound-2contact', name: 'KPN Outbound Partners (2contact)', channelId: 'cs' },
  { id: 'cs-partners', name: 'KPN CS Partners', channelId: 'cs' },
  { id: 'cs-oe-staf', name: 'KPN OE/CS Staf', channelId: 'cs' },
  // Retail
  { id: 'retail-kpn', name: 'KPN Retail', channelId: 'retail' },
  { id: 'retail-xl', name: 'KPN XL Retail', channelId: 'retail' },
  { id: 'retail-hoofdkantoor', name: 'Hoofdkantoor Retail (KPN)', channelId: 'retail' },
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

export const SKILLS = [
  // Customer Service
  { id: 'verkopen', name: 'Verkopen', channelId: 'cs' },
  { id: 'crossselling', name: 'Cross- & upselling', channelId: 'cs' },
  { id: 'opzeggingen', name: 'Opzeggingen & retentie', channelId: 'cs' },
  { id: 'facturatie', name: 'Facturatie', channelId: 'cs' },
  { id: 'storingen', name: 'Storingen & techniek', channelId: 'cs' },
  { id: 'klachten', name: 'Klachtafhandeling', channelId: 'cs' },
  { id: 'tv-entertainment', name: 'TV & entertainment', channelId: 'cs' },
  { id: 'mobiel-cs', name: 'Mobiele diensten', channelId: 'cs' },
  { id: 'vast-internet-cs', name: 'Vast internet', channelId: 'cs' },
  { id: 'chat-support', name: 'Chat & messaging', channelId: 'cs' },
  // Retail
  { id: 'retail-verkopen', name: 'Winkelverkoop', channelId: 'retail' },
  { id: 'klantadvies', name: 'Klantadvies', channelId: 'retail' },
  { id: 'devices', name: 'Toestellen & devices', channelId: 'retail' },
  { id: 'accessoires', name: 'Accessoires', channelId: 'retail' },
  { id: 'trade-in', name: 'Inruil & trade-in', channelId: 'retail' },
  { id: 'kassa', name: 'Kassa & betalen', channelId: 'retail' },
  { id: 'demonstraties', name: "Productdemo's", channelId: 'retail' },
  { id: 'voorraadbeheer', name: 'Voorraadbeheer', channelId: 'retail' },
  { id: 'winkelmanagement', name: 'Winkelmanagement', channelId: 'retail' },
  // Customer Delivery
  { id: 'glasvezel', name: 'Glasvezel aanleg', channelId: 'cd' },
  { id: 'koper-dsl', name: 'Koper & DSL', channelId: 'cd' },
  { id: 'modem-router', name: 'Modem & router', channelId: 'cd' },
  { id: 'binnenbekabeling', name: 'Binnenhuisbekabeling', channelId: 'cd' },
  { id: 'meterkast', name: 'Meterkast & FTU', channelId: 'cd' },
  { id: 'veiligheid', name: 'Veiligheid op locatie', channelId: 'cd' },
  { id: 'storingsherstel', name: 'Storingsherstel', channelId: 'cd' },
  { id: 'werkvoorbereiding', name: 'Werkvoorbereiding', channelId: 'cd' },
  { id: 'klantcontact-locatie', name: 'Klantcontact op locatie', channelId: 'cd' },
  // Zakelijke Markt
  { id: 'mobiel-zakelijk', name: 'Mobiel zakelijk', channelId: 'zm' },
  { id: 'vast-zakelijk', name: 'Vast & internet zakelijk', channelId: 'zm' },
  { id: 'cloud-security', name: 'Cloud & security', channelId: 'zm' },
  { id: 'iot', name: 'IoT & connectiviteit', channelId: 'zm' },
  { id: 'unified-comms', name: 'Unified communications', channelId: 'zm' },
  { id: 'partnerprogramma', name: 'Partnerprogramma', channelId: 'zm' },
  { id: 'aanbestedingen', name: 'Aanbestedingen', channelId: 'zm' },
  { id: 'leadopvolging', name: 'Leadopvolging', channelId: 'zm' },
  { id: 'accountbeheer', name: 'Accountbeheer', channelId: 'zm' },
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

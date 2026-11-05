import { defineShots, shot } from 'protographer'

// Step 2 "Plaatsing": groep, channels and the feeds PER channel.
const pick = (field, option) => [
  { click: { sel: `input[placeholder="${field}"]` } },
  { click: { text: option, in: '.search-select-list' } },
]

export default defineShots({ group: 'channels' }, [
  shot.page({
    id: '02-01', name: 'plaatsing-leeg',
    title: 'Plaatsing: groep CCO staat al klaar, één channel gekozen, nog geen feeds',
    state: { path: '/plaatsing' },
    expect: [{ text: 'Channels' }],
  }),
  shot.page({
    id: '02-02', name: 'feeds-per-channel',
    title: 'Twee channels gekozen (CCO + Monteurs): elk channel krijgt zijn eigen feeds',
    state: { path: '/plaatsing' },
    setup: [
      { click: { text: 'Monteurs' } },
      ...pick('Voeg een feed toe…', 'Productnieuws'),
      ...pick('Voeg een feed toe…', 'TV+'),
      { click: { sel: 'input[placeholder="Voeg een feed toe…"]', nth: 1 } },
      { click: { text: 'Storingen & onderhoud', in: '.search-select-list' } },
      { key: 'Escape' },
    ],
    expect: [{ text: 'Feeds in Monteurs' }],
  }),
  shot.overlay({
    id: '02-03', name: 'feeds-zoeken',
    title: 'Feeds kies je uit een doorzoekbare lijst met abonnee-aantallen',
    state: { path: '/plaatsing' },
    open: [{ click: { sel: 'input[placeholder="Voeg een feed toe…"]' } }],
    expect: '.search-select-list',
  }),
])

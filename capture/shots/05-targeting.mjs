import { defineShots, shot } from 'protographer'

const UNCLIP = '.layout,.layout-main,.article-settings,.article-settings-container{height:auto!important;max-height:none!important;overflow:visible!important}'

export default defineShots({ group: 'targeting' }, [
  shot.page({
    id: '05-01', name: 'targeting',
    title: 'Targeting: standaard voor iedereen in de channels die de feeds volgt; prioriteit als keuzeblokken',
    state: { path: '/settings', tab: 'targeting' },
    unclip: UNCLIP,
    expect: [{ text: 'Richt aan doelgroep(en)' }, { text: 'Prioriteit' }],
  }),
  shot.page({
    id: '05-02', name: 'targeting-doelgroepen',
    title: 'Richt aan doelgroep(en) aan: gekozen doelgroepen als blokken, prioriteit Kritiek geselecteerd',
    state: { path: '/settings', tab: 'targeting' },
    unclip: UNCLIP,
    setup: [
      { click: { sel: '[role=switch][aria-label="Richt aan doelgroep(en)"]' } },
      { click: { sel: 'input[placeholder="Voeg een doelgroep toe…"]' } },
      { click: { text: 'KPN CS Vestiging Groningen', in: '.search-select-list' } },
      { key: 'Escape' },
      { click: { sel: 'input[placeholder="Voeg een doelgroep toe…"]' } },
      { type: { into: 'input.search-select-input', text: 'KPN Retail' } },
      { click: { text: 'KPN Retail', in: '.search-select-list', exact: true } },
      { key: 'Escape' },
      { click: { text: 'Kritiek' } },
    ],
    expect: [{ text: 'KPN CS Vestiging Groningen' }, { text: 'KPN Retail', exact: true }],
  }),
])

import { defineShots, shot } from 'protographer'

// The "Nieuwsartikel updaten" path: prefilled existing article → editor → step 4 with the Update tab first.
const UNCLIP = '.layout,.layout-main,.article-settings,.article-settings-container{height:auto!important;max-height:none!important;overflow:visible!important}'

export default defineShots({ group: 'update' }, [
  shot.screen({
    id: '06-01', name: 'editor-ingevuld',
    title: 'Updaten begint direct in de editor (stap 3), met het bestaande artikel al ingevuld',
    state: { mode: 'update' },
    expect: [{ text: 'Nieuwsartikel updaten' }, { text: 'XS4ALL homepages vanaf 1 juli op zwart' }],
  }),
  shot.page({
    id: '06-02', name: 'update-tab',
    title: 'Stap 4 opent op de tab Update: updatedatum + tijd (nu), Update-tag met voorbeeld, Bovenaan plaatsen, updatenotitie',
    state: { mode: 'update', path: '/settings' },
    unclip: UNCLIP,
    expect: [{ text: 'Updatedatum' }, { text: 'Updatenotitie' }, { text: 'Artikel updaten', in: '.layout-footer' }],
  }),
  shot.page({
    id: '06-03', name: 'update-ingevuld',
    title: 'Update-tag en Bovenaan plaatsen aan, met een interne updatenotitie',
    state: { mode: 'update', path: '/settings' },
    unclip: UNCLIP,
    setup: [
      { click: { sel: '[role=switch][aria-label="Update-tag"]' } },
      { click: { sel: '[role=switch][aria-label="Bovenaan plaatsen"]' } },
      { type: { into: 'textarea', text: 'Doorverwijzing verlengd tot 1 oktober.' } },
    ],
    expect: ['[role=switch][aria-label="Update-tag"][aria-checked=true]', '[role=switch][aria-label="Bovenaan plaatsen"][aria-checked=true]'],
  }),
  shot.page({
    id: '06-04', name: 'publicatie-bij-update',
    title: 'Bij een update zegt Plaatsen alleen "Artikel is al geplaatst."',
    state: { mode: 'update', path: '/settings', tab: 'publicatie' },
    unclip: UNCLIP,
    expect: [{ text: 'Artikel is al geplaatst.' }],
  }),
])

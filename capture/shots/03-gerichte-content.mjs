import { defineShots, shot } from 'protographer'

// Block-level targeting in the editor ("Gerichte content"), on the prefilled update article.
// targetBlock 1 = the first paragraph block.
export default defineShots({ group: 'gerichte-content' }, [
  shot.screen({
    id: '03-01', name: 'modal-leeg',
    title: 'Gerichte content: per blok doelgroepen en feeds kiezen, met een tab per gekozen channel (hier alleen CCO)',
    state: { mode: 'update', targetBlock: 1 },
    expect: [{ text: 'Gerichte content' }, { text: 'Doelgroepen' }, { text: 'Feeds', in: '.block-targeting-modal' }],
  }),
  shot.screen({
    id: '03-02', name: 'modal-gekozen',
    title: 'Gekozen doelgroep en feed staan als blokken met icoon en aantallen in de modal',
    state: { mode: 'update', targetBlock: 1 },
    setup: [
      { click: { sel: 'input[placeholder="Voeg een doelgroep toe…"]' } },
      { click: { text: 'KPN CS Vestiging Groningen', in: '.search-select-list' } },
      { click: { sel: 'input[placeholder="Voeg een feed toe…"]', in: '.block-targeting-modal' } },
      { click: { text: 'Productnieuws', in: '.search-select-list' } },
      { click: { text: 'Gerichte content' } },
    ],
    expect: [{ text: 'KPN CS Vestiging Groningen', in: '.block-targeting-modal' }],
  }),
  shot.screen({
    id: '03-03', name: 'blok-met-doelgroep',
    title: 'Een gericht blok toont boven het blok een groen label met zijn doelgroep',
    state: { mode: 'update', targetBlock: 1 },
    setup: [
      { click: { sel: 'input[placeholder="Voeg een doelgroep toe…"]' } },
      { click: { text: 'KPN CS Vestiging Groningen', in: '.search-select-list' } },
      { click: { sel: 'input[placeholder="Voeg een feed toe…"]', in: '.block-targeting-modal' } },
      { click: { text: 'Productnieuws', in: '.search-select-list' } },
      { click: { text: 'Gerichte content' } },
      { click: { text: 'Opslaan', in: '.block-targeting-modal' } },
      { wait: 400 },
    ],
    expect: [{ text: 'Voor KPN CS Vestiging Groningen, Productnieuws' }],
  }),
])

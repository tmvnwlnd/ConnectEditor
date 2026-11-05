import { defineShots, shot } from 'protographer'

// Context only: the editor, filled (the prefilled update article).
export default defineShots({ group: 'artikel' }, [
  shot.screen({
    id: '01-01', name: 'editor-ingevuld',
    title: 'De editor, ingevuld met een bestaand artikel (context)',
    state: { mode: 'update' },
    expect: [{ text: 'XS4ALL homepages vanaf 1 juli op zwart' }],
  }),
])

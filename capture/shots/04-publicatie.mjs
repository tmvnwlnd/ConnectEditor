import { defineShots, shot } from 'protographer'

// Step 4, tab Publicatie (new article). The settings column scrolls inside its container: release it.
const UNCLIP = '.layout,.layout-main,.article-settings,.article-settings-container{height:auto!important;max-height:none!important;overflow:visible!important}'

export default defineShots({ group: 'publicatie' }, [
  shot.page({
    id: '04-01', name: 'publicatie',
    title: 'Publicatie: plaatsen en automatisch sluiten naast elkaar, AI-samenvatting, voorlezen, link-tag, gerelateerde artikelen',
    state: { path: '/settings' },
    unclip: UNCLIP,
    expect: [{ text: 'Plaatsen' }, { text: 'Gerelateerde artikelen' }],
  }),
  shot.page({
    id: '04-02', name: 'publicatie-ingevuld',
    title: 'Link-tag aan met een link, en twee gerelateerde artikelen als tegels met prullenbak',
    state: { path: '/settings' },
    unclip: UNCLIP,
    setup: [
      { click: { sel: '[role=switch][aria-label="Link-tag"]' } },
      { type: { into: 'input[placeholder="https://"]', text: 'https://kpn.com/xs4all' } },
      // The field sits under the sticky footer inside the settings scroller: pick through the DOM.
      { run: async (ctx) => {
        for (const title of ['Facturatie: nieuwe lay-out van de digitale factuur', 'Nieuwe zomeractie: gratis maand bij overstap naar glasvezel']) {
          await ctx.page.locator('input[placeholder="Voeg een artikel toe…"]').evaluate((el) => { el.scrollIntoView({ block: 'center' }); el.focus(); el.click() })
          await ctx.page.locator('.search-select-option', { hasText: title }).first().evaluate((el) => el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })) || el.click())
          await ctx.wait(200)
        }
      } },
      { key: 'Escape' },
    ],
    expect: [{ text: 'Facturatie: nieuwe lay-out van de digitale factuur', in: '.related-items' }],
  }),
  shot.screen({
    id: '04-03', name: 'opslaan-als-concept',
    title: 'Plaatsen op "Opslaan als concept": de primaire knop wordt "Opslaan"',
    state: { path: '/settings' },
    setup: [{ click: { text: 'Opslaan als concept', in: '.scheduling-options' } }],
    expect: [{ text: 'Opslaan', in: '.layout-footer', exact: true }],
  }),
])

import { defineConfig } from 'protographer'

export default defineConfig({
  outDir: 'capture/out',
  shots: ['capture/shots'],
  states: './capture/states.mjs', // the update path and the step-4 tabs are reached by clicking

  server: { type: 'vite', port: 5273 }, // builds with vite, serves a snapshot of dist/

  locale: 'nl-NL',
  timezoneId: 'Europe/Amsterdam',
  fixedTime: '2026-11-03T10:14:00Z', // Date.now() is pinned here — the Updatedatum prefill reads 03-11-2026 11:14

  showcase: {
    lang: 'nl',
  },
})

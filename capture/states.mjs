// How shots reach their starting point. Rules (npx protographer guide states): one place, fixed order,
// drive it like a person, every step asserts.
//
// state = { path?, mode?: 'update', tab?, targetBlock? }
//   Order: load → path choice (start page) → step → tab.
//   - mode 'update' can only be entered from the start page ("/"): its card prefills the existing article
//     and lands on the editor (step 3). Step 4 is then reached with the footer button — a page.goto would
//     reload, which is fine for the app but keeps the shot honest to how a person gets there.
//   - tab is a step-4 tab, clicked in the sticky header (labels in one table; they get renamed).

const url = (baseUrl, path) => new URL(path, baseUrl).href // baseUrl may end in '/'

const TAB_LABELS = { update: 'Update', publicatie: 'Publicatie', targeting: 'Targeting' }

export async function applyState(ctx, state = {}, baseUrl) {
  if (state.mode === 'update') {
    await ctx.page.goto(url(baseUrl, '/'), { waitUntil: 'load' })
    await ctx.expect('.start-choice') // React renders after 'load'
    await ctx.domClick({ text: 'Nieuwsartikel updaten', in: '.start-choice' })
    await ctx.expect({ text: 'Nieuwsartikel updaten', in: '.page-header' })
    if (state.path === '/settings') {
      await ctx.domClick({ text: 'Volgende stap: publiceren', in: '.layout-footer' })
      await ctx.expect('.layout-header-tabs')
    }
  } else {
    await ctx.page.goto(url(baseUrl, state.path ?? '/'), { waitUntil: 'load' })
  }

  await ctx.expect(state.path === '/settings' ? '.layout-header-tabs' : 'body')
  if (state.tab) {
    const label = TAB_LABELS[state.tab]
    if (!label) throw new Error(`unknown tab id "${state.tab}" — known: ${Object.keys(TAB_LABELS).join(', ')}`)
    await ctx.domClick({ text: label, in: '.layout-header-tabs' })
  }
  // targetBlock = n: open "Gerichte content" for the n-th editor block. Its people button only shows on
  // hover/focus, so it's clicked programmatically (asserting it exists and the modal opens).
  if (state.targetBlock != null) {
    const ok = await ctx.page.evaluate((n) => {
      const b = document.querySelectorAll('[aria-label="Doelgroep toewijzen"]')[n]
      b?.click()
      return !!b
    }, state.targetBlock)
    if (!ok) throw new Error(`no "Doelgroep toewijzen" button #${state.targetBlock}`)
    await ctx.expect({ text: 'Gerichte content' })
  }
  await ctx.wait(400) // the step slide (300ms) and tab switch finish
}
